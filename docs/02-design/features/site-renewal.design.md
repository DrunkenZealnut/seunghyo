# site-renewal Design Document

> **Summary**: 진보당 레드+네이비 디자인 토큰·3축 폰트 시스템·재사용 컴포넌트 트리·9대 약속 데이터 모델을 정의하고, 페이지별 마크업/상호작용 명세를 확정한다.
>
> **Project**: seunghyo (이승효 후보 공식 홈페이지)
> **Version**: 0.1.0
> **Author**: kcsvictory@gmail.com
> **Date**: 2026-05-24
> **Status**: Draft
> **Planning Doc**: [site-renewal.plan.md](../../01-plan/features/site-renewal.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A (백엔드 변경 없음) |
| Phase 2 | Coding Conventions | N/A (CLAUDE.md/AGENTS.md로 갈음) |
| Phase 3 | Mockup | ✅ `sample/index.html`, `sample/gongyak.html` |
| Phase 4 | API Spec | N/A (API 변경 없음) |

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 현재 4개 공약·단일 스카이톤·emoji 아이콘은 9대 약속(34개 세부정책)의 정책 깊이와 진보당 "기호 5번" 정체성을 전달하지 못하며, 거대 단일 `SeunghyoApp.tsx`는 분해되지 않아 협업·재사용이 어렵다. |
| **Solution** | 7개 CSS 변수 토큰(`--red/--red-deep/--navy/--sky/--sky-soft/--sky-deep/--paper`) + 3축 폰트(Black Han Sans·Archivo·Noto Sans KR)를 `globals.css`에 정의하고, `hero/pledge-card/pledge-index/bio-row/cta-band` 5개 신규 컴포넌트와 `Pledge` 타입(9개 항목·34개 sub-policy)으로 페이지 3개(`/`, `/pledges`, `/about`)를 재구성. 백엔드·admin·기존 폼 로직은 무변경. |
| **Function/UX Effect** | (a) 데스크탑 sticky 인덱스 + 9 카드 anchor 스크롤 (b) 모바일은 인덱스를 가로 스크롤 chip으로 자동 변환 (c) 메인 진입 30초 내 "진보당 기호 5 · 동대문구 · 이승효 · 9대 약속" 인지 가능 (d) `IntersectionObserver`로 카드 등장 애니메이션·인덱스 active 상태 자동 동기화. |
| **Core Value** | 디자인 토큰·컴포넌트 분리로 **선거 D-day까지의 컨텐츠 수정 비용을 줄이면서**, 후보 정체성과 정책 깊이를 시각 일관성으로 증명하는 프론트엔드 디자인 시스템 확립. |

---

## 1. Overview

### 1.1 Design Goals

1. **시각 일관성**: sample 2개 HTML의 색·타이포·여백을 단일 토큰/컴포넌트 세트로 통합해 페이지 간 드리프트 제거.
2. **컨텐츠 데이터화**: 9대 약속을 `src/data/site-data.ts` 단일 export로 모델링해 추후 카피 수정이 데이터 한 곳에서 끝나도록 한다.
3. **거대 파일 분해**: `SeunghyoApp.tsx`(~385줄)에서 JSX 컴포지션을 `components/`로 추출하고, base64 이미지 상수는 `src/data/*-image.ts` 패턴을 따른다.
4. **React-네이티브 상호작용**: sample HTML의 인라인 `onclick`/`querySelectorAll`을 `useState`/`useEffect`/`IntersectionObserver` 훅으로 치환해 XSS 표면을 줄인다.
5. **백엔드 무변경 보증**: Supabase·HMAC·admin·nodemailer 코드는 import 그대로 유지, 회귀 0건.

### 1.2 Design Principles

- **Tokens over hex**: 신규 색상은 반드시 CSS 변수로만 참조. 기존 `#29ABE2` 하드코딩은 점진 제거.
- **Composition over duplication**: 카드/뱃지/CTA는 컴포넌트로 분리, 페이지는 데이터만 매핑.
- **Mobile-first breakpoint**: 모바일 디폴트 + `@media (min-width: 820px)`로 데스크탑 확장(반대 아님).
- **Preserve admin isolation**: `/admin/*`는 기존 sky-800 톤 유지(공개 페이지 토큰과 격리).
- **No new runtime deps**: Tailwind v4 + 인라인 style 공존 컨벤션 유지, 패키지 추가 0건.

---

## 2. Architecture

### 2.1 Component Diagram

```
┌────────────────────────────────────────────────────────────┐
│  src/app/layout.tsx                                        │
│  ├─ next/font/google × 3 (Black Han Sans, Archivo, Noto KR)│
│  └─ Metadata (sample copy)                                 │
└────────────────────────────────────────────────────────────┘
       │
       ├──► src/app/page.tsx ──► SeunghyoApp.tsx (composition)
       │                          ├─ <Navbar activePage="홈"/>
       │                          ├─ <Hero/>            ◄── 신규
       │                          ├─ <Band/>             ◄── 신규
       │                          ├─ <BioSection/>       ◄── 신규
       │                          ├─ <PledgePreview/>    ◄── 신규
       │                          ├─ <CtaBand/>          ◄── 신규
       │                          ├─ <Contact/>          ◄── 기존
       │                          └─ <Footer/>           ◄── 신규
       │
       ├──► src/app/pledges/page.tsx
       │      ├─ <Navbar activePage="공약"/>
       │      ├─ <PledgesHero/>         ◄── 신규 (kicker + sub copy)
       │      ├─ <PledgeIndex/>         ◄── 신규 sticky aside
       │      ├─ <PledgeCard× 9>        ◄── 신규
       │      ├─ <CtaBand/>             ◄── 재사용
       │      └─ <Footer/>              ◄── 재사용
       │
       ├──► src/app/about/page.tsx
       │      ├─ <Navbar activePage="소개"/>
       │      ├─ <AboutHero/>           ◄── 신규
       │      ├─ <BioRows/>             ◄── 신규 (학력/전/현 chip)
       │      └─ <Footer/>              ◄── 재사용
       │
       └──► /news, /opinions, /donate, /admin/* (시각 토큰만 적용, 로직 무변경)
```

### 2.2 Data Flow

```
Build time:
  src/data/site-data.ts  (정적 export)
        │
        ▼
  Server Component render → HTML (정적 마크업)
        │
        ▼
  Client hydration (useState, IntersectionObserver)
        │
        ▼
  사용자 인터랙션 (anchor scroll, mobile menu, card observer)

Runtime (변경 없음):
  Contact 폼 ──► POST /api/cheers ──► supabase.from("cheers")
  Opinion 폼 ──► POST /api/opinions ─► supabase.from("opinions")
  Donate 폼  ──► POST /api/donations + /api/notify
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `Hero` | `PARTY_BADGE` 상수, `HERO_POSTER_IMG` | 메인 nameplate + district chip |
| `PledgeIndex` | `PLEDGES[]` | sticky 인덱스 anchor 생성 |
| `PledgeCard` | `Pledge` 타입 | 단일 약속 카드 (num + em + h2 + bullets) |
| `PledgePreview` | `PLEDGES[]` (curated 4개) | 메인 미리보기 4 카드 |
| `BioRows` | `CAREERS[]` (확장) | `학력/전/현` chip row |
| `Footer` | `NAV_ITEMS`, `DISTRICT_LABEL` | 공통 푸터 |
| 모든 컴포넌트 | `globals.css` CSS 변수 | 색·폰트 토큰 |
| `layout.tsx` | `next/font/google` | 폰트 변수 주입 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// src/data/site-data.ts

export type PledgeCategory =
  | "Transit"         // 교통
  | "Care"            // 돌봄
  | "Youth-Women"     // 청년·여성
  | "Housing"         // 주거
  | "Dongbu"          // 동부간선
  | "Labor"           // 노동
  | "Small-Business"  // 자영업·소상공인
  | "Politics"        // 정치혁신
  | "Infra";          // 공공 인프라 개발 (9번째, sample에 없음)

export interface Pledge {
  /** anchor id: "p1" ~ "p9" */
  id: string;
  /** 2자리 표시 번호: "01" ~ "09" */
  num: string;
  /** 카테고리 영문 라벨 (카드 em 영역) */
  category: PledgeCategory;
  /** 카테고리 한글 부제 (em 우측 · 표기) */
  categoryKo: string;
  /** 약속 제목 (카드 h2) */
  title: string;
  /** 세부 정책 bullet (마크다운 굵게는 b 태그로 분해) */
  subItems: PledgeSubItem[];
  /** 카드 스타일: indigo num 박스 사용 (sample p6/p7 패턴) */
  accent?: boolean;
}

export interface PledgeSubItem {
  /** 본문 — `<b>` 텍스트는 `boldParts` 인덱스로 분리 */
  text: string;
  /** `text` 내에서 굵게 처리할 토큰 (정확 매칭) */
  boldParts?: string[];
}

export interface Career {
  /** "학력" | "전" | "현" */
  period: "학력" | "전" | "현";
  /** 이력 본문 */
  label: string;
}

export interface NewsItem {
  id: number;
  date: string;   // "YYYY.MM.DD"
  title: string;
  body: string;
}
```

### 3.2 Entity Relationships

```
SitePage ─ 1 ─ N Pledge
              │
              └─ 1 ─ N PledgeSubItem

SitePage(About) ─ 1 ─ N Career

SitePage(News) ─ 1 ─ N NewsItem
```

순수 정적 데이터 — 외래키·DB 저장 없음. Supabase의 `cheers/opinions/donations` 테이블은 변경 없이 그대로 사용.

### 3.3 Database Schema

본 작업은 데이터베이스 변경 없음. 기존 마이그레이션(`supabase/migrations/001_create_seunghyo_schema.sql`) 그대로 유지.

### 3.4 PLEDGES 9개 데이터 (확정 카피)

> 원본: `sample/9promise.rtf` (권위) + `sample/gongyak.html` (디자인 참조)
> 9번째 약속은 RTF에만 있음 — sample HTML의 `card.accent` 패턴을 재사용해 신규 작성.

| id | num | category | categoryKo | title | subItems 수 | accent |
|----|-----|----------|-----------|-------|:----------:|:------:|
| p1 | 01 | Transit | 교통 | 편안한 출퇴근, 다니기 좋은 우리 동네 | 7 | - |
| p2 | 02 | Care | 돌봄 | 아이 키우기 좋게, 어르신이 건강하게 | 4 | - |
| p3 | 03 | Youth-Women | 청년·여성 | 청년이 떠나는 동네가 아니라, 청년이 사는 동대문 | 7 | - |
| p4 | 04 | Housing | 주거 | 전세사기 입증을 세입자가 책임지지 않도록 | 2 | - |
| p5 | 05 | Dongbu | 동부간선 | 동부간선 지하화, 주민과 함께 다시 | 3 | - |
| p6 | 06 | Labor | 노동 | 노동이 존중받는 동대문 만들기 | 3 | ✓ |
| p7 | 07 | Small-Business | 자영업·소상공인 | 자영업자·소상공인의 버팀목이 필요해 | 3 | ✓ |
| p8 | 08 | Politics | 정치혁신 | 내란세력 완전 청산! 동대문구 정치교체! | 2 | - |
| p9 | 09 | Infra | 공공 인프라 개발 | 우리 동네 큰 땅을 공공의 자산으로 | 3 | ✓ |

**합계**: 9개 약속 × 34개 sub-policy (7+4+7+2+3+3+3+2+3 = 34)

> Note: plan 문서의 `categoryEn` 필드는 `category`로 단순화하고 한글 부제는 별도 필드(`categoryKo`)로 분리 — 카드 em 라벨 디자인을 영문/한글 둘 다 지원하기 위함.

### 3.5 CAREERS 확장 (sample/index.html 233-241 라인 패턴)

| period | label |
|--------|-------|
| 학력 | 광주 고려고등학교 졸업 |
| 학력 | 동국대학교 국어교육과 졸업 |
| 전 | 동국대학교 총학생회 부총학생회장 |
| 전 | 학교급식법 개정 100만 청원운동본부 언론홍보팀 총괄 |
| 현 | 진보당 달빛어린이병원 추진 공동운동본부장 |
| 현 | 진보당 동대문지역위 민생위원장 |
| 현 | 민주노총 서비스연맹 정책국장 |

7행 (sample 6행 + 학교급식법 1행). 추가 이력은 캠프 확인 후 보강.

---

## 4. API Specification

API 변경 없음. 기존 라우트 100% 유지:

| Route | Method | Purpose | Status |
|-------|--------|---------|--------|
| `/api/cheers` | POST | 응원 메시지 등록 | 변경 없음 |
| `/api/opinions` | POST | 주민 의견 등록 | 변경 없음 |
| `/api/donations` | POST | 후원금 신청 | 변경 없음 |
| `/api/notify` | POST | 이메일 알림 | 변경 없음 |
| `/api/admin/login` | POST | HMAC 토큰 발급 | 변경 없음 |
| `/api/admin/data` | GET/POST/PUT/DELETE | 멀티플렉스 admin CRUD | 변경 없음 |

신규 API 없음. `PLEDGES`는 빌드타임 정적 export로 처리.

---

## 5. UI/UX Design

### 5.1 Design Tokens (`globals.css` 추가)

```css
:root {
  /* === Color tokens (sample/gongyak.html :root와 동일) === */
  --red: #E4032E;          /* 진보당 레드 (포인트·CTA) */
  --red-deep: #B30021;     /* CTA hover */
  --sky: #BFE0F4;
  --sky-soft: #DCEFFB;
  --sky-deep: #5BA7DC;     /* district chip border */
  --navy: #15233F;         /* 본문·헤드라인 색 */
  --navy-soft: #33476e;
  --indigo: #221D7A;       /* accent 카드 num 박스 */
  --ink: #15233F;          /* alias */
  --ink-soft: #33476e;     /* alias */
  --paper: #F2F8FE;        /* 페이지 배경 */
  --paper-2: #E6F2FB;

  /* 기존 토큰 유지 — admin 페이지가 사용 */
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-noto-kr);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-black-han-sans);
  --font-numeric: var(--font-archivo);
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-noto-kr), 'Apple SD Gothic Neo', sans-serif;
  -webkit-font-smoothing: antialiased;
}

html { scroll-behavior: smooth; }
```

### 5.2 Font Strategy (`layout.tsx`)

```typescript
import { Noto_Sans_KR, Archivo } from "next/font/google";
import localFont from "next/font/local";  // Black Han Sans는 next/font/google에 없을 수 있음 — fallback 검토

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const blackHanSans = Black_Han_Sans({  // next/font/google에 포함 — 확인 필요
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-black-han-sans",
  display: "swap",
});
```

> **Decision**: `next/font/google`이 Black Han Sans를 지원하면 사용(권장), 아니면 `<link>` 태그를 `layout.tsx` `<head>`에 추가하되 `preconnect` + `display=swap` 명시. Do 단계 첫 작업으로 확인.

### 5.3 Screen Layouts

#### 5.3.1 `/` (메인)

```
┌─────────────────────────────────────────────┐
│ <Navbar> 진보당 빨강 + 이승효 + 6 메뉴       │
├─────────────────────────────────────────────┤
│ <Hero> (sky gradient + dot pattern + red line)│
│ ┌───────────────────┐ ┌───────────────────┐ │
│ │ badge 기호 5번    │ │                   │ │
│ │ h1 내란세력 청산 │ │   포스터 이미지   │ │
│ │ nameplate [5][이승효]│ │                │ │
│ │ district chip × 3 │ │                   │ │
│ │ CTA 8대 약속 보기 │ │                   │ │
│ └───────────────────┘ └───────────────────┘ │
├─────────────────────────────────────────────┤
│ <Band> 한 줄 카피                           │
├─────────────────────────────────────────────┤
│ <BioSection> 학력/전/현 6행                 │
├─────────────────────────────────────────────┤
│ <PledgePreview> 4 카드 (p1, p2, p4, p6)     │
│ + "9대 약속 전체 보기" CTA                  │
├─────────────────────────────────────────────┤
│ <CtaBand> 의견 보내기 / 응원 보내기         │
├─────────────────────────────────────────────┤
│ <Contact> 기존 응원 메시지 폼 (유지)        │
├─────────────────────────────────────────────┤
│ <CheerList> 기존 응원 리스트 (유지)         │
├─────────────────────────────────────────────┤
│ <Footer>                                    │
└─────────────────────────────────────────────┘
```

#### 5.3.2 `/pledges` (공약)

```
데스크탑 (≥820px):
┌─────────────────────────────────────────────┐
│ <Navbar activePage="공약">                  │
├─────────────────────────────────────────────┤
│ <PledgesHero> kicker + h1 + sub + tag chip │
├─────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────────────────────┐  │
│ │ <PledgeIndex>│ <PledgeCard p1>          │  │
│ │ sticky   │ │ ┌──┐ Transit · 교통       │  │
│ │ 9 anchor │ │ │01│ 편안한 출퇴근…       │  │
│ │ (active  │ │ └──┘ ─────────────────    │  │
│ │  spy)    │ │ • 대중교통 노선 배차…    │  │
│ │ 230px    │ │ • <b>외대앞역…</b>        │  │
│ │          │ │ ...                        │  │
│ │          │ ├──────────────────────────┤  │
│ │          │ │ <PledgeCard p2> ... p9    │  │
│ └──────────┘ └──────────────────────────┘  │
├─────────────────────────────────────────────┤
│ <CtaBand>                                   │
├─────────────────────────────────────────────┤
│ <Footer>                                    │
└─────────────────────────────────────────────┘

모바일 (<820px):
┌────────────────────┐
│ <Navbar>           │
├────────────────────┤
│ <PledgesHero>      │
├────────────────────┤
│ <PledgeIndex>      │
│ (가로 scroll chip) │
│ → ← swipe          │
├────────────────────┤
│ <PledgeCard p1>    │
│ ...                │
│ <PledgeCard p9>    │
├────────────────────┤
│ <CtaBand>          │
│ <Footer>           │
└────────────────────┘
```

#### 5.3.3 `/about` (소개)

```
┌─────────────────────────────────────────────┐
│ <Navbar activePage="소개">                  │
├─────────────────────────────────────────────┤
│ <AboutHero>                                 │
│ kicker · h1 "현장에서 일해 온 사람"         │
├─────────────────────────────────────────────┤
│ <PortraitCard> 사진 + chip 3개 + 자기소개   │
├─────────────────────────────────────────────┤
│ <BioRows>                                   │
│ [학력] 광주 고려고…                         │
│ [학력] 동국대 국어교육과…                   │
│ [전]   동국대 부총학생회장                  │
│ [전]   학교급식법 100만 청원…               │
│ [현]   진보당 달빛어린이병원…               │
│ [현]   진보당 민생위원장                    │
│ [현]   민주노총 정책국장                    │
├─────────────────────────────────────────────┤
│ <CtaBand>                                   │
│ <Footer>                                    │
└─────────────────────────────────────────────┘
```

### 5.4 User Flow

```
1. 첫 방문 (메인):
   진입 → 히어로 "기호 5번 이승효" 인지 (3초)
        → district chip로 선거구 확인 (5초)
        → 약속 미리보기 4 카드 스캔 (15초)
        → "9대 약속 전체 보기" 클릭 → /pledges
                                    또는
        → 응원 메시지 작성 → /api/cheers POST

2. 공약 페인지:
   진입 → sticky 인덱스로 관심 영역(예: 교통) 점프 → #p1 anchor
        → 카드 IntersectionObserver로 등장 애니메이션
        → 인덱스 active 표시 동기화 (spy)
        → CTA "의견 보내기" → /opinions

3. 모바일:
   햄버거 클릭 → 메뉴 dropdown → 페이지 이동 → dropdown 자동 닫힘
   pledges 가로 스크롤 chip 인덱스 → tap → anchor
```

### 5.5 Component List (신규 + 변경)

| Component | Location | Responsibility | New/Modified |
|-----------|----------|----------------|:------------:|
| `Navbar` | `src/components/navbar.tsx` | 진보당 뱃지·이승효 cand·메뉴·burger·bottom nav | ✏️ 수정 |
| `Hero` | `src/components/hero.tsx` | 메인 히어로 (sky gradient + 뱃지 + nameplate + district + CTA) | 🆕 신규 |
| `Band` | `src/components/band.tsx` | 한 줄 카피 밴드 | 🆕 신규 |
| `BioSection` | `src/components/bio-section.tsx` | 메인용 약력 6행 (eyebrow + h2 + bio rows) | 🆕 신규 |
| `BioRows` | `src/components/bio-rows.tsx` | 학력/전/현 chip 리스트 (about·main 공용) | 🆕 신규 |
| `PledgePreview` | `src/components/pledge-preview.tsx` | 메인 4 카드 미리보기 grid | 🆕 신규 |
| `PledgesHero` | `src/components/pledges-hero.tsx` | 공약 페이지 hero (kicker + h1 + tag) | 🆕 신규 |
| `PledgeIndex` | `src/components/pledge-index.tsx` | sticky 사이드 인덱스 + active spy + 모바일 가로 scroll | 🆕 신규 |
| `PledgeCard` | `src/components/pledge-card.tsx` | 단일 약속 카드 (num + em + h2 + bullets) | 🆕 신규 |
| `AboutHero` | `src/components/about-hero.tsx` | 소개 페이지 hero | 🆕 신규 |
| `PortraitCard` | `src/components/portrait-card.tsx` | 사진 + chip 3 + 자기소개 | 🆕 신규 |
| `CtaBand` | `src/components/cta-band.tsx` | "가장 확실한 정치교체" CTA 밴드 | 🆕 신규 |
| `Footer` | `src/components/footer.tsx` | 공통 푸터 | 🆕 신규 |
| `Contact` | `src/components/contact.tsx` | 응원 폼 (스타일만 토큰 적용) | ✏️ 수정 |
| `CheerList` | `src/components/cheer-list.tsx` | 응원 리스트 (스타일만 토큰 적용) | ✏️ 수정 |
| `SeunghyoApp` | `src/app/SeunghyoApp.tsx` | 위 컴포넌트들 컴포지션 — base64 이미지 import 유지 | ✏️ 분해 |

총 **14개 컴포넌트** (신규 11 + 수정 3) + `SeunghyoApp` 분해.

### 5.6 Key Interactions (React 변환)

| Sample HTML 패턴 | React 변환 |
|------------------|------------|
| `<button onclick="document.getElementById('m').classList.toggle('open')">` | `useState<boolean>("open")` + `onClick={() => setOpen(o => !o)}` |
| `IntersectionObserver` for `.card.show` 등장 | `useEffect` 안에서 `IntersectionObserver` 생성, ref array로 카드 관찰 |
| `IntersectionObserver` for index `.active` spy | 같은 hook에서 별도 observer, `useState<string>("activeId")` |
| `document.querySelectorAll('#m a').forEach(a=>...)` | onClick prop에서 `setOpen(false)` |
| `clip-path: polygon(...)` red line panel | inline `<style>` 또는 CSS module — 동일 hex 값 |
| `animation: rise .6s` | CSS `@keyframes` `globals.css` 또는 컴포넌트 inline style |

---

## 6. Error Handling

본 작업은 새 네트워크 호출이 없어 신규 에러 코드 없음. 기존 폼/API 에러 처리는 그대로 유지.

| Scenario | Handling | Source |
|----------|----------|--------|
| 폰트 로딩 실패 | `display: swap` + system fallback (`Apple SD Gothic Neo`, `sans-serif`) | `layout.tsx` |
| `IntersectionObserver` 미지원 (구형 브라우저) | 카드 즉시 표시, 인덱스 active는 첫 번째 강제 — `if (!('IntersectionObserver' in window)) return` | hook 가드 |
| 이미지 로딩 실패 | `<img onError>` 대신 base64 인라인이라 실패 없음 | - |
| `sessionStorage` 미지원 (admin) | 기존 동작 유지 (`admin-fetch.ts`) | 변경 없음 |
| 응원·의견·후원 폼 검증 실패 | 기존 alert/toast 패턴 유지 | 변경 없음 |

---

## 7. Security Considerations

- [x] **XSS**: sample HTML의 인라인 `onclick`을 모두 React state로 변환 → DOM string injection 표면 제거
- [x] **`dangerouslySetInnerHTML` 금지**: PledgeSubItem의 `<b>` 표시는 `boldParts` 배열 기반 토큰화 렌더링 사용 (`text.split(boldPart)` 후 `<b>` 래핑)
- [x] **외부 폰트 CSP**: `next/font/google`은 빌드타임에 self-host되어 외부 도메인 없음 — CSP `font-src` 영향 0
- [x] **인증 영향 없음**: HMAC admin auth(`src/lib/admin-auth.ts`)는 변경 없음
- [x] **이미지**: 모두 base64 인라인 또는 `public/` — 외부 URL fetch 없음
- [x] **`window.location.href` 네비**: 기존 패턴 유지 (next/link 미사용) — CSRF 영향 없음 (GET only)

신규 위험 표면 0건.

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | 우선순위 |
|------|--------|------|:-------:|
| Visual diff | sample HTML vs 구현 페이지 (1280px, 375px) | 수동 사이드바이사이드 비교 (스크린샷) | High |
| Build | `npm run build` 무에러 | Next.js 16 build | High |
| Lint | `npm run lint` 무경고 (기존 base64 경고 제외) | ESLint flat config | High |
| Smoke (manual) | 6 페이지 200 OK, 폼 POST 1회씩 | localhost:3013 수동 | High |
| Regression | `/api/admin/login`·`/api/donations`·`/api/cheers` 동작 | curl 또는 admin UI | High |
| Lighthouse | Mobile Performance ≥80, A11y ≥90 | Chrome DevTools | Medium |
| Cross-browser | iOS Safari 16+, Chrome 최신, Galaxy 기본 | 실기기 또는 BrowserStack | Medium |
| Type check | `tsc --noEmit` (Next build에 포함) | tsc | High |

> 본 프로젝트는 자동화 테스트 러너가 없음 — Plan FR-09 검증은 수동 스크린샷 비교.

### 8.2 Test Cases (Key)

- [ ] **Happy path - 메인**: `/` 진입 시 진보당 뱃지·"기호 5번"·district chip 3개·CTA 1개 표시
- [ ] **Happy path - 공약**: `/pledges` 진입 → 9개 카드 모두 마운트, `#p1`~`#p9` anchor 점프 작동
- [ ] **Happy path - 인덱스 spy**: 스크롤 시 인덱스 active 항목이 카드와 동기화
- [ ] **Happy path - 모바일 메뉴**: 햄버거 클릭 → dropdown 열림 → 메뉴 항목 클릭 → 자동 닫힘
- [ ] **Happy path - 응원 폼**: 메인 응원 메시지 POST → Supabase `cheers` insert 성공
- [ ] **Edge case - 9번째 약속**: p9 카드가 sample에 없음에도 sample p6/p7 accent 패턴과 시각적으로 동일 그룹
- [ ] **Edge case - 모바일 인덱스**: 가로 스크롤 chip이 swipe로 9개 모두 접근 가능
- [ ] **Regression - admin**: `/admin/login` 페이지 진입, 비밀번호 입력, 토큰 발급, `/admin` 데이터 페이지 진입
- [ ] **Regression - 후원**: `/donate` 폼 제출 → `/api/donations` 200, `/api/notify` 이메일 발송
- [ ] **A11y**: 키보드 Tab으로 nav → hero CTA → pledge 인덱스 → 카드까지 포커스 이동 가능
- [ ] **Bundle**: `npm run build` 후 First Load JS 이전 빌드 대비 +50KB 이내

---

## 9. Clean Architecture

### 9.1 Layer Structure (Dynamic - 변경 없음)

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | UI components, pages | `src/components/`, `src/app/` |
| **Application** | (없음 — 폼 핸들러는 page 안에 인라인) | - |
| **Domain** | Pledge, Career, NewsItem 타입 + PLEDGES/CAREERS 정적 데이터 | `src/data/site-data.ts` |
| **Infrastructure** | Supabase client, admin auth, admin fetch | `src/lib/` |

### 9.2 Dependency Rules

```
Presentation (components, app/) ─► Domain (data/site-data.ts)
Presentation ─► Infrastructure (lib/supabase, lib/admin-fetch)
Domain ◄── (의존 없음 — pure types/data)
Infrastructure ◄── Domain만
```

본 작업은 Presentation + Domain 레이어 변경에 한정. Infrastructure는 import만 유지.

### 9.3 File Import Rules

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| `src/components/*` | `src/data/*`, `src/lib/*` (의도된 경우만) | `src/app/SeunghyoApp.tsx` (역방향) |
| `src/app/page.tsx` | `src/app/SeunghyoApp.tsx` (dynamic) | - |
| `src/app/*/page.tsx` | `src/components/*`, `src/data/*`, `src/lib/*` | `src/app/SeunghyoApp.tsx` |
| `src/data/site-data.ts` | (no imports — pure types/literals) | 모든 외부 |
| `src/lib/supabase-admin.ts` | (server-only) | 모든 `"use client"` 파일 |

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `Hero`, `PledgeCard`, `PledgeIndex`, `BioRows` 등 11개 신규 | Presentation | `src/components/` |
| `Pledge`, `PledgeSubItem`, `Career`, `PledgeCategory` 타입 | Domain | `src/data/site-data.ts` |
| `PLEDGES[9]`, `CAREERS[7]` 데이터 | Domain | `src/data/site-data.ts` |
| `supabase`, `admin-auth`, `admin-fetch` | Infrastructure | `src/lib/` (변경 없음) |

---

## 10. Coding Convention Reference

> Reference: `CLAUDE.md` (프로젝트 컨벤션) + `AGENTS.md` (Next.js 16 주의사항)

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `PledgeCard`, `BioRows` |
| Component files | kebab-case.tsx (현행 컨벤션 유지) | `pledge-card.tsx`, `bio-rows.tsx` |
| Functions | camelCase | `handleSubmit`, `scrollToAnchor` |
| Constants | UPPER_SNAKE_CASE | `PLEDGES`, `CAREERS`, `NAV_ITEMS`, `DISTRICT_LABELS` |
| Types/Interfaces | PascalCase | `Pledge`, `PledgeCategory`, `NewsItem` |
| CSS variables | kebab-case + `--` | `--red`, `--sky-deep`, `--paper` |
| anchor id | `p` + 숫자 | `p1`, `p2`, ..., `p9` |

> ⚠️ 기존 컨벤션: 컴포넌트 파일도 **kebab-case**. `navbar.tsx`, `cheer-list.tsx` 패턴 유지.

### 10.2 Import Order

```typescript
// 1. React / next
import { useState, useEffect, useRef } from "react";
import type { Metadata } from "next";

// 2. next/font
import { Noto_Sans_KR, Archivo } from "next/font/google";

// 3. Internal absolute (@/)
import { PLEDGES, type Pledge } from "@/data/site-data";
import Navbar from "@/components/navbar";
import PledgeCard from "@/components/pledge-card";

// 4. 같은 폴더 상대 import (필요 시)
import { someHelper } from "./helpers";

// 5. Styles
import "./globals.css";
```

### 10.3 Environment Variables

본 작업은 신규 환경 변수 없음. 기존 그대로 사용:

| Prefix | Purpose | Scope |
|--------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL/_ANON_KEY` | Supabase 클라이언트 | Browser + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | admin API only | Server |
| `ADMIN_PASSWORD` | 로그인 + HMAC 시크릿 | Server |
| `MAIL_SMTP_*`, `MAIL_FROM_*`, `ADMIN_EMAIL`, `DONATION_EMAIL` | nodemailer | Server |

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| Component naming | PascalCase 컴포넌트, kebab-case 파일 (기존 유지) |
| File organization | `src/components/` 평면 구조 (sub-folder 없음) |
| State management | `useState` (단일 페이지 로컬 상태만), 라이브러리 추가 없음 |
| Error handling | Form은 try/catch + alert, 무한 fallback 없이 첫 에러 노출 |
| Styling | Tailwind v4 + 인라인 `<style>`/`style={{}}` 공존 (CLAUDE.md 명시) |
| Routing | `window.location.href` 유지 (next/link 미사용) |
| Data fetching | 정적 import (PLEDGES, CAREERS), API는 페이지 `useEffect`에서 fetch |

---

## 11. Implementation Guide

### 11.1 File Structure (변경 후)

```
src/
├── app/
│   ├── layout.tsx               # ✏️ 폰트 3개 + metadata 갱신
│   ├── globals.css              # ✏️ 7 색 토큰 + body 폰트 + scroll-behavior
│   ├── page.tsx                 # (변경 없음 — dynamic import 유지)
│   ├── SeunghyoApp.tsx          # ✏️ 분해: 신규 컴포넌트 컴포지션
│   ├── about/page.tsx           # ✏️ AboutHero + PortraitCard + BioRows 사용
│   ├── pledges/page.tsx         # ✏️ PledgesHero + PledgeIndex + PledgeCard×9
│   ├── news/page.tsx            # ✏️ 토큰만 통일 (NewsItem 사용)
│   ├── opinions/page.tsx        # ✏️ 토큰만 통일
│   ├── donate/page.tsx          # ✏️ 토큰만 통일
│   ├── admin/*                  # (변경 없음 — 격리)
│   └── api/*                    # (변경 없음)
│
├── components/
│   ├── navbar.tsx               # ✏️ 진보당 뱃지·이승효 cand·burger
│   ├── footer.tsx               # 🆕 공통 푸터
│   ├── hero.tsx                 # 🆕 메인 히어로
│   ├── band.tsx                 # 🆕 한 줄 카피 밴드
│   ├── bio-section.tsx          # 🆕 메인 약력 섹션
│   ├── bio-rows.tsx             # 🆕 학력/전/현 chip 리스트
│   ├── pledge-preview.tsx       # 🆕 메인 4 카드 미리보기
│   ├── pledges-hero.tsx         # 🆕 공약 페이지 hero
│   ├── pledge-index.tsx         # 🆕 sticky 사이드 인덱스 + spy
│   ├── pledge-card.tsx          # 🆕 단일 약속 카드
│   ├── about-hero.tsx           # 🆕 소개 페이지 hero
│   ├── portrait-card.tsx        # 🆕 사진 + chip + 자기소개
│   ├── cta-band.tsx             # 🆕 CTA 밴드
│   ├── contact.tsx              # ✏️ 토큰 적용 (기존)
│   └── cheer-list.tsx           # ✏️ 토큰 적용 (기존)
│
├── data/
│   ├── site-data.ts             # ✏️ Pledge/Career 타입 + PLEDGES[9] + CAREERS[7]
│   ├── hero-image.ts            # (변경 없음 — base64)
│   ├── profile-image.ts         # (변경 없음 — base64)
│   └── sitting-image.ts         # (변경 없음 — base64)
│
└── lib/                         # (변경 없음 — 전체)
    ├── admin-auth.ts
    ├── admin-fetch.ts
    ├── supabase.ts
    └── supabase-admin.ts
```

### 11.2 Implementation Order

1. **[Foundation] 데이터 + 토큰** (의존 없음 — 다른 모든 작업의 전제)
   - [ ] 1-1. `src/data/site-data.ts` 재작성: 타입 정의 + PLEDGES 9개 + CAREERS 7개 + NewsItem 타입 추가
   - [ ] 1-2. `src/app/globals.css` 갱신: CSS 변수 7개 + body 기본 + `scroll-behavior`
   - [ ] 1-3. `src/app/layout.tsx` 갱신: 폰트 3개 (`next/font/google` 지원 확인) + metadata 한글 카피
   - [ ] 1-4. `npm run build` 1차 통과 확인

2. **[Atoms] 공통 컴포넌트** (페이지보다 먼저)
   - [ ] 2-1. `src/components/footer.tsx`
   - [ ] 2-2. `src/components/cta-band.tsx`
   - [ ] 2-3. `src/components/bio-rows.tsx`
   - [ ] 2-4. `src/components/navbar.tsx` 개편 (진보당 뱃지 + cand + burger, 라우팅 유지)

3. **[Molecules] 페이지 전용 컴포넌트**
   - [ ] 3-1. `src/components/hero.tsx` (메인 hero — `HERO_POSTER_IMG` 또는 `HERO_IMG` 재사용)
   - [ ] 3-2. `src/components/band.tsx`
   - [ ] 3-3. `src/components/bio-section.tsx`
   - [ ] 3-4. `src/components/pledge-preview.tsx`
   - [ ] 3-5. `src/components/pledges-hero.tsx`
   - [ ] 3-6. `src/components/pledge-card.tsx` (boldParts 토큰 렌더링 포함)
   - [ ] 3-7. `src/components/pledge-index.tsx` (sticky + IntersectionObserver spy)
   - [ ] 3-8. `src/components/about-hero.tsx`
   - [ ] 3-9. `src/components/portrait-card.tsx`

4. **[Pages] 페이지 재조립**
   - [ ] 4-1. `src/app/SeunghyoApp.tsx` 분해 (base64 이미지 import 유지, JSX 컴포지션만 교체)
   - [ ] 4-2. `src/app/pledges/page.tsx` 재작성 (PledgeIndex + 9 카드)
   - [ ] 4-3. `src/app/about/page.tsx` 재작성 (AboutHero + PortraitCard + BioRows)
   - [ ] 4-4. `src/app/news/page.tsx` 토큰 통일
   - [ ] 4-5. `src/app/opinions/page.tsx` 토큰 통일
   - [ ] 4-6. `src/app/donate/page.tsx` 토큰 통일

5. **[Polish] 기존 폼 컴포넌트 토큰 적용**
   - [ ] 5-1. `src/components/contact.tsx` 스타일 토큰화
   - [ ] 5-2. `src/components/cheer-list.tsx` 스타일 토큰화

6. **[Verification]**
   - [ ] 6-1. `npm run dev` (localhost:3013) — 6 페이지 시각 확인
   - [ ] 6-2. `npm run build` — 빌드 성공
   - [ ] 6-3. `npm run lint` — 경고 없음 (기존 base64 제외)
   - [ ] 6-4. admin 회귀: `/admin/login` → `/admin/cheers/opinions/donations` 200 + CRUD
   - [ ] 6-5. 모바일 시뮬레이터(375px) 시각 확인
   - [ ] 6-6. Lighthouse Mobile 1회

### 11.3 Critical Decisions for Do Phase

| Decision Point | 권장 처리 |
|----------------|----------|
| Black Han Sans `next/font/google` 지원 여부 | Do 1-3 첫 작업으로 확인. 미지원 시 `<link>` 태그 + preconnect로 fallback |
| `SeunghyoApp.tsx`의 어떤 base64 이미지가 hero에 쓰이는지 | grep으로 `HERO_IMG` export 확인, 그대로 `hero.tsx`에서 `<img src={HERO_IMG}>` |
| `PledgeSubItem.boldParts` 렌더링 알고리즘 | `text.split(boldPart)`를 부분 매치로 처리, regex 안전성 위해 `replaceAll` 후 fragment 배열 |
| 모바일 인덱스 가로 스크롤 vs 햄버거 vs accordian | sample 패턴 그대로 가로 스크롤 — `.scroller { overflow-x: auto }` |
| admin 페이지 토큰 격리 방법 | admin layout이 별도 wrapper에서 `--paper` override 또는 admin은 globals.css 토큰 미사용 (현행 sky-800 유지) |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-24 | Initial design — 토큰 7개·폰트 3축·컴포넌트 14개·9 약속 데이터 모델 확정 | kcsvictory@gmail.com |
