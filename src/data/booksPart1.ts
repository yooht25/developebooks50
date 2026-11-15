export interface PersonaCategory {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  accentColor: string;
  badgeClass: string;
}

export interface Book {
  id: number;
  title: string;
  originalTitle: string;
  author: string;
  authorBio: string;
  year: number;
  summary: string;
  keyLessons: string[];
  quote: string;
  personas: string[]; // PersonaCategory ids
  whoShouldRead: string[]; // 구체적인 추천 독자 설명
  readingTime: string;
  difficulty: '입문' | '중급' | '심화';
  coverTheme: {
    bgFrom: string;
    bgTo: string;
    accent: string;
    icon: string;
  };
  tags: string[];
}

export const PERSONA_CATEGORIES: PersonaCategory[] = [
  {
    id: 'all',
    label: '전체 50권 보기',
    shortLabel: '전체 도서',
    description: '시대를 초월해 검증된 최고의 자기계발서 50권을 모두 확인해보세요.',
    icon: 'fa-layer-group',
    accentColor: '#4F46E5',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 'habit-focus',
    label: '작심삼일 끝! 습관과 집중력이 필요한 사람',
    shortLabel: '습관 · 집중력',
    description: '미루는 습관을 고치고 매일 꾸준한 루틴과 몰입의 힘을 기르고 싶은 분께 추천합니다.',
    icon: 'fa-bullseye',
    accentColor: '#0D9488',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  {
    id: 'mindset-healing',
    label: '번아웃·불안 극복! 멘탈 관리와 자존감이 필요한 사람',
    shortLabel: '멘탈 · 자존감',
    description: '지친 마음을 다독이고 흔들리지 않는 내면과 회복탄력성을 되찾고 싶은 분을 위한 책입니다.',
    icon: 'fa-seedling',
    accentColor: '#10B981',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'career-success',
    label: '일잘러 & 커리어 도약! 압도적 성취를 원하는 사람',
    shortLabel: '커리어 · 성취',
    description: '직장과 비즈니스에서 탁월한 성과를 내고 나만의 경쟁력을 구축하고 싶은 분께 적합합니다.',
    icon: 'fa-rocket',
    accentColor: '#2563EB',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'relationship-comm',
    label: '인간관계·대화법 고민! 소통과 리더십을 키우고 싶은 사람',
    shortLabel: '인간관계 · 소통',
    description: '사람 때문에 스트레스받지 않고 설득력 있는 대화와 따뜻한 리더십을 갖추고 싶은 분께 권합니다.',
    icon: 'fa-comments',
    accentColor: '#E11D48',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'wealth-finance',
    label: '경제적 자유와 부의 추월차선을 꿈꾸는 사람',
    shortLabel: '부 · 재테크 마인드',
    description: '돈에 대한 철학을 바로 세우고 자본주의 원리와 부자의 사고방식을 배우고 싶은 분을 위한 필독서입니다.',
    icon: 'fa-coins',
    accentColor: '#D97706',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'life-philosophy',
    label: '인생의 방향을 잃었을 때! 삶의 의미와 통찰을 찾는 사람',
    shortLabel: '인생 방향 · 통찰',
    description: '중요한 선택의 기로에서 후회 없는 삶의 태도와 깊은 지혜를 얻고 싶은 분께 추천합니다.',
    icon: 'fa-compass',
    accentColor: '#7C3AED',
    badgeClass: 'bg-violet-100 text-violet-800 border-violet-200'
  },
  {
    id: 'creative-thinking',
    label: '틀을 깨는 사고력! 창의성과 기획력을 넓히고 싶은 사람',
    shortLabel: '창의성 · 사고법',
    description: '고정관념에서 벗어나 본질을 꿰뚫어 보는 의사결정과 새로운 아이디어를 원하는 분께 알맞습니다.',
    icon: 'fa-lightbulb',
    accentColor: '#EA580C',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200'
  }
];

export const BOOKS_PART_1: Book[] = [
  {
    id: 1,
    title: '아주 작은 습관의 힘',
    originalTitle: 'Atomic Habits',
    author: '제임스 클리어 (James Clear)',
    authorBio: '세계적인 습관 형성 전문가이자 작가. 생물학·뇌과학·심리학을 결합해 행동 변화의 원리를 연구하며 전 세계 수백만 독자의 일상을 변화시켰습니다.',
    year: 2018,
    summary: '거창한 목표 대신 매일 1%씩 나아지는 아주 작은 습관(원자 습관)이 어떻게 복리 효과를 일으켜 인생 전체를 바꾸는지 과학적으로 증명한 책입니다. 의지력을 탓하는 대신 습관이 저절로 실행될 수밖에 없는 환경과 시스템(신호-열망-반응-보상)을 설계하는 4가지 법칙을 구체적으로 안내합니다.',
    keyLessons: [
      '목표가 아니라 시스템을 구축하라: 결과는 시스템의 부산물일 뿐이다.',
      '행동 변화의 4단계 법칙: 분명하게, 매력적으로, 하기 쉽게, 만족스럽게 만들어라.',
      '정체성 기반 습관: 무엇을 얻을지가 아니라 어떤 사람이 될 것인가에 집중하라.'
    ],
    quote: '습관은 자아 개선의 복리 이자다. 매일 1퍼센트씩 나아지면 1년 뒤에는 37배 더 나은 사람이 된다.',
    personas: ['habit-focus', 'career-success'],
    whoShouldRead: [
      '새해 다짐이나 계획이 늘 작심삼일로 끝나 자책하는 분',
      '의지력이 약해도 자동으로 실천되는 일상 루틴을 만들고 싶은 분',
      '운동, 독서, 공부 등 좋은 습관을 평생의 자산으로 정착시키고 싶은 분'
    ],
    readingTime: '약 6시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#0F766E', bgTo: '#115E59', accent: '#5EEAD4', icon: 'fa-atom' },
    tags: ['습관설계', '시스템', '루틴', '행동심리']
  },
  {
    id: 2,
    title: '그릿 (GRIT)',
    originalTitle: 'Grit: The Power of Passion and Perseverance',
    author: '앤절라 더크워스 (Angela Duckworth)',
    authorBio: '펜실베이니아 대학교 심리학과 교수이자 맥아더 펠로우 수상자. 군 사관학교, 세일즈맨, 철자 말하기 대회 챔피언들을 수년간 추적 연구해 성공의 핵심 요인을 규명했습니다.',
    year: 2016,
    summary: '우리가 흔히 선망하는 타고난 재능(IQ, 운동 신경 등)보다 장기적인 목표를 향해 열정과 끈기를 유지하는 힘인 "그릿(Grit)"이 성취의 결정적 열쇠임을 밝힙니다. 재능에 노력을 곱하면 기술이 되고, 그 기술에 다시 노력을 곱해야 비로소 성취가 된다는 공식을 통해 포기하지 않는 내면의 근력을 키우는 법을 제시합니다.',
    keyLessons: [
      '성취 공식: 재능 × 노력 = 기술, 기술 × 노력 = 성취 (노력은 두 번 계산된다).',
      '그릿의 4가지 원천: 관심사 발굴, 의식적인 연습, 높은 목적의식, 다시 일어서는 희망.',
      '아이와 조직에 그릿을 길러주는 "현명한 양육·리더십"은 높은 기대와 따뜻한 지지의 결합이다.'
    ],
    quote: '열정은 방향을 알려주는 나침반이고, 끈기는 그 끝까지 가게 만드는 엔진이다.',
    personas: ['habit-focus', 'career-success'],
    whoShouldRead: [
      '자신에게 특별한 재능이 없다고 느껴 쉽게 주눅이 드는 분',
      '장기 프로젝트나 시험 준비 중 슬럼프를 겪고 있는 수험생·직장인',
      '쉽게 포기하지 않는 단단한 끈기와 열정을 기르고 싶은 분'
    ],
    readingTime: '약 7시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#1E3A8A', bgTo: '#1E40AF', accent: '#93C5FD', icon: 'fa-fire-flame-curved' },
    tags: ['끈기', '열정', '장기목표', '노력의힘']
  },
  {
    id: 3,
    title: '성공하는 사람들의 7가지 습관',
    originalTitle: 'The 7 Habits of Highly Effective People',
    author: '스티븐 코비 (Stephen R. Covey)',
    authorBio: '세계적인 리더십 권위자이자 프랭클린코비사 공동 창립자. 포춘 500대 기업 대부분과 각국 지도자들에게 원칙 중심 리더십을 전수했습니다.',
    year: 1989,
    summary: '단기적인 처세술이 아닌 내면의 성품과 보편적 원칙에 기반한 자기 혁신의 바이블입니다. 개인의 독립성(주도성, 목표 확립, 우선순위 관리)을 먼저 완성한 뒤, 타인과의 상호의존성(승-승 사고, 경청, 시너지)으로 나아가고, 끊임없이 자신을 쇄신하는 7단계 성장 프레임워크를 담고 있습니다.',
    keyLessons: [
      '자극과 반응 사이에는 선택의 공간이 있다: 자신의 삶을 주도하라.',
      '급한 일이 아니라 "중요하지만 급하지 않은 일(제2사분면)"에 시간을 투자하라.',
      '먼저 이해하고 다음에 이해시켜라: 공감적 경청이 모든 신뢰의 출발점이다.'
    ],
    quote: '생각을 심으면 행동을 거두고, 행동을 심으면 습관을 거두며, 습관을 심으면 성품을 거두고, 성품을 심으면 운명을 거둔다.',
    personas: ['career-success', 'relationship-comm', 'life-philosophy'],
    whoShouldRead: [
      '단편적인 스킬이 아닌 인생 전반을 관통하는 원칙을 세우고 싶은 분',
      '바쁘게는 살지만 정작 중요한 목표에는 다가가지 못해 답답한 분',
      '팀원들과 시너지를 내는 성숙한 리더로 성장하고 싶은 관리자'
    ],
    readingTime: '약 9시간',
    difficulty: '중급',
    coverTheme: { bgFrom: '#312E81', bgTo: '#4338CA', accent: '#C7D2FE', icon: 'fa-crown' },
    tags: ['원칙중심', '시간관리', '리더십', '고전필독서']
  },
  {
    id: 4,
    title: '데일 카네기 인간관계론',
    originalTitle: 'How to Win Friends and Influence People',
    author: '데일 카네기 (Dale Carnegie)',
    authorBio: '현대 자기계발 및 인간관계학의 아버지. 수많은 성인들을 대상으로 화술과 대인관계를 강의하며 시대를 초월한 인간 심리의 통찰을 정리했습니다.',
    year: 1936,
    summary: '출간 이후 약 90년 동안 전 세계에서 가장 많이 읽힌 인간관계의 고전입니다. 타인을 비난하지 않고 진심으로 인정하며, 상대방의 관점에서 원하는 것을 파악해 호감을 얻고 갈등 없이 사람을 설득하는 구체적이고 따뜻한 인간 이해의 원칙들을 풍부한 실화와 함께 들려줍니다.',
    keyLessons: [
      '비판, 비난, 불평을 삼가라: 사람은 논리가 아니라 감정과 자존심으로 움직인다.',
      '인간의 가장 깊은 욕구는 "자신이 중요한 사람으로 인정받고 싶은 욕구"다.',
      '논쟁에서 이기는 유일한 방법은 논쟁을 피하고 상대의 체면을 세워주는 것이다.'
    ],
    quote: '다른 사람이 당신을 좋아하게 만드는 2개월의 시간보다, 당신이 다른 사람에게 진심으로 관심을 갖는 2년이 더 많은 친구를 만든다 — 아니, 그 반대다. 진심 어린 관심은 단 두 달 만에 기적을 만든다.',
    personas: ['relationship-comm', 'career-success'],
    whoShouldRead: [
      '직장 동료, 상사, 고객과의 관계에서 잦은 피로감을 느끼는 분',
      '갈등 없이 상대방의 마음을 열고 설득하는 대화법을 배우고 싶은 분',
      '처음 만나는 사람과도 자연스럽게 신뢰를 쌓고 싶은 영업·기획 직군'
    ],
    readingTime: '약 6시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#9F1239', bgTo: '#BE123C', accent: '#FECDD3', icon: 'fa-handshake' },
    tags: ['인간관계', '대화법', '설득', '경청']
  },
  {
    id: 5,
    title: '죽음의 수용소에서',
    originalTitle: "Man's Search for Meaning",
    author: '빅터 프랭클 (Viktor E. Frankl)',
    authorBio: '오스트리아의 신경정신과 의사이자 로고테라피(의미치료) 창시자. 아우슈비츠 강제수용소에서 살아남아 인간의 존엄성과 삶의 의미를 전 세계에 일깨웠습니다.',
    year: 1946,
    summary: '나치 강제수용소라는 극한의 절망 속에서도 인간이 어떻게 삶의 의미를 발견하고 존엄을 지킬 수 있는지를 기록한 위대한 수기이자 심리학 명저입니다. 환경이 모든 것을 빼앗아가도 주어진 상황에 어떤 태도를 취할지 결정하는 "인간의 마지막 자유"만은 빼앗을 수 없음을 증명합니다.',
    keyLessons: [
      '왜 살아야 하는지(Why) 아는 사람은 그 어떤 상황(How)도 견뎌낼 수 있다.',
      '삶의 의미는 세 가지 길로 발견된다: 일·창조, 사랑·경험, 그리고 피할 수 없는 시련을 대하는 태도.',
      '행복은 추구할 대상이 아니라 의미 있는 삶에 뒤따라오는 자연스러운 결과다.'
    ],
    quote: '인간에게서 모든 것을 빼앗아 갈 수 있어도 단 한 가지, 주어진 환경에서 자신의 태도를 결정하고 자기 자신의 길을 선택할 수 있는 자유만은 빼앗아 갈 수 없다.',
    personas: ['life-philosophy', 'mindset-healing'],
    whoShouldRead: [
      '인생의 큰 시련이나 상실감 앞에서 살아갈 이유를 찾고 싶은 분',
      '무기력증에 빠져 내 삶의 진정한 가치와 방향을 다시 묻고 싶은 분',
      '어떤 역경에도 꺾이지 않는 깊은 내면의 철학을 갖고 싶은 분'
    ],
    readingTime: '약 4시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#3B0764', bgTo: '#581C87', accent: '#E9D5FF', icon: 'fa-dove' },
    tags: ['삶의의미', '로고테라피', '극복', '인생철학']
  },
  {
    id: 6,
    title: '원씽 (The ONE Thing)',
    originalTitle: 'The ONE Thing',
    author: '게리 켈러 & 제이 파파산 (Gary Keller & Jay Papasan)',
    authorBio: '세계 최대 규모의 부동산 기업 켈러 윌리엄스 리얼티의 창업자 게리 켈러와 베스트셀러 작가이자 편집자 제이 파파산이 공동 집필했습니다.',
    year: 2013,
    summary: '복잡한 세상에서 남다른 성과를 내는 비결은 멀티태스킹이 아니라 가장 중요한 "단 하나(The ONE Thing)"를 찾아 모든 에너지를 집중하는 것임을 강조합니다. 첫 번째 도미노를 쓰러뜨리면 거대한 도미노까지 연쇄적으로 넘어뜨릴 수 있다는 원리를 통해 일과 삶의 우선순위를 날카롭게 벼려줍니다.',
    keyLessons: [
      '초점 탐색 질문: "당신이 할 수 있는 단 하나의 일, 그것을 함으로써 다른 모든 일을 쉽게 혹은 필요 없게 만들 그 일은 무엇인가?"',
      '멀티태스킹은 거짓말이며 모든 일을 똑같이 중요하게 여기는 평등주의를 버려라.',
      '매일 하루 중 가장 생산적인 4시간을 단 하나의 핵심 과제를 위해 타임블록(Time Block)으로 사수하라.'
    ],
    quote: '모든 일을 다 하려다가는 아무것도 하지 못한다. 탁월한 성과는 선택과 집중의 크기에 비례한다.',
    personas: ['habit-focus', 'career-success'],
    whoShouldRead: [
      '할 일 목록(To-do list)에 치여 정작 핵심 성과는 못 내고 있는 직장인',
      '여러 가지 목표를 동시에 벌여놓고 에너지가 분산되어 지친 분',
      '최소한의 핵심 노력으로 압도적인 결과를 만들고 싶은 창업가·프리랜서'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#B45309', bgTo: '#D97706', accent: '#FDE68A', icon: 'fa-crosshairs' },
    tags: ['선택과집중', '우선순위', '생산성', '도미노효과']
  },
  {
    id: 7,
    title: '딥 워크 (Deep Work)',
    originalTitle: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: '칼 뉴포트 (Cal Newport)',
    authorBio: 'MIT 컴퓨터공학 박사이자 조지타운 대학교 컴퓨터공학과 교수. 디지털 시대의 집중력과 지식 노동의 미래를 날카롭게 통찰하는 작가입니다.',
    year: 2016,
    summary: '스마트폰 알림, 이메일, 메신저로 끊임없이 주의력이 파편화되는 시대에, 방해 없는 고도의 집중 상태인 "딥 워크"야말로 21세기 가장 희소하고 가치 있는 초능력임을 역설합니다. 피상적 작업(Shallow Work)을 줄이고 뇌의 인지 능력을 극한까지 끌어올려 고부가가치 결과물을 만드는 구체적인 훈련법을 다룹니다.',
    keyLessons: [
      '고품질 결과물 = (투자한 시간) × (집중의 강도). 작업 전환 시 발생하는 "주의력 잔여물"을 경계하라.',
      '자신만의 딥 워크 철학(수도승 방식, 이원적 방식, 리듬 방식, 기자 방식)을 선택해 루틴화하라.',
      '지루함을 견디는 훈련을 하고, 소셜 미디어를 도구적 가치 기준으로 엄격히 선별하라.'
    ],
    quote: '깊이 집중하는 능력은 경제적 가치가 점점 높아지는 동시에, 점점 더 희귀해지고 있다.',
    personas: ['habit-focus', 'career-success', 'creative-thinking'],
    whoShouldRead: [
      '스마트폰과 메신저 확인 때문에 30분 이상 깊이 집중하기 어려운 분',
      '단기간에 어려운 기술이나 전문 지식을 빠르게 습득해야 하는 분',
      '창작, 개발, 연구, 기획 등 고도의 두뇌 노동을 수행하는 전문가'
    ],
    readingTime: '약 6시간',
    difficulty: '중급',
    coverTheme: { bgFrom: '#0F172A', bgTo: '#1E293B', accent: '#38BDF8', icon: 'fa-brain' },
    tags: ['몰입', '디지털디톡스', '주의력관리', '지식노동']
  },
  {
    id: 8,
    title: '마인드셋 (Mindset)',
    originalTitle: 'Mindset: The New Psychology of Success',
    author: '캐럴 드웩 (Carol S. Dweck)',
    authorBio: '스탠퍼드 대학교 심리학과 석좌교수. 수십 년간 성취와 동기의 심리학을 연구하며 고정 마인드셋과 성장 마인드셋 이론을 확립한 세계적 석학입니다.',
    year: 2006,
    summary: '인간의 능력과 지능이 타고난 고정된 것이라 믿는 "고정 마인드셋"과 노력과 학습을 통해 얼마든지 개발될 수 있다고 믿는 "성장 마인드셋"의 차이를 규명합니다. 실패를 능력 부족의 증거가 아닌 배움의 디딤돌로 바라보는 관점 전환이 학업, 비즈니스, 스포츠, 인간관계를 어떻게 바꾸는지 보여줍니다.',
    keyLessons: [
      '고정 마인드셋은 똑똑해 보이는 것에 집착해 도전을 피하지만, 성장 마인드셋은 실패 속에서도 성장을 즐긴다.',
      '"나는 못해" 대신 "아직(Not Yet) 못할 뿐이야"라는 단어를 사용해 뇌의 성장 회로를 깨워라.',
      '타인을 칭찬할 때 지능이나 재능이 아닌 "과정, 전략, 노력"을 칭찬해야 진정한 자신감이 자란다.'
    ],
    quote: '성공한 사람들은 실패를 사랑하지는 않더라도 실패가 자신을 규정하지 못한다는 사실을 알고 배움의 기회로 삼는다.',
    personas: ['mindset-healing', 'career-success'],
    whoShouldRead: [
      '실수하거나 평가받는 것이 두려워 새로운 도전을 망설이는 분',
      '완벽주의 성향 때문에 시작조차 어렵거나 자기 검열이 심한 분',
      '자녀, 학생, 팀원의 잠재력을 끌어올려 주고 싶은 부모와 리더'
    ],
    readingTime: '약 6시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#047857', bgTo: '#065F46', accent: '#6EE7B7', icon: 'fa-arrows-up-to-line' },
    tags: ['성장마인드셋', '실패극복', '잠재력', '심리학']
  },
  {
    id: 9,
    title: '미움받을 용기',
    originalTitle: '嫌われる勇気',
    author: '기시미 이치로 & 고가 후미타케',
    authorBio: '아들러 심리학의 권위자인 철학자 기시미 이치로와 베스트셀러 작가 고가 후미타케가 철학자와 청년의 대화 형식으로 아들러 사상을 쉽게 풀어냈습니다.',
    year: 2013,
    summary: '"인간은 변할 수 있고 누구나 지금 이 순간부터 행복해질 수 있다"는 알프레드 아들러의 개인심리학을 청년과 철학자의 5일 밤 대화로 풀어낸 책입니다. 과거의 트라우마가 현재를 결정한다는 원인론을 부정하고, 타인의 시선과 인정 욕구에서 벗어나 "과제의 분리"를 실천할 때 진정한 자유를 얻는다고 말합니다.',
    keyLessons: [
      '목적론: 우리는 과거의 상처 때문에 불행한 것이 아니라 변하지 않기 위해 불행을 선택하고 있을지 모른다.',
      '과제의 분리: 내가 통제할 수 있는 나의 과제와 타인의 평가를 명확히 분리하라.',
      '모든 고민은 인간관계에서 비롯되며, 진정한 자유란 타인에게 미움받는 것을 두려워하지 않는 용기다.'
    ],
    quote: '남이 나에 대해 어떤 평가를 내리든 마음에 두지 않고, 타인이 나를 싫어해도 두려워하지 않는 것. 그것이 바로 자유다.',
    personas: ['mindset-healing', 'relationship-comm', 'life-philosophy'],
    whoShouldRead: [
      '남들의 눈치를 너무 많이 보고 거절을 잘 못해 마음고생하는 분',
      '과거의 후회나 상처에 발목 잡혀 앞으로 나아가지 못하는 분',
      '타인의 인정 욕구에서 벗어나 주체적인 내 삶을 살고 싶은 분'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#1D4ED8', bgTo: '#1E3A8A', accent: '#BFDBFE', icon: 'fa-feather-pointed' },
    tags: ['아들러심리학', '자존감', '과제의분리', '자유']
  },
  {
    id: 10,
    title: '세이노의 가르침',
    originalTitle: '세이노의 가르침 (피보다 진하게 살아라)',
    author: '세이노 (SayNo)',
    authorBio: '자수성가한 수백억 원대 자산가이자 칼럼니스트. 현재까지 믿고 있는 것들에 "No"라고 말하라는 필명으로 20여 년간 날카롭고 현실적인 조언을 남겨왔습니다.',
    year: 2023,
    summary: '어린 시절 가난과 시련을 딛고 맨손으로 부와 성공을 일궈낸 저자가 청년들과 직장인들에게 전하는 뼈아프지만 따뜻한 실전 지침서입니다. 허황된 일확천금이나 달콤한 위로를 단호히 거부하고, 어떤 허드렛일이라도 자기 일처럼 파고들어 대체 불가능한 실력을 쌓는 삶의 태도를 강렬하게 일깨웁니다.',
    keyLessons: [
      '일이 재미없다고 불평하기 전에 그 일의 달인이 될 때까지 치열하게 파고들어라.',
      '부자가 되려면 돈 쓰는 법을 배우기 전에 돈을 안 쓰는 법과 밑바닥 경제 감각부터 익혀라.',
      '독서와 공부는 학벌이 아니라 현실 문제를 해결하기 위한 가장 강력한 무기다.'
    ],
    quote: '피보다 진하게 살아라. 삶이 그대를 속일지라도 슬퍼하거나 노하지 말고, 그 삶을 정면으로 돌파하라.',
    personas: ['wealth-finance', 'career-success', 'life-philosophy'],
    whoShouldRead: [
      '현실 안주와 나태함을 단번에 깨부수는 강력한 동기부여가 필요한 분',
      '흙수저·무스펙 환경에서 실력 하나로 자수성가하고 싶은 2030 세대',
      '막연한 위로 대신 당장 현장에서 써먹을 처절한 생존 지혜를 원하는 분'
    ],
    readingTime: '약 10시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#18181B', bgTo: '#27272A', accent: '#FBBF24', icon: 'fa-gavel' },
    tags: ['자수성가', '현실조언', '태도', '부의철학']
  },
  {
    id: 11,
    title: '역행자',
    originalTitle: '역행자: 돈·시간·운명으로부터 완전한 자유를 얻는 7단계 인생 공략집',
    author: '자청 (송명진)',
    authorBio: '무스펙·열등감 가득했던 청년에서 독서와 글쓰기, 무자본 창업으로 경제적 자유를 이룬 기업가이자 크리에이터.',
    year: 2022,
    summary: '95%의 인간은 타고난 유전자와 본능의 명령대로 살아가는 "순리자"로 머물지만, 본능을 거스르고 뇌를 최적화하는 7단계 모델을 밟으면 누구나 경제적·시간적 자유를 얻는 "역행자"가 될 수 있다고 설파합니다. 자의식 해체부터 하루 2시간 독서·글쓰기(22전략)까지 실전형 공략법을 제시합니다.',
    keyLessons: [
      '1단계 자의식 해체: 질투와 합리화라는 방어기제를 인정할 때 비로소 배움이 시작된다.',
      '22전략: 2년 동안 매일 2시간씩 책을 읽고 글을 쓰는 것이 뇌 근육을 키우는 최고의 복리 투자다.',
      '기버(Giver) 이론과 확률 게임: 실패해도 손실이 적고 성공하면 보상이 큰 시도를 반복하라.'
    ],
    quote: '인생을 바꾸는 방법은 아주 간단하다. 본능이 시키는 반대로 행동하고 매일 뇌를 업그레이드하는 것이다.',
    personas: ['wealth-finance', 'habit-focus', 'career-success'],
    whoShouldRead: [
      '평범한 배경에서 출발해 인생의 레버리지를 만들고 싶은 분',
      '독서와 글쓰기를 통해 사고력과 사업 수완을 동시에 키우고 싶은 분',
      '자기 합리화를 멈추고 실행력을 끌어올릴 단계별 가이드가 필요한 분'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#4C1D95', bgTo: '#6D28D9', accent: '#F472B6', icon: 'fa-arrows-rotate' },
    tags: ['자의식해체', '독서와글쓰기', '경제적자유', '실행력']
  },
  {
    id: 12,
    title: '부의 추월차선',
    originalTitle: 'The Millionaire Fastlane',
    author: '엠제이 드마코 (MJ DeMarco)',
    authorBio: '리무진 운전기사 등 수많은 아르바이트를 전전하다 웹 플랫폼을 창업해 30대 초반에 자수성가 억만장자가 된 기업가이자 투자자.',
    year: 2011,
    summary: '"아껴 쓰고 저축해 65세에 은퇴하라"는 기존의 재테크 상식을 휠체어 탄 노인이 되어서야 부자가 되는 "서행차선"이라 비판합니다. 진정한 젊음과 자유가 함께하는 부를 얻기 위해서는 시간과 돈을 맞바꾸는 노동을 넘어, 수많은 사람에게 가치를 제공하고 자동화된 수익 시스템을 만드는 "추월차선"으로 진입해야 함을 역설합니다.',
    keyLessons: [
      '부의 3가지 도로: 인도(소비 중독), 서행차선(시간을 파는 직장·장기 적립), 추월차선(비즈니스 시스템 구축).',
      '백만장자는 사건이 아니라 과정이 만든다: 소비자의 관점에서 생산자의 관점으로 전환하라.',
      '영향력의 법칙: 수백만 명에게 큰 가치를 제공하면 수백만 달러의 부가 따라온다.'
    ],
    quote: '부의 진정한 가치는 고급 자동차가 아니라 자유, 건강, 그리고 사랑하는 사람들과 보내는 시간이다.',
    personas: ['wealth-finance', 'career-success'],
    whoShouldRead: [
      '월급과 적금만으로는 경제적 자유에 도달하기 어렵다고 느끼는 직장인',
      '나만의 사업이나 확장 가능한 비즈니스 모델을 구상 중인 예비 창업가',
      '소비자 마인드를 버리고 생산자 마인드로 눈을 뜨고 싶은 분'
    ],
    readingTime: '약 7시간',
    difficulty: '중급',
    coverTheme: { bgFrom: '#92400E', bgTo: '#B45309', accent: '#FCD34D', icon: 'fa-gauge-high' },
    tags: ['경제적자유', '창업마인드', '생산자사고', '부의시스템']
  },
  {
    id: 13,
    title: '부자 아빠 가난한 아빠',
    originalTitle: 'Rich Dad Poor Dad',
    author: '로버트 기요사키 (Robert T. Kiyosaki)',
    authorBio: '세계적인 금융 교육가이자 투자자. 개인 금융 분야에서 역대 가장 많이 팔린 베스트셀러를 집필해 전 세계인의 경제관념을 뒤흔들었습니다.',
    year: 1997,
    summary: '고학력 공무원이었지만 평생 돈 문제에 시달린 친아버지(가난한 아빠)와 정규 교육은 짧았으나 자본의 원리를 깨우친 친구 아버지(부자 아빠)의 상반된 가르침을 비교합니다. 돈을 위해 일하지 말고 돈이 나를 위해 일하게 만드는 "자산과 부채의 구분법"과 금융 문해력의 중요성을 가장 쉽게 일깨워줍니다.',
    keyLessons: [
      '자산은 내 주머니에 돈을 넣어주는 것이고, 부채는 내 주머니에서 돈을 빼가는 것이다.',
      '가난한 사람과 중산층은 돈을 위해 일하지만, 부자는 자산을 사 모으고 돈이 자신을 위해 일하게 한다.',
      '학교는 훌륭한 직원을 길러낼 뿐 돈의 원리를 가르치지 않는다. 금융 지식을 스스로 공부하라.'
    ],
    quote: '실패를 피하는 사람은 성공도 피하게 된다. 부자가 되는 첫걸음은 자산과 부채의 차이를 아는 것이다.',
    personas: ['wealth-finance'],
    whoShouldRead: [
      '재테크와 자본주의 공부를 처음 시작하려는 사회초년생과 대학생',
      '열심히 일해 소득이 늘어도 늘 돈이 부족한 "쥐 레이스"에서 벗어나고 싶은 분',
      '월급 외 현금 흐름과 파이프라인의 개념을 확실히 잡고 싶은 분'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#5B21B6', bgTo: '#7C3AED', accent: '#FDE047', icon: 'fa-sack-dollar' },
    tags: ['금융문해력', '자산과부채', '재테크입문', '현금흐름']
  },
  {
    id: 14,
    title: '돈의 심리학',
    originalTitle: 'The Psychology of Money',
    author: '모건 하우절 (Morgan Housel)',
    authorBio: '콜라보레이티브 펀드 파트너이자 전 월스트리트 저널 칼럼니스트. 인간의 심리와 행동경제학을 우아한 스토리텔링으로 풀어내는 금융 작가입니다.',
    year: 2020,
    summary: '부와 투자의 성공은 수학 공식이나 천재적인 지능이 아니라 탐욕, 두려움, 인내심 등 "돈을 대하는 태도와 행동"에 달려 있음을 20가지 짧은 이야기로 들려줍니다. 일확천금을 노리다 파산한 천재 투자자와 평생 청소부로 일하며 800만 달러를 남긴 로널드 리드의 대비를 통해 복리와 만족의 가치를 전합니다.',
    keyLessons: [
      '부자 되는 것(Getting wealthy)은 과감함과 낙관이 필요하지만, 부를 지키는 것(Staying wealthy)은 겸손과 생존이 핵심이다.',
      '가장 어려운 금융 기술은 움직이는 골대(남들과의 비교)를 멈추고 "충분함"을 아는 것이다.',
      '돈이 주는 최고의 배당금은 내 시간을 내 마음대로 쓸 수 있는 통제권이다.'
    ],
    quote: '원하는 것을, 원하는 시간에, 원하는 사람과, 원하는 만큼 할 수 있는 능력. 이것이 돈이 주는 가장 큰 가치다.',
    personas: ['wealth-finance', 'mindset-healing', 'life-philosophy'],
    whoShouldRead: [
      '주변 사람들의 투자 수익이나 소비 수준과 비교하며 조급함을 느끼는 분',
      '단기 투기가 아닌 평생 흔들리지 않는 건강한 부의 철학을 세우고 싶은 분',
      '돈과 행복의 균형을 현명하게 잡고 싶은 모든 직장인과 투자자'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#064E3B', bgTo: '#047857', accent: '#A7F3D0', icon: 'fa-scale-balanced' },
    tags: ['행동경제학', '장기투자', '복리의마법', '시간의자유']
  },
  {
    id: 15,
    title: '타이탄의 도구들',
    originalTitle: 'Tools of Titans',
    author: '팀 페리스 (Tim Ferriss)',
    authorBio: '실리콘밸리의 전설적인 엔젤 투자자이자 팟캐스트 진행자, 《나는 4시간만 일한다》의 저자. 세계 최고 수행자들의 루틴을 실험하고 분석합니다.',
    year: 2016,
    summary: '세계적인 억만장자, 아카데미 수상자, 올림픽 금메달리스트, 베스트셀러 작가 등 각 분야 정점에 오른 "타이탄" 200여 명을 직접 인터뷰해 그들이 매일 실천하는 아침 루틴, 멘탈 관리법, 독서 습관, 창의성 노하우를 집대성한 실용 백과사전입니다.',
    keyLessons: [
      '타이탄들의 공통된 아침 습관: 이부자리 정리, 명상, 가벼운 운동, 감사 일기로 하루의 주도권을 쥔다.',
      '한 가지 압도적인 무기 대신 상위 25% 수준의 능력 2~3가지를 결합해 대체 불가능한 사람이 되어라.',
      '두려움 설정(Fear-Setting): 막연한 불안 대신 최악의 시나리오를 종이에 구체적으로 적어 통제하라.'
    ],
    quote: '성공한 사람들은 초인이 아니다. 그들은 단지 매일 반복하는 작고 검증된 도구들을 가지고 있을 뿐이다.',
    personas: ['habit-focus', 'career-success', 'creative-thinking'],
    whoShouldRead: [
      '세계 최고 전문가들의 검증된 아침 루틴과 생산성 팁을 한 권으로 얻고 싶은 분',
      '나만의 강점 조합을 찾아 커리어 경쟁력을 높이고 싶은 분',
      '필요할 때마다 펼쳐서 영감과 실행 아이디어를 얻고 싶은 분'
    ],
    readingTime: '약 6시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#1E293B', bgTo: '#334155', accent: '#F97316', icon: 'fa-toolbox' },
    tags: ['아침루틴', '성공습관', '멘탈관리', '실전노하우']
  },
  {
    id: 16,
    title: '생각에 관한 생각',
    originalTitle: 'Thinking, Fast and Slow',
    author: '대니얼 카너먼 (Daniel Kahneman)',
    authorBio: '심리학자 최초로 노벨 경제학상을 수상한 현대 행동경제학의 창시자. 인간의 판단과 의사결정의 오류를 평생 연구했습니다.',
    year: 2011,
    summary: '인간의 머릿속에서 작동하는 두 가지 사고 체계인 직관적이고 빠른 "시스템 1"과 논리적이고 숙고하는 "시스템 2"의 메커니즘을 파헤친 불후의 명저입니다. 우리가 일상과 비즈니스에서 얼마나 쉽게 확증 편향, 손실 회피, 앵커링 효과 같은 인지적 착각에 빠지는지 보여주며 현명한 의사결정법을 안내합니다.',
    keyLessons: [
      '시스템 1(빠른 직관)은 효율적이지만 성급한 결론과 편향에 취약하므로 중요한 결정에는 시스템 2를 깨워야 한다.',
      '손실 회피 편향: 인간은 같은 크기의 이득에서 느끼는 기쁨보다 손실에서 느끼는 고통을 약 2배 더 크게 느낀다.',
      '경험하는 자아와 기억하는 자아는 다르다: 결정을 내릴 때 객관적 통계와 기저율(Base rate)을 확인하라.'
    ],
    quote: '우리가 보는 것이 세상의 전부라고 믿는 착각이 수많은 잘못된 판단의 출발점이다.',
    personas: ['creative-thinking', 'wealth-finance', 'career-success'],
    whoShouldRead: [
      '감정이나 성급한 직관에 휘둘리지 않고 정교한 의사결정을 내리고 싶은 리더·투자자',
      '인간 심리와 인지 편향의 원리를 깊이 이해하고 싶은 기획자·마케터',
      '논리적이고 비판적인 사고력을 한 차원 높이고 싶은 분'
    ],
    readingTime: '약 12시간',
    difficulty: '심화',
    coverTheme: { bgFrom: '#1E3A8A', bgTo: '#0F172A', accent: '#60A5FA', icon: 'fa-lightbulb' },
    tags: ['행동경제학', '인지편향', '의사결정', '비판적사고']
  },
  {
    id: 17,
    title: '몰입 (Flow)',
    originalTitle: 'Flow: The Psychology of Optimal Experience',
    author: '미하이 칙센트미하이 (Mihaly Csikszentmihalyi)',
    authorBio: '긍정심리학의 선구자이자 클레어몬트 대학원 심리학과 석좌교수. "플로우(몰입)" 개념을 최초로 학문적으로 정립했습니다.',
    year: 1990,
    summary: '인간이 가장 깊은 행복과 충만함을 느끼는 순간은 아무것도 하지 않고 쉴 때가 아니라, 시간 가는 줄 모르고 자신의 능력을 최대한 발휘해 무언가에 완전히 빠져드는 "몰입(Flow)"의 상태임을 수만 건의 연구로 입증한 고전입니다. 일상의 일과 취미를 몰입 경험으로 전환하는 방법을 알려줍니다.',
    keyLessons: [
      '몰입의 조건: 명확한 목표, 즉각적인 피드백, 그리고 과제의 난이도와 내 실력 사이의 팽팽한 균형.',
      '외부의 물질적 보상과 무관하게 활동 그 자체에서 기쁨을 찾는 "자기목적적 성격"을 길러라.',
      '의식의 혼돈(불안과 지루함)을 질서 있게 정돈할 때 삶 전체가 하나의 예술 작품이 된다.'
    ],
    quote: '최고의 순간은 수동적으로 긴장을 풀고 있을 때가 아니라, 가치 있는 무언가를 이루기 위해 몸과 마음을 한계까지 늘릴 때 찾아온다.',
    personas: ['habit-focus', 'mindset-healing', 'creative-thinking'],
    whoShouldRead: [
      '일상이 무료하고 어떤 일을 해도 진정한 즐거움을 느끼기 어려운 분',
      '공부나 업무를 고통이 아닌 짜릿한 성장 경험으로 바꾸고 싶은 분',
      '고도의 집중 상태에 진입하는 심리적 조건을 이해하고 싶은 분'
    ],
    readingTime: '약 8시간',
    difficulty: '중급',
    coverTheme: { bgFrom: '#0369A1', bgTo: '#0C4A6E', accent: '#7DD3FC', icon: 'fa-water' },
    tags: ['몰입경험', '긍정심리학', '행복의비밀', '집중력']
  },
  {
    id: 18,
    title: '미라클 모닝',
    originalTitle: 'The Miracle Morning',
    author: '할 엘로드 (Hal Elrod)',
    authorBio: '음주운전 트럭과의 정면충돌로 6분간 심장이 멎고 평생 걸을 수 없다는 판정을 받았으나 기적적으로 재기한 세계적인 동기부여 강연가.',
    year: 2012,
    summary: '교통사고와 파산이라는 인생 최악의 위기를 극복하게 해준 아침 습관 프로젝트입니다. 출근 시간보다 조금 일찍 일어나 온전히 나만을 위해 보내는 아침 시간 동안 6가지 구원의 루틴(SAVERS: 침묵·확언·시각화·운동·독서·일기)을 실천하여 하루의 에너지와 삶의 수준을 바꾸는 법을 안내합니다.',
    keyLessons: [
      'SAVERS 6단계 루틴: 명상(Silence), 확언(Affirmations), 시각화(Visualization), 운동(Exercise), 독서(Reading), 기록(Scribing).',
      '아침 첫 1시간을 어떻게 보내느냐가 그날 하루의 생산성과 감정 상태를 결정한다.',
      '시간이 부족하다면 단 6분 버전의 미라클 모닝부터 가볍게 시작하라.'
    ],
    quote: '당신의 삶이 바뀌기를 기다리지 마라. 매일 아침 스스로 더 나은 사람으로 깨어나라.',
    personas: ['habit-focus', 'mindset-healing'],
    whoShouldRead: [
      '매일 아침 알람을 미루며 쫓기듯 하루를 시작해 지쳐 있는 직장인',
      '퇴근 후에는 체력이 방전되어 자기계발 시간을 전혀 못 내는 분',
      '단순하고 따라 하기 쉬운 아침 루틴 가이드를 찾고 있는 입문자'
    ],
    readingTime: '약 4시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#C2410C', bgTo: '#EA580C', accent: '#FED7AA', icon: 'fa-sun' },
    tags: ['미라클모닝', '새벽기상', '아침루틴', '자기관리']
  },
  {
    id: 19,
    title: '자존감 수업',
    originalTitle: '자존감 수업: 하루에 하나, 나를 사랑하게 되는 자존감 회복 훈련',
    author: '윤홍균',
    authorBio: '정신건강의학과 전문의. 진료실에서 수많은 내담자를 만나며 한국인의 마음 건강과 자존감 회복을 위한 현실적인 처방전을 제시해 왔습니다.',
    year: 2016,
    summary: '스스로를 얼마나 가치 있고 사랑스러운 존재로 여기는지를 뜻하는 "자존감"을 정신의학 전문의가 따뜻하고 명쾌하게 풀어낸 책입니다. 낮아진 자존감이 연애, 직장, 대인관계에 미치는 영향을 짚어보고, 자기 비하와 후회, 타인과의 비교에서 벗어나 건강한 자존감을 근육처럼 단련하는 실천 훈련법을 담았습니다.',
    keyLessons: [
      '자존감의 세 기둥: 자기 효능감(나는 쓸모 있다), 자기 조절감(내 삶을 내가 선택한다), 자기 안전감(나는 안전하고 사랑받을 만하다).',
      '감정은 사실이 아니다: 순간의 우울이나 수치심을 내 인격 전체와 동일시하지 마라.',
      '스스로에게 가장 가혹한 비평가가 되는 습관을 멈추고 가장 다정한 친구가 되어주어라.'
    ],
    quote: '나를 사랑하는 일에도 연습이 필요하다. 오늘 조금 서툴렀어도 괜찮다, 내일 다시 나를 안아주면 된다.',
    personas: ['mindset-healing', 'relationship-comm'],
    whoShouldRead: [
      '작은 실수에도 심하게 자책하고 스스로가 작아지는 기분이 드는 분',
      '인간관계나 연애에서 늘 을이 되거나 감정 소모가 심한 분',
      '흔들리는 멘탈을 다잡고 나 자신을 건강하게 돌보는 법을 배우고 싶은 분'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#047857', bgTo: '#10B981', accent: '#D1FAE5', icon: 'fa-heart' },
    tags: ['자존감회복', '마음챙김', '자기돌봄', '심리처방']
  },
  {
    id: 20,
    title: '상처받지 않는 영혼',
    originalTitle: 'The Untethered Soul',
    author: '마이클 싱어 (Michael A. Singer)',
    authorBio: '플로리다 대학교 경제학 석사 과정 중 깊은 내면의 각성을 경험한 뒤 명상 센터와 의료 소프트웨어 기업을 성공적으로 이끈 영성 작가이자 경영인.',
    year: 2007,
    summary: '우리 머릿속에서 24시간 쉬지 않고 떠들어대는 불안한 목소리(생각과 감정)가 "진정한 나"가 아님을 깨닫게 해주는 내면 탐구서입니다. 두려움과 상처를 방어하기 위해 마음의 문을 닫는 대신, 감정이 흘러가도록 놓아줄 때 비로소 조건 없는 평온과 무한한 에너지가 열린다는 깊은 통찰을 전합니다.',
    keyLessons: [
      '머릿속에서 끊임없이 걱정하는 목소리와 그것을 알아차리는 "의식(관찰자)"을 분리하라.',
      '마음의 가시를 뽑아라: 상처받지 않으려고 세상을 통제하려 할수록 삶은 감옥이 된다.',
      '불편한 감정이 올라올 때 저항하지 말고 긴장을 풀며 그냥 가슴을 통과해 지나가게 놓아주어라.'
    ],
    quote: '당신은 당신의 생각이 아니다. 당신은 그 생각을 조용히 바라보고 있는 깨어 있는 의식이다.',
    personas: ['mindset-healing', 'life-philosophy'],
    whoShouldRead: [
      '꼬리에 꼬리를 무는 잡생각과 미래에 대한 불안으로 잠 못 이루는 분',
      '과거의 트라우마나 타인의 말 한마디에 마음이 크게 요동치는 분',
      '외부 환경과 상관없이 평온한 내면의 중심을 갖고 싶은 분'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#4338CA', bgTo: '#6366F1', accent: '#E0E7FF', icon: 'fa-spa' },
    tags: ['내면평화', '알아차림', '불안해소', '마음수련']
  },
  {
    id: 21,
    title: '비폭력 대화',
    originalTitle: 'Nonviolent Communication: A Language of Life',
    author: '마셜 로젠버그 (Marshall B. Rosenberg)',
    authorBio: '미시간 대학교 임상심리학 박사이자 국제비폭력대화센터 설립자. 전 세계 분쟁 지역과 가정, 학교, 기업에서 평화적 갈등 해결을 중재했습니다.',
    year: 1999,
    summary: '우리가 일상에서 무심코 쓰는 평가, 강요, 비난의 언어("폭력적 대화")가 어떻게 관계를 단절시키는지 밝히고, 진심으로 연결되는 4단계 대화 모델(관찰-느낌-욕구-부탁)을 제시합니다. 내 마음의 진짜 욕구를 솔직하게 표현하면서도 상대방의 아픔에 깊이 공감하는 기적 같은 소통 기술서입니다.',
    keyLessons: [
      '평가를 섞지 않고 있는 그대로 관찰하기: "너는 게을러"가 아니라 "이번 주에 약속 시간보다 10분 늦었네".',
      '생각이 아닌 진짜 느낌과 그 이면의 충족되지 않은 욕구(존중, 안전, 휴식 등)를 연결하라.',
      '막연한 강요 대신 지금 당장 실행 가능하고 긍정적인 언어로 구체적인 부탁을 하라.'
    ],
    quote: '평가를 섞지 않고 관찰하는 것은 인간 지성의 가장 높은 형태다. 모든 비난의 이면에는 충족되지 않은 간절한 욕구가 숨어 있다.',
    personas: ['relationship-comm', 'mindset-healing'],
    whoShouldRead: [
      '가족, 연인, 배우자와 대화할 때마다 본심과 다르게 상처 주는 말이 나가는 분',
      '갈등 상황에서 감정을 억누르거나 폭발시키지 않고 건강하게 표현하고 싶은 분',
      '상담, 교육, 인사관리, 고객 응대 등 깊은 공감이 필요한 직군'
    ],
    readingTime: '약 6시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#BE185D', bgTo: '#DB2777', accent: '#FCE7F3', icon: 'fa-comments' },
    tags: ['대화법', '공감소통', '갈등해결', '감정표현']
  },
  {
    id: 22,
    title: '설득의 심리학',
    originalTitle: 'Influence: The Psychology of Persuasion',
    author: '로버트 치알디니 (Robert B. Cialdini)',
    authorBio: '애리조나 주립대학교 심리학·마케팅 명예교수. 3년간 영업 현장에 직접 위장 취업해 설득 전문가들의 비밀을 파헤친 사회심리학의 거장입니다.',
    year: 1984,
    summary: '사람들이 왜 "네(Yes)"라고 대답하는지를 결정짓는 6가지 보편적인 심리 법칙(상호성, 일관성, 사회적 증거, 호감, 권위, 희소성)을 과학적 실험과 생생한 사례로 규명한 설득 분야의 최고 권위서입니다. 상대를 윤리적으로 설득하는 법은 물론 부당한 조작으로부터 나를 지키는 방어법까지 알려줍니다.',
    keyLessons: [
      '상호성의 법칙: 사람은 작은 호의라도 먼저 받으면 반드시 갚아야 한다는 강한 심리적 부채감을 느낀다.',
      '일관성의 법칙: 스스로 작게라도 공개적인 약속이나 입장을 표명하면 그와 일치하게 행동하려 한다.',
      '사회적 증거와 희소성: 불확실할 때 다수의 선택을 따르며, 잃어버릴지 모른다는 한정이 행동을 촉발한다.'
    ],
    quote: '설득은 마술이 아니라 과학이다. 인간 심리의 지름길을 이해하는 사람이 비즈니스와 소통의 주도권을 쥔다.',
    personas: ['relationship-comm', 'career-success', 'creative-thinking'],
    whoShouldRead: [
      '영업, 마케팅, 기획서 발표, 협상에서 성공 확률을 비약적으로 높이고 싶은 분',
      '소비자 심리와 대중의 행동을 움직이는 원리가 궁금한 비즈니스맨',
      '교묘한 상술이나 부당한 요구에 휘둘리지 않는 분별력을 기르고 싶은 분'
    ],
    readingTime: '약 8시간',
    difficulty: '중급',
    coverTheme: { bgFrom: '#991B1B', bgTo: '#DC2626', accent: '#FEE2E2', icon: 'fa-magnet' },
    tags: ['설득의6원칙', '마케팅심리', '협상력', '사회심리학']
  },
  {
    id: 23,
    title: '기브 앤 테이크',
    originalTitle: 'Give and Take: Why Helping Others Drives Our Success',
    author: '애덤 그랜트 (Adam Grant)',
    authorBio: '펜실베이니아 대학교 와튼스쿨 최연소 종신교수이자 세계에서 가장 영향력 있는 조직심리학자.',
    year: 2013,
    summary: '세상의 모든 사람을 이익을 챙기는 "테이커(Taker)", 주고받는 균형을 맞추는 "매처(Matcher)", 조건 없이 베푸는 "기버(Giver)"로 분류해 누가 결국 가장 크게 성공하는지 추적합니다. 놀랍게도 성공 사다리의 맨 밑바닥과 맨 꼭대기 모두 기버가 차지한다는 사실을 밝히며, 호구가 되지 않고 정상에 오르는 "현명한 기버"의 전략을 전합니다.',
    keyLessons: [
      '실패하는 기버는 타인의 이익만 챙기다 번아웃되지만, 성공하는 기버는 자신의 목표와 타인의 이익을 함께 키운다.',
      '테이커를 상대할 때는 무조건 베풀지 말고 상대의 행동에 맞춰 대응하는 "유연한 매처(티포탯)" 전략으로 자신을 보호하라.',
      '5분 호의(5-Minute Favor): 내게는 큰 부담이 없지만 상대에게 큰 도움이 되는 작은 연결과 나눔이 거대한 네트워크 자산을 만든다.'
    ],
    quote: '가장 성공한 기버들은 남을 돕는 일 못지않게 야심 차게 자신의 목표도 추구한다. 파이 조각을 뺏는 대신 파이 전체를 키우기 때문이다.',
    personas: ['relationship-comm', 'career-success'],
    whoShouldRead: [
      '착하게 남을 돕다가 손해만 보거나 번아웃을 겪어본 적이 있는 분',
      '장기적인 신뢰 네트워크와 선한 영향력으로 성공하고 싶은 직장인·창업가',
      '이기적인 사람(테이커)들 사이에서 나를 지키며 현명하게 협업하고 싶은 분'
    ],
    readingTime: '약 7시간',
    difficulty: '중급',
    coverTheme: { bgFrom: '#0E7490', bgTo: '#0891B2', accent: '#CFFAFE', icon: 'fa-hand-holding-heart' },
    tags: ['기버이론', '조직심리', '네트워킹', '현명한배려']
  },
  {
    id: 24,
    title: '에센셜리즘 (Essentialism)',
    originalTitle: 'Essentialism: The Disciplined Pursuit of Less',
    author: '그렉 맥커운 (Greg McKeown)',
    authorBio: '스탠퍼드 대학교 인기 강의 개설자이자 애플, 구글, 픽사 등 글로벌 기업들의 리더십 및 전략 컨설턴트.',
    year: 2014,
    summary: '"더 적게, 그러나 더 좋게(Less but better)"라는 철학을 통해 비본질적인 99%를 과감히 덜어내고 정말 중요한 본질적인 1%에 생애 에너지를 투자하는 삶의 기술서입니다. 모든 요청에 "예스"라고 답하며 남이 정해준 우선순위에 끌려다니는 삶에서 벗어나 우아하게 거절하는 용기를 선물합니다.',
    keyLessons: [
      '내가 직접 내 삶의 우선순위를 정하지 않으면 다른 누군가가 내 삶의 우선순위를 정해버린다.',
      '90점 법칙: 선택할 때 확실한 "예스!(90점 이상)"가 아니라면 그것은 곧 "노(No)"다.',
      '더 많이 해내는 시간 관리가 아니라 불필요한 일을 아예 하지 않는 체계적 제거가 핵심이다.'
    ],
    quote: '에센셜리즘은 어떻게 하면 더 많은 일을 해낼 것인가가 아니라, 어떻게 하면 옳은 일을 해낼 것인가에 관한 것이다.',
    personas: ['habit-focus', 'life-philosophy', 'career-success'],
    whoShouldRead: [
      '거절을 못해 과중한 업무와 약속을 떠안고 늘 지쳐 있는 분',
      '미니멀하고 밀도 높은 삶과 일의 방식을 추구하는 분',
      '수많은 선택지 앞에서 무엇을 버리고 무엇을 취할지 기준이 필요한 분'
    ],
    readingTime: '약 5시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#334155', bgTo: '#475569', accent: '#F8FAFC', icon: 'fa-filter' },
    tags: ['본질집중', '거절의기술', '미니멀워크', '우선순위']
  },
  {
    id: 25,
    title: '완벽한 공부법',
    originalTitle: '완벽한 공부법: 모든 공부의 최고 지침서',
    author: '고영성 & 신영준',
    authorBio: '수천 권의 인문·사회·뇌과학 서적을 탐독한 작가 고영성과 공학박사 출신 멘토 신영준이 인지심리학과 뇌과학 논문을 집대성해 저술했습니다.',
    year: 2017,
    summary: '밑줄 긋기나 단순 반복 읽기 같은 착각의 공부법을 타파하고, 현대 인지심리학과 뇌과학이 검증한 가장 효율적인 학습 전략 14가지를 총망라한 실전 학습 바이블입니다. 믿음, 메타인지, 기억(인출 연습), 목표, 동기, 노력, 감정, 독서, 영어, 일까지 평생 성장하는 학습자의 모든 무기를 다룹니다.',
    keyLessons: [
      '메타인지: 내가 무엇을 알고 무엇을 모르는지 정확히 파악하는 능력이 성적과 실력의 핵심이다.',
      '최고의 기억 전략은 반복 읽기가 아니라 책을 덮고 스스로 떠올려보는 "인출(테스트) 연습"과 "분산 학습"이다.',
      '뇌 가소성: 성인이 되어서도 의식적인 연습을 통해 뇌 신경망은 물리적으로 계속 성장한다.'
    ],
    quote: '제대로 된 방법으로 공부하면 어제의 나보다 오늘의 내가 반드시 더 똑똑해진다.',
    personas: ['habit-focus', 'career-success', 'creative-thinking'],
    whoShouldRead: [
      '자격증, 고시, 입시, 이직 준비 등 단기간에 학습 효율을 극대화해야 하는 수험생·직장인',
      '열심히 책상에 앉아 있는데도 머리에 남는 것이 없어 고민인 분',
      '메타인지와 독서법, 영어 학습의 과학적 원리를 익히고 싶은 평생 학습자'
    ],
    readingTime: '약 8시간',
    difficulty: '입문',
    coverTheme: { bgFrom: '#1E40AF', bgTo: '#2563EB', accent: '#DBEAFE', icon: 'fa-graduation-cap' },
    tags: ['메타인지', '뇌과학공부법', '독서전략', '자기주도학습']
  }
];
