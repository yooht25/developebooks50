import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ALL_BOOKS, PERSONA_CATEGORIES } from './data/books'
import { EDITORIAL_GUIDES } from './data/guides'
import { escapeHtmlServer, renderSiteLayout } from './views/layout'
import {
  renderAboutPageContent,
  renderBookDetailPageContent,
  renderCategoryPageContent,
  renderContactPageContent,
  renderGuideDetailPageContent,
  renderGuidesListPageContent,
  renderNotFoundPageContent,
  renderPrivacyPageContent,
  renderQuizPageContent,
  renderTermsPageContent
} from './views/pages'

const app = new Hono()

app.use('/api/*', cors())

function getOrigin(urlStr: string): string {
  try {
    const u = new URL(urlStr)
    return `${u.protocol}//${u.host}`
  } catch {
    return 'https://developebooks50.pages.dev'
  }
}

// Google AdSense ads.txt 라우트
app.get('/ads.txt', (c) => {
  return c.text('google.com, pub-4024277026672694, DIRECT, f08c47fec0942fa0\n', 200, {
    'Content-Type': 'text/plain; charset=utf-8'
  })
})

// 검색엔진 및 AdSense 크롤러 허용 robots.txt
app.get('/robots.txt', (c) => {
  const origin = getOrigin(c.req.url)
  const txt = [
    'User-agent: *',
    'Allow: /',
    'User-agent: Mediapartners-Google',
    'Allow: /',
    `Sitemap: ${origin}/sitemap.xml`,
    ''
  ].join('\n')
  return c.text(txt, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

// 전체 페이지(메인 + 가이드 칼럼 + 독자 유형별 페이지 + 50권 개별 상세 페이지 + 정책 페이지) 동적 XML 사이트맵
app.get('/sitemap.xml', (c) => {
  const origin = getOrigin(c.req.url)
  const today = '2026-11-15'

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: `${origin}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${origin}/quiz`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${origin}/guides`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${origin}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${origin}/privacy`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${origin}/terms`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${origin}/contact`, priority: '0.5', changefreq: 'monthly' }
  ]

  for (const guide of EDITORIAL_GUIDES) {
    urls.push({
      loc: `${origin}/guide/${guide.slug}`,
      priority: '0.9',
      changefreq: 'monthly'
    })
  }

  for (const cat of PERSONA_CATEGORIES) {
    if (cat.id !== 'all') {
      urls.push({
        loc: `${origin}/category/${cat.id}`,
        priority: '0.8',
        changefreq: 'weekly'
      })
    }
  }

  for (const book of ALL_BOOKS) {
    urls.push({
      loc: `${origin}/book/${book.id}`,
      priority: '0.8',
      changefreq: 'monthly'
    })
  }

  const xmlItems = urls
    .map(
      (u) => `  <url>
    <loc>${escapeHtmlServer(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`

  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// 추천 대상(독자 유형) 카테고리 목록 조회 API
app.get('/api/personas', (c) => {
  const categoriesWithCount = PERSONA_CATEGORIES.map((cat) => {
    const count =
      cat.id === 'all'
        ? ALL_BOOKS.length
        : ALL_BOOKS.filter((b) => b.personas.includes(cat.id)).length
    return { ...cat, count }
  })
  return c.json({ personas: categoriesWithCount })
})

// 전체 도서 또는 조건별 도서 목록 조회 API
app.get('/api/books', (c) => {
  const persona = c.req.query('persona') || 'all'
  const q = (c.req.query('q') || '').trim().toLowerCase()
  const difficulty = c.req.query('difficulty') || 'all'
  const sort = c.req.query('sort') || 'id-asc'

  let filtered = [...ALL_BOOKS]

  if (persona !== 'all') {
    filtered = filtered.filter((b) => b.personas.includes(persona))
  }

  if (difficulty !== 'all') {
    filtered = filtered.filter((b) => b.difficulty === difficulty)
  }

  if (q) {
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.originalTitle.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.whoShouldRead.some((w) => w.toLowerCase().includes(q))
    )
  }

  if (sort === 'year-desc') {
    filtered.sort((a, b) => b.year - a.year)
  } else if (sort === 'year-asc') {
    filtered.sort((a, b) => a.year - b.year)
  } else if (sort === 'title-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
  } else {
    filtered.sort((a, b) => a.id - b.id)
  }

  return c.json({
    total: filtered.length,
    books: filtered
  })
})

// 개별 도서 상세 조회 API
app.get('/api/books/:id', (c) => {
  const id = Number(c.req.param('id'))
  const book = ALL_BOOKS.find((b) => b.id === id)
  if (!book) {
    return c.json({ error: '해당 도서를 찾을 수 없습니다.' }, 404)
  }

  const related = ALL_BOOKS.filter(
    (b) => b.id !== book.id && b.personas.some((p) => book.personas.includes(p))
  ).slice(0, 3)

  return c.json({ book, related })
})

// 메인 페이지 렌더링 (초기 SSR로도 50권 링크 및 칼럼 요약을 모두 출력하여 크롤러 친화성 확보 + 인터랙티브 필터·모달 동시 제공)
app.get('/', (c) => {
  const origin = getOrigin(c.req.url)
  const initialDataJson = JSON.stringify({
    personas: PERSONA_CATEGORIES,
    books: ALL_BOOKS
  }).replace(/</g, '\\u003c')

  // JS 실행 전에도 Google 크롤러가 즉시 읽을 수 있는 초기 SSR 도서 카드 마크업
  const ssrInitialBooksHtml = ALL_BOOKS.map((book) => {
    const numStr = String(book.id).padStart(2, '0')
    return `
      <article class="book-card bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
        <div>
          <div class="book-cover-visual h-40 p-4 pl-6 flex flex-col justify-between text-white" style="background: linear-gradient(135deg, ${escapeHtmlServer(book.coverTheme.bgFrom)} 0%, ${escapeHtmlServer(book.coverTheme.bgTo)} 100%);">
            <div class="flex items-center justify-between gap-2 relative z-10">
              <span class="text-xs font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-black/25">NO. ${numStr}</span>
            </div>
            <div class="flex items-end justify-between gap-3 relative z-10">
              <div class="min-w-0">
                <p class="text-[11px] text-white/75 truncate font-medium">${escapeHtmlServer(book.originalTitle)}</p>
                <h3 class="text-lg font-extrabold leading-snug line-clamp-2 serif-heading mt-0.5">
                  <a href="/book/${book.id}" class="hover:underline">${escapeHtmlServer(book.title)}</a>
                </h3>
              </div>
              <i class="fa-solid ${escapeHtmlServer(book.coverTheme.icon)} text-2xl opacity-80 shrink-0" style="color: ${escapeHtmlServer(book.coverTheme.accent)}"></i>
            </div>
          </div>
          <div class="p-4 pb-3">
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span class="font-semibold text-slate-700 dark:text-slate-200 truncate">${escapeHtmlServer(book.author)}</span>
              <span class="shrink-0 text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">${escapeHtmlServer(book.difficulty)} · ${book.year}</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">${escapeHtmlServer(book.summary)}</p>
            <div class="bg-stone-50 dark:bg-slate-800/70 rounded-xl p-2.5 border border-stone-100 dark:border-slate-700/80">
              <p class="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 mb-1">추천 독자</p>
              <p class="text-xs text-slate-700 dark:text-slate-200 line-clamp-2">${escapeHtmlServer(book.whoShouldRead[0] || '')}</p>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-stone-50/40 dark:bg-slate-900/60">
          <span class="text-xs text-slate-500">#${escapeHtmlServer(book.tags[0] || '')}</span>
          <a href="/book/${book.id}" class="text-xs font-bold text-indigo-600 dark:text-indigo-400">작가 &amp; 상세 내용 보기</a>
        </div>
      </article>`
  }).join('')

  const featuredGuidesHtml = EDITORIAL_GUIDES.map(
    (g) => `
      <a href="/guide/${escapeHtmlServer(g.slug)}" class="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-stone-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition flex flex-col justify-between">
        <div>
          <span class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full text-white mb-3" style="background-color: ${escapeHtmlServer(g.accentColor)}">
            <i class="fa-solid ${escapeHtmlServer(g.icon)}"></i>
            ${escapeHtmlServer(g.categoryLabel)}
          </span>
          <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug serif-heading">${escapeHtmlServer(g.title)}</h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">${escapeHtmlServer(g.excerpt)}</p>
        </div>
        <span class="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">심층 가이드 읽기 <i class="fa-solid fa-arrow-right text-[10px]"></i></span>
      </a>`
  ).join('')

  const homeBody = `
    <!-- 히어로 섹션 -->
    <section id="hero-section" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/90 dark:to-black text-white py-12 sm:py-16 border-b border-transparent dark:border-slate-800/80">
      <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(#818cf8 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-medium mb-4">
            <i class="fa-solid fa-star text-amber-400"></i>
            전 세계 수천만 독자가 검증한 필독서 50권 &amp; 실전 독서 가이드
          </p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight serif-heading">
            지금 당신의 고민에 답하는<br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-teal-200">인생 자기계발서 50선</span>
          </h1>
          <p class="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <strong>"어떤 사람들이 봐야 할까?"</strong> 아래 메뉴에서 지금 내 상황과 가장 가까운 유형을 선택해 보세요.
            원하는 책을 클릭하면 <strong>작가 소개, 핵심 내용 요약, 3가지 실천 원칙, 명문장</strong>을 바로 열람하거나 전용 상세 해설 페이지로 깊이 있게 읽을 수 있습니다.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a href="/quiz" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-lg transition">
              <i class="fa-solid fa-stethoscope"></i>
              <span>1분 맞춤 인생책 진단 테스트 시작하기</span>
            </a>
            <a href="/guides" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-sm transition">
              <i class="fa-solid fa-newspaper text-indigo-300"></i>
              <span>실전 독서법 심층 칼럼 10편 보기</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 어떤 사람들이 봐야 하는지 선택하는 추천 대상 메뉴 섹션 -->
    <section id="persona-selector-section" aria-labelledby="persona-menu-heading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-slate-950/60 border border-stone-200/90 dark:border-slate-800 p-5 sm:p-7 transition-colors duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 id="persona-menu-heading" class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-user-check text-indigo-600 dark:text-indigo-400"></i>
              어떤 사람이 읽어야 할까요? (독자 유형 선택 메뉴)
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">나에게 해당하는 고민이나 목표를 선택하면 맞춤형 추천 도서만 골라 보여드립니다.</p>
          </div>
          <button id="reset-persona-btn" type="button" class="hidden self-start sm:self-auto text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-transparent dark:border-indigo-800/60 transition">
            <i class="fa-solid fa-rotate-left mr-1"></i>전체 50권으로 초기화
          </button>
        </div>

        <div id="persona-menu-grid" role="tablist" aria-label="추천 독자 유형 선택" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          ${PERSONA_CATEGORIES.map(
            (p) =>
              `<a href="${p.id === 'all' ? '/' : `/category/${escapeHtmlServer(p.id)}`}" class="p-3.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50/70 dark:bg-slate-800/60 text-sm font-bold text-slate-900 dark:text-slate-100">${escapeHtmlServer(p.shortLabel)} — ${escapeHtmlServer(p.label)}</a>`
          ).join('')}
        </div>

        <div id="active-persona-banner" class="mt-4 px-4 py-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors duration-200">
          <div class="flex items-start sm:items-center gap-2.5">
            <i id="banner-icon" class="fa-solid fa-layer-group text-indigo-600 dark:text-indigo-400 mt-0.5 sm:mt-0"></i>
            <div>
              <span id="banner-title" class="font-bold text-sm text-slate-900 dark:text-white">전체 50권 보기</span>
              <span class="hidden sm:inline text-slate-300 dark:text-slate-600 mx-2">|</span>
              <p id="banner-desc" class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 sm:inline">시대를 초월해 검증된 최고의 자기계발서 50권을 모두 확인해보세요.</p>
            </div>
          </div>
          <span id="result-count-label" class="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">검색 결과 50권</span>
        </div>
      </div>
    </section>

    <!-- 검색 및 필터 바 -->
    <section id="search-filter-section" aria-label="도서 검색 및 정렬" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div class="relative flex-1">
          <label for="book-search-input" class="sr-only">책 제목, 작가, 키워드 검색</label>
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
          <input
            id="book-search-input"
            type="search"
            placeholder="책 제목, 작가명, 고민 키워드(예: 습관, 돈, 대화, 불안, 리더십)로 검색..."
            class="w-full pl-10 pr-9 py-2.5 rounded-lg bg-stone-50 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
          <button id="clear-search-btn" type="button" aria-label="검색어 지우기" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>

        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <div class="flex items-center bg-stone-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium" role="group" aria-label="독서 난이도 필터">
            <button type="button" data-difficulty="all" class="difficulty-btn active px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold transition">전체 난이도</button>
            <button type="button" data-difficulty="입문" class="difficulty-btn px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">입문</button>
            <button type="button" data-difficulty="중급" class="difficulty-btn px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">중급</button>
            <button type="button" data-difficulty="심화" class="difficulty-btn px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">심화</button>
          </div>

          <label for="sort-select" class="sr-only">정렬 방식</label>
          <select id="sort-select" class="px-3 py-2 rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
            <option value="id-asc">추천 번호순 (1~50)</option>
            <option value="year-desc">최신 출간순</option>
            <option value="year-asc">고전 명저순 (오래된순)</option>
            <option value="title-asc">제목 가나다순</option>
          </select>
        </div>
      </div>
    </section>

    <!-- 도서 50권 카드 그리드 목록 -->
    <section id="books-catalog-section" aria-label="자기계발서 도서 목록" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div id="books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        ${ssrInitialBooksHtml}
      </div>

      <div id="empty-state" class="hidden text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-stone-300 dark:border-slate-700">
        <div class="w-16 h-16 mx-auto rounded-full bg-stone-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
          <i class="fa-solid fa-book-open text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">조건에 맞는 자기계발서를 찾지 못했습니다</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">다른 독자 유형을 선택하거나 검색어 필터를 초기화해 보세요.</p>
        <button id="empty-reset-btn" type="button" class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
          전체 도서 50권 다시 보기
        </button>
      </div>
    </section>

    <!-- 실전 독서법 & 심층 칼럼 섹션 (독창적 부가가치 아티클 허브) -->
    <section id="editorial-guides-section" aria-labelledby="guides-sec-heading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200 dark:border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Original Reading Guides</span>
          <h2 id="guides-sec-heading" class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 serif-heading">책을 읽고 실제 인생을 바꾸는 실전 독서 칼럼</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">50권의 핵심 통찰을 습관·멘탈·관계·재테크에 바로 연결하는 분야별 심층 로드맵입니다.</p>
        </div>
        <a href="/guides" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0">칼럼 전체 보기 <i class="fa-solid fa-arrow-right text-xs"></i></a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${featuredGuidesHtml}
      </div>
    </section>

    <!-- 자주 묻는 질문 및 자기계발 독서 가이드 FAQ (독창적 정보성 콘텐츠 보강) -->
    <section aria-labelledby="faq-sec-heading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200 dark:border-slate-800">
      <h2 id="faq-sec-heading" class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-6 serif-heading">자기계발서 선택 &amp; 독서법 자주 묻는 질문</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-stone-200 dark:border-slate-800">
          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-2">Q. 독서 초보자는 어떤 책부터 시작하는 게 좋을까요?</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            처음부터 두꺼운 심화서(《생각에 관한 생각》, 《원칙》 등)를 고르기보다 난이도 필터를 <strong>'입문'</strong>으로 선택한 뒤 《아주 작은 습관의 힘》, 《아주 작은 반복의 힘》, 《바빌론 부자들의 돈 버는 지혜》처럼 이야기 중심이면서 즉시 실천 가능한 책으로 완독 성취감을 먼저 경험하는 것을 추천합니다.
          </p>
        </article>
        <article class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-stone-200 dark:border-slate-800">
          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-2">Q. 여러 권을 동시에 읽는 병렬 독서도 괜찮을까요?</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            네, 효과적입니다. 예를 들어 아침 출근길에는 실행 에너지를 깨우는 <strong>습관·커리어 분야 도서</strong>를 15분 읽고, 잠들기 전에는 마음을 차분히 가라앉히는 <strong>멘탈·인생 철학 에세이</strong>(《내가 틀릴 수도 있습니다》, 《상처받지 않는 영혼》 등)를 함께 읽으면 지루함 없이 독서 리듬을 유지할 수 있습니다.
          </p>
        </article>
        <article class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-stone-200 dark:border-slate-800">
          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-2">Q. 읽은 내용을 잊어버리지 않으려면 어떻게 해야 하나요?</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            완독 직후 책을 덮고 백지에 기억나는 핵심 교훈 3가지를 스스로 떠올려 적어보는 <strong>인출 연습</strong>이 가장 강력합니다. 또한 각 도서 상세 페이지에 정리된 '3가지 핵심 교훈' 중 단 하나만 골라 스마트폰 알림이나 책상 포스트잇에 붙여 2주간 행동으로 반복해 보세요.
          </p>
        </article>
      </div>
    </section>

    <!-- 도서 상세 모달 (빠른 미리보기 + 개별 상세 페이지 연결) -->
    <div id="book-detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-book-title" class="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-6">
      <div id="modal-backdrop" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

      <article class="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-slate-700 animate-modal-in transition-colors duration-200">
        <div id="modal-header-bg" class="relative p-6 sm:p-8 text-white shrink-0">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span id="modal-book-number" class="px-2.5 py-1 rounded-full text-xs font-bold bg-black/25 backdrop-blur-sm">NO. 01</span>
              <span id="modal-book-year" class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">2018년 출간</span>
              <span id="modal-book-difficulty" class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">난이도: 입문</span>
              <span id="modal-book-time" class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm"><i class="fa-regular fa-clock mr-1"></i>약 6시간</span>
            </div>
            <div class="flex items-center gap-2">
              <button id="modal-bookmark-btn" type="button" aria-label="내 서재에 저장" class="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                <i class="fa-regular fa-bookmark"></i>
              </button>
              <button id="modal-close-btn" type="button" aria-label="모달 닫기" class="w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center transition">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </div>

          <div class="mt-5 flex items-end justify-between gap-4">
            <div>
              <p id="modal-original-title" class="text-xs sm:text-sm text-white/80 font-medium tracking-wide">Atomic Habits</p>
              <h2 id="modal-book-title" class="text-2xl sm:text-3xl font-extrabold mt-1 leading-snug serif-heading">아주 작은 습관의 힘</h2>
              <p class="mt-2 text-sm sm:text-base font-semibold text-white/95 flex items-center gap-2">
                <i class="fa-solid fa-pen-fancy text-xs opacity-80"></i>
                <span id="modal-book-author">제임스 클리어</span>
              </p>
            </div>
            <div class="hidden sm:flex w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm items-center justify-center shrink-0 border border-white/20">
              <i id="modal-cover-icon" class="fa-solid fa-atom text-3xl text-white"></i>
            </div>
          </div>
        </div>

        <div id="modal-scroll-body" class="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-200">
          <section aria-labelledby="section-author-heading" class="bg-stone-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-slate-700">
            <h3 id="section-author-heading" class="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-2">
              <i class="fa-solid fa-user-pen"></i>
              작가 소개
            </h3>
            <p id="modal-author-name-bold" class="font-bold text-slate-900 dark:text-white text-base mb-1"></p>
            <p id="modal-author-bio" class="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300"></p>
          </section>

          <section aria-labelledby="section-summary-heading">
            <h3 id="section-summary-heading" class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2.5">
              <i class="fa-solid fa-book-open text-indigo-600 dark:text-indigo-400"></i>
              핵심 내용 및 줄거리
            </h3>
            <p id="modal-book-summary" class="text-sm sm:text-base leading-7 text-slate-700 dark:text-slate-200"></p>
          </section>

          <section aria-labelledby="section-lessons-heading">
            <h3 id="section-lessons-heading" class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <i class="fa-solid fa-list-check text-teal-600 dark:text-teal-400"></i>
              삶에 바로 적용하는 핵심 교훈 3가지
            </h3>
            <ul id="modal-key-lessons" class="space-y-2.5"></ul>
          </section>

          <blockquote class="relative bg-gradient-to-r from-indigo-50 to-amber-50/50 dark:from-indigo-950/60 dark:to-slate-800/70 border-l-4 border-indigo-600 dark:border-indigo-400 rounded-r-2xl p-4 sm:p-5">
            <i class="fa-solid fa-quote-left text-indigo-300 dark:text-indigo-500 text-xl mb-1 block"></i>
            <p id="modal-book-quote" class="serif-heading text-slate-800 dark:text-slate-100 font-medium text-sm sm:text-base leading-relaxed italic"></p>
          </blockquote>

          <section aria-labelledby="section-target-heading" class="bg-emerald-50/60 dark:bg-emerald-950/35 rounded-2xl p-4 sm:p-5 border border-emerald-200/70 dark:border-emerald-800/60">
            <h3 id="section-target-heading" class="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mb-3">
              <i class="fa-solid fa-circle-check text-emerald-600 dark:text-emerald-400"></i>
              이런 분들에게 특히 추천합니다!
            </h3>
            <div id="modal-persona-badges" class="flex flex-wrap gap-1.5 mb-3"></div>
            <ul id="modal-who-should-read" class="space-y-2 text-sm text-emerald-950 dark:text-emerald-100"></ul>
          </section>

          <div class="flex justify-end">
            <a id="modal-fullpage-link" href="/book/1" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition">
              <i class="fa-solid fa-up-right-from-square text-xs"></i>
              <span>전용 상세 리뷰 페이지에서 보기</span>
            </a>
          </div>

          <section aria-labelledby="section-related-heading" class="pt-2 border-t border-stone-200 dark:border-slate-800">
            <h3 id="section-related-heading" class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">비슷한 고민을 가진 분들이 함께 읽은 책</h3>
            <div id="modal-related-books" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5"></div>
          </section>
        </div>

        <div class="px-6 py-3.5 bg-stone-50 dark:bg-slate-800/90 border-t border-stone-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <button id="modal-prev-btn" type="button" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none transition">
            <i class="fa-solid fa-arrow-left"></i>
            <span>이전 도서</span>
          </button>
          <span id="modal-position-indicator" class="text-xs text-slate-400 dark:text-slate-500 font-medium">1 / 50</span>
          <button id="modal-next-btn" type="button" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none transition">
            <span>다음 도서</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </article>
    </div>

    <script id="initial-catalog-data" type="application/json">${initialDataJson}</script>
  `

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '인생을 바꾸는 자기계발서 50선',
    description: '독자 유형별 맞춤형 자기계발 필독서 50권 큐레이션 및 실천 가이드',
    numberOfItems: ALL_BOOKS.length,
    itemListElement: ALL_BOOKS.slice(0, 15).map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${origin}/book/${b.id}`,
      name: `${b.title} - ${b.author}`
    }))
  }

  return c.html(
    renderSiteLayout({
      title: '인생을 바꾸는 자기계발서 50선 | 독자 유형별 맞춤 성장 서재 & 실전 독서법',
      description:
        '습관·멘탈·커리어·인간관계·재테크·인생철학까지, 전 세계 독자가 검증한 자기계발서 50권을 추천 대상별로 탐색하고 작가 소개와 핵심 내용을 확인하세요.',
      canonicalPath: '/',
      origin,
      enableAds: true,
      activeNav: 'home',
      jsonLd: homeJsonLd,
      bodyContent: homeBody,
      includeAppJs: true
    })
  )
})

// 개별 도서 상세 SSR 페이지 (/book/:id)
app.get('/book/:id', (c) => {
  const origin = getOrigin(c.req.url)
  const id = Number(c.req.param('id'))
  const idx = ALL_BOOKS.findIndex((b) => b.id === id)
  if (idx === -1) {
    return c.html(
      renderSiteLayout({
        title: '페이지를 찾을 수 없습니다 | 성장 서재 50',
        description: '요청하신 도서 페이지를 찾을 수 없습니다.',
        canonicalPath: `/book/${id}`,
        origin,
        enableAds: false, // 404 페이지에는 광고 미게재 (AdSense 정책 엄수)
        bodyContent: renderNotFoundPageContent()
      }),
      404
    )
  }

  const book = ALL_BOOKS[idx]
  const prevBook = idx > 0 ? ALL_BOOKS[idx - 1] : null
  const nextBook = idx < ALL_BOOKS.length - 1 ? ALL_BOOKS[idx + 1] : null
  const relatedBooks = ALL_BOOKS.filter(
    (b) => b.id !== book.id && b.personas.some((p) => book.personas.includes(p))
  ).slice(0, 3)

  const relatedGuides = EDITORIAL_GUIDES.filter((g) =>
    g.sections.some((sec) => sec.recommendedBookIds.includes(book.id))
  )

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    alternateName: book.originalTitle,
    author: {
      '@type': 'Person',
      name: book.author,
      description: book.authorBio
    },
    datePublished: String(book.year),
    description: book.summary,
    inLanguage: 'ko',
    url: `${origin}/book/${book.id}`
  }

  return c.html(
    renderSiteLayout({
      title: `${book.title} (${book.author}) 핵심 요약·작가 소개·추천 독자 | 성장 서재 50`,
      description: `${book.title} 저자 ${book.author} 소개와 핵심 줄거리, 삶에 바로 적용하는 3가지 교훈, 명문장 및 어떤 사람이 읽어야 하는지 확인해보세요.`,
      canonicalPath: `/book/${book.id}`,
      origin,
      enableAds: true,
      activeNav: 'home',
      jsonLd: bookJsonLd,
      bodyContent: renderBookDetailPageContent(
        book,
        PERSONA_CATEGORIES,
        prevBook,
        nextBook,
        relatedBooks,
        relatedGuides
      )
    })
  )
})

// 독자 유형별 전용 페이지 (/category/:id)
app.get('/category/:id', (c) => {
  const origin = getOrigin(c.req.url)
  const catId = c.req.param('id')
  if (catId === 'all') {
    return c.redirect('/', 301)
  }

  const persona = PERSONA_CATEGORIES.find((p) => p.id === catId)
  if (!persona) {
    return c.html(
      renderSiteLayout({
        title: '카테고리를 찾을 수 없습니다 | 성장 서재 50',
        description: '요청하신 독자 유형 카테고리를 찾을 수 없습니다.',
        canonicalPath: `/category/${catId}`,
        origin,
        enableAds: false,
        bodyContent: renderNotFoundPageContent()
      }),
      404
    )
  }

  const booksInCat = ALL_BOOKS.filter((b) => b.personas.includes(persona.id))

  return c.html(
    renderSiteLayout({
      title: `${persona.label}을 위한 추천 자기계발서 ${booksInCat.length}선 | 성장 서재 50`,
      description: persona.description,
      canonicalPath: `/category/${persona.id}`,
      origin,
      enableAds: true,
      activeNav: 'categories',
      bodyContent: renderCategoryPageContent(persona, PERSONA_CATEGORIES, booksInCat)
    })
  )
})

// 1분 맞춤 인생책 진단 테스트 페이지 (/quiz)
app.get('/quiz', (c) => {
  const origin = getOrigin(c.req.url)
  const quizDataJson = JSON.stringify({
    personas: PERSONA_CATEGORIES,
    books: ALL_BOOKS
  }).replace(/</g, '\\u003c')

  return c.html(
    renderSiteLayout({
      title: '1분 맞춤 인생 자기계발서 진단 테스트 | 성장 서재 50',
      description:
        '5가지 질문으로 현재 나의 고민, 행동 패턴, 선호 난이도를 분석하여 50권의 검증된 명저 중 지금 가장 필요한 인생책 TOP 3를 처방해 드립니다.',
      canonicalPath: '/quiz',
      origin,
      enableAds: true,
      activeNav: 'quiz',
      bodyContent: renderQuizPageContent(quizDataJson),
      extraScriptSrc: '/static/quiz.js'
    })
  )
})

// 심층 독서 칼럼 목록 (/guides)
app.get('/guides', (c) => {
  const origin = getOrigin(c.req.url)
  return c.html(
    renderSiteLayout({
      title: '실전 독서법 & 자기계발 심층 칼럼 | 성장 서재 50',
      description:
        '자기계발서를 읽고 실제 행동 변화로 연결하는 4단계 실천 독서법, 30일 습관·몰입 설계, 멘탈 회복탄력성, 경제적 자유 로드맵 칼럼을 만나보세요.',
      canonicalPath: '/guides',
      origin,
      enableAds: true,
      activeNav: 'guides',
      bodyContent: renderGuidesListPageContent(EDITORIAL_GUIDES)
    })
  )
})

// 심층 독서 칼럼 상세 (/guide/:slug)
app.get('/guide/:slug', (c) => {
  const origin = getOrigin(c.req.url)
  const slug = c.req.param('slug')
  const guide = EDITORIAL_GUIDES.find((g) => g.slug === slug)

  if (!guide) {
    return c.html(
      renderSiteLayout({
        title: '칼럼을 찾을 수 없습니다 | 성장 서재 50',
        description: '요청하신 칼럼을 찾을 수 없습니다.',
        canonicalPath: `/guide/${slug}`,
        origin,
        enableAds: false,
        bodyContent: renderNotFoundPageContent()
      }),
      404
    )
  }

  const otherGuides = EDITORIAL_GUIDES.filter((g) => g.slug !== guide.slug)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedDate,
    author: {
      '@type': 'Organization',
      name: '성장 서재 50 에디토리얼 팀'
    },
    publisher: {
      '@type': 'Organization',
      name: '성장 서재 50'
    },
    mainEntityOfPage: `${origin}/guide/${guide.slug}`
  }

  return c.html(
    renderSiteLayout({
      title: `${guide.title} | 성장 서재 50 실전 칼럼`,
      description: guide.excerpt,
      canonicalPath: `/guide/${guide.slug}`,
      origin,
      enableAds: true,
      activeNav: 'guides',
      jsonLd: articleJsonLd,
      bodyContent: renderGuideDetailPageContent(guide, ALL_BOOKS, otherGuides)
    })
  )
})

// 서비스 소개 및 도서 선정 기준 (/about)
app.get('/about', (c) => {
  const origin = getOrigin(c.req.url)
  return c.html(
    renderSiteLayout({
      title: '서비스 소개 및 50권 도서 선정 원칙 | 성장 서재 50',
      description:
        '성장 서재 50의 설립 취지, 검증된 자기계발 명저 50권 선정 4대 기준 및 독창적 큐레이션 작성 원칙을 소개합니다.',
      canonicalPath: '/about',
      origin,
      enableAds: true,
      activeNav: 'about',
      bodyContent: renderAboutPageContent()
    })
  )
})

// 정책 및 안내 페이지들 — AdSense 가이드라인 2부("콘텐츠 기반 페이지가 아닌 페이지에는 광고 미게재") 원칙에 따라 enableAds: false 적용
app.get('/privacy', (c) => {
  const origin = getOrigin(c.req.url)
  return c.html(
    renderSiteLayout({
      title: '개인정보처리방침 (쿠키 및 Google AdSense 안내) | 성장 서재 50',
      description: '성장 서재 50의 개인정보 보호 정책, 브라우저 저장소 및 Google AdSense 광고 쿠키 운영 방침을 안내합니다.',
      canonicalPath: '/privacy',
      origin,
      enableAds: false,
      activeNav: 'about',
      bodyContent: renderPrivacyPageContent()
    })
  )
})

app.get('/terms', (c) => {
  const origin = getOrigin(c.req.url)
  return c.html(
    renderSiteLayout({
      title: '이용약관 및 저작권 안내 | 성장 서재 50',
      description: '성장 서재 50 서비스 이용약관, 도서 인용 저작권 기준 및 면책 사항을 안내합니다.',
      canonicalPath: '/terms',
      origin,
      enableAds: false,
      activeNav: 'about',
      bodyContent: renderTermsPageContent()
    })
  )
})

app.get('/contact', (c) => {
  const origin = getOrigin(c.req.url)
  return c.html(
    renderSiteLayout({
      title: '문의 및 도서 제보 | 성장 서재 50',
      description: '도서 정보 정정 요청, 인생 자기계발서 추천 및 사이트 개선 의견 접수 안내 페이지입니다.',
      canonicalPath: '/contact',
      origin,
      enableAds: false,
      activeNav: 'about',
      bodyContent: renderContactPageContent()
    })
  )
})

// 커스텀 404 오류 페이지 — AdSense 가이드라인 2부 명시 사항: 404 오류 페이지에는 절대 광고를 게재하지 않음(enableAds: false)
app.notFound((c) => {
  const origin = getOrigin(c.req.url)
  return c.html(
    renderSiteLayout({
      title: '페이지를 찾을 수 없습니다 (404) | 성장 서재 50',
      description: '요청하신 페이지 주소를 찾을 수 없습니다.',
      canonicalPath: '/404',
      origin,
      enableAds: false,
      bodyContent: renderNotFoundPageContent()
    }),
    404
  )
})

export default app
