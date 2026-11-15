import { PERSONA_CATEGORIES } from '../data/books';

export interface LayoutOptions {
  title: string;
  description: string;
  canonicalPath: string;
  origin: string;
  enableAds: boolean; // 고품질 가이드라인 2부 준수: 풍부한 본문 콘텐츠 페이지에만 true, 404/정책 페이지에는 false
  activeNav?: 'home' | 'guides' | 'categories' | 'about';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  bodyContent: string;
  includeAppJs?: boolean;
}

export function escapeHtmlServer(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderSiteLayout(opts: LayoutOptions): string {
  const canonicalUrl = `${opts.origin}${opts.canonicalPath}`;
  const adsenseHeadHtml = opts.enableAds
    ? `
  <meta name="google-adsense-account" content="ca-pub-4024277026672694">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4024277026672694"
     crossorigin="anonymous"></script>`
    : `
  <meta name="google-adsense-account" content="ca-pub-4024277026672694">`;

  const jsonLdHtml = opts.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(opts.jsonLd).replace(/</g, '\\u003c')}</script>`
    : '';

  const categoryLinksFooter = PERSONA_CATEGORIES.filter((c) => c.id !== 'all')
    .map(
      (cat) =>
        `<li><a href="/category/${escapeHtmlServer(cat.id)}" class="hover:text-white transition">${escapeHtmlServer(cat.shortLabel)} 추천 도서</a></li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ko" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtmlServer(opts.title)}</title>
  <meta name="description" content="${escapeHtmlServer(opts.description)}" />
  <link rel="canonical" href="${escapeHtmlServer(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtmlServer(opts.title)}" />
  <meta property="og:description" content="${escapeHtmlServer(opts.description)}" />
  <meta property="og:url" content="${escapeHtmlServer(canonicalUrl)}" />
  <meta property="og:site_name" content="성장 서재 50" />${adsenseHeadHtml}
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Cpath d='M18 16h28a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4zm4 8v20h20V24H22z' fill='%23ffffff'/%3E%3C/svg%3E" />
  <script>
    (function () {
      try {
        var savedTheme = localStorage.getItem('growth_library_theme_v1');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { darkMode: 'class' };
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=Noto+Serif+KR:wght@500;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css" rel="stylesheet" />
  ${jsonLdHtml}
</head>
<body class="bg-stone-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased selection:bg-indigo-600 selection:text-white transition-colors duration-200 min-h-screen flex flex-col">
  <!-- 상단 글로벌 네비게이션 헤더 -->
  <header id="site-header" class="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <div class="flex items-center gap-6">
        <a href="/" id="brand-logo" class="flex items-center gap-3 group shrink-0">
          <span class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition">
            <i class="fa-solid fa-book-open-reader text-lg"></i>
          </span>
          <div>
            <span class="font-bold text-lg tracking-tight text-slate-900 dark:text-white block leading-none">성장 서재 50</span>
            <span class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">맞춤형 자기계발 큐레이션 &amp; 독서 가이드</span>
          </div>
        </a>

        <!-- 명확한 사이트 탐색 주 메뉴 (AdSense 고품질 사이트 탐색 구조 준수) -->
        <nav aria-label="주요 사이트 메뉴" class="hidden md:flex items-center gap-1 text-sm font-semibold">
          <a href="/" class="px-3 py-2 rounded-lg transition ${opts.activeNav === 'home' ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800'}">도서 50선 탐색</a>
          <a href="/guides" class="px-3 py-2 rounded-lg transition ${opts.activeNav === 'guides' ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800'}">실전 독서 칼럼</a>
          <a href="/category/habit-focus" class="px-3 py-2 rounded-lg transition ${opts.activeNav === 'categories' ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800'}">독자 유형별 로드맵</a>
          <a href="/about" class="px-3 py-2 rounded-lg transition ${opts.activeNav === 'about' ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800'}">서비스 소개</a>
        </nav>
      </div>

      <div class="flex items-center gap-2 sm:gap-2.5">
        <!-- 화이트 / 다크 모드 토글 스위치 (모든 페이지 공통 동작) -->
        <button
          id="theme-toggle-btn"
          type="button"
          aria-label="다크 모드 / 화이트 모드 전환"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700 transition"
        >
          <i id="theme-toggle-icon" class="fa-solid fa-moon text-indigo-600 dark:text-amber-300"></i>
          <span id="theme-toggle-label" class="hidden lg:inline">다크 모드</span>
        </button>

        ${
          opts.includeAppJs
            ? `<button id="random-book-btn" type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition">
          <i class="fa-solid fa-wand-magic-sparkles text-amber-600 dark:text-amber-400"></i>
          <span class="hidden xl:inline">오늘의 도서 뽑기</span>
          <span class="xl:hidden">랜덤</span>
        </button>

        <button id="bookmark-filter-btn" type="button" aria-pressed="false" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700 transition">
          <i class="fa-regular fa-bookmark text-indigo-600 dark:text-indigo-400" id="bookmark-header-icon"></i>
          <span class="hidden sm:inline">내 서재</span>
          <span id="bookmark-count-badge" class="px-1.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">0</span>
        </button>`
            : `<a href="/" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition">
          <i class="fa-solid fa-compass text-xs"></i>
          <span>50권 전체 보기</span>
        </a>`
        }
      </div>
    </div>

    <!-- 모바일 보조 네비게이션 바 -->
    <nav aria-label="모바일 메뉴" class="md:hidden border-t border-stone-200/80 dark:border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
      <a href="/" class="px-2.5 py-1 rounded-md shrink-0 ${opts.activeNav === 'home' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800'}">도서 50선</a>
      <a href="/guides" class="px-2.5 py-1 rounded-md shrink-0 ${opts.activeNav === 'guides' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800'}">실전 독서 칼럼</a>
      <a href="/category/habit-focus" class="px-2.5 py-1 rounded-md shrink-0 ${opts.activeNav === 'categories' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800'}">독자별 추천</a>
      <a href="/about" class="px-2.5 py-1 rounded-md shrink-0 ${opts.activeNav === 'about' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800'}">소개 및 원칙</a>
    </nav>
  </header>

  <main id="main-content" class="flex-1">
    ${opts.bodyContent}
  </main>

  <!-- 체계적 사이트맵 & 정책 링크를 갖춘 글로벌 푸터 -->
  <footer class="bg-slate-900 dark:bg-black text-slate-400 pt-12 pb-10 border-t border-slate-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
        <div class="md:col-span-2">
          <div class="flex items-center gap-2.5 mb-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <i class="fa-solid fa-book-open-reader text-sm"></i>
            </span>
            <span class="font-bold text-lg text-white">성장 서재 50</span>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed max-w-md">
            성장 서재 50은 전 세계 수천만 독자와 학계가 검증한 동서고금의 자기계발 명저 50권을 엄선하여,
            독자의 현재 고민과 삶의 단계에 가장 알맞은 책을 연결해 주는 독서 큐레이션 및 실천 가이드 플랫폼입니다.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-3">독자 유형별 추천</h3>
          <ul class="space-y-2 text-xs sm:text-sm">
            ${categoryLinksFooter}
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-3">가이드 및 정책 안내</h3>
          <ul class="space-y-2 text-xs sm:text-sm">
            <li><a href="/guides" class="hover:text-white transition">실전 독서법 &amp; 심층 칼럼</a></li>
            <li><a href="/about" class="hover:text-white transition">서비스 소개 및 도서 선정 기준</a></li>
            <li><a href="/privacy" class="hover:text-white transition">개인정보처리방침 (쿠키·광고 안내)</a></li>
            <li><a href="/terms" class="hover:text-white transition">이용약관 및 저작권 안내</a></li>
            <li><a href="/contact" class="hover:text-white transition">문의 및 도서 제보</a></li>
            <li><a href="/sitemap.xml" class="hover:text-white transition">사이트맵 (Sitemap)</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; ${new Date().getFullYear()} 성장 서재 50 (Growth Library 50). All rights reserved.</p>
        <p>본 사이트의 모든 도서 리뷰·요약·실천 가이드는 독자의 자기주도적 독서를 돕기 위해 직접 집필된 고유 큐레이션 콘텐츠입니다.</p>
      </div>
    </div>
  </footer>

  ${
    opts.includeAppJs
      ? `<script src="/static/app.js"></script>`
      : `<script>
    // 서브페이지용 경량 테마 토글 스크립트
    (function () {
      var btn = document.getElementById('theme-toggle-btn');
      var icon = document.getElementById('theme-toggle-icon');
      var label = document.getElementById('theme-toggle-label');
      function syncUI() {
        var isDark = document.documentElement.classList.contains('dark');
        if (icon) icon.className = isDark ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-indigo-600';
        if (label) label.textContent = isDark ? '화이트 모드' : '다크 모드';
      }
      syncUI();
      if (btn) {
        btn.addEventListener('click', function () {
          var nextDark = !document.documentElement.classList.contains('dark');
          if (nextDark) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
          try { localStorage.setItem('growth_library_theme_v1', nextDark ? 'dark' : 'light'); } catch (e) {}
          syncUI();
        });
      }
    })();
  </script>`
  }
</body>
</html>`;
}
