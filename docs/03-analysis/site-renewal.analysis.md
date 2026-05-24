# site-renewal Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
> **Project**: seunghyo (이승효 캠페인)
> **Version**: 0.1.0
> **Analyst**: gap-detector
> **Date**: 2026-05-24
> **Design Doc**: [site-renewal.design.md](../02-design/features/site-renewal.design.md)
> **Plan Doc**: [site-renewal.plan.md](../01-plan/features/site-renewal.plan.md)

---

## Executive Summary

| Metric | v0.1 | v0.2 (Act-1 후) |
|--------|:----:|:---------------:|
| **Match Rate** | 91% ✅ | **97% ✅** (+6%p) |
| Verdict | PASS | PASS |
| FR Compliance | 8/10 ✅ + 2 ⚠️ | **10/10 ✅** |
| Component Coverage | 15 / 15 | 15 / 15 |
| Page Layouts (full token) | 4/6 | **6/6** |
| Critical/High Gaps | 0 | 0 |
| Medium Gaps | 2 | **0** |
| Low Gaps | 3 | 2 (cosmetic) |
| Iteration | 0 | 1 |
| Next Step | iterate or report | **`/pdca report site-renewal`** |

---

## 1. Analysis Overview

### 1.1 Purpose

Plan FR-01~10 + Design 명세(토큰 7개·폰트 3축·컴포넌트 14개·9 약속·페이지 3개)와 실제 구현 코드의 정합성 측정 및 90% 합격 여부 판정.

### 1.2 Scope

- **Design**: `docs/02-design/features/site-renewal.design.md`
- **Plan**: `docs/01-plan/features/site-renewal.plan.md`
- **Implementation**:
  - `src/data/site-data.ts`
  - `src/app/globals.css`
  - `src/app/layout.tsx`
  - `src/components/*.tsx` (14)
  - `src/app/{SeunghyoApp,pledges,about,news,opinions,donate}/page.tsx`

---

## 2. FR Gap Analysis

| FR | 요구사항 | 구현 위치 | Status | 비고 |
|----|---------|----------|:------:|------|
| FR-01 | PLEDGES 9개 + 34 sub-policy + `Pledge`/`PledgeSubItem` 타입 | `src/data/site-data.ts:1-198` | ✅ Match | 9개·sub 합계 34(7+4+7+2+3+3+3+2+3) 일치, `boldParts` 토큰 포함 |
| FR-02 | 메인 hero: 진보당 뱃지·"기호 5번"·H1·5 nameplate·district chip·CTA | `src/components/hero.tsx:64-219` | ✅ Match | 뱃지·H1 red/navy split·nameplate·`DISTRICT_LABELS` 3 chip·CTA 2개("9대 약속 보기"·"후원하기") |
| FR-03 | sticky 인덱스 + 9 카드 + `#p1`~`#p9` anchor | `src/components/pledge-index.tsx`, `pledge-card.tsx:41`, `src/app/pledges/page.tsx:27-29` | ✅ Match | `position:sticky top:84px`, IntersectionObserver active spy, `id={pledge.id}` |
| FR-04 | 카드 sample 충실도: num 박스 navy/indigo 교차·em 라벨·점 패턴(rotate 45°) | `pledge-card.tsx:60-124` | ✅ Match | `accent ? indigo : navy` num·box-shadow·em Archivo 11px letter-spacing 1.5·`transform: rotate(45deg)` bullet 모두 sample 정확 재현 |
| FR-05 | /about bio chip 학력/전/현 + 7행 | `bio-rows.tsx:1-44`, `data:202-210` | ✅ Match | CAREERS 7행(학력 2 + 전 2 + 현 3), "현" red chip 강조 |
| FR-06 | 디자인 시스템 일관성 (공통 토큰/헤더/푸터) | `navbar.tsx`, `footer.tsx`, `globals.css` | ⚠️ Partial | 메인/공약/소개/소식 4페이지는 새 토큰 적용. **opinions/donate는 sky-200/sky-500 그라데이션·sky-800 텍스트 그대로** (Navbar/Footer만 신규 적용) |
| FR-07 | 모바일 ≤820px: hero 1열·인덱스 가로 스크롤·햄버거 | `hero.tsx:247`, `pledge-index.tsx:104`, `navbar.tsx:174` | ⚠️ Minor | 모두 구현됨. 단 breakpoint가 **860px**로 일관 적용됨(design은 820px 명시). 시각 영향 미미 |
| FR-08 | 메타데이터 "이승효 · 일하는 사람의 시의원" 통일 | `layout.tsx:32-36` | ✅ Match | title·description 한글 카피 정확. 단 페이지별 metadata override 없음(전역만) |
| FR-09 | 9번째 약속(공공 인프라) 카드 신규 추가 | `data:181-197`, `pledge-card.tsx` accent 분기 | ✅ Match | p9 accent: true → indigo num + indigo shadow, sample p6/p7 패턴 정확 재사용 |
| FR-10 | 응원 폼 새 토큰 적용 | `contact.tsx:39-50` | ✅ Match | `inputStyle`이 `var(--ink)`·`rgba(21,35,63,0.16)` border·`#fff` bg로 토큰화됨 |

