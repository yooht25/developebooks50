import { Book, PersonaCategory } from '../data/books';
import { EditorialGuide } from '../data/guides';
import { escapeHtmlServer } from './layout';

// 도서 상세 페이지 SSR 렌더링 (/book/:id) - Googlebot 및 사용자에게 풍부한 고유 분석 콘텐츠 제공
export function renderBookDetailPageContent(
  book: Book,
  allPersonas: PersonaCategory[],
  prevBook: Book | null,
  nextBook: Book | null,
  relatedBooks: Book[],
  relatedGuides: EditorialGuide[]
): string {
  const numStr = String(book.id).padStart(2, '0');

  const personaLinksHtml = book.personas
    .map((pid) => {
      const p = allPersonas.find((cat) => cat.id === pid);
      if (!p) return '';
      return `<a href="/category/${escapeHtmlServer(p.id)}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition">
        <i class="fa-solid ${escapeHtmlServer(p.icon)}"></i>
        <span>${escapeHtmlServer(p.label)}</span>
      </a>`;
    })
    .join('');

  const keyLessonsHtml = book.keyLessons
    .map(
      (lesson, idx) => `
      <li class="flex items-start gap-4 bg-stone-50 dark:bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-slate-700">
        <span class="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
        <div class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">${escapeHtmlServer(lesson)}</div>
      </li>`
    )
    .join('');

  const whoShouldReadHtml = book.whoShouldRead
    .map(
      (item) => `
      <li class="flex items-start gap-3">
        <i class="fa-solid fa-circle-check text-emerald-600 dark:text-emerald-400 mt-1 shrink-0"></i>
        <span class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">${escapeHtmlServer(item)}</span>
      </li>`
    )
    .join('');

  const tagsHtml = book.tags
    .map(
      (tag) =>
        `<span class="px-3 py-1 rounded-lg bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">#${escapeHtmlServer(tag)}</span>`
    )
    .join('');

  const relatedBooksHtml = relatedBooks
    .map(
      (rel) => `
      <a href="/book/${rel.id}" class="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">NO. ${String(rel.id).padStart(2, '0')}</span>
            <span class="text-xs text-slate-400">${rel.year}년 · ${escapeHtmlServer(rel.difficulty)}</span>
          </div>
          <h4 class="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition serif-heading">${escapeHtmlServer(rel.title)}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${escapeHtmlServer(rel.author)}</p>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">${escapeHtmlServer(rel.summary)}</p>
        </div>
        <span class="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">상세 리뷰 읽기 <i class="fa-solid fa-arrow-right text-[10px]"></i></span>
      </a>`
    )
    .join('');

  const relatedGuidesHtml =
    relatedGuides.length > 0
      ? `<section class="mt-10 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/60">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <i class="fa-solid fa-newspaper text-indigo-600 dark:text-indigo-400"></i>
            이 책과 연결된 심층 독서 칼럼
          </h3>
          <div class="space-y-3">
            ${relatedGuides
              .map(
                (g) => `
              <a href="/guide/${escapeHtmlServer(g.slug)}" class="block p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-indigo-400 transition">
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">${escapeHtmlServer(g.categoryLabel)}</span>
                <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">${escapeHtmlServer(g.title)}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">${escapeHtmlServer(g.excerpt)}</p>
              </a>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  // 난이도에 따른 독서 실천 팁 보강 문단 (고유 부가가치 텍스트)
  const readingStrategyText =
    book.difficulty === '입문'
      ? `《${book.title}》은(는) 자기계발서를 처음 접하거나 부담 없이 핵심 원리를 익히고 싶은 입문 독자에게 매우 적합한 책입니다. 예상 완독 시간은 ${book.readingTime} 내외이며, 처음부터 끝까지 정독한 뒤 제시된 3가지 핵심 교훈 중 오늘 당장 실행할 수 있는 가장 작은 습관 하나를 골라 일주일간 실천해 보는 것을 권장합니다.`
      : book.difficulty === '중급'
      ? `《${book.title}》은(는) 풍부한 연구 사례와 구조적인 프레임워크를 담고 있는 중급 난이도의 필독서입니다. 예상 독서 시간은 ${book.readingTime} 정도 소요되며, 각 장을 읽을 때마다 본인의 현재 업무나 일상 문제에 어떻게 대입할 수 있을지 노트에 메모하며 읽으면 훨씬 깊은 통찰을 얻을 수 있습니다.`
      : `《${book.title}》은(는) 인간의 의사결정, 시스템 사고, 철학적 원리를 깊이 있게 파고드는 심화 명저입니다. 총 예상 독서 시간은 ${book.readingTime} 이상이며, 하루에 한 챕터씩 나누어 숙독하면서 저자의 핵심 개념을 자신의 언어로 요약·복기하는 벽돌책 독서법을 추천합니다.`;

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- 브레드크럼 (탐색 경로 명확화) -->
      <nav aria-label="현재 위치 경로" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <a href="/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition">홈 (50선 목록)</a>
        <span>/</span>
        <a href="/category/${escapeHtmlServer(book.personas[0] || 'all')}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition">독자 유형별 추천</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold">${escapeHtmlServer(book.title)}</span>
      </nav>

      <!-- 상단 도서 커버 배너 -->
      <article class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-stone-200 dark:border-slate-800 overflow-hidden">
        <header
          class="p-6 sm:p-10 text-white relative"
          style="background: linear-gradient(135deg, ${escapeHtmlServer(book.coverTheme.bgFrom)} 0%, ${escapeHtmlServer(book.coverTheme.bgTo)} 100%);"
        >
          <div class="flex flex-wrap items-center gap-2 text-xs font-semibold mb-5">
            <span class="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">성장 서재 NO. ${numStr}</span>
            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">${book.year}년 초판 출간</span>
            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">독서 난이도: ${escapeHtmlServer(book.difficulty)}</span>
            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"><i class="fa-regular fa-clock mr-1"></i>완독 ${escapeHtmlServer(book.readingTime)}</span>
          </div>

          <div class="flex items-end justify-between gap-6">
            <div>
              <p class="text-sm sm:text-base text-white/80 font-medium">${escapeHtmlServer(book.originalTitle)}</p>
              <h1 class="text-2xl sm:text-4xl font-extrabold mt-1 leading-tight serif-heading">${escapeHtmlServer(book.title)}</h1>
              <p class="mt-3 text-base sm:text-lg font-semibold text-white/95 flex items-center gap-2">
                <i class="fa-solid fa-pen-fancy text-sm opacity-85"></i>
                <span>저자: ${escapeHtmlServer(book.author)}</span>
              </p>
            </div>
            <div class="hidden sm:flex w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm items-center justify-center shrink-0 border border-white/25">
              <i class="fa-solid ${escapeHtmlServer(book.coverTheme.icon)} text-4xl" style="color: ${escapeHtmlServer(book.coverTheme.accent)}"></i>
            </div>
          </div>
        </header>

        <!-- 본문 상세 분석 섹션 -->
        <div class="p-6 sm:p-10 space-y-9">
          <!-- 1. 작가 소개 -->
          <section aria-labelledby="book-author-sec">
            <h2 id="book-author-sec" class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-3">
              <i class="fa-solid fa-user-pen text-indigo-600 dark:text-indigo-400"></i>
              작가 소개 — ${escapeHtmlServer(book.author)}
            </h2>
            <p class="text-base leading-8 text-slate-700 dark:text-slate-300 bg-stone-50 dark:bg-slate-800/70 p-5 rounded-2xl border border-stone-200/80 dark:border-slate-700">
              ${escapeHtmlServer(book.authorBio)}
            </p>
          </section>

          <!-- 2. 도서 핵심 내용 및 심층 줄거리 -->
          <section aria-labelledby="book-summary-sec">
            <h2 id="book-summary-sec" class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-3">
              <i class="fa-solid fa-book-open text-indigo-600 dark:text-indigo-400"></i>
              핵심 내용 및 줄거리 해설
            </h2>
            <p class="text-base leading-8 text-slate-700 dark:text-slate-200">
              ${escapeHtmlServer(book.summary)}
            </p>
          </section>

          <!-- 3. 삶에 적용하는 핵심 교훈 3가지 -->
          <section aria-labelledby="book-lessons-sec">
            <h2 id="book-lessons-sec" class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-4">
              <i class="fa-solid fa-list-check text-teal-600 dark:text-teal-400"></i>
              삶을 바꾸는 3가지 핵심 원칙과 인사이트
            </h2>
            <ul class="space-y-3">
              ${keyLessonsHtml}
            </ul>
          </section>

          <!-- 4. 대표 명문장 -->
          <section aria-labelledby="book-quote-sec">
            <h2 id="book-quote-sec" class="sr-only">책 속 대표 명문장</h2>
            <blockquote class="bg-gradient-to-r from-indigo-50 to-amber-50/60 dark:from-indigo-950/60 dark:to-slate-800/70 border-l-4 border-indigo-600 dark:border-indigo-400 rounded-r-2xl p-6">
              <i class="fa-solid fa-quote-left text-indigo-400 text-2xl mb-2 block"></i>
              <p class="serif-heading text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed italic">
                "${escapeHtmlServer(book.quote)}"
              </p>
              <footer class="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">— 《${escapeHtmlServer(book.title)}》 본문 핵심 메시지 중</footer>
            </blockquote>
          </section>

          <!-- 5. 어떤 사람들이 읽어야 하는가 -->
          <section aria-labelledby="book-reader-sec" class="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-6 border border-emerald-200/80 dark:border-emerald-800/60">
            <h2 id="book-reader-sec" class="text-lg sm:text-xl font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2.5 mb-4">
              <i class="fa-solid fa-user-check text-emerald-600 dark:text-emerald-400"></i>
              어떤 사람들이 읽어야 할까요? (맞춤 추천 독자)
            </h2>
            <div class="flex flex-wrap gap-2 mb-4">
              ${personaLinksHtml}
            </div>
            <ul class="space-y-2.5">
              ${whoShouldReadHtml}
            </ul>
          </section>

          <!-- 6. 실전 독서 가이드 팁 -->
          <section aria-labelledby="book-guide-tip-sec">
            <h2 id="book-guide-tip-sec" class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-3">
              <i class="fa-solid fa-compass text-amber-600 dark:text-amber-400"></i>
              완독 및 실천 가이드
            </h2>
            <p class="text-sm sm:text-base leading-7 text-slate-700 dark:text-slate-300">
              ${escapeHtmlServer(readingStrategyText)}
            </p>
            <div class="flex flex-wrap gap-2 mt-4">
              ${tagsHtml}
            </div>
          </section>

          <!-- 7. 나만의 실천 다짐 & 독서 노트 (브라우저 자동 저장 양방향 도구) -->
          <section aria-labelledby="book-note-sec" class="bg-indigo-50/50 dark:bg-slate-800/60 rounded-2xl p-6 border border-indigo-100 dark:border-slate-700">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h2 id="book-note-sec" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square text-indigo-600 dark:text-indigo-400"></i>
                나만의 독서 실천 노트 (내 브라우저에 자동 보관)
              </h2>
              <label class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer select-none">
                <input type="checkbox" id="book-read-done-checkbox" data-book-id="${book.id}" class="w-4 h-4 rounded accent-emerald-600" />
                <span>이 책 완독 완료 표시</span>
              </label>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
              책을 덮은 뒤 내일 당장 실행할 <strong>단 1가지 작은 행동(One Action)</strong>이나 기억하고 싶은 문장을 적어보세요.
            </p>
            <textarea
              id="book-personal-note"
              data-book-id="${book.id}"
              rows="3"
              placeholder="예: 매일 아침 출근 전 10분 동안 스마트폰 대신 이 책의 원칙 1가지를 점검하겠다..."
              class="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            ></textarea>
            <div class="mt-2.5 flex items-center justify-between">
              <span id="book-note-status" class="text-xs text-slate-500 dark:text-slate-400">작성 후 저장 버튼을 누르면 이 기기에 안전하게 보존됩니다.</span>
              <button type="button" id="save-book-note-btn" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">
                실천 노트 저장
              </button>
            </div>
          </section>
        </div>
        <script>
          (function () {
            var noteEl = document.getElementById('book-personal-note');
            var saveBtn = document.getElementById('save-book-note-btn');
            var statusEl = document.getElementById('book-note-status');
            var doneBox = document.getElementById('book-read-done-checkbox');
            if (!noteEl) return;
            var bookId = noteEl.getAttribute('data-book-id');
            var noteKey = 'growth_library_note_v1_' + bookId;
            var doneKey = 'growth_library_done_v1_' + bookId;
            try {
              var saved = localStorage.getItem(noteKey);
              if (saved) noteEl.value = saved;
              if (doneBox && localStorage.getItem(doneKey) === '1') doneBox.checked = true;
            } catch (e) {}
            if (saveBtn) {
              saveBtn.addEventListener('click', function () {
                try {
                  localStorage.setItem(noteKey, noteEl.value);
                  if (statusEl) {
                    statusEl.textContent = '✓ 저장되었습니다! 언제든 다시 와서 점검해 보세요.';
                    statusEl.className = 'text-xs font-bold text-emerald-600 dark:text-emerald-400';
                  }
                } catch (e) {}
              });
            }
            if (doneBox) {
              doneBox.addEventListener('change', function () {
                try {
                  localStorage.setItem(doneKey, doneBox.checked ? '1' : '0');
                } catch (e) {}
              });
            }
          })();
        </script>

        <!-- 이전 / 다음 도서 이동 네비게이션 -->
        <nav aria-label="이전 및 다음 도서 이동" class="px-6 sm:px-10 py-5 bg-stone-50 dark:bg-slate-800/80 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          ${
            prevBook
              ? `<a href="/book/${prevBook.id}" class="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  <i class="fa-solid fa-arrow-left text-xs"></i>
                  <span>이전: NO.${String(prevBook.id).padStart(2, '0')} ${escapeHtmlServer(prevBook.title)}</span>
                </a>`
              : `<span></span>`
          }
          <a href="/" class="text-center text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">전체 50권 목록으로</a>
          ${
            nextBook
              ? `<a href="/book/${nextBook.id}" class="flex items-center justify-end gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  <span>다음: NO.${String(nextBook.id).padStart(2, '0')} ${escapeHtmlServer(nextBook.title)}</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>`
              : `<span></span>`
          }
        </nav>
      </article>

      ${relatedGuidesHtml}

      <!-- 연관 추천 도서 4권 -->
      <section aria-labelledby="related-books-sec" class="mt-12">
        <h2 id="related-books-sec" class="text-xl font-bold text-slate-900 dark:text-white mb-4">비슷한 고민에 해답을 주는 연관 추천 도서</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${relatedBooksHtml}
        </div>
      </section>
    </div>
  `;
}

// 독자 유형별 전용 추천 로드맵 페이지 (/category/:id)
export function renderCategoryPageContent(
  currentPersona: PersonaCategory,
  allPersonas: PersonaCategory[],
  booksInCategory: Book[]
): string {
  const tabsHtml = allPersonas
    .filter((p) => p.id !== 'all')
    .map((p) => {
      const active = p.id === currentPersona.id;
      return `<a href="/category/${escapeHtmlServer(p.id)}" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-2 ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-800 hover:border-indigo-400'
      }">
        <i class="fa-solid ${escapeHtmlServer(p.icon)}"></i>
        <span>${escapeHtmlServer(p.shortLabel)}</span>
      </a>`;
    })
    .join('');

  const booksHtml = booksInCategory
    .map(
      (book) => `
      <article class="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-md text-xs font-extrabold text-white" style="background-color: ${escapeHtmlServer(book.coverTheme.bgFrom)}">NO. ${String(book.id).padStart(2, '0')}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">${book.year}년 · 난이도 ${escapeHtmlServer(book.difficulty)} · ${escapeHtmlServer(book.readingTime)}</span>
          </div>
          <h2 class="text-xl font-extrabold text-slate-900 dark:text-white serif-heading">
            <a href="/book/${book.id}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition">${escapeHtmlServer(book.title)}</a>
          </h2>
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">${escapeHtmlServer(book.author)} <span class="text-slate-400 font-normal">(${escapeHtmlServer(book.originalTitle)})</span></p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-3">${escapeHtmlServer(book.summary)}</p>
          <div class="mt-4 bg-stone-50 dark:bg-slate-800/70 rounded-xl p-3.5 border border-stone-200/70 dark:border-slate-700">
            <p class="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">핵심 추천 이유</p>
            <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200">${escapeHtmlServer(book.whoShouldRead[0] || '')}</p>
          </div>
        </div>
        <div class="mt-5 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-400">#${book.tags.slice(0, 3).map(escapeHtmlServer).join(' #')}</span>
          <a href="/book/${book.id}" class="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            작가 &amp; 핵심 교훈 전체 보기 <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>
      </article>`
    )
    .join('');

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="경로" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-2">
        <a href="/" class="hover:text-indigo-600">홈</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold">${escapeHtmlServer(currentPersona.shortLabel)} 맞춤 도서</span>
      </nav>

      <!-- 다른 독자 유형 전환 탭 -->
      <div class="flex flex-wrap gap-2 mb-8">
        ${tabsHtml}
      </div>

      <header class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-9 border border-stone-200 dark:border-slate-800 shadow-sm mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style="background-color: ${escapeHtmlServer(currentPersona.accentColor)}">
          <i class="fa-solid ${escapeHtmlServer(currentPersona.icon)}"></i>
          <span>독자 유형별 맞춤 큐레이션 (${booksInCategory.length}권)</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white serif-heading">${escapeHtmlServer(currentPersona.label)}</h1>
        <p class="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtmlServer(currentPersona.description)} 입문서부터 차근차근 읽으며 삶에 바로 적용할 수 있도록 각 책의 핵심 메시지와 추천 이유를 정리했습니다.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${booksHtml}
      </div>
    </div>
  `;
}

