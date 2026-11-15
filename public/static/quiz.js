(function () {
  const dataEl = document.getElementById('quiz-books-data');
  if (!dataEl) return;

  const payload = JSON.parse(dataEl.textContent || '{"personas":[],"books":[]}');
  const allPersonas = payload.personas || [];
  const allBooks = payload.books || [];

  const QUESTIONS = [
    {
      step: 1,
      question: '요즘 내 일상에서 가장 먼저 해결하고 싶은 고민은 무엇인가요?',
      subtitle: '가장 마음에 와닿는 한 가지를 골라주세요.',
      options: [
        {
          label: '계획은 세우지만 자꾸 미루고 집중력이 흐트러진다',
          icon: 'fa-bullseye',
          scores: { 'habit-focus': 4, 'career-success': 1 }
        },
        {
          label: '마음이 쉽게 지치고 불안하거나 자존감이 흔들린다',
          icon: 'fa-seedling',
          scores: { 'mindset-healing': 4, 'life-philosophy': 1 }
        },
        {
          label: '일과 커리어에서 남다른 실력과 압도적인 성과를 내고 싶다',
          icon: 'fa-rocket',
          scores: { 'career-success': 4, 'creative-thinking': 1 }
        },
        {
          label: '사람들과의 대화·설득·인간관계에서 피로감을 느낀다',
          icon: 'fa-comments',
          scores: { 'relationship-comm': 4, 'mindset-healing': 1 }
        },
        {
          label: '월급만으로는 부족해 경제적 자유와 부의 시스템을 만들고 싶다',
          icon: 'fa-coins',
          scores: { 'wealth-finance': 4, 'career-success': 1 }
        },
        {
          label: '앞으로 어떻게 살아야 할지 인생의 방향과 깊은 통찰이 필요하다',
          icon: 'fa-compass',
          scores: { 'life-philosophy': 4, 'creative-thinking': 1 }
        }
      ]
    },
    {
      step: 2,
      question: '평소 새로운 목표나 과제를 마주했을 때 나의 행동 패턴은?',
      subtitle: '가장 가까운 내 모습을 선택해 보세요.',
      options: [
        {
          label: '의욕적으로 크게 시작했다가 3~4일 뒤 흐지부지되는 편이다',
          icon: 'fa-bolt',
          scores: { 'habit-focus': 3 }
        },
        {
          label: '실패하거나 남들에게 평가받는 것이 두려워 시작을 망설인다',
          icon: 'fa-shield-heart',
          scores: { 'mindset-healing': 3 }
        },
        {
          label: '혼자 모든 일을 떠안고 열심히 하지만 투입 시간 대비 효율이 아쉽다',
          icon: 'fa-briefcase',
          scores: { 'career-success': 2, 'wealth-finance': 2 }
        },
        {
          label: '고정관념을 깨는 새로운 아이디어와 기획 방식을 찾고 싶다',
          icon: 'fa-lightbulb',
          scores: { 'creative-thinking': 4 }
        }
      ]
    },
    {
      step: 3,
      question: '선호하는 책의 스타일과 독서 난이도는 어떤가요?',
      subtitle: '부담 없이 끝까지 완독할 수 있는 난이도를 맞춰드립니다.',
      options: [
        {
          label: '술술 읽히고 오늘 당장 따라 할 수 있는 쉬운 입문서가 좋다',
          icon: 'fa-feather',
          preferredDifficulty: '입문',
          scores: {}
        },
        {
          label: '심리학·뇌과학·경영학의 탄탄한 실험과 사례가 담긴 중급서가 좋다',
          icon: 'fa-layer-group',
          preferredDifficulty: '중급',
          scores: { 'creative-thinking': 1, 'career-success': 1 }
        },
        {
          label: '벽돌책이라도 본질을 깊게 파고드는 묵직한 명저에 도전하고 싶다',
          icon: 'fa-graduation-cap',
          preferredDifficulty: '심화',
          scores: { 'life-philosophy': 1, 'creative-thinking': 1 }
        },
        {
          label: '난이도 상관없이 내 고민에 가장 직격탄이 되는 책이면 된다',
          icon: 'fa-star',
          preferredDifficulty: 'any',
          scores: {}
        }
      ]
    },
    {
      step: 4,
      question: '책을 덮었을 때 어떤 문장이 내 마음에 남기를 바라나요?',
      subtitle: '당신이 지금 가장 갈망하는 변화를 골라보세요.',
      options: [
        {
          label: '"작은 시스템 하나가 내 하루를 완전히 장악하게 되었다"',
          icon: 'fa-clock',
          scores: { 'habit-focus': 3 }
        },
        {
          label: '"남의 시선에서 벗어나 나 자신을 있는 그대로 아끼게 되었다"',
          icon: 'fa-heart',
          scores: { 'mindset-healing': 3, 'life-philosophy': 1 }
        },
        {
          label: '"돈과 시간이 나를 위해 일하는 자본주의의 원리를 깨달았다"',
          icon: 'fa-sack-dollar',
          scores: { 'wealth-finance': 3 }
        },
        {
          label: '"사람의 마음을 얻고 세상을 다르게 보는 통찰의 눈이 열렸다"',
          icon: 'fa-wand-magic-sparkles',
          scores: { 'relationship-comm': 2, 'creative-thinking': 2 }
        }
      ]
    },
    {
      step: 5,
      question: '하루 중 독서에 투자할 수 있는 현실적인 시간은 어느 정도인가요?',
      subtitle: '완독 소요 시간과 호흡에 맞춰 추천 순위를 정교화합니다.',
      options: [
        {
          label: '출퇴근길이나 잠들기 전 하루 15~20분 (가볍고 짧은 호흡 선호)',
          icon: 'fa-mug-hot',
          shortTimeBonus: true,
          scores: { 'habit-focus': 1 }
        },
        {
          label: '하루 30분~1시간 정도 꾸준히 읽을 수 있다',
          icon: 'fa-book-open',
          shortTimeBonus: false,
          scores: {}
        },
        {
          label: '주말이나 집중 시간에 깊이 몰입해서 긴 책도 읽을 수 있다',
          icon: 'fa-fire-flame-curved',
          shortTimeBonus: false,
          scores: { 'career-success': 1, 'life-philosophy': 1 }
        }
      ]
    }
  ];

  const quizStage = document.getElementById('quiz-stage');
  const resultStage = document.getElementById('quiz-result-stage');
  const progressBar = document.getElementById('quiz-progress-bar');
  const stepLabel = document.getElementById('quiz-step-label');
  const questionTitle = document.getElementById('quiz-question-title');
  const questionSub = document.getElementById('quiz-question-sub');
  const optionsContainer = document.getElementById('quiz-options-container');
  const prevStepBtn = document.getElementById('quiz-prev-btn');

  let currentIdx = 0;
  const answers = [];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStep() {
    const q = QUESTIONS[currentIdx];
    const pct = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (stepLabel) stepLabel.textContent = `질문 ${currentIdx + 1} / ${QUESTIONS.length}`;
    if (questionTitle) questionTitle.textContent = q.question;
    if (questionSub) questionSub.textContent = q.subtitle;
    if (prevStepBtn) {
      if (currentIdx === 0) prevStepBtn.classList.add('invisible');
      else prevStepBtn.classList.remove('invisible');
    }

    optionsContainer.innerHTML = q.options
      .map(
        (opt, i) => `
        <button
          type="button"
          data-opt-idx="${i}"
          class="w-full text-left p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/70 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-500 dark:hover:border-indigo-400 transition flex items-center gap-4 group"
        >
          <span class="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
            <i class="fa-solid ${escapeHtml(opt.icon)} text-base"></i>
          </span>
          <span class="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug">${escapeHtml(opt.label)}</span>
        </button>
      `
      )
      .join('');

    optionsContainer.querySelectorAll('[data-opt-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-opt-idx'));
        answers[currentIdx] = q.options[idx];
        if (currentIdx < QUESTIONS.length - 1) {
          currentIdx += 1;
          renderStep();
        } else {
          computeAndShowResult();
        }
      });
    });
  }

  function computeAndShowResult() {
    const scoreMap = {
      'habit-focus': 0,
      'mindset-healing': 0,
      'career-success': 0,
      'relationship-comm': 0,
      'wealth-finance': 0,
      'life-philosophy': 0,
      'creative-thinking': 0
    };

    let preferredDifficulty = 'any';
    let shortTimeBonus = false;

    answers.forEach((ans) => {
      if (!ans) return;
      if (ans.preferredDifficulty) preferredDifficulty = ans.preferredDifficulty;
      if (typeof ans.shortTimeBonus === 'boolean') shortTimeBonus = ans.shortTimeBonus;
      Object.entries(ans.scores || {}).forEach(([k, val]) => {
        scoreMap[k] = (scoreMap[k] || 0) + Number(val);
      });
    });

    // 가장 높은 점수의 페르소나 도출
    const sortedPersonas = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
    const topPersonaId = sortedPersonas[0][0];
    const secondPersonaId = sortedPersonas[1][0];

    const topPersona = allPersonas.find((p) => p.id === topPersonaId) || allPersonas[1];

    // 50권 도서별 매칭 점수 산정
    const scoredBooks = allBooks.map((book) => {
      let pts = 0;
      if (book.personas.includes(topPersonaId)) pts += 10;
      if (book.personas.includes(secondPersonaId)) pts += 5;
      book.personas.forEach((pid) => {
        pts += scoreMap[pid] || 0;
      });
      if (preferredDifficulty !== 'any' && book.difficulty === preferredDifficulty) {
        pts += 6;
      }
      if (shortTimeBonus && (book.readingTime.includes('3시간') || book.readingTime.includes('4시간') || book.readingTime.includes('5시간'))) {
        pts += 3;
      }
      return { book, pts };
    });

    scoredBooks.sort((a, b) => b.pts - a.pts || a.book.id - b.book.id);
    const top3 = scoredBooks.slice(0, 3).map((item) => item.book);

    quizStage.classList.add('hidden');
    resultStage.classList.remove('hidden');

    const resultHeaderBadge = document.getElementById('quiz-result-badge');
    const resultTitle = document.getElementById('quiz-result-title');
    const resultDesc = document.getElementById('quiz-result-desc');
    const resultBooksContainer = document.getElementById('quiz-result-books');
    const resultCategoryLink = document.getElementById('quiz-result-category-link');

    if (resultHeaderBadge) {
      resultHeaderBadge.style.backgroundColor = topPersona.accentColor;
      resultHeaderBadge.innerHTML = `<i class="fa-solid ${escapeHtml(topPersona.icon)}"></i> <span>당신의 독서 처방 유형: ${escapeHtml(topPersona.shortLabel)}</span>`;
    }
    if (resultTitle) resultTitle.textContent = topPersona.label;
    if (resultDesc) resultDesc.textContent = topPersona.description;
    if (resultCategoryLink) {
      resultCategoryLink.setAttribute('href', `/category/${topPersona.id}`);
      resultCategoryLink.textContent = `'${topPersona.shortLabel}' 분야 전체 추천 도서 더 보기`;
    }

    resultBooksContainer.innerHTML = top3
      .map(
        (book, rank) => `
        <article class="bg-white dark:bg-slate-900 rounded-2xl border-2 ${rank === 0 ? 'border-indigo-500 shadow-md' : 'border-stone-200 dark:border-slate-800'} p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold ${rank === 0 ? 'bg-indigo-600 text-white' : 'bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}">
                ${rank === 0 ? '1순위 인생책 처방' : `${rank + 1}순위 추천 도서`}
              </span>
              <span class="text-xs text-slate-400">난이도: ${escapeHtml(book.difficulty)} · ${escapeHtml(book.readingTime)}</span>
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white serif-heading">
              <a href="/book/${book.id}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition">《${escapeHtml(book.title)}》</a>
            </h3>
            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">${escapeHtml(book.author)}</p>
            <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-3">${escapeHtml(book.summary)}</p>
            <div class="mt-4 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
              <strong class="block mb-1"><i class="fa-solid fa-check mr-1"></i>이 책을 추천하는 이유:</strong>
              ${escapeHtml(book.whoShouldRead[0] || '')}
            </div>
          </div>
          <div class="mt-5 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end">
            <a href="/book/${book.id}" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 transition">
              <span>작가 소개 &amp; 3가지 실천 교훈 보기</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>
        </article>
      `
      )
      .join('');
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (currentIdx > 0) {
        currentIdx -= 1;
        renderStep();
      }
    });
  }

  const retryBtn = document.getElementById('quiz-retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      currentIdx = 0;
      answers.length = 0;
      resultStage.classList.add('hidden');
      quizStage.classList.remove('hidden');
      renderStep();
    });
  }

  renderStep();
})();