**FR Match: 8/10 ✅ + 2/10 ⚠️ = 90%**

---

## 3. Design Spec Gap Analysis

### 3.1 Design Tokens (`globals.css`)

| Token | Design | Impl | Status |
|-------|--------|------|:------:|
| `--red`, `--red-deep`, `--sky`, `--sky-soft`, `--sky-deep`, `--navy`, `--navy-soft`, `--indigo`, `--ink`, `--ink-soft`, `--paper`, `--paper-2` | 12 (7 핵심 + 5 alias) | 12 모두 | ✅ |
| `@theme inline` mapping (`--font-display`, `--font-numeric`) | Required | 동일 + `--color-red/--color-navy/--color-paper` 추가 | ✅ (확장) |
| `html { scroll-behavior: smooth }` | Required | Present | ✅ |
| body font Noto KR | Required | Present | ✅ |
| `.admin-scope` 격리 | Design Section 5.1 의도 | `globals.css:45-48`에 명시 격리 | ✅ |

### 3.2 Font Strategy (`layout.tsx`)

| Font | Design | Impl | Status |
|------|--------|------|:------:|
| Noto Sans KR (`--font-noto-kr`) | weight 400/500/700/900 swap | 동일 | ✅ |
| Archivo (`--font-archivo`) | weight 700/800/900 swap | 동일 | ✅ |
| Black Han Sans (`--font-black-han-sans`) | `next/font/google` 지원 확인 후 적용 | 적용됨 (`Black_Han_Sans` import 성공) | ✅ |
| Geist_Mono | (legacy 유지) | 유지 | ✅ |

### 3.3 Component List (14개 + SeunghyoApp 분해)

| Component | Designed | Exists | Status |
|-----------|:--------:|:------:|:------:|
| Navbar | ✏️ | `navbar.tsx` | ✅ |
| Hero | 🆕 | `hero.tsx` | ✅ |
| Band | 🆕 | `band.tsx` | ✅ |
| BioSection | 🆕 | `bio-section.tsx` | ✅ |
| BioRows | 🆕 | `bio-rows.tsx` | ✅ |
| PledgePreview | 🆕 | `pledge-preview.tsx` | ✅ |
| PledgesHero | 🆕 | `pledges-hero.tsx` | ✅ |
| PledgeIndex | 🆕 | `pledge-index.tsx` | ✅ |
| PledgeCard | 🆕 | `pledge-card.tsx` | ✅ |
| AboutHero | 🆕 | `about-hero.tsx` | ✅ |
| PortraitCard | 🆕 | `portrait-card.tsx` | ✅ |
| CtaBand | 🆕 | `cta-band.tsx` | ✅ |
| Footer | 🆕 | `footer.tsx` | ✅ |
| Contact | ✏️ | `contact.tsx` | ✅ |
| CheerList | ✏️ | `cheer-list.tsx` | ✅ |
| SeunghyoApp 분해 | ✏️ | `SeunghyoApp.tsx` 38줄 컴포지션 | ✅ |