// 실전 독서 가이드 & 심층 칼럼 목록 페이지 (/guides)
export function renderGuidesListPageContent(guides: EditorialGuide[]): string {
  const cards = guides
    .map(
      (g) => `
      <article class="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:border-indigo-500 transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white" style="background-color: ${escapeHtmlServer(g.accentColor)}">
              <i class="fa-solid ${escapeHtmlServer(g.icon)}"></i>
              ${escapeHtmlServer(g.categoryLabel)}
            </span>
            <span class="text-xs text-slate-400">${escapeHtmlServer(g.publishedDate)} · ${escapeHtmlServer(g.readingTime)}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug serif-heading">
            <a href="/guide/${escapeHtmlServer(g.slug)}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition">${escapeHtmlServer(g.title)}</a>
          </h2>
          <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1.5">${escapeHtmlServer(g.subtitle)}</p>
          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mt-4">${escapeHtmlServer(g.excerpt)}</p>
        </div>
        <div class="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-500 dark:text-slate-400">총 ${g.sections.length}개 실전 파트 수록</span>
          <a href="/guide/${escapeHtmlServer(g.slug)}" class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            칼럼 전문 읽기 <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>
      </article>`
    )
    .join('');

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <header class="mb-10">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Editorial &amp; Reading Guides</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 serif-heading">실전 독서법 &amp; 주제별 심층 칼럼</h1>
        <p class="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          단순한 도서 소개를 넘어, 50권의 명저들이 공통으로 말하는 핵심 원리를 현실의 습관·멘탈·커리어·재정 관리에 어떻게 적용할지 심층 분석한 오리지널 가이드입니다.
        </p>
      </header>
      <div class="space-y-6">
        ${cards}
      </div>
    </div>
  `;
}

// 개별 심층 독서 가이드 상세 페이지 (/guide/:slug)
export function renderGuideDetailPageContent(
  guide: EditorialGuide,
  allBooks: Book[],
  otherGuides: EditorialGuide[]
): string {
  const sectionsHtml = guide.sections
    .map((sec) => {
      const recBooks = sec.recommendedBookIds
        .map((id) => allBooks.find((b) => b.id === id))
        .filter((b): b is Book => Boolean(b));

      const recLinks = recBooks
        .map(
          (b) =>
            `<a href="/book/${b.id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:border-indigo-500 transition">
              <i class="fa-solid fa-book text-[11px]"></i>
              <span>《${escapeHtmlServer(b.title)}》 (${escapeHtmlServer(b.author)})</span>
            </a>`
        )
        .join('');

      return `
        <section class="space-y-4">
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug serif-heading">${escapeHtmlServer(sec.heading)}</h2>
          ${sec.paragraphs
            .map(
              (p) =>
                `<p class="text-base leading-8 text-slate-700 dark:text-slate-200">${escapeHtmlServer(p)}</p>`
            )
            .join('')}
          <div class="bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-2xl p-4 sm:p-5">
            <p class="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1">
              <i class="fa-solid fa-bolt mr-1"></i>오늘 바로 적용하는 Action Tip
            </p>
            <p class="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">${escapeHtmlServer(sec.actionTip)}</p>
          </div>
          ${
            recLinks
              ? `<div class="pt-1">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">함께 읽으면 좋은 관련 필독서:</span>
                  <div class="flex flex-wrap gap-2">${recLinks}</div>
                </div>`
              : ''
          }
        </section>`;
    })
    .join('<hr class="border-stone-200 dark:border-slate-800 my-8" />');

  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <nav aria-label="경로" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <a href="/" class="hover:text-indigo-600">홈</a>
        <span>/</span>
        <a href="/guides" class="hover:text-indigo-600">실전 독서 칼럼</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold">${escapeHtmlServer(guide.categoryLabel)}</span>
      </nav>

      <article class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
        <header class="pb-8 border-b border-stone-200 dark:border-slate-800 mb-8">
          <div class="flex items-center gap-3 text-xs font-bold mb-3">
            <span class="px-3 py-1 rounded-full text-white" style="background-color: ${escapeHtmlServer(guide.accentColor)}">${escapeHtmlServer(guide.categoryLabel)}</span>
            <span class="text-slate-400">발행일: ${escapeHtmlServer(guide.publishedDate)}</span>
            <span class="text-slate-400">· ${escapeHtmlServer(guide.readingTime)}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight serif-heading">${escapeHtmlServer(guide.title)}</h1>
          <p class="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtmlServer(guide.subtitle)}</p>
        </header>

        <div class="space-y-8">
          ${sectionsHtml}
        </div>

        <footer class="mt-10 pt-8 border-t border-stone-200 dark:border-slate-800 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl p-6">
          <h3 class="text-base font-bold text-indigo-900 dark:text-indigo-300 mb-2">마치며 — 독서를 삶의 변화로 연결하기</h3>
          <p class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">${escapeHtmlServer(guide.conclusion)}</p>
        </footer>
      </article>

      <section class="mt-12">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">다른 심층 독서 칼럼 이어 읽기</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${otherGuides
            .map(
              (og) => `
            <a href="/guide/${escapeHtmlServer(og.slug)}" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-indigo-500 transition block">
              <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">${escapeHtmlServer(og.categoryLabel)}</span>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-2">${escapeHtmlServer(og.title)}</h3>
            </a>`
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

// 필수 정책 및 신뢰도 페이지들 (/about, /privacy, /terms, /contact, 404)
export function renderAboutPageContent(): string {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed">
        <header class="border-b border-stone-200 dark:border-slate-800 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">About Growth Library 50</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 serif-heading">성장 서재 50 소개 및 도서 큐레이션 원칙</h1>
          <p class="mt-2 text-slate-600 dark:text-slate-300">독자의 귀중한 시간을 아끼고 지금 삶의 고민에 가장 정확한 이정표가 되는 책을 연결합니다.</p>
        </header>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">1. 왜 '성장 서재 50'을 만들었나요?</h2>
          <p class="text-slate-700 dark:text-slate-300">
            매년 수천 권의 자기계발서와 비즈니스 서적이 쏟아져 나오지만, 정작 지금 내 상황(번아웃, 습관 형성 실패, 인간관계 갈등, 커리어 정체, 경제적 불안 등)에 어떤 책을 먼저 읽어야 할지 막막해하는 독자가 많습니다.
            <strong>성장 서재 50</strong>은 자극적인 마케팅 문구가 아닌, 오랜 시간 전 세계 독자들과 심리학·뇌과학·경영학 분야에서 검증된 50권의 핵심 명저만을 엄선하여 독자 맞춤형으로 안내하기 위해 탄생했습니다.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">2. 50권 도서 선정 4대 기준</h2>
          <ul class="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>검증된 지속성(Lindys Effect):</strong> 일시적인 유행에 그치지 않고 출간 후 수년에서 수십 년간 꾸준히 사랑받으며 가치를 입증한 고전과 현대 필독서를 균형 있게 선정했습니다.</li>
            <li><strong>과학적·실증적 근거:</strong> 인지심리학, 행동경제학, 신경과학 연구 또는 저자의 치열한 현장 경험으로 뒷받침되는 도서를 우선했습니다.</li>
            <li><strong>실천 가능성:</strong> 추상적인 정신론에 머물지 않고 독자가 읽은 즉시 일상에 적용할 수 있는 구체적인 방법론을 담은 책을 골랐습니다.</li>
            <li><strong>7대 핵심 성장 영역 균형:</strong> 습관·집중력, 멘탈·자존감, 커리어·성취, 인간관계·소통, 부·재테크 마인드, 인생 철학·통찰, 창의성·사고법까지 삶의 전 영역을 아우르도록 구성했습니다.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">3. 독창적인 콘텐츠 작성 원칙</h2>
          <p class="text-slate-700 dark:text-slate-300">
            본 웹사이트에 수록된 모든 도서 해설, 작가 소개 요약, 3가지 실천 교훈, 추천 독자 진단 및 심층 독서 칼럼은 출판사 보도자료를 단순 복사하지 않고 직접 연구·구조화하여 집필한 고유 콘텐츠입니다. 도서의 저작권은 각 원저작자와 출판사에 있으며, 본 사이트는 독자가 좋은 책을 발견하고 실제 종이책·전자책 독서로 나아가도록 돕는 길잡이 역할을 지향합니다.
          </p>
        </section>
      </article>
    </div>
  `;
}

