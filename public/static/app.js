(function () {
  const dataEl = document.getElementById('initial-catalog-data');
  if (!dataEl) return;

  const catalogData = JSON.parse(dataEl.textContent || '{"personas":[],"books":[]}');
  const allPersonas = catalogData.personas || [];
  const allBooks = catalogData.books || [];

  // 상태 관리
  const state = {
    selectedPersona: 'all',
    searchQuery: '',
    difficulty: 'all',
    sortBy: 'id-asc',
    bookmarkOnly: false,
    bookmarks: loadBookmarks(),
    filteredBooks: [...allBooks],
    activeBookId: null,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  };

  // 로컬스토리지 북마크 불러오기/저장하기
  function loadBookmarks() {
    try {
      const saved = localStorage.getItem('growth_library_bookmarks_v1');
      if (!saved) return new Set();
      const arr = JSON.parse(saved);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem('growth_library_bookmarks_v1', JSON.stringify(Array.from(state.bookmarks)));
    } catch (e) {
      // ignore storage errors
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // DOM 요소 참조
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const themeToggleLabel = document.getElementById('theme-toggle-label');

  const personaMenuGrid = document.getElementById('persona-menu-grid');
  const resetPersonaBtn = document.getElementById('reset-persona-btn');
  const bannerIcon = document.getElementById('banner-icon');
  const bannerTitle = document.getElementById('banner-title');
  const bannerDesc = document.getElementById('banner-desc');
  const resultCountLabel = document.getElementById('result-count-label');
  const booksGrid = document.getElementById('books-grid');
  const emptyState = document.getElementById('empty-state');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  const searchInput = document.getElementById('book-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  const sortSelect = document.getElementById('sort-select');
  const bookmarkFilterBtn = document.getElementById('bookmark-filter-btn');
  const bookmarkCountBadge = document.getElementById('bookmark-count-badge');
  const bookmarkHeaderIcon = document.getElementById('bookmark-header-icon');
  const randomBookBtn = document.getElementById('random-book-btn');
  const brandLogo = document.getElementById('brand-logo');

  // 모달 DOM 요소
  const modal = document.getElementById('book-detail-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalHeaderBg = document.getElementById('modal-header-bg');
  const modalBookNumber = document.getElementById('modal-book-number');
  const modalBookYear = document.getElementById('modal-book-year');
  const modalBookDifficulty = document.getElementById('modal-book-difficulty');
  const modalBookTime = document.getElementById('modal-book-time');
  const modalOriginalTitle = document.getElementById('modal-original-title');
  const modalBookTitle = document.getElementById('modal-book-title');
  const modalBookAuthor = document.getElementById('modal-book-author');
  const modalCoverIcon = document.getElementById('modal-cover-icon');
  const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');
  const modalScrollBody = document.getElementById('modal-scroll-body');
  const modalAuthorNameBold = document.getElementById('modal-author-name-bold');
  const modalAuthorBio = document.getElementById('modal-author-bio');
  const modalBookSummary = document.getElementById('modal-book-summary');
  const modalKeyLessons = document.getElementById('modal-key-lessons');
  const modalBookQuote = document.getElementById('modal-book-quote');
  const modalPersonaBadges = document.getElementById('modal-persona-badges');
  const modalWhoShouldRead = document.getElementById('modal-who-should-read');
  const modalRelatedBooks = document.getElementById('modal-related-books');
  const modalFullpageLink = document.getElementById('modal-fullpage-link');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const modalPositionIndicator = document.getElementById('modal-position-indicator');

  // 다크 모드 / 화이트 모드 테마 전환 함수
  function applyTheme(theme) {
    state.theme = theme;
    const isDark = theme === 'dark';

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('growth_library_theme_v1', theme);
    } catch (e) {
      // ignore storage errors
    }

    if (themeToggleIcon && themeToggleLabel && themeToggleBtn) {
      if (isDark) {
        // 현재 다크 모드일 때 -> 클릭 시 화이트 모드로 전환 안내
        themeToggleIcon.className = 'fa-solid fa-sun text-amber-400';
        themeToggleLabel.textContent = '화이트 모드';
        themeToggleBtn.setAttribute('title', '화이트 모드로 전환');
      } else {
        // 현재 화이트 모드일 때 -> 클릭 시 다크 모드로 전환 안내
        themeToggleIcon.className = 'fa-solid fa-moon text-indigo-600';
        themeToggleLabel.textContent = '다크 모드';
        themeToggleBtn.setAttribute('title', '다크 모드로 전환');
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // 페르소나 배지 다크모드 호환 클래스 보강
  function getDarkAwareBadgeClass(persona) {
    const map = {
      'all': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-200 dark:border-indigo-800',
      'habit-focus': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-800',
      'mindset-healing': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800',
      'career-success': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-800',
      'relationship-comm': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800',
      'wealth-finance': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800',
      'life-philosophy': 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/70 dark:text-violet-200 dark:border-violet-800',
      'creative-thinking': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-800'
    };
    return map[persona.id] || persona.badgeClass;
  }

  // 페르소나별 권수 계산
  function getPersonaBookCount(personaId) {
    if (personaId === 'all') return allBooks.length;
    return allBooks.filter((b) => b.personas.includes(personaId)).length;
  }

  function getPersonaById(personaId) {
    return allPersonas.find((p) => p.id === personaId);
  }

  // 1. 독자 유형 선택 메뉴 렌더링
  function renderPersonaMenu() {
    if (!personaMenuGrid) return;

    personaMenuGrid.innerHTML = allPersonas
      .map((persona) => {
        const isSelected = state.selectedPersona === persona.id;
        const count = getPersonaBookCount(persona.id);
        return `
          <button
            type="button"
            role="tab"
            aria-selected="${isSelected}"
            data-persona-id="${escapeHtml(persona.id)}"
            class="persona-tab-btn text-left p-3.5 rounded-xl border border-stone-200 dark:border-slate-700/90 bg-stone-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 flex items-start gap-3 group"
          >
            <span
              class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm transition-transform group-hover:scale-105"
              style="background-color: ${escapeHtml(persona.accentColor)}"
            >
              <i class="fa-solid ${escapeHtml(persona.icon)} text-sm"></i>
            </span>
            <span class="flex-1 min-w-0">
              <span class="flex items-center justify-between gap-1">
                <span class="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">${escapeHtml(persona.shortLabel)}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-600 text-white' : 'bg-stone-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${count}권</span>
              </span>
              <span class="block text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">${escapeHtml(persona.label)}</span>
            </span>
          </button>
        `;
      })
      .join('');

    // 이벤트 바인딩
    personaMenuGrid.querySelectorAll('[data-persona-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-persona-id') || 'all';
        state.selectedPersona = id;
        state.bookmarkOnly = false;
        updateBookmarkHeaderUI();
        applyFiltersAndRender();
      });
    });
  }

  // 2. 필터링 및 정렬 적용
  function applyFiltersAndRender() {
    let result = [...allBooks];

    // 내 서재(북마크) 전용 보기일 때
    if (state.bookmarkOnly) {
      result = result.filter((b) => state.bookmarks.has(b.id));
    }

    // 독자 유형 필터
    if (state.selectedPersona !== 'all') {
      result = result.filter((b) => b.personas.includes(state.selectedPersona));
    }

    // 난이도 필터
    if (state.difficulty !== 'all') {
      result = result.filter((b) => b.difficulty === state.difficulty);
    }

    // 검색어 필터
    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.originalTitle.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.whoShouldRead.some((w) => w.toLowerCase().includes(q))
      );
    }

    // 정렬
    if (state.sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    } else if (state.sortBy === 'year-asc') {
      result.sort((a, b) => a.year - b.year);
    } else if (state.sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    state.filteredBooks = result;

    renderPersonaMenu();
    updateBannerUI();
    renderBooksGrid();
  }

  // 상단 배너 업데이트
  function updateBannerUI() {
    const currentPersona = getPersonaById(state.selectedPersona) || allPersonas[0];

    if (state.bookmarkOnly) {
      bannerIcon.className = 'fa-solid fa-bookmark text-indigo-600 dark:text-indigo-400 mt-0.5 sm:mt-0';
      bannerIcon.style.color = '';
      bannerTitle.textContent = '내 서재에 담아둔 관심 도서';
      bannerDesc.textContent = '읽고 싶은 책으로 북마크한 자기계발서 목록입니다.';
    } else if (currentPersona) {
      bannerIcon.className = `fa-solid ${currentPersona.icon} mt-0.5 sm:mt-0`;
      bannerIcon.style.color = currentPersona.accentColor;
      bannerTitle.textContent = currentPersona.label;
      bannerDesc.textContent = currentPersona.description;
    }

    resultCountLabel.textContent = `검색 결과 ${state.filteredBooks.length}권`;

    if (state.selectedPersona !== 'all' || state.bookmarkOnly) {
      resetPersonaBtn.classList.remove('hidden');
    } else {
      resetPersonaBtn.classList.add('hidden');
    }
  }

  // 3. 책 카드 그리드 렌더링
  function renderBooksGrid() {
    if (!booksGrid || !emptyState) return;

    if (state.filteredBooks.length === 0) {
      booksGrid.innerHTML = '';
      booksGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    booksGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    booksGrid.innerHTML = state.filteredBooks
      .map((book) => {
        const isBookmarked = state.bookmarks.has(book.id);
        const numStr = String(book.id).padStart(2, '0');
        const personaBadgesHtml = book.personas
          .slice(0, 2)
          .map((pid) => {
            const p = getPersonaById(pid);
            if (!p) return '';
            const badgeCls = getDarkAwareBadgeClass(p);
            return `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-md border ${escapeHtml(badgeCls)}">${escapeHtml(p.shortLabel)}</span>`;
          })
          .join('');

        return `
          <article
            data-book-card-id="${book.id}"
            tabindex="0"
            role="button"
            aria-label="${escapeHtml(book.title)} - 클릭하여 작가와 내용 보기"
            class="book-card cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div>
              <!-- 입체 북커버 상단 -->
              <div
                class="book-cover-visual h-40 p-4 pl-6 flex flex-col justify-between text-white"
                style="background: linear-gradient(135deg, ${escapeHtml(book.coverTheme.bgFrom)} 0%, ${escapeHtml(book.coverTheme.bgTo)} 100%);"
              >
                <div class="flex items-center justify-between gap-2 relative z-10">
                  <span class="text-xs font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-black/25 backdrop-blur-sm">NO. ${numStr}</span>
                  <button
                    type="button"
                    data-bookmark-toggle="${book.id}"
                    aria-label="${isBookmarked ? '북마크 해제' : '내 서재에 저장'}"
                    class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center transition"
                  >
                    <i class="${isBookmarked ? 'fa-solid text-amber-300' : 'fa-regular text-white/90'} fa-bookmark text-sm"></i>
                  </button>
                </div>

                <div class="flex items-end justify-between gap-3 relative z-10">
                  <div class="min-w-0">
                    <p class="text-[11px] text-white/75 truncate font-medium">${escapeHtml(book.originalTitle)}</p>
                    <h3 class="text-lg font-extrabold leading-snug line-clamp-2 serif-heading mt-0.5">${escapeHtml(book.title)}</h3>
                  </div>
                  <i class="fa-solid ${escapeHtml(book.coverTheme.icon)} text-2xl opacity-80 shrink-0" style="color: ${escapeHtml(book.coverTheme.accent)}"></i>
                </div>
              </div>

              <!-- 카드 본문 -->
              <div class="p-4 pb-3">
                <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span class="font-semibold text-slate-700 dark:text-slate-200 truncate">
                    <i class="fa-solid fa-feather text-indigo-500 dark:text-indigo-400 mr-1"></i>${escapeHtml(book.author)}
                  </span>
                  <span class="shrink-0 text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">${escapeHtml(book.difficulty)} · ${book.year}</span>
                </div>

                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  ${escapeHtml(book.summary)}
                </p>

                <!-- 어떤 사람이 봐야 하는지 한 줄 미리보기 -->
                <div class="bg-stone-50 dark:bg-slate-800/70 rounded-xl p-2.5 border border-stone-100 dark:border-slate-700/80">
                  <p class="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                    <i class="fa-solid fa-user-tag text-[10px]"></i>추천 독자
                  </p>
                  <p class="text-xs text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">
                    ${escapeHtml(book.whoShouldRead[0] || '')}
                  </p>
                </div>
              </div>
            </div>

            <!-- 카드 푸터 -->
            <div class="px-4 py-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-stone-50/40 dark:bg-slate-900/60">
              <div class="flex flex-wrap gap-1">
                ${personaBadgesHtml}
              </div>
              <a href="/book/${book.id}" data-detail-page-link="${book.id}" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 shrink-0">
                상세 리뷰 <i class="fa-solid fa-chevron-right text-[10px]"></i>
              </a>
            </div>
          </article>
        `;
      })
      .join('');

    // 카드 클릭 및 키보드 접근성 바인딩
    booksGrid.querySelectorAll('[data-book-card-id]').forEach((card) => {
      const bookId = Number(card.getAttribute('data-book-card-id'));

      card.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('[data-bookmark-toggle]');
        if (bookmarkBtn) {
          e.stopPropagation();
          toggleBookmark(bookId);
          return;
        }
        const detailLink = e.target.closest('[data-detail-page-link]');
        if (detailLink) {
          e.stopPropagation();
          return;
        }
        openBookModal(bookId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openBookModal(bookId);
        }
      });
    });
  }

  // 북마크 토글
  function toggleBookmark(bookId) {
    if (state.bookmarks.has(bookId)) {
      state.bookmarks.delete(bookId);
    } else {
      state.bookmarks.add(bookId);
    }
    saveBookmarks();
    updateBookmarkHeaderUI();
    applyFiltersAndRender();

    // 모달이 열려 있으면 모달 내 북마크 아이콘도 갱신
    if (state.activeBookId === bookId) {
      updateModalBookmarkButton(bookId);
    }
  }

  function updateBookmarkHeaderUI() {
    bookmarkCountBadge.textContent = String(state.bookmarks.size);
    bookmarkFilterBtn.setAttribute('aria-pressed', String(state.bookmarkOnly));
    if (state.bookmarkOnly) {
      bookmarkFilterBtn.className =
        'inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white border border-indigo-600 shadow-sm transition';
      bookmarkHeaderIcon.className = 'fa-solid fa-bookmark text-amber-300';
      bookmarkCountBadge.className = 'px-1.5 py-0.5 text-xs font-bold rounded-full bg-white text-indigo-700';
    } else {
      bookmarkFilterBtn.className =
        'inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-sm font-medium bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700 transition';
      bookmarkHeaderIcon.className = 'fa-regular fa-bookmark text-indigo-600 dark:text-indigo-400';
      bookmarkCountBadge.className = 'px-1.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white';
    }
  }

  function updateModalBookmarkButton(bookId) {
    const isSaved = state.bookmarks.has(bookId);
    modalBookmarkBtn.innerHTML = `<i class="${isSaved ? 'fa-solid text-amber-300' : 'fa-regular text-white'} fa-bookmark"></i>`;
    modalBookmarkBtn.setAttribute('title', isSaved ? '내 서재에서 제거' : '내 서재에 저장');
  }

  // 난이도 버튼 활성화 스타일 일괄 업데이트 (라이트/다크 대응)
  function syncDifficultyButtonsUI() {
    difficultyBtns.forEach((b) => {
      const isActive = (b.getAttribute('data-difficulty') || 'all') === state.difficulty;
      b.className = isActive
        ? 'difficulty-btn active px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold transition'
        : 'difficulty-btn px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
    });
  }

  // 4. 도서 상세 모달 열기 (작가 소개 + 핵심 내용 + 추천 대상 표시)
  function openBookModal(bookId) {
    const book = allBooks.find((b) => b.id === bookId);
    if (!book) return;

    state.activeBookId = bookId;

    // 헤더 스타일 및 메타 정보
    modalHeaderBg.style.background = `linear-gradient(135deg, ${book.coverTheme.bgFrom} 0%, ${book.coverTheme.bgTo} 100%)`;
    modalBookNumber.textContent = `NO. ${String(book.id).padStart(2, '0')}`;
    modalBookYear.textContent = `${book.year}년 출간`;
    modalBookDifficulty.textContent = `난이도: ${book.difficulty}`;
    modalBookTime.innerHTML = `<i class="fa-regular fa-clock mr-1"></i>${escapeHtml(book.readingTime)}`;
    modalOriginalTitle.textContent = book.originalTitle;
    modalBookTitle.textContent = book.title;
    modalBookAuthor.textContent = book.author;
    modalCoverIcon.className = `fa-solid ${book.coverTheme.icon} text-3xl`;
    modalCoverIcon.style.color = book.coverTheme.accent;

    if (modalFullpageLink) {
      modalFullpageLink.setAttribute('href', `/book/${book.id}`);
    }

    updateModalBookmarkButton(book.id);

    // 작가 소개 & 핵심 내용
    modalAuthorNameBold.textContent = book.author;
    modalAuthorBio.textContent = book.authorBio;
    modalBookSummary.textContent = book.summary;

    // 핵심 교훈 3가지
    modalKeyLessons.innerHTML = book.keyLessons
      .map(
        (lesson, idx) => `
        <li class="flex items-start gap-3 bg-stone-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-stone-200/70 dark:border-slate-700">
          <span class="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
          <span class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">${escapeHtml(lesson)}</span>
        </li>
      `
      )
      .join('');

    // 명문장
    modalBookQuote.textContent = `"${book.quote}"`;

    // 추천 대상 배지 (클릭하면 해당 독자 유형 필터로 바로 전환 가능)
    modalPersonaBadges.innerHTML = book.personas
      .map((pid) => {
        const p = getPersonaById(pid);
        if (!p) return '';
        const badgeCls = getDarkAwareBadgeClass(p);
        return `
          <button
            type="button"
            data-modal-persona-jump="${escapeHtml(p.id)}"
            class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${escapeHtml(badgeCls)} hover:opacity-85 transition"
          >
            <i class="fa-solid ${escapeHtml(p.icon)}"></i>
            <span>${escapeHtml(p.label)}</span>
          </button>
        `;
      })
      .join('');

    modalPersonaBadges.querySelectorAll('[data-modal-persona-jump]').forEach((badgeBtn) => {
      badgeBtn.addEventListener('click', () => {
        const pid = badgeBtn.getAttribute('data-modal-persona-jump') || 'all';
        closeBookModal();
        state.selectedPersona = pid;
        state.bookmarkOnly = false;
        updateBookmarkHeaderUI();
        applyFiltersAndRender();
        document.getElementById('persona-selector-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // 구체적 추천 대상 리스트
    modalWhoShouldRead.innerHTML = book.whoShouldRead
      .map(
        (item) => `
        <li class="flex items-start gap-2.5">
          <i class="fa-solid fa-check text-emerald-600 dark:text-emerald-400 mt-1 shrink-0 text-xs"></i>
          <span class="leading-relaxed">${escapeHtml(item)}</span>
        </li>
      `
      )
      .join('');

    // 연관 추천 도서 3권
    const related = allBooks
      .filter((b) => b.id !== book.id && b.personas.some((p) => book.personas.includes(p)))
      .slice(0, 3);

    modalRelatedBooks.innerHTML = related
      .map(
        (rel) => `
        <button
          type="button"
          data-related-id="${rel.id}"
          class="text-left p-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition flex items-start gap-2.5"
        >
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5" style="background-color: ${escapeHtml(rel.coverTheme.bgFrom)}">
            <i class="fa-solid ${escapeHtml(rel.coverTheme.icon)} text-xs"></i>
          </span>
          <span class="min-w-0">
            <span class="block font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">${escapeHtml(rel.title)}</span>
            <span class="block text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${escapeHtml(rel.author)}</span>
          </span>
        </button>
      `
      )
      .join('');

    modalRelatedBooks.querySelectorAll('[data-related-id]').forEach((relBtn) => {
      relBtn.addEventListener('click', () => {
        const nextId = Number(relBtn.getAttribute('data-related-id'));
        openBookModal(nextId);
      });
    });

    // 이전/다음 도서 네비게이션 (현재 필터된 목록 기준)
    const navList = state.filteredBooks.length > 0 ? state.filteredBooks : allBooks;
    const currentIdx = navList.findIndex((b) => b.id === book.id);
    if (currentIdx !== -1) {
      modalPrevBtn.disabled = currentIdx <= 0;
      modalNextBtn.disabled = currentIdx >= navList.length - 1;
      modalPositionIndicator.textContent = `${currentIdx + 1} / ${navList.length}`;
      modalPrevBtn.onclick = () => {
        if (currentIdx > 0) openBookModal(navList[currentIdx - 1].id);
      };
      modalNextBtn.onclick = () => {
        if (currentIdx < navList.length - 1) openBookModal(navList[currentIdx + 1].id);
      };
    } else {
      modalPrevBtn.disabled = true;
      modalNextBtn.disabled = true;
      modalPositionIndicator.textContent = `NO. ${book.id}`;
    }

    // 모달 표시 및 스크롤 상단 이동
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (modalScrollBody) modalScrollBody.scrollTop = 0;
  }

  function closeBookModal() {
    state.activeBookId = null;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // 이벤트 리스너 등록
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value || '';
      if (state.searchQuery.length > 0) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
      applyFiltersAndRender();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      searchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      applyFiltersAndRender();
      searchInput.focus();
    });
  }

  difficultyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.difficulty = btn.getAttribute('data-difficulty') || 'all';
      syncDifficultyButtonsUI();
      applyFiltersAndRender();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  function resetAllFilters() {
    state.selectedPersona = 'all';
    state.searchQuery = '';
    state.difficulty = 'all';
    state.sortBy = 'id-asc';
    state.bookmarkOnly = false;
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    if (sortSelect) sortSelect.value = 'id-asc';
    syncDifficultyButtonsUI();
    updateBookmarkHeaderUI();
    applyFiltersAndRender();
  }

  if (resetPersonaBtn) {
    resetPersonaBtn.addEventListener('click', resetAllFilters);
  }
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', resetAllFilters);
  }
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      resetAllFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (bookmarkFilterBtn) {
    bookmarkFilterBtn.addEventListener('click', () => {
      state.bookmarkOnly = !state.bookmarkOnly;
      updateBookmarkHeaderUI();
      applyFiltersAndRender();
    });
  }

  // 랜덤 운명 도서 추천 버튼 (현재 선택된 독자 유형 내에서 우선 추첨)
  if (randomBookBtn) {
    randomBookBtn.addEventListener('click', () => {
      const pool = state.filteredBooks.length > 0 ? state.filteredBooks : allBooks;
      const randomIdx = Math.floor(Math.random() * pool.length);
      const picked = pool[randomIdx];
      if (picked) {
        openBookModal(picked.id);
      }
    });
  }

  // 모달 내 북마크 버튼
  if (modalBookmarkBtn) {
    modalBookmarkBtn.addEventListener('click', () => {
      if (state.activeBookId != null) {
        toggleBookmark(state.activeBookId);
      }
    });
  }

  // 모달 닫기 이벤트
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeBookModal);

  document.addEventListener('keydown', (e) => {
    if (!state.activeBookId) return;
    if (e.key === 'Escape') {
      closeBookModal();
    } else if (e.key === 'ArrowLeft' && !modalPrevBtn.disabled) {
      modalPrevBtn.click();
    } else if (e.key === 'ArrowRight' && !modalNextBtn.disabled) {
      modalNextBtn.click();
    }
  });

  // 초기 렌더링 실행
  applyTheme(state.theme);
  syncDifficultyButtonsUI();
  updateBookmarkHeaderUI();
  applyFiltersAndRender();
})();