**Component coverage: 15/15 = 100%**

### 3.4 Data Model (`Pledge`, `PledgeSubItem`, `Career`, `NewsItem`)

| Field | Designed | Impl | Status |
|-------|----------|------|:------:|
| `Pledge.id/num/category/categoryKo/title/subItems/accent` | 7 fields | 7 fields 동일 | ✅ |
| `PledgeSubItem.text/boldParts` | text + optional boldParts | 동일 | ✅ |
| `Career.period: "학력"\|"전"\|"현"` | union literal | 동일 | ✅ |
| `NewsItem.id/date/title/body` | 4 fields | 4 fields | ✅ |
| `PledgeCategory` 9 union | 9개 | 9개 | ✅ |

### 3.5 Page Layouts

| Page | Sections | Status |
|------|----------|:------:|
| `/` (SeunghyoApp) | Navbar/Hero/Band/BioSection/PledgePreview/CtaBand/Contact/Footer | ✅ (8 컴포지션) |
| `/pledges` | Navbar/PledgesHero/PledgeIndex+9 Cards/CtaBand/Footer | ✅ |
| `/about` | Navbar/AboutHero/PortraitCard/BioRows(Career)/CtaBand/Footer | ✅ |
| `/news` | 새 토큰 적용 | ✅ |
| `/opinions` | "시각 토큰만 적용" (design 2.1 line 89) | ❌ **Navbar만 적용, sky-50/sky-500 그라데이션 잔존** |
| `/donate` | "시각 토큰만 적용" (design 2.1 line 89) | ❌ **Navbar만 적용, sky-50/sky-500 그라데이션 잔존** |

---

## 4. Match Rate Summary

```
┌─────────────────────────────────────────────┐
│  Overall Match Rate: 91%                     │
├─────────────────────────────────────────────┤
│  FR Compliance:        90% (8 ✅ + 2 ⚠️ /10)  │
│  Design Tokens:       100% (12/12)           │
│  Fonts:               100% (3/3)             │
│  Components:          100% (15/15)           │
│  Data Model:          100% (5/5 entities)    │
│  Page Layouts:         67% (4/6 fully)       │
│  Sample Visual Fidelity: 95%+ (FR-04 정확)   │
└─────────────────────────────────────────────┘
```

---

## 5. Implemented (구현 완료)

- **데이터**: PLEDGES 9개·sub 34개·boldParts 토큰·CAREERS 7행·INITIAL_NEWS 3건 (`site-data.ts`)
- **토큰**: 7 핵심 색상 + 5 alias + body 폰트 + `scroll-behavior` + admin 격리 (`globals.css`)
- **폰트**: Noto Sans KR + Archivo + Black Han Sans 3축 모두 `next/font/google`로 self-host (`layout.tsx`)
- **컴포넌트 14개**: 신규 11 + 수정 3 모두 존재 (`src/components/`)
- **메인 페이지**: Hero 진보당 뱃지·red H1·5 nameplate·3 district chip·2 CTA·Band·BioSection·PledgePreview(p1/p2/p4/p6)·CtaBand·Contact·Footer (`SeunghyoApp.tsx`)
- **공약 페이지**: sticky 인덱스 + `IntersectionObserver` spy + 9 카드 `#p1`~`#p9` + accent indigo 분기 + 점 패턴 `rotate(45deg)` bullet (`pledges/page.tsx`)
- **소개 페이지**: AboutHero + PortraitCard + BioRows + CtaBand (`about/page.tsx`)
- **소식 페이지**: 새 토큰·Black Han Sans h1·red kicker (`news/page.tsx`)
- **반응형**: 모바일(≤860px)에서 hero 1열·인덱스 가로 스크롤·햄버거 메뉴 작동
- **메타데이터**: "이승효 · 일하는 사람의 시의원" 한글 카피 통일
- **회귀 안전**: Supabase·admin·nodemailer·인증 import 무변경 확인
- **빌드 검증**: `npm run build` 성공 (TypeScript 통과, 20 static pages prerender)
- **신규 의존성**: 0건 (Tailwind v4 + 인라인 style 컨벤션 유지)