export function renderPrivacyPageContent(): string {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <header class="border-b border-stone-200 dark:border-slate-800 pb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white serif-heading">개인정보처리방침 (Privacy Policy)</h1>
          <p class="mt-2 text-xs sm:text-sm text-slate-500">시행일 및 최종 업데이트: 2026년 11월 15일</p>
        </header>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">1. 개인정보의 수집 및 이용 목적</h2>
          <p>「성장 서재 50」(이하 "본 사이트")은 별도의 회원가입 절차 없이 모든 도서 큐레이션 및 독서 칼럼을 무료로 열람할 수 있도록 운영됩니다. 사용자가 '내 서재(북마크)' 또는 '다크/화이트 테마 설정'을 이용할 때 해당 설정값은 서버로 전송되지 않고 오직 사용자의 웹 브라우저 내 저장소(<code>localStorage</code>)에만 안전하게 보관됩니다.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">2. 쿠키(Cookie) 및 Google AdSense 광고 게재 안내</h2>
          <p>본 사이트는 무료 콘텐츠 운영 및 유지를 위해 <strong>Google AdSense(구글 애드센스)</strong> 광고 프로그램을 사용합니다. 이와 관련하여 다음 사항을 투명하게 고지합니다:</p>
          <ul class="list-disc pl-5 space-y-1.5">
            <li>Google을 포함한 제3자 광고 사업자는 쿠키(Cookie)를 사용하여 사용자의 본 웹사이트 또는 다른 웹사이트 이전 방문 기록을 바탕으로 맞춤형 광고를 게재할 수 있습니다.</li>
            <li>Google의 광고 쿠키 사용으로 인해 Google 및 파트너는 사용자의 사이트 방문 이력에 기반한 관련성 높은 광고를 제공할 수 있습니다.</li>
            <li>사용자는 언제든지 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline">Google 광고 설정(Ads Settings)</a> 페이지에서 개인 맞춤형 광고를 해제(Opt-out)할 수 있습니다. 또한 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline">www.aboutads.info</a>에 접속하여 제3자 공급업체의 맞춤형 광고 쿠키 사용을 차단할 수 있습니다.</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">3. 서버 로그 및 보안 정보</h2>
          <p>웹 호스팅 인프라(Cloudflare 네트워크) 차원에서 서비스 안정성 확보 및 부정 접속 방지를 위해 IP 주소, 브라우저 유형, 접속 일시 등의 기본적인 비식별 기술 로그가 자동으로 처리될 수 있으며, 개인을 식별하는 용도로 활용되지 않습니다.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">4. 이용자의 권리 및 브라우저 쿠키 관리</h2>
          <p>이용자는 웹 브라우저 설정(크롬, 엣지, 사파리 등)을 통해 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키 및 사이트 데이터의 저장을 거부 및 삭제할 권리가 있습니다.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">5. 개인정보 보호 관련 문의</h2>
          <p>개인정보처리방침이나 사이트 이용과 관련된 문의 사항은 <a href="/contact" class="text-indigo-600 dark:text-indigo-400 underline font-semibold">문의하기 페이지</a>를 통해 접수하실 수 있습니다.</p>
        </section>
      </article>
    </div>
  `;
}

export function renderTermsPageContent(): string {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <header class="border-b border-stone-200 dark:border-slate-800 pb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white serif-heading">이용약관 및 저작권 안내 (Terms of Service)</h1>
          <p class="mt-2 text-xs sm:text-sm text-slate-500">최종 개정일: 2026년 11월 15일</p>
        </header>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">제1조 (목적)</h2>
          <p>본 약관은 「성장 서재 50」(이하 "사이트")이 제공하는 자기계발 도서 큐레이션, 서평 요약 및 독서 가이드 서비스의 이용 조건과 저작권 기준을 명확히 규정함을 목적으로 합니다.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">제2조 (지식재산권 및 도서 인용 안내)</h2>
          <p>1. 본 사이트에서 소개하는 각 도서의 제목, 원제, 저자명 등에 대한 권리는 해당 원저작권자 및 출판사에 귀속됩니다. 본문 내 짧은 명문장 인용은 저작권법상 정당한 비평 및 도서 소개 범위 내에서 출처를 명시하여 사용되었습니다.</p>
          <p>2. 본 사이트가 독자적으로 구성한 큐레이션 분류 체계, 요약 해설문, 실천 가이드 칼럼 및 UI 디자인을 운영자의 사전 동의 없이 상업적으로 무단 복제·크롤링하여 재배포하는 행위를 금합니다.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">제3조 (면책 조항)</h2>
          <p>본 사이트에 수록된 재테크, 심리, 건강, 커리어 관련 도서 소개 및 가이드는 교양 및 독서 안내 목적의 일반 정보이며, 전문적인 법률·의학·금융 투자 자문을 대체하지 않습니다. 구체적인 투자나 의료적 판단은 반드시 해당 분야 전문가와 상의하시기 바랍니다.</p>
        </section>
      </article>
    </div>
  `;
}

