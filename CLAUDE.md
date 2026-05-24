# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js version

This repo uses **Next.js 16.2.3 with React 19**. Per `AGENTS.md`, APIs/conventions may differ from training data — read the relevant page in `node_modules/next/dist/docs/` before changing App Router routing, server actions, caching, or `next.config.ts`. Heed deprecation warnings shown at build time.

## Commands

```bash
npm run dev      # next dev on http://localhost:3013  (note: port 3013, not 3000)
npm run build    # next build
npm run start    # next start (after build)
npm run lint     # eslint (flat config in eslint.config.mjs)
```

No test runner is configured. Path alias `@/*` → `src/*`.

## Architecture

Korean campaign site for candidate 이승효 (진보당, 서울시의회 동대문구 제2선거구) with a public landing experience, public forms, and an admin console.

### Backend: Supabase with a custom schema

All tables live in the **`seunghyo`** Postgres schema, not `public` (see `supabase/migrations/001_create_seunghyo_schema.sql`). Both Supabase clients are pinned to this schema via `db: { schema: "seunghyo" }`:

- `src/lib/supabase.ts` — anon client for browser + most API routes.
- `src/lib/supabase-admin.ts` — lazy service-role client (`getSupabaseAdmin()`), only used by `/api/admin/*`. **Never import this from client components.**

Tables: `cheers` (응원 메시지), `opinions` (주민 의견), `donations` (후원금). RLS policies allow anonymous INSERT on all three and SELECT on `cheers`/`opinions`; donations writes from `/api/donations` go through the anon client and rely on those RLS policies.

When adding tables/columns, write a new migration file under `supabase/migrations/` and remember to `GRANT` to `anon, authenticated, service_role` — the migration shows the pattern.

### Admin auth (stateless HMAC, no Supabase Auth)

- Login: `POST /api/admin/login` compares plaintext against `ADMIN_PASSWORD` env, then issues an HMAC-SHA256 token (`<ts>.<sig>` base64url-encoded, 24h TTL) via `src/lib/admin-auth.ts`.
- Client stores the token in `sessionStorage` under key `admin_token`; `src/lib/admin-fetch.ts` attaches it as `Authorization: Bearer …` and auto-redirects to `/admin/login` on 401.
- Every `/api/admin/*` route must call `verifyToken(getTokenFromRequest(request))` before doing anything else.
- `src/app/admin/layout.tsx` gates all `/admin/*` pages client-side by checking `sessionStorage`. The HMAC verification on the server is the real boundary.

### Admin data API

`/api/admin/data` is a single multiplexed route (`GET`/`POST`/`PUT`/`DELETE`) keyed on `?table=` plus `?action=counts|all`. Enforce changes via the allowlists at the top of `src/app/api/admin/data/route.ts`:

- `ALLOWED_TABLES`, `DELETABLE_TABLES`, `INSERTABLE_TABLES`, `UPDATABLE_TABLES`
- `INSERTABLE_FIELDS` — field-level allowlist; bodies are filtered through `Object.fromEntries(... .filter(...))` before insert/update. Add new editable fields here, not in the SQL.

Donation amount and `deposit_date` (`YYYY-MM-DD`) are validated explicitly. Pagination caps at `PAGE_LIMIT_MAX = 100`.

### Frontend layout

- `src/app/page.tsx` dynamically imports `SeunghyoApp.tsx` with `ssr: false`. `SeunghyoApp.tsx` is ~385 lines but ~95% of its bytes are **inlined base64 image constants** (`HERO_IMG`, etc.) — same pattern in `src/data/*-image.ts`. Don't `cat` or fully `Read` these files; use offset/grep for the actual JSX/logic. If you need to edit images, replace the base64 string or move the asset to `public/` and reference by URL.
- Other top-level pages: `/about`, `/pledges`, `/news`, `/opinions`, `/donate`, plus `/admin`, `/admin/login`, `/admin/cheers`, `/admin/opinions`, `/admin/donations`.
- Navigation is hand-rolled in `src/components/navbar.tsx` using `window.location.href` (not `next/link`) — preserve that if you don't have a reason to change it.
- Styling is **Tailwind v4 via `@tailwindcss/postcss`** (see `postcss.config.mjs`, `globals.css`). `navbar.tsx` and parts of `SeunghyoApp.tsx` also use inline `style={{}}` props; both patterns coexist intentionally.
- `src/app/storage.ts` is a thin wrapper: prefers `window.storage` if present (sandbox/host-injected), otherwise falls back to `localStorage`. Use it instead of touching `localStorage` directly.

### Email (donation notifications)

`POST /api/notify` with `{ type: "donation", name, amount, depositDate, donorEmail? }` uses `nodemailer` to send (a) an admin alert to `ADMIN_EMAIL` + `DONATION_EMAIL` and (b) a thank-you to `donorEmail` if provided. Requires `MAIL_SMTP_HOST/PORT/USERNAME/PASSWORD` and `MAIL_FROM_NAME/EMAIL`. The thank-you send is fire-and-forget (`.catch(console.error)`); the admin send is awaited.

### Required environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     # admin API only
ADMIN_PASSWORD                # also used as HMAC secret for admin tokens
MAIL_SMTP_HOST / MAIL_SMTP_PORT / MAIL_SMTP_USERNAME / MAIL_SMTP_PASSWORD
MAIL_FROM_NAME / MAIL_FROM_EMAIL
ADMIN_EMAIL / DONATION_EMAIL  # at least one for /api/notify to send anything
```

Note: `ADMIN_PASSWORD` doubles as the HMAC signing secret — rotating it invalidates all existing admin sessions.
