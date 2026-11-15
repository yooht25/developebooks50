# 성장 서재 50 (인생을 바꾸는 자기계발서 50선 & 실전 독서법 큐레이션 플랫폼)

## 프로젝트 개요
- **프로젝트명**: 성장 서재 50 (`webapp` / `developebooks50`)
- **목표**: 시대를 초월해 검증된 자기계발서 50권을 독자 유형별로 추천하고, 50권 각각의 고유 심층 해설 페이지와 4편의 오리지널 실전 독서 칼럼을 제공하며, **Google AdSense 고품질 사이트 공식 가이드라인을 100% 준수**하여 최적화된 반응형 웹 애플리케이션.
- **기술 스택**: Hono (SSR + API) + TypeScript + Cloudflare Pages + Tailwind CSS (Dark/Light Mode) + Vanilla JavaScript + Schema.org JSON-LD

## 공개 접속 및 저장소 URL
- **샌드박스 미리보기 URL**: https://3000-iow1tbugc9tgknr4nxvug-8f57ffe2.sandbox.novita.ai
- **GitHub 저장소**: https://github.com/yooht25/developebooks50

## 전체 라우트 및 엔드포인트 구조 (총 65개+ 고유 페이지)
- `GET /` : 메인 자기계발서 50선 인터랙티브 탐색 + SSR 초기 마크업 + 실전 칼럼 + 독서 FAQ
- `GET /book/:id` (`1`~`50`) : 50권 각각의 전용 SSR 심층 리뷰 페이지 (작가 소개, 줄거리, 3대 실천 원칙, 명문장, 맞춤 독자, 완독 가이드, 연관 도서 및 JSON-LD `Book` 스키마)
- `GET /guides` : 실전 독서법 & 주제별 심층 칼럼 허브 페이지
- `GET /guide/:slug` : 4편의 장문 오리지널 독서·성장 칼럼 상세 페이지 (`Article` JSON-LD 포함)
- `GET /category/:id` : 7대 독자 유형별 전용 추천 로드맵 페이지
- `GET /about` : 서비스 소개, 설립 취지 및 도서 선정 4대 기준 안내
- `GET /privacy` : 개인정보처리방침 (쿠키 및 Google AdSense 맞춤형 광고 정책 고지 포함)
- `GET /terms` : 이용약관, 저작권 인용 기준 및 면책 조항
- `GET /contact` : 문의 및 도서 추천 제보 안내
- `GET /ads.txt` : Google AdSense 공식 판매자 인증 파일 (`pub-4024277026672694`)
- `GET /robots.txt` : Googlebot 및 `Mediapartners-Google`(AdSense 크롤러) 전면 허용 및 사이트맵 안내
- `GET /sitemap.xml` : 전체 60개 이상 고유 URL 동적 XML 사이트맵
- `GET /api/personas`, `GET /api/books`, `GET /api/books/:id` : JSON REST API

## Google AdSense 고품질 사이트 가이드라인 반영 내역
1. **독창적이고 부가가치 높은 콘텐츠 구성 (1부·2부 핵심)**:
   - 단순 목록 나열을 넘어 50권 전 도서의 개별 해설 페이지(`/book/1`~`/book/50`)와 4편의 장문 실전 독서 칼럼(`/guide/*`), 독서 FAQ를 직접 구성하여 재방문 가치를 높였습니다.
2. **체계적인 탐색 구조와 약속된 정보 제공**:
   - 상단 글로벌 메뉴, 모바일 서브 메뉴, 브레드크럼(이동 경로), 이전/다음 도서 네비게이션, 체계적인 푸터 사이트맵으로 어떤 페이지에서든 2클릭 이내에 원하는 정보에 도달합니다.
   - 자바스크립트를 실행하지 않는 검색·심사 크롤러도 첫 화면과 모든 서브페이지의 텍스트 및 내부 링크를 100% 읽을 수 있도록 서버 사이드 렌더링(SSR)을 적용했습니다.
3. **비콘텐츠 페이지 광고 게재 금지 정책 엄수 (2부 핵심)**:
   - 본문 콘텐츠가 풍부한 페이지(`/`, `/book/:id`, `/guides`, `/guide/:slug`, `/category/:id`, `/about`)에만 AdSense 광고 스크립트(`adsbygoogle.js`)가 로드되며, **404 오류 페이지 및 단순 정책/연락처 페이지(`/privacy`, `/terms`, `/contact`)에는 광고 스크립트가 로드되지 않도록 엄격히 분리**했습니다.
4. **투명한 신뢰도 및 필수 정책 고지**:
   - 구글 애드센스 필수 심사 항목인 쿠키·맞춤형 광고 opt-out 안내(`Google 광고 설정`, `aboutads.info`)가 명시된 개인정보처리방침(`/privacy`), 이용약관(`/terms`), 서비스 소개(`/about`), 문의처(`/contact`)를 완비했습니다.

## 실행 및 배포 방법
```bash
# 빌드 (출력 폴더: dist)
npm run build

# 로컬 샌드박스 실행 (PM2)
pm2 start ecosystem.config.cjs
```
- **상태**: ✅ 정상 가동 중 (마지막 업데이트: 2026-11-15)