export function renderContactPageContent(): string {
  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
        <header class="border-b border-stone-200 dark:border-slate-800 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Contact &amp; Feedback</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 serif-heading">문의 및 도서 추천 제보</h1>
          <p class="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">도서 정보 수정 요청, 추가로 소개되었으면 하는 인생 책 추천, 사이트 개선 의견을 환영합니다.</p>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700">
            <i class="fa-solid fa-code-branch text-indigo-600 dark:text-indigo-400 text-xl mb-2"></i>
            <h2 class="font-bold text-slate-900 dark:text-white">공식 오픈 저장소 이슈 등록</h2>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 mb-3">오탈자 제보 및 기능 제안을 가장 빠르게 확인하고 반영합니다.</p>
            <a href="https://github.com/yooht25/developebooks50/issues" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              GitHub Issues 바로가기 <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>

          <div class="p-5 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700">
            <i class="fa-solid fa-clock text-teal-600 dark:text-teal-400 text-xl mb-2"></i>
            <h2 class="font-bold text-slate-900 dark:text-white">검토 및 답변 안내</h2>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">접수된 도서 정보 정정 요청이나 정책 관련 문의는 영업일 기준 3일 이내에 검토 후 사이트에 반영됩니다.</p>
          </div>
        </div>
      </article>
    </div>
  `;
}

export function renderQuizPageContent(personasJson: string): string {
  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <nav aria-label="경로" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
        <a href="/" class="hover:text-indigo-600">홈</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold">1분 맞춤 인생책 진단 테스트</span>
      </nav>

      <header class="mb-8">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3">
          <i class="fa-solid fa-stethoscope"></i> 인터랙티브 북 큐레이터 진단
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight serif-heading">
          지금 내 상황에 가장 필요한<br class="hidden sm:inline" /> 맞춤 인생 자기계발서 찾기
        </h1>
        <p class="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          5가지 간단한 질문에 답하면 현재 겪고 있는 고민 유형, 행동 성향, 선호하는 독서 난이도와 가용 시간을 종합 분석하여 50권 중 최적의 책 3권을 처방해 드립니다.
        </p>
      </header>

      <!-- 진단 진행 스테이지 -->
      <section id="quiz-stage" class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-9 shadow-sm">
        <div class="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          <span id="quiz-step-label">질문 1 / 5</span>
          <button type="button" id="quiz-prev-btn" class="invisible text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
            <i class="fa-solid fa-arrow-left mr-1"></i>이전 질문으로
          </button>
        </div>
        <div class="w-full h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden mb-7">
          <div id="quiz-progress-bar" class="h-full bg-indigo-600 rounded-full transition-all duration-300" style="width: 20%;"></div>
        </div>

        <h2 id="quiz-question-title" class="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug serif-heading"></h2>
        <p id="quiz-question-sub" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6"></p>

        <div id="quiz-options-container" class="space-y-3"></div>
      </section>

      <!-- 진단 완료 결과 스테이지 -->
      <section id="quiz-result-stage" class="hidden space-y-8">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-9 shadow-sm">
          <span id="quiz-result-badge" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white mb-4"></span>
          <h2 id="quiz-result-title" class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white serif-heading"></h2>
          <p id="quiz-result-desc" class="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed"></p>
          <div class="mt-5 flex flex-wrap items-center gap-3">
            <a id="quiz-result-category-link" href="/category/habit-focus" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              해당 분야 전체 추천 도서 보기
            </a>
            <button type="button" id="quiz-retry-btn" class="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700 transition">
              <i class="fa-solid fa-rotate-left mr-1"></i>다시 진단하기
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-extrabold text-slate-900 dark:text-white mb-4 serif-heading">당신을 위한 맞춤 처방 도서 TOP 3</h3>
          <div id="quiz-result-books" class="space-y-5"></div>
        </div>
      </section>

      <!-- 진단 원리 설명 섹션 (크롤러 및 독자를 위한 풍부한 설명 텍스트) -->
      <section class="mt-12 bg-stone-100/80 dark:bg-slate-900/70 rounded-2xl p-6 border border-stone-200 dark:border-slate-800 space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">맞춤 독서 진단 알고리즘 안내</h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          본 진단 도구는 구글 애드센스 및 웹 품질 가이드라인이 권장하는 '사용자 맞춤형 양방향 가치 제공'을 위해 설계되었습니다. 독자의 현재 핵심 고민(습관·집중력, 멘탈·회복탄력성, 커리어·성취, 인간관계·소통, 부·재테크, 인생 철학, 창의적 사고)과 선호 독서 난이도(입문·중급·심화), 일일 가용 독서 시간을 교차 가중치로 계산하여 가장 완독 확률이 높은 필독서를 우선 추천합니다.
        </p>
      </section>

      <script id="quiz-books-data" type="application/json">${personasJson}</script>
    </div>
  `;
}

export function renderNotFoundPageContent(): string {
  return `
    <div class="max-w-xl mx-auto px-4 py-20 text-center">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
        <i class="fa-solid fa-compass text-2xl"></i>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white serif-heading">요청하신 페이지를 찾을 수 없습니다 (404)</h1>
      <p class="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">주소가 변경되었거나 삭제된 페이지입니다. 아래 버튼을 통해 자기계발서 50선 전체 목록이나 독서 칼럼을 탐색해 보세요.</p>
      <div class="mt-7 flex items-center justify-center gap-3">
        <a href="/" class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">도서 50선 홈으로</a>
        <a href="/guides" class="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:opacity-90 transition">실전 독서 칼럼 보기</a>
      </div>
    </div>
  `;
}
