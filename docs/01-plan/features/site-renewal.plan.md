# site-renewal Planning Document

> **Summary**: `sample/` HTML 디자인(레드+네이비+스카이, Black Han Sans 헤드라인, "기호 5번" 브랜딩)을 본 사이트에 이식하고, 기존 4대 공약을 RTF의 **9대 약속/34대 정책**으로 전면 교체한다.
>
> **Project**: seunghyo (이승효 후보 공식 홈페이지)
> **Version**: 0.1.0
> **Author**: kcsvictory@gmail.com
> **Date**: 2026-05-24
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 현재 사이트의 4개 공약·하늘색 단조 디자인은 (a) 후보 정책 폭(9대/34대) 전달 부족 (b) 진보당 정체성·"기호 5번" 브랜드 노출 미흡 (c) 데스크탑 정보밀도 낮음. |
| **Solution** | `sample/index.html`(메인)·`sample/gongyak.html`(공약 상세) 디자인을 본 Next.js App Router 사이트에 이식하고, `sample/9promise.rtf`의 9대 약속/34대 정책으로 `src/data/site-data.ts`를 재구성. 기존 admin/donate/opinions/cheers 백엔드는 그대로 유지. |
| **Function/UX Effect** | (a) 메인 히어로: "내란세력 완전청산 / 동대문구 정치교체" + 기호 5 nameplate (b) 공약 페이지: 좌측 sticky 인덱스 + 9개 카드(번호·카테고리 라벨·세부 bullet) (c) 모바일 인덱스를 가로 스크롤 chip로 전환 (d) 일관된 진보당 레드 포인트. |
| **Core Value** | "오직 주민편 · 기호 5번 이승효"를 정책 깊이와 시각 일관성으로 증명 — 방문자가 30초 안에 후보 정체성/지역/약속 9개를 인지하고 의견함·후원 CTA로 전환. |

---

## 1. Overview

### 1.1 Purpose

선거 D-day가 가까워지며 후보 정책 깊이(9대 약속·34대 정책)와 진보당 시각 정체성을 강화하기 위해 사이트 전면 개편. 백엔드(Supabase `seunghyo` 스키마, admin 콘솔, 이메일 알림)는 변경하지 않고 **프론트엔드 디자인 시스템 + 컨텐츠**만 교체.

### 1.2 Background

- 현재 `src/data/site-data.ts`의 `PLEDGES`는 4개만 노출 — RTF의 34개 세부 정책 중 4개만 큐레이션됨.
- 현재 디자인은 `#29ABE2` 단일 스카이 톤 + emoji icon. 진보당 레드(`#E4032E`)와 "기호 5번" 정체성이 빠짐.
- 디자이너가 제공한 `sample/index.html`, `sample/gongyak.html`이 캠페인의 최종 비주얼 기준.
- 9번째 약속(이문 차량사업소 등 공공 인프라 개발)은 RTF에는 있으나 `sample/gongyak.html`에는 카드가 8개만 있어 **신규 작성 필요**.

### 1.3 Related Documents

- 디자인 참조: `/Users/zealnutkim/DEV/Election2026/seunghyo/sample/index.html`
- 디자인 참조: `/Users/zealnutkim/DEV/Election2026/seunghyo/sample/gongyak.html`
- 컨텐츠 원본(권위): `/Users/zealnutkim/DEV/Election2026/seunghyo/sample/9promise.rtf`
- 기존 컨벤션: `CLAUDE.md`, `AGENTS.md`
- 기존 스키마: `supabase/migrations/001_create_seunghyo_schema.sql` (변경 없음)

---

## 2. Scope

### 2.1 In Scope