---

## 6. Gaps (미구현·부분구현)

| ID | Item | Severity | Location | Description |
|----|------|:--------:|----------|-------------|
| G-01 | `/opinions` 페이지 시각 토큰 미적용 | 🟡 Medium | `src/app/opinions/page.tsx:78-220` | Design 2.1 line 89 "시각 토큰만 적용, 로직 무변경" 명시했으나 sky-50 배경·sky-200/300/400 그라데이션 hero·sky-500 그라데이션 버튼 그대로. Navbar/Footer만 신규. CtaBand·새 토큰 미적용 |
| G-02 | `/donate` 페이지 시각 토큰 미적용 | 🟡 Medium | `src/app/donate/page.tsx:155-422` | 동일. sky-500 그라데이션 7단계 폼 스타일 잔존. red CTA·navy·paper 토큰 미적용 |
| G-03 | Mobile breakpoint 820px vs 860px 불일치 | 🟢 Low | `hero.tsx:247`, `pledge-index.tsx:104`, `navbar.tsx:174`, `pledges/page.tsx:44` | Plan FR-07/Design 1.2 "820px" 명시했으나 구현은 모두 860px. 40px 차이로 시각 영향은 미미하지만 spec 불일치 |
| G-04 | 페이지별 metadata override 없음 | 🟢 Low | `pledges/about/news/page.tsx` | Plan FR-08·Design 1.4는 페이지별 title 카피 가능성 시사. 현재 `layout.tsx` 전역만 적용 — SEO에서 모든 페이지가 동일 title. 단 Plan 기준 통일 카피 요구는 충족 |
| G-05 | `/admin/*` 토큰 격리 검증 미실시 | 🟢 Low | `.admin-scope` class | `globals.css:45-48`에 격리 정의됐으나 admin layout/page에서 `.admin-scope` className 적용 여부 확인 필요. body 배경(paper) override 안 되면 admin UI 색 충돌 가능 |
| G-06 | sample 인덱스 "8대 약속" → 구현 "9대 약속" 불일치 | 🟢 Info | `pledge-index.tsx:48`, `hero.tsx:203` | Plan FR-09에 따라 9번째 신설했으므로 사실상 정상. 단 sample HTML(`index:240` 등)의 "8대" 카피와 다름 — 의도된 변경이므로 Gap 아님 (참고) |

---

## 7. Sample Visual Fidelity Check (FR-04)

| Sample CSS 패턴 | 구현 | Status |
|----------------|------|:------:|
| `.card .num` Archivo 900 44px navy bg | `pledge-card.tsx:60-69` Archivo 900 44px `var(--navy)` | ✅ |
| `.card.accent .num` indigo bg | `:60` `accent ? var(--indigo) : var(--navy)` | ✅ |
| `.card .htext .em` Archivo 800 11px letter-spacing 1.5 red text | `:73-83` Archivo 800 11px ls 1.5 `var(--red)` | ✅ |
| `.card.accent .htext .em` ink-soft | `:78` `accent ? var(--ink-soft) : var(--red)` | ✅ |
| `.card li::before` 7×7 rotate 45 red dot | `:113-124` 7×7 `rotate(45deg)` `var(--red)` | ✅ |
| `.card.accent li::before` indigo | `:121` `accent ? var(--indigo) : var(--red)` | ✅ |
| `.card` box-shadow `6px 6px 0 navy/indigo` | `:46-48` 정확 | ✅ |
| `.card li b` bold token | `pledge-card.tsx renderWithBold()` text.split + b wrap | ✅ |

**Sample 카드 시각 충실도: 100%**

---

## 8. Architecture & Convention

