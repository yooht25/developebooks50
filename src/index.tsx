import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ALL_BOOKS, PERSONA_CATEGORIES } from './data/books'

const app = new Hono()

app.use('/api/*', cors())

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

  // 같은 추천 독자군에 속하는 연관 추천 도서 3권 추출
  const related = ALL_BOOKS.filter(
    (b) => b.id !== book.id && b.personas.some((p) => book.personas.includes(p))
  ).slice(0, 3)

  return c.json({ book, related })
})

// 메인 페이지 렌더링
app.get('/', (c) => {
  const initialDataJson = JSON.stringify({
    personas: PERSONA_CATEGORIES,
    books: ALL_BOOKS
  }).replace(/</g, '\\u003c')

  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>인생을 바꾸는 자기계발서 50선 | 나에게 꼭 맞는 성장 큐레이션</title>
  <meta name="description" content="시대를 초월해 검증된 자기계발서 50권을 추천 대상별로 탐색하고, 도서를 클릭해 작가 소개와 핵심 내용을 확인해보세요." />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Cpath d='M18 16h28a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4zm4 8v20h20V24H22z' fill='%23ffffff'/%3E%3C/svg%3E" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=Noto+Serif+KR:wght@500;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css" rel="stylesheet" />
</head>
<body class="bg-stone-50 text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
  <!-- 상단 네비게이션 헤더 -->
  <header id="site-header" class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <a href="#" id="brand-logo" class="flex items-center gap-3 group">
        <span class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition">
          <i class="fa-solid fa-book-open-reader text-lg"></i>
        </span>
        <div>
          <span class="font-bold text-lg tracking-tight text-slate-900 block leading-none">성장 서재 50</span>
          <span class="text-xs text-slate-500 mt-0.5 block">맞춤형 자기계발 큐레이션</span>
        </div>
      </a>

      <nav aria-label="빠른 도구 메뉴" class="flex items-center gap-2 sm:gap-3">
        <button id="random-book-btn" type="button" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition">
          <i class="fa-solid fa-wand-magic-sparkles text-amber-600"></i>
          <span class="hidden sm:inline">오늘의 운명 도서 뽑기</span>
          <span class="sm:hidden">랜덤 추천</span>
        </button>

        <button id="bookmark-filter-btn" type="button" aria-pressed="false" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-stone-100 text-slate-700 border border-stone-200 hover:bg-stone-200 transition">
          <i class="fa-regular fa-bookmark text-indigo-600" id="bookmark-header-icon"></i>
          <span>내 서재</span>
          <span id="bookmark-count-badge" class="px-1.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">0</span>
        </button>
      </nav>
    </div>
  </header>

  <main id="main-content">
    <!-- 히어로 섹션 -->
    <section id="hero-section" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-16">
      <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(#818cf8 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-medium mb-4">
            <i class="fa-solid fa-star text-amber-400"></i>
            전 세계 수천만 독자가 검증한 필독서 50권 총정리
          </p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight serif-heading">
            지금 당신의 고민에 답하는<br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-teal-200">인생 자기계발서 50선</span>
          </h1>
          <p class="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <strong>"어떤 사람들이 봐야 할까?"</strong> 아래 메뉴에서 지금 내 상황과 가장 가까운 유형을 선택해 보세요.
            원하는 책을 클릭하면 <strong>작가 소개, 핵심 내용 요약, 3가지 실천 원칙, 명문장</strong>까지 한눈에 볼 수 있습니다.
          </p>
        </div>
      </div>
    </section>

    <!-- 어떤 사람들이 봐야 하는지 선택하는 추천 대상 메뉴 섹션 -->
    <section id="persona-selector-section" aria-labelledby="persona-menu-heading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
      <div class="bg-white rounded-2xl shadow-lg border border-stone-200/90 p-5 sm:p-7">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 id="persona-menu-heading" class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-user-check text-indigo-600"></i>
              어떤 사람이 읽어야 할까요? (독자 유형 선택 메뉴)
            </h2>
            <p class="text-sm text-slate-500 mt-0.5">나에게 해당하는 고민이나 목표를 선택하면 맞춤형 추천 도서만 골라 보여드립니다.</p>
          </div>
          <button id="reset-persona-btn" type="button" class="hidden self-start sm:self-auto text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg bg-indigo-50 transition">
            <i class="fa-solid fa-rotate-left mr-1"></i>전체 50권으로 초기화
          </button>
        </div>

        <!-- 독자 유형 선택 카드/탭 그리드 -->
        <div id="persona-menu-grid" role="tablist" aria-label="추천 독자 유형 선택" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <!-- JS로 렌더링 -->
        </div>

        <!-- 현재 선택된 독자 유형 안내 배너 -->
        <div id="active-persona-banner" class="mt-4 px-4 py-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-start sm:items-center gap-2.5">
            <i id="banner-icon" class="fa-solid fa-layer-group text-indigo-600 mt-0.5 sm:mt-0"></i>
            <div>
              <span id="banner-title" class="font-bold text-sm text-slate-900">전체 50권 보기</span>
              <span class="hidden sm:inline text-slate-300 mx-2">|</span>
              <p id="banner-desc" class="text-xs sm:text-sm text-slate-600 sm:inline">시대를 초월해 검증된 최고의 자기계발서 50권을 모두 확인해보세요.</p>
            </div>
          </div>
          <span id="result-count-label" class="text-xs sm:text-sm font-bold text-indigo-700 whitespace-nowrap">총 50권</span>
        </div>
      </div>
    </section>

    <!-- 검색 및 필터 바 -->
    <section id="search-filter-section" aria-label="도서 검색 및 정렬" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm">
        <div class="relative flex-1">
          <label for="book-search-input" class="sr-only">책 제목, 작가, 키워드 검색</label>
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            id="book-search-input"
            type="search"
            placeholder="책 제목, 작가명, 고민 키워드(예: 습관, 돈, 대화, 불안, 리더십)로 검색..."
            class="w-full pl-10 pr-9 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          <button id="clear-search-btn" type="button" aria-label="검색어 지우기" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>

        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <!-- 난이도 선택 -->
          <div class="flex items-center bg-stone-100 p-1 rounded-lg text-xs font-medium" role="group" aria-label="독서 난이도 필터">
            <button type="button" data-difficulty="all" class="difficulty-btn active px-3 py-1.5 rounded-md bg-white text-slate-900 shadow-sm transition">전체 난이도</button>
            <button type="button" data-difficulty="입문" class="difficulty-btn px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition">입문</button>
            <button type="button" data-difficulty="중급" class="difficulty-btn px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition">중급</button>
            <button type="button" data-difficulty="심화" class="difficulty-btn px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition">심화</button>
          </div>

          <!-- 정렬 선택 -->
          <label for="sort-select" class="sr-only">정렬 방식</label>
          <select id="sort-select" class="px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="id-asc">추천 번호순 (1~50)</option>
            <option value="year-desc">최신 출간순</option>
            <option value="year-asc">고전 명저순 (오래된순)</option>
            <option value="title-asc">제목 가나다순</option>
          </select>
        </div>
      </div>
    </section>

    <!-- 도서 50권 카드 그리드 목록 -->
    <section id="books-catalog-section" aria-label="자기계발서 도서 목록" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div id="books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <!-- JS로 책 카드 렌더링 -->
      </div>

      <!-- 검색 결과 없음 안내 -->
      <div id="empty-state" class="hidden text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
        <div class="w-16 h-16 mx-auto rounded-full bg-stone-100 text-slate-400 flex items-center justify-center mb-4">
          <i class="fa-solid fa-book-open text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800">조건에 맞는 자기계발서를 찾지 못했습니다</h3>
        <p class="text-sm text-slate-500 mt-1 mb-5">다른 독자 유형을 선택하거나 검색어 필터를 초기화해 보세요.</p>
        <button id="empty-reset-btn" type="button" class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
          전체 도서 50권 다시 보기
        </button>
      </div>
    </section>
  </main>

  <!-- 푸터 -->
  <footer class="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
      <div class="flex items-center gap-2.5">
        <i class="fa-solid fa-book-open-reader text-indigo-400"></i>
        <span class="font-semibold text-white">성장 서재 50</span>
        <span>— 삶의 방향을 밝혀주는 자기계발서 50권 큐레이션</span>
      </div>
      <p class="text-xs text-slate-500">원하는 도서 카드를 클릭하면 작가 소개와 상세 핵심 내용을 열람할 수 있습니다.</p>
    </div>
  </footer>

  <!-- 도서 상세 모달 (클릭 시 작가 & 내용 & 추천 대상 상세 표시) -->
  <div id="book-detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-book-title" class="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-6">
    <!-- 배경 오버레이 -->
    <div id="modal-backdrop" class="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"></div>

    <!-- 모달 컨테이너 -->
    <article class="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 animate-modal-in">
      <!-- 모달 상단 북 커버 헤더 -->
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

      <!-- 모달 본문 스크롤 영역 -->
      <div id="modal-scroll-body" class="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
        <!-- 작가 소개 섹션 -->
        <section aria-labelledby="section-author-heading" class="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80">
          <h3 id="section-author-heading" class="text-sm font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2 mb-2">
            <i class="fa-solid fa-user-pen"></i>
            작가 소개
          </h3>
          <p id="modal-author-name-bold" class="font-bold text-slate-900 text-base mb-1"></p>
          <p id="modal-author-bio" class="text-sm sm:text-base leading-relaxed text-slate-600"></p>
        </section>

        <!-- 책 핵심 내용 요약 -->
        <section aria-labelledby="section-summary-heading">
          <h3 id="section-summary-heading" class="text-base font-bold text-slate-900 flex items-center gap-2 mb-2.5">
            <i class="fa-solid fa-book-open text-indigo-600"></i>
            핵심 내용 및 줄거리
          </h3>
          <p id="modal-book-summary" class="text-sm sm:text-base leading-7 text-slate-700"></p>
        </section>

        <!-- 핵심 인사이트 3가지 -->
        <section aria-labelledby="section-lessons-heading">
          <h3 id="section-lessons-heading" class="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <i class="fa-solid fa-list-check text-teal-600"></i>
            삶에 바로 적용하는 핵심 교훈 3가지
          </h3>
          <ul id="modal-key-lessons" class="space-y-2.5">
            <!-- JS 렌더링 -->
          </ul>
        </section>

        <!-- 책 속 명문장 -->
        <blockquote class="relative bg-gradient-to-r from-indigo-50 to-amber-50/50 border-l-4 border-indigo-600 rounded-r-2xl p-4 sm:p-5">
          <i class="fa-solid fa-quote-left text-indigo-300 text-xl mb-1 block"></i>
          <p id="modal-book-quote" class="serif-heading text-slate-800 font-medium text-sm sm:text-base leading-relaxed italic"></p>
        </blockquote>

        <!-- 어떤 사람들이 읽어야 하는가 -->
        <section aria-labelledby="section-target-heading" class="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-200/70">
          <h3 id="section-target-heading" class="text-base font-bold text-emerald-900 flex items-center gap-2 mb-3">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            이런 분들에게 특히 추천합니다!
          </h3>
          <div id="modal-persona-badges" class="flex flex-wrap gap-1.5 mb-3"></div>
          <ul id="modal-who-should-read" class="space-y-2 text-sm text-emerald-950">
            <!-- JS 렌더링 -->
          </ul>
        </section>

        <!-- 함께 읽으면 좋은 연관 도서 -->
        <section aria-labelledby="section-related-heading" class="pt-2 border-t border-stone-200">
          <h3 id="section-related-heading" class="text-sm font-bold text-slate-500 mb-3">비슷한 고민을 가진 분들이 함께 읽은 책</h3>
          <div id="modal-related-books" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5"></div>
        </section>
      </div>

      <!-- 모달 하단 이전/다음 책 이동 바 -->
      <div class="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
        <button id="modal-prev-btn" type="button" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition">
          <i class="fa-solid fa-arrow-left"></i>
          <span>이전 도서</span>
        </button>
        <span id="modal-position-indicator" class="text-xs text-slate-400 font-medium">1 / 50</span>
        <button id="modal-next-btn" type="button" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition">
          <span>다음 도서</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </article>
  </div>

  <!-- 초기 데이터 주입 -->
  <script id="initial-catalog-data" type="application/json">${initialDataJson}</script>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