- [ ] `src/data/site-data.ts` 재작성: `PLEDGES`를 9개로 확장하고 각 항목에 `id`, `category`(Transit/Care/Youth·Women/Housing/Dongbu/Labor/Small Business/Politics/Infra), `subItems[]`(세부 정책 bullet)를 추가.
- [ ] 디자인 토큰 도입: `globals.css`에 `--red:#E4032E`, `--navy:#15233F`, `--sky-deep:#5BA7DC`, `--paper:#F2F8FE` CSS 변수 + `Black Han Sans`·`Archivo`·`Noto Sans KR` Google Fonts 추가.
- [ ] `src/components/navbar.tsx` 개편: 진보당 빨강 뱃지 + "기호 5번" 컨셉을 반영하되 라우팅은 기존 6개 페이지(`/`, `/about`, `/pledges`, `/news`, `/opinions`, `/donate`) 유지.
- [ ] 메인(`/`): `SeunghyoApp.tsx`의 히어로 섹션을 sample/index.html 패턴(레드 라인 패널·점 패턴 배경·기호 5 nameplate·district chip·약속 미리보기 4장)으로 교체. 응원 보내기(`Contact` 컴포넌트)와 base64 이미지 자산은 보존.
- [ ] 공약(`/pledges`): sticky 사이드 인덱스(데스크탑 230px) + 9개 카드(번호+카테고리 em+제목+bullet 리스트) 패턴 구현, 모바일은 가로 스크롤 chip로 변환.
- [ ] 소개(`/about`): bio chip 패턴(`학력`/`전`/`현` 라벨) + 이력 7~9건으로 확장.
- [ ] 메타데이터: `src/app/layout.tsx`의 `title`/`description`을 "이승효 · 일하는 사람의 시의원" 등 sample 카피로 변경.
- [ ] 푸터: 선거구·진보당 표기 통일.

### 2.2 Out of Scope

- Supabase 스키마, RLS 정책, `cheers`/`opinions`/`donations` API 라우트 — 변경 없음.
- Admin 콘솔(`/admin/*`), HMAC 인증, nodemailer 알림 — 변경 없음.
- `/news`, `/opinions`, `/donate` 페이지의 **기능 동작** — 시각 토큰만 통일하고 폼/로직은 유지.
- 신규 페이지 추가(`/voice` 같은 sample 메뉴는 본 사이트의 `/opinions`로 매핑만).
- 다국어/i18n.
- E2E 테스트 자동화.

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `PLEDGES` 데이터 모델을 `{id, num, category, categoryEn, title, subItems[]}` 구조로 변경하고 RTF 9개 약속 + 34개 세부정책을 모두 포함 | High | Pending |
| FR-02 | 메인 `/` 히어로에 진보당 뱃지·"내란세력 완전청산/동대문구 정치교체" H1·기호 5 nameplate·district chip·"8대 약속 보기" CTA 노출 | High | Pending |
| FR-03 | `/pledges`에서 sticky 사이드 인덱스(번호+제목)로 카드 anchor 스크롤 작동, 카드는 9개 모두 `id="p1"`~`id="p9"`로 마운트 | High | Pending |
| FR-04 | `/pledges` 카드는 sample/gongyak.html의 num 박스(navy/indigo 교차)·카테고리 em 라벨·점 패턴(rotate 45°)을 충실히 재현 | High | Pending |
| FR-05 | `/about` bio에 `학력`/`전`/`현` 칩 + 6~9개 이력 row를 sample/index.html 235-241 라인 패턴으로 표시 | Medium | Pending |
| FR-06 | 메인·공약·소개·소식 페이지가 동일한 헤더/푸터/색상 토큰을 공유 (디자인 시스템 일관성) | High | Pending |
| FR-07 | 모바일(<= 820px) 레이아웃: hero grid 1열, 사이드 인덱스 가로 스크롤 chip 변환, 햄버거 메뉴 동작 | High | Pending |
| FR-08 | 페이지 메타 `title`/`description`을 sample 카피로 통일 ("이승효 · 일하는 사람의 시의원") | Medium | Pending |
| FR-09 | 9번째 약속(이문 차량사업소 등 공공 인프라 개발) — sample HTML에 없으므로 카드 디자인을 같은 패턴으로 신규 추가 | High | Pending |
| FR-10 | 기존 응원 메시지(Contact 컴포넌트) 폼은 페이지 하단 자리에 유지하되 버튼/입력 스타일만 새 토큰으로 통일 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | LCP < 2.5s, CLS < 0.1 (모바일 4G) | Lighthouse Mobile |
| Performance | 폰트 로딩으로 인한 FOIT 방지 (`display=swap`) | DevTools Network |
| Accessibility | 네비/CTA 키보드 포커스 가능, 색 대비 AA | axe DevTools |
| Compatibility | iOS Safari 16+, Chrome/Edge 최신, Galaxy 기본 브라우저 | 수동 확인 |
| SEO | OG 태그·description·canonical 정확 | `view-source:` 점검 |
| Bundle | 신규 의존성 추가 없음 (Tailwind v4 + inline `<style>` 유지) | `npm ls` 비교 |
| 보안 | sample HTML의 인라인 onclick(`document.getElementById…toggle`)을 React 상태로 변환 (XSS 표면 최소화) | 코드 리뷰 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 9개 공약 카드가 RTF 원문 그대로(오·탈자 없이) 렌더되고 anchor(`#p1`~`#p9`) 동작
- [ ] 데스크탑/모바일 두 폭(1280px·375px)에서 sample 레퍼런스와 시각적으로 95%+ 일치
- [ ] 기존 admin/login·donate/opinions POST 동작 변화 없음(회귀 테스트)
- [ ] `npm run build` 성공, `npm run lint` 무경고 (기존 base64 이미지 관련 경고 제외)
- [ ] `CLAUDE.md` 컨벤션(Tailwind v4 + 인라인 스타일 공존, base64 이미지 파일은 통째로 Read 금지) 준수
- [ ] Lighthouse Mobile Performance ≥ 80, Accessibility ≥ 90

