# Saathi Finance

Internal DSA (Direct Selling Agent) operations-tracking system. **Not a customer self-service portal.** Customers only submit basic details on the public site; all actual application data entry and status movement is done manually by staff (Employee/Admin/Manager/Partner) inside the dashboard. See [PRODUCT.md](./PRODUCT.md) for the full product record — though note the caveats under "Known drift from PRODUCT.md" below before trusting it as gospel.

## Setup

```bash
npm install                # runs `prisma generate` via postinstall
createdb saathi_finance_dev   # if the local Postgres database doesn't exist yet
npm run db:migrate         # apply the schema + run prisma/seed.ts
npm run dev
```

Requires a local PostgreSQL instance. `.env` needs `DATABASE_URL` and `AUTH_SECRET` (see `.env` for the current dev values — not committed anywhere else, so don't lose it). `NEXTAUTH_URL` is intentionally left unset in dev (NextAuth v5 infers host from the request; hardcoding it breaks redirects when the dev server falls back to another port).

Stack: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict + Prisma 7 (`@prisma/adapter-pg`, config lives in `prisma.config.ts` not `schema.prisma`) + NextAuth v5 beta (Credentials/OTP, JWT sessions) + shadcn/ui on **Base UI** (not Radix — see gotchas below) + Tailwind.

⚠️ **Read `AGENTS.md` before writing code against this Next.js version** — it points at `node_modules/next/dist/docs/` for breaking-change docs specific to this install, since a lot of the App Router/Prisma/Base UI API surface differs from what's in general training data.

## Auth in dev

No SMS provider is wired up yet. Every OTP is fixed to **`123456`** (`DEV_FIXED_OTP` in `src/lib/otp.ts`), shown directly on screen — no server-log lookup needed. Swap to random-only once a real SMS provider is picked (see Undecided list in PRODUCT.md).

- **Customers**: `/apply` → basic details + OTP → `/confirmation/[leadCode]`. Read-only tracker at `/status/[leadCode]`.
- **Staff**: `/login` → mobile + OTP (`123456`) → `/dashboard`. Seeded accounts:
  - Admin — `9820011223` (Admin)
  - Manager — `9820011224` (Viplav)
  - Employee — `9820011225` (Kanhaiya)
  - Partner — `9820011226` (Divyam)

## What's built

**Auth & lead capture**
- Mobile+OTP auth for both customers and staff, role on the JWT, role-gated `/dashboard/*` shell.
- Public lead-capture flow (`/apply` → `/verify` → `/confirmation/[leadCode]`), auto-generated `SF-2026-XXXXXX` lead codes.
- Role-based sidebar nav, monochrome design system (no color/hue anywhere — status and emphasis are communicated via weight, fill inversion, and icons; see `src/app/globals.css`).

**Home Loan — internal-application reference flow** (`/dashboard/leads/[leadId]/application`)
- Full "Inspection Station" workspace: left-rail station list + one form panel at a time, each station stamps-and-advances.
- Stations: KYC/basic details, employment/income, property/loan details, document upload (real local-disk storage in dev, S3-swappable interface in `src/lib/storage.ts`), photo, review, payment recording, real PDF generation (`@react-pdf/renderer`, `src/lib/pdf/home-loan-pdf.tsx`).
- Status auto-advances New → Profile Pending → Documents Pending → Documents Complete → Login as each station completes; everything from Processing onward (Processing/Sanction/Disbursement/Rejected/On Hold) is a manual status change since it reflects lender-side action Saathi can't see. Status only ever moves forward automatically, never regresses (`advanceStatusIfFurther` in `src/lib/lead-access.ts`).

**Personal Loan — external-referral reference flow** (`/dashboard/leads/[leadId]/referral`)
- Corrected model (not the original self-service-redirect assumption): the company holds real, fixed referral/affiliate links per lender bank. Staff collect customer details in Saathi, then staff themselves open the bank's real link and fill in the bank's own form using that data. Saathi's job is to capture proof afterward.
- Stations: basic details, employment, eligibility & consent (pick the matched lender from an Admin-managed list), referral (shows a real "Open {Lender}'s application" link if a URL is configured, or an honest "not configured yet" message if not — then captures the application/reference number + a confirmation screenshot upload).
- Lender list is Admin-manageable at `/dashboard/admin/lenders` (`Lender` model: name, slug, referralUrl, active) — not hardcoded, since more lenders get added over time. Currently seeded: **HDFC Bank** and **ICICI Bank**, both with `referralUrl: null` — real URLs still need to be added by an Admin once you have them (see Handoff notes below).

**Vehicle Loan — internal-application flow** (`/dashboard/leads/[leadId]/vehicle`), templated off Home Loan's Inspection Station pattern
- Stations: customer details (reuses Personal Loan's basic-details shape), vehicle details (condition New/Used, type Car/Commercial Vehicle/Tractor), dealer & quotation, loan requirement (down payment/tenure), documents (income docs always, RC/Insurance/NOC added only when condition is Used — `getRequiredDocuments()` in `src/lib/vehicle-loan-schema.ts`), review & submit.
- No processing fee or generated PDF (PRODUCT.md's Vehicle Loan sequence doesn't call for either, unlike Home Loan) — the final station just records `LoanApplication.submittedAt` and advances status to Login; Sanction/Disbursement/Rejected from there are the same manual status changes as every other product.

**Business Loan — external-referral flow** (`/dashboard/leads/[leadId]/business`), templated off Personal Loan's referral pattern
- Stations: owner & business info (name/GSTIN/vintage), turnover & income, existing obligations (EMI/running loans), loan requirement (amount/purpose), documents (ITR/GST/Bank Statement), eligibility & consent, referral — the last two stations directly reuse Personal Loan's `EligibilityStation`/`ReferralStation` components and schemas since the shape (consent + lender pick; reference number + screenshot) is identical.
- Unlike Personal Loan, Business Loan has a Documents station (PRODUCT.md calls for ITR/GST/Bank Statement uploads) — advances through Documents Pending → Documents Complete the same way Home/Vehicle Loan do, which Personal Loan's flow doesn't need.

**Admin**
- Lead list/detail, manual status changes with `StatusHistoryEntry` + `ActivityLog` writes on every mutation.
- Lenders CRUD (add lender, edit URL, activate/deactivate) at `/dashboard/admin/lenders`.
- Role-scoped access enforced at the query layer, not just hidden in the UI: `requireLeadAccess(leadId, { canManage })` in `src/lib/lead-access.ts` — Admin/Manager can act on any lead; Employee/Partner only on leads assigned to or created by them (404, not just a hidden button, for anyone else).

## What's left

**Immediate / blocking a real launch**
- Real HDFC and ICICI referral URLs — currently `null`, need to be entered via `/dashboard/admin/lenders` by an Admin.
- Additional lenders beyond HDFC/ICICI, as they get added.
- **Open decision, not yet made**: whether Insurance / Tax / Banking & Cards referral flows follow the same fixed-lender-link + reference-number + screenshot pattern as Personal/Business Loan, or need something different. This was explicitly deferred by the client mid-build ("we will discuss 4 later") — **don't build those flows until this is resolved**, since it changes the shape of the work.

**Phase 2 (per PRODUCT.md's roadmap, next up)**
- ~~Business Loan and Vehicle Loan flows~~ — **done**: Business Loan (`/dashboard/leads/[leadId]/business`) and Vehicle Loan (`/dashboard/leads/[leadId]/vehicle`), templated off the two existing reference implementations as described above. Lead detail page branches wired up.
- Insurance (5 types), Tax (5 types), Banking & Cards (3 types) service flows — all `EXTERNAL_REFERRAL`, all currently unbuilt (leads can be created for these product types but there's no station workspace yet, so staff have nowhere to work them). Blocked on the point-4 decision above.
- In-app notification feed (9 trigger types listed in PRODUCT.md; email/WhatsApp fan-out deferred further, pending provider choice).

**Phase 3 (per PRODUCT.md)**
- Real Manager dashboard (currently an empty-state stub).
- Reports & Filters module (filter combinators, Excel export via `exceljs`, PDF export).
- Target vs. Achievement tracking (`Target` model exists in schema, no UI yet).
- A full role-scope security audit — re-verify every list/detail query filters by session role before calling Phase 3 done.

**Phase 4 (hardening, per PRODUCT.md)**
- Real SMS/OTP provider, real payment gateway, real CIBIL/credit bureau API — all currently stubbed/undecided (see PRODUCT.md §5 Integration points).
- WCAG 2.1 AA pass, load testing on reporting queries, security review (OTP rate-limiting, upload AV scanning, PII encryption at rest).

**Loose end worth a decision**
- `/(public)/r/[leadCode]` — a public "click through to lender" landing page built under the original (pre-correction) self-service assumption. It's harmless as-is but likely vestigial now that customers never visit lender links directly — staff do. Worth asking the client whether to remove it or repurpose it.

## Known drift from PRODUCT.md

PRODUCT.md was written early and revised once for the manual-first correction, but two spots are now stale and shouldn't be trusted over the actual code:
- §4 Phase 1's Personal Loan bullet still describes the *original* "generate a referral link (UTM + partner code)" design — superseded by the fixed-lender-link + reference-number + screenshot model described above and implemented in `src/app/dashboard/leads/[leadId]/referral/`.
- §5's "Lender/partner referral APIs or link programs" row says "MVP can ship with static tracked links" — in practice these are Admin-entered fixed URLs per lender (`Lender` model), not UTM-tracked generated links.

## Gotchas for whoever picks this up

This project runs on newer/beta versions of everything, so a lot of "how this normally works" from training data doesn't apply. The big ones that cost real time this session:

- **Prisma 7**: no `datasource.url` in `schema.prisma` — config lives in `prisma.config.ts` with a `PrismaPg` driver adapter. Generated client imports from `@/generated/prisma/client`, not the bare `@/generated/prisma`.
- **shadcn/ui is on Base UI, not Radix**: `asChild` → `render` prop, and anything rendering a non-`<button>` (like a `<Link>`) via `render=` needs `nativeButton={false}` or it warns/misbehaves. `SelectValue` needs a children render-prop (`<SelectValue>{(v) => label}</SelectValue>`) to show a label instead of the raw value. Dropdown menu items use `onClick`, not `onSelect`. `DropdownMenuLabel`/`Item` must each be wrapped in their own `DropdownMenuGroup`.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`.** Auth config is split into an edge-safe `auth.config.ts` (no providers) and the full `auth.ts` (Credentials provider, pulls in Prisma) — Prisma can't run in Edge Middleware/Proxy, so the split matters.
- Bare (non-form) server-action calls via `startTransition` don't auto-trigger a Next.js router refresh — call `router.refresh()` explicitly afterward.
- `requireLeadAccess`/`advanceStatusIfFurther` in `src/lib/lead-access.ts` are the shared enforcement points for every lead-scoped server action — reuse them for any new product flow rather than re-implementing ownership checks.