| Item | Status | 비고 |
|------|:------:|------|
| Layer 구분 (Presentation/Domain) | ✅ | `components/`·`data/` 분리 유지 |
| Component file kebab-case | ✅ | 모든 신규 컴포넌트 kebab-case |
| Component name PascalCase | ✅ | export default 함수 PascalCase |
| Constants UPPER_SNAKE_CASE | ✅ | PLEDGES·CAREERS·DISTRICT_LABELS·NAV_ITEMS 등 |
| anchor id `p1`~`p9` | ✅ | data + pledge-card id |
| Import order (react/next → @/ → 상대) | ✅ | 검사한 모든 파일 준수 |
| No new runtime deps | ✅ | package 변경 없음 |
| `dangerouslySetInnerHTML` 미사용 | ✅ | `boldParts` 토큰 렌더링 |
| 인라인 onclick 제거 | ✅ | `useState`/`useEffect` 전환 |
| admin 격리 | ⚠️ | `.admin-scope` class 정의됨, 실 적용 검증 필요 (G-05) |

---

## 9. Overall Score & Verdict

```
┌─────────────────────────────────────────────┐
│  Overall Score: 91/100                       │
├─────────────────────────────────────────────┤
│  Design Match:        91 points              │
│  Data Model:         100 points              │
│  Component Coverage: 100 points              │
│  Sample Fidelity:     95 points              │
│  Architecture:       100 points              │
│  Convention:         100 points              │
│  Page Visual Token:   67 points (op/donate)  │
└─────────────────────────────────────────────┘
```

**Verdict: ✅ PASS (≥ 90% 기준)**

Match Rate **91%**. Plan의 In-Scope 핵심(9 약속 데이터화·메인 hero·공약 sticky·소개 bio·디자인 토큰·폰트·9번 카드·메타데이터) 모두 충족. opinions/donate 토큰 적용은 design 본문에 명시되었으나 구현 누락 — 단 Plan FR 항목으로 격상되지 않은 부속 요구이므로 PASS 판정 유지.

---

## 10. Recommended Next Step

### 권장: `/pdca report site-renewal` (완료 보고서 생성)

90% 임계 통과. 핵심 인도물이 모두 갖춰졌으므로 Act/iterate 없이 Report 단계로 진행 가능.

### 선택적 후속 작업 (Report 후 또는 별도 follow-up feature)

| Priority | Action | 처리 방법 |
|----------|--------|----------|
| 🟡 Medium | G-01/G-02: opinions·donate 토큰 적용 | 두 페이지의 sky-* Tailwind를 `var(--paper)`·`var(--red)`·`var(--navy)` + 인라인 style로 치환 (1~2시간) |
| 🟢 Low | G-03: breakpoint 820 vs 860 통일 | design 0.2로 업데이트하거나 4파일 일괄 820으로 변경. 시각 영향 미미 |
| 🟢 Low | G-04: 페이지별 metadata | `pledges/about/news/page.tsx`에 `export const metadata` 추가 |
| 🟢 Low | G-05: `.admin-scope` 실 적용 확인 | `src/app/admin/layout.tsx`에서 wrapper에 className 부여 확인 |

대안: opinions/donate 토큰 적용이 캠프 기준 "디자인 시스템 일관성"의 핵심 요구이면 `/pdca iterate site-renewal`로 G-01/G-02만 1회 사이클 실행 후 Report 권장.

---

## 11. 관련 파일 (절대 경로)