### 4.2 Quality Criteria

- [ ] 모든 인라인 색상 hex는 CSS 변수 또는 sample 정의된 5색 팔레트만 사용
- [ ] 새 컴포넌트는 `src/components/`에 분리(navbar.tsx, hero.tsx, pledge-card.tsx 등)
- [ ] sample의 인라인 `<script onclick>`은 React state로 변환 — `dangerouslySetInnerHTML` 금지

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 9번째 약속 카드 디자인이 sample에 없어 톤이 어긋남 | Medium | High | sample의 `card.accent` 패턴(indigo num)을 재사용해 8·9번 동일 비주얼 그룹화 |
| 폰트 추가(Black Han Sans·Archivo)로 LCP 악화 | Medium | Medium | `next/font/google` 사용 + `display: swap` + preconnect 유지 |
| `SeunghyoApp.tsx`의 거대 base64 이미지로 편집 충돌 | High | Medium | `SeunghyoApp.tsx`를 분해: 이미지 상수는 `src/data/*-image.ts`에 이미 분리되어 있는 패턴 따라 더 잘게 쪼개고, JSX는 컴포넌트로 추출 |
| 진보당 레드(#E4032E)가 기존 admin UI(emerald/pink 그라데이션)와 충돌 | Low | High | admin 영역은 별도 디자인 시스템으로 격리(현재 layout.tsx의 sky-800 유지) — 공개 페이지만 새 토큰 적용 |
| RTF 원문 텍스트의 한자·특수기호 인코딩 오류 | Medium | Low | `textutil -convert txt`로 추출한 텍스트를 그대로 복붙, 한 줄 한 줄 사람 눈으로 검수 |
| 선거법상 광고문구 변경 시 후보 측 확인 필요 | High | Medium | 카피 변경분(메인 H1, CTA 등)은 PR 머지 전 후보 캠프 검토 받기 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | 정적 사이트, 포트폴리오 | ☐ |
| **Dynamic** | Feature-based + BaaS | Supabase 통합 풀스택 | ☑ |
| **Enterprise** | Strict layer separation | 대규모 시스템 | ☐ |

> 본 작업은 Dynamic 프로젝트의 **프론트엔드 디자인 시스템 갱신**에 한정. 백엔드 레이어는 손대지 않음.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js 16 / Remix | **Next.js 16.2.3** (현행 유지) | 이미 채택, App Router 사용 중 |
| State Management | Context / Zustand / 없음 | **없음(useState)** | 페이지별 폼 상태만 필요, 라이브러리 추가 가치 없음 |
| Styling | Tailwind / inline style / CSS-in-JS | **Tailwind v4 + 인라인 `<style>`/`style={{}}` 공존** | 현재 컨벤션 유지 (CLAUDE.md 명시) |
| Fonts | next/font/google / `<link>` / self-host | **next/font/google** | `Geist`가 이미 동일 패턴, FOIT 방지 |
| Data | 정적 TS export / JSON / CMS | **`src/data/site-data.ts` 정적** | 컨텐츠 변경 빈도 낮음, 빌드타임 최적화 |
| Form Handling | react-hook-form / native | **native useState** | 기존 `Contact` 패턴 유지 |
| Backend | Supabase(현행) | **변경 없음** | 본 작업 out of scope |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic (변경 없음)

폴더 변경 계획:
src/
├── app/                     # 라우팅 (그대로)
│   ├── page.tsx             # SeunghyoApp 동적 로드 유지
│   ├── SeunghyoApp.tsx      # 메인 컴포지션 — 히어로/약속 미리보기/응원 박스 분리
│   ├── about/page.tsx       # bio chip 패턴으로 재작성
│   ├── pledges/page.tsx     # sticky 인덱스 + 9 카드로 재작성
│   ├── news/, opinions/, donate/, admin/  # 시각만 통일, 로직 보존
│   └── layout.tsx           # 메타데이터/폰트만 갱신
├── components/
│   ├── navbar.tsx           # 진보당 뱃지 + 메뉴 (기존 라우팅 유지)
│   ├── hero.tsx             # (신규) sample/index.html 199-225 패턴
│   ├── pledge-card.tsx      # (신규) sample/gongyak.html 269-375 패턴
│   ├── pledge-index.tsx     # (신규) sticky 사이드 인덱스
│   ├── bio-row.tsx          # (신규) 학력/전/현 chip row
│   ├── contact.tsx          # 입력만 새 토큰으로
│   └── cheer-list.tsx       # 새 토큰 적용
├── data/
│   ├── site-data.ts         # PLEDGES 9개로 확장 + CAREERS 확장
│   └── *-image.ts           # base64 이미지 — 변경 없음
└── lib/                     # supabase·admin-auth — 변경 없음
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` 코딩 컨벤션 보유 (이번 세션에서 작성)
- [x] `AGENTS.md` Next.js 16 경고 보유
- [ ] `docs/01-plan/conventions.md` (없음 — 본 plan으로 충분)
- [x] `eslint.config.mjs` (flat config)
- [x] `tsconfig.json` (`@/*` → `src/*`)

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | kebab-case 파일명 (navbar.tsx, cheer-list.tsx) | 신규 컴포넌트도 동일 (pledge-card.tsx 등) | High |
| **색상 토큰** | 인라인 hex 산재 | `--red/--navy/--sky/--sky-soft/--sky-deep/--ink/--paper` 7개로 통일 | High |
| **폰트 토큰** | Geist + Noto Sans KR 혼재 | Black Han Sans(헤드라인) + Archivo(숫자/카테고리) + Noto Sans KR(본문) 3축 | High |
| **컴포넌트 분리** | 단일 거대 `SeunghyoApp.tsx` | 페이지별 컴포지션 + `components/` 재사용 | Medium |
| **이미지 처리** | base64 inline | 신규는 `public/` 권장, 기존은 유지 | Medium |

### 7.3 Environment Variables Needed

신규 환경 변수 없음. 기존 그대로 사용:

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Client | ☐ (기존) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key | Client | ☐ (기존) |
| `SUPABASE_SERVICE_ROLE_KEY` | service role | Server | ☐ (기존) |
| `ADMIN_PASSWORD` | admin 로그인 + HMAC 시크릿 | Server | ☐ (기존) |

### 7.4 Pipeline Integration

본 작업은 PDCA 단일 feature 사이클로 진행 (Phase 1~9 파이프라인 미사용).

---

## 8. Next Steps

1. [ ] `/pdca design site-renewal` — 9대 약속 데이터 구조 / 컴포넌트 트리 / CSS 토큰 / 페이지별 마크업 설계 문서 작성
2. [ ] 후보 캠프에 메인 H1 카피("내란세력 완전청산 / 동대문구 정치교체") 최종 확정 요청
3. [ ] `/pdca do site-renewal` — 데이터 파일 → 토큰/폰트 → 컴포넌트 → 페이지 순으로 구현
4. [ ] `/pdca analyze site-renewal` — sample HTML과 구현 결과 시각·텍스트 일치율 검증
5. [ ] `/pdca report site-renewal` — 변경 요약 + Lighthouse 결과 첨부

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-24 | Initial draft — sample HTML + 9promise RTF 기반 사이트 전면 개편 계획 | kcsvictory@gmail.com |
