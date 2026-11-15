# 성장 서재 50 (인생을 바꾸는 자기계발서 50선 & 실전 독서법 큐레이션 플랫폼)

## 프로젝트 개요
- **프로젝트명**: 성장 서재 50 (`webapp` / `developebooks50`)
- **목표**: 시대를 초월해 검증된 자기계발서 50권을 독자 유형별로 추천하고, 1분 맞춤 인생책 진단 테스트, 50권 각각의 고유 심층 해설 페이지(개인 실천 노트 포함), 10편의 오리지널 실전 독서 칼럼을 제공하며, **Google AdSense 고품질 사이트 공식 가이드라인을 100% 준수**하여 최적화된 반응형 웹 애플리케이션.
- **기술 스택**: Hono (SSR + API) + TypeScript + Cloudflare Pages + Tailwind CSS (Dark/Light Mode) + Vanilla JavaScript + Schema.org JSON-LD

## 공개 접속 및 저장소 URL
- **샌드박스 미리보기 URL**: https://3000-iow1tbugc9tgknr4nxvug-8f57ffe2.sandbox.novita.ai
- **GitHub 저장소**: https://github.com/yooht25/developebooks50

## 전체 라우트 및 엔드포인트 구조 (총 74개 고유 URL)
- `GET /` : 메인 자기계발서 50선 인터랙티브 탐색 + SSR 초기 마크업 + 실전 칼럼 10선 + 독서 FAQ
- `GET /quiz` : **1분 맞춤 인생책 진단 테스트** (5단계 문항 분석으로 50권 중 TOP 3 처방)
- `GET /book/:id` (`1`~`50`) : 50권 각각의 전용 SSR 심층 리뷰 페이지 (작가 소개, 줄거리, 3대 실천 원칙, 명문장, 맞춤 독자, 완독 가이드, **개인 독서 실천 노트 & 완독 체크박스**, 연관 도서 및 JSON-LD `Book` 스키마)
- `GET /guides` : 실전 독서법 & 주제별 심층 칼럼 **10편** 허브 페이지
- `GET /guide/:slug` : **10편**의 장문 오리지널 독서·성장 칼럼 상세 페이지 (`Article` JSON-LD 포함)
- `GET /category/:id` : 7대 독자 유형별 전용 추천 로드맵 페이지
- `GET /about` : 서비스 소개, 설립 취지 및 도서 선정 4대 기준 안내
- `GET /privacy` : 개인정보처리방침 (쿠키 및 Google AdSense 맞춤형 광고 정책 고지 포함)
- `GET /terms` : 이용약관, 저작권 인용 기준 및 면책 조항
- `GET /contact` : 문의 및 도서 추천 제보 안내
- `GET /ads.txt` : Google AdSense 공식 판매자 인증 파일 (`pub-4024277026672694`)
- `GET /robots.txt` : Googlebot 및 `Mediapartners-Google`(AdSense 크롤러) 전면 허용 및 사이트맵 안내
- `GET /sitemap.xml` : 전체 74개 고유 URL 동적 XML 사이트맵
- `GET /api/personas`, `GET /api/books`, `GET /api/books/:id` : JSON REST API

## 실행 및 배포 방법 (Cloudflare Pages 최적화 완료)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: `20` (`.nvmrc` 포함, `pnpm-workspace.yaml` 충돌 제거 완료)
- **상태**: ✅ 정상 가동 중 (마지막 업데이트: 2026-11-15)