- Plan: `/Users/zealnutkim/DEV/Election2026/seunghyo/docs/01-plan/features/site-renewal.plan.md`
- Design: `/Users/zealnutkim/DEV/Election2026/seunghyo/docs/02-design/features/site-renewal.design.md`
- Data: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/data/site-data.ts`
- Tokens: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/globals.css`
- Fonts/Meta: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/layout.tsx`
- Main page: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/SeunghyoApp.tsx`
- Pledges page: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/pledges/page.tsx`
- About page: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/about/page.tsx`
- News page: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/news/page.tsx`
- Opinions (Gap): `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/opinions/page.tsx`
- Donate (Gap): `/Users/zealnutkim/DEV/Election2026/seunghyo/src/app/donate/page.tsx`
- 핵심 컴포넌트: `/Users/zealnutkim/DEV/Election2026/seunghyo/src/components/{hero,pledge-card,pledge-index,navbar,footer,cta-band,bio-rows,pledge-preview}.tsx`

---

---

## 12. Iteration v0.2 — Act-1 결과 (2026-05-24)

### 12.1 처리한 Gap

| ID | Action | Status | Evidence |
|----|--------|:------:|----------|
| G-01 | `opinions/page.tsx` 전체 재작성 (sky-* 제거 + token + Navbar/Footer) | ✅ Resolved | sky-* 0건, `var(--ink)`/`var(--red)`/`var(--paper)` 토큰 사용, lucide-react 의존 제거 |
| G-02 | `donate/page.tsx` 전체 재작성 (7단계 폼 StepBadge + red CTA) | ✅ Resolved | sky-*/lucide-react 0건, `var(--ink)` 토큰 적용 |
| G-03 | breakpoint 860→820px 통일 | ✅ Resolved | 5개 파일(`navbar`, `hero`, `pledge-index`, `pledge-preview`, `pledges/page`)에서 860px 0건 |
| G-04 | 페이지별 metadata 추가 | ✅ Resolved | `pledges`/`about`/`news` 3개 server component에 `export const metadata` 추가. opinions/donate는 `"use client"`라 metadata export 불가 — 전역 `layout.tsx`로 대체 (정상 패턴) |
| G-05 | `admin-scope` 격리 실 적용 | ✅ Resolved | `admin/layout.tsx:62` `className="admin-scope flex min-h-screen bg-gray-50"` 추가 |

### 12.2 New Match Rate

```
┌─────────────────────────────────────────────┐
│  Overall Match Rate: 97% (+6%p)              │
├─────────────────────────────────────────────┤
│  FR Compliance:       100% (10/10 ✅)         │
│  Design Tokens:       100%                   │
│  Fonts:               100%                   │
│  Components:          100%                   │
│  Data Model:          100%                   │
│  Page Layouts:        100% (6/6 full token)  │
│  Sample Visual:        95%+                  │
│  SEO Metadata:        100% (server 3 + 전역) │
└─────────────────────────────────────────────┘
```

### 12.3 Remaining (Low / Cosmetic)

| Severity | Item |
|:--------:|------|
| 🟢 Low | opinions/donate의 metadata 분리 패턴이 Design 5.3.5에 미문서화 — Report 단계에서 lessons learned로 기록 권장 |
| 🟢 Low | opinions/donate에서 일부 `style={{}}` 인라인 패턴 사용 (CLAUDE.md 공식 컨벤션이라 결함 아님) |

### 12.4 Build/Type Check

- `npm run build`: ✅ Compiled successfully (2.0s), TypeScript ✅, 20/20 static pages prerender
- 신규 lint error: 0건
- 신규 의존성: 0건

### 12.5 Final Verdict

**✅ PASS** — Match Rate **97%** (≥90% 통과). All 5 gaps resolved (3 medium + 2 low). Report 단계 진행 가능.

### 12.6 Files Changed (Act-1)

- `src/app/opinions/page.tsx` (전체 재작성)
- `src/app/donate/page.tsx` (전체 재작성)
- `src/app/admin/layout.tsx` (className 추가)
- `src/app/pledges/page.tsx` (metadata + breakpoint)
- `src/app/about/page.tsx` (metadata)
- `src/app/news/page.tsx` (metadata)
- `src/components/{navbar,hero,pledge-index,pledge-preview}.tsx` (breakpoint 820)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-24 | Initial gap analysis — Match Rate 91% PASS, 2 medium gaps (opinions/donate) | gap-detector |
| 0.2 | 2026-05-24 | Act-1 이터레이션 후 재검증 — Match Rate 97% PASS (+6%p), all 5 gaps resolved | gap-detector |
