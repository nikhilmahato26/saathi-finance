# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14+ (App Router, TypeScript) · PostgreSQL · Prisma ORM · NextAuth.js (custom OTP credentials provider) · Tailwind CSS. Recommended by Claude for a multi-role CRM-style system with heavy reporting/dashboard surface area and a public-facing acquisition site in one deployable; confirmed by user 2026-08-17.

## Users

- **Customer** — public visitor who submits basic interest (name, mobile, product) directly (Google/organic) or via a partner referral link, and gets a confirmation that their lead was received. Does not fill the actual application — wants a fast, low-effort first step and later visibility into status.
- **Partner (DSA)** — a Direct Selling Agent / referral partner who submits leads on behalf of customers across any product. Wants to originate leads, track commission-relevant status, and reach official lender/partner sites for referral products.
- **Employee** — internal staff who owns assigned files, chases documents, and moves files through the pipeline. Wants a clear worklist and follow-up queue.
- **Manager** — oversees a team of employees; escalates delayed files, tracks team targets vs. achievement.
- **Admin** — full operational control: all leads, all products, all staff, all reports, notification and activity oversight.

## Product Purpose

Saathi Finance is fundamentally an **internal DSA operations-tracking system**, not a customer-facing loan-application portal. The public website's only job is to capture a lead — name, mobile, product interest — and confirm receipt. Every subsequent step of every application (loan or service, internal or referral) — KYC and income capture, document collection, loan/property details, payment recording, status progression through sanction and disbursement — is entered and moved **manually**, inside the dashboard, by the assigned Employee, Partner, or Admin, based on information and documents gathered outside the app (phone call, WhatsApp, in-person visit). The system's core value is not automating the loan process; it is giving DSA business owners full, real-time visibility into every application in flight and every employee's workload — replacing spreadsheets, WhatsApp threads, and disconnected partner portals with one tracked system of record.

## Positioning

Saathi's product is the operations tracker, not the application funnel. A thin public lead-capture form feeds a manual back office where staff key in every application by hand — internal loan products and external-referral products alike — and move it through one shared status pipeline: visible in one place, attributable to one employee, reportable across the whole team. A generic form-builder can't give a DSA business owner a live view of who is sitting on which file; a spreadsheet can't attribute delay or enforce role-scoped visibility. Saathi's edge is turning an inherently manual, people-driven DSA workflow into a trackable system of record — without pretending to automate away the human steps that actually get loans processed in this business.

## Operating Context

- **Public/customer-facing scope, in full:** Customer (Google/Direct) or Partner (DSA/Referral) submits basic details — name, mobile, product interest — on the public website (SaathiFinance.com) → Mobile + OTP verification → auto-created Lead (`SF-2026-XXXXXX`) in the central DB → customer sees a confirmation screen ("Thanks, our team will contact you"). That is the entire customer-facing interaction for applying; nothing past this point is customer self-service.
- **Everything else is manual, inside the dashboard:** the assigned Employee (or Partner, for partner-originated leads) manually keys in every further field of the application — KYC/personal details, employment & income, loan/vehicle/property specifics, uploads documents collected from the customer, records the customer photo, records payment collection, and generates the application PDF — using information gathered by phone, WhatsApp, or in person. This applies uniformly to internal loan products and external-referral products alike.
- Product selection across 4 categories: Loans, Insurance, Tax, Banking.
- Two routing paths per product: **Internal Application** (Home Loan, Vehicle Loan — full details captured and held inside Saathi) or **External Referral** (Personal Loan, Business Loan, Insurance, Tax, Banking — Saathi captures a lead + referral record, then hands off to the lender/partner's own site via a tracked link).
- Every lead is assigned to an Employee or Partner and moved **manually, stage by stage — no automatic triggers** — through a single Loan Status Pipeline: **New → Profile Pending → Documents Pending → Documents Complete → Login → Processing → Sanction → Disbursement**, plus terminal **Rejected** / **On Hold** states.
- Visibility is role-scoped: Admin sees everything; Manager sees own team; Employee sees assigned files; Partner sees own leads; Customer sees only their own application's status.
- Notifications fire on: New Lead Created, New File Submitted, Follow-up Due, Document Pending, File Status Changed, Loan Sanctioned, Application Rejected, New Partner Lead, New Task Assigned.
- Every state-changing action writes to an Activity Log (Timestamp · Actor ID · IP) — this is the primary mechanism for tracking employee work, since nearly every action in the system is a manual staff action.

## Capabilities and Constraints

### Loan products

Every field below is **entered manually inside the dashboard by the assigned Employee or Partner**, not filled by the customer. The customer's only self-service action, for any product, is the basic-details lead form + OTP verification described in Operating Context. The sequences below are the data captured and the record built, not a customer-facing step-by-step UI.

1. **Home Loan** — internal, full detail capture. Sub-types: LAP, HL, P+C, House Purchase.
   Lead received (customer's basic details) → Employee enters Customer Details (KYC/DOB/Address/PAN) → Employment & Income → Loan Details (Amount/Tenure/Purpose) → Property Details (Type/Value/Ownership) → uploads Documents (collected from customer) → attaches Customer Photo → Review → records Payment ₹2,950 processing fee → generates Application PDF → File ID assigned → Employee/Admin manually advances the Status Pipeline as real-world processing occurs.
2. **Personal Loan** — external referral. Lead received → Employee enters Basic Details → Employment Details → Salary/Income → runs Eligibility Check → pulls CIBIL/Credit API (with recorded consent) → records Lender Match → generates Tracked Referral Link (UTM + partner code) for the customer → customer applies on the Official Lender Site → Employee/Admin updates the Saathi Referral Record as the lender reports status back.
3. **Business Loan** — external referral. Lead received → Employee enters Owner & Business Info (Name/GSTIN/Vintage) → Turnover & Income → Existing Obligations (EMI/running loans) → Loan Requirement (Amount/Purpose) → uploads Documents (ITR/GST/Bank Stmt) → runs Eligibility Check → records Suitable Lender → generates Referral/Affiliate Link → customer applies on the Official Lender Website → Employee/Admin updates the Saathi Referral Record.
4. **Vehicle Loan** — internal, full detail capture. Lead received → Employee enters Customer Details → Vehicle Details (New/Used, Car/CV/Tractor) → Dealer & Quotation (Company/Model/Price) → Loan Requirement (Down payment/Tenure) → uploads Income Documents → uploads RC/Insurance/NOC (used vehicles) → submits the application record → Employee/Admin manually records Sanction/Reject/Disburse.

Shared document taxonomy: **KYC** (Aadhaar, PAN, Voter ID, Signature, Customer Photo) · **Property** (Property Photo, Property Papers, Sale Deed, NOC — Home Loan only) · **Income** (Salary Slip, Bank Statement, ITR, GST Certificate, Business Proof).

### Services (all referral-routed, all manually entered)

- **Insurance** — Vehicle (Car), Commercial Vehicle, Tractor, Term, Health. Partner logs in → selects Insurance Type → enters Customer Basic Details → enters Vehicle/Insured Details → Lead ID created → records Insurance Partner/Broker → generates Referral/Broker Code → customer applies on the Official Partner Website → Partner/Admin records Policy Issued → Admin updates the Saathi Policy Record.
- **Tax Services** — ITR Filing, GST Registration/Return, Gumasta, RTO/Registry, Other. Partner logs in → selects Tax Service → enters Customer Short Form → Lead ID created → records Relevant Tax Partner → system sends WhatsApp Notification → Partner Calls Customer (manually) → Partner/Admin records Service Completed → Admin updates the Saathi Service Record.
- **Banking & Cards** — Saving Account, Current Account, Credit Card. Partner logs in → selects Account/Card Type → enters Customer Basic Details against Available Banks/Products → Lead Record created → generates Tracked Referral Link → customer applies on the Official Bank Website → Partner/Admin records Referral Status as the bank reports back.

### Roles & permissions

| Role | Scope |
|---|---|
| Admin | Full system, all data, all reports |
| Manager | Own team performance & oversight |
| Employee | Assigned leads & files only |
| Partner | Own leads & referrals only |
| Customer | Own application & status only |

### Admin system

- **Admin Dashboard** — Total Leads, Total Applications, Disbursements, Sanctions, Rejected, On Hold, Employee Mgmt, Partner Mgmt, Reports, Activity Log.
- **Employee Dashboard** — My Leads, My Files, Follow-ups Due, Pending Documents, My Target, Achievement, Sanction, Disbursement, Tasks.
- **Manager Dashboard** — My Team Members, Team Leads, Team Applications, Pending Files, Delayed Files, Sanctions, Disbursements, Team Target vs Achievement.
- **Reports & Filters** — filter by Date, Product, Employee, Partner, Manager, City/District, Status, Lender; report types: Employee, Partner, Product, Monthly; export: View Report, Export Excel, Download PDF.
- **Notification System** — 9 trigger types (listed under Operating Context).
- **Activity Log** — File created by Partner, Document uploaded by Employee, Status changed by Admin, Customer assigned, Remark added — each with Timestamp, Actor ID, IP.

### Explicitly undecided

- Payment gateway provider for the ₹2,950 Home Loan processing fee.
- OTP/SMS provider.
- CIBIL/credit bureau API provider and consent-capture mechanism.
- WhatsApp Business API provider for Tax Service notifications.
- Specific lender/partner integrations — "HDFC / SBI" etc. in the source mockup are illustrative examples, not confirmed integration partners.
- Hosting/deployment target.

## Brand Commitments

- Name: **Saathi Finance**. Public domain referenced: **SaathiFinance.com**.
- Category line used in the source mockup: "DSA Business Management System."
- Lead ID format: `SF-2026-XXXXXX` (year-prefixed, 6-digit sequence).
- File ID example in mockups: `SF-2026-000001`.

## Evidence on Hand

- Full interaction flow, screen inventory, field lists, and copy sourced from the Figma Make prototype "Flow chart creation" (System Overview, Loan Products, Services, Admin & Roles tabs), captured 2026-08-17. **Correction (2026-08-18, from the actual business owner):** the prototype's per-field sequences (KYC → Employment → Loan Details → …) describe the data captured for each product, not a customer-facing step-by-step UI. In the real business, the customer only ever submits basic details and gets a confirmation; every one of those fields is entered manually inside the dashboard by staff. Treat every "Mobile+OTP → Customer Details → …" chain in this document as an internal data-entry sequence performed by an Employee/Partner, never as a customer self-service flow.
- Confirmed brand assets on hand: the Saathi Finance logo (monochrome, angular "SF" wing-cut mark, wordmark, taglines "Finance Made Simple" / "Your Trust. Our Commitment.", four product icons for Home/Vehicle/Business/Personal Loan) and two visual inspiration references — a black-and-white card-based fintech dashboard, and Vitto (an existing Indian lending app) showing an OTP-entry + CIBIL-consent mobile pattern. See the shaped surface brief for how these inform the visual direction.
- No existing codebase or written product docs beyond this file exist — this is a greenfield build.
- No real customer, partner, or lender data exists; record examples (e.g. "HDFC / SBI", "SF-2026-000001") are illustrative placeholders from the prototype, not confirmed integrations or live records. Future work must not present them as real.

## Product Principles

1. **One lead, one record** — every entry point (customer or partner, any product) converges on a single Lead ID in the central DB; no product silos.
2. **Manual-first, tracked always** — nearly every field of every application is entered, and every status transition is triggered, by a human (Employee, Partner, or Admin) inside the dashboard. The product's job is to make that manual, people-driven work fully visible and attributable — not to automate it away. Design and build for a data-entry operator working from phone/WhatsApp/in-person information, not for a self-service applicant.
3. **Two flow types, one pipeline** — internal full-detail-capture products and external-referral products both report into the same status pipeline and admin visibility model.
4. **Role scope is structural, not cosmetic** — Employee/Partner/Customer data access is enforced at the query layer, not just hidden in the UI.
5. **Every state change is attributable** — status changes, document uploads, and assignments are actor- and timestamp-logged by default, not optionally. This is the system's primary reporting substrate, since most actions are manual staff actions.
6. **Referral tracking survives the handoff** — external-referral products still report a trackable status to Saathi's admin even after the customer leaves for the lender/partner's own site.

## Accessibility & Inclusion

Not established by the source material. Recommend WCAG 2.1 AA as a default baseline for a public-facing financial-services site, pending explicit confirmation.

---

# Implementation Plan

This section is the actionable build plan derived from the product record above. It is a living plan, not frozen product truth — update it as architecture decisions firm up.

## 1. Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 14+ App Router                       │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │ Public site    │  │ Customer status │  │ Dashboard          │    │
│  │ (marketing +   │  │ lookup (read-   │  │ (admin, manager,  │    │
│  │  lead capture  │  │  only, unauth   │  │  employee, partner)│    │
│  │  form only)    │  │  via lead code) │  │ — ALL application  │    │
│  │ (unauth)       │  │                 │  │  data entry lives  │    │
│  │                │  │                 │  │  here, manually    │    │
│  └───────────────┘  └────────────────┘  └──────────────────┘    │
│           │                  │                    │              │
│           └──────────────────┴────────────────────┘              │
│                    Route Handlers / Server Actions                │
│                    (app/api/**, "use server")                     │
└──────────────────────────────┬────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                  │
      ┌───────▼──────┐  ┌───────▼───────┐  ┌───────▼────────┐
      │  Prisma ORM   │  │ Auth (NextAuth │  │ File storage    │
      │  → PostgreSQL │  │  + OTP        │  │ (S3-compatible, │
      │               │  │  credentials) │  │  documents/PDFs)│
      └───────────────┘  └───────────────┘  └─────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
      ┌───────▼──────┐  ┌───────▼───────┐  ┌───────▼────────┐
      │ SMS/OTP       │  │ Payment       │  │ WhatsApp/       │
      │ provider      │  │ gateway       │  │ notification    │
      │ (TBD)         │  │ (TBD)         │  │ provider (TBD)  │
      └───────────────┘  └───────────────┘  └─────────────────┘
```

- Single Next.js deployable serves the public marketing/lead-capture page, a read-only customer status lookup, and the role-scoped dashboards — route-grouped as `(public)`, `(app)`, `(dashboard)`. Per Product Principle 2, there is no customer-facing multi-step application flow: `(dashboard)/employee` and `(dashboard)/partner` are where every application's data actually gets entered.
- Role scope is enforced server-side in every Route Handler / Server Action (never client-only), backed by a Prisma query layer that always filters by the session's role + owned-record IDs.
- Async work (PDF generation, notification fan-out, referral-status polling where a partner API supports it) runs through a job queue rather than inline in request handlers — start with a simple Postgres-backed queue (e.g. `pg-boss`) rather than standing up Redis for MVP.

## 2. Data model (Prisma schema, high level)

```prisma
enum Role {
  ADMIN
  MANAGER
  EMPLOYEE
  PARTNER
  CUSTOMER
}

enum ProductCategory {
  LOAN
  INSURANCE
  TAX
  BANKING
}

enum LoanProductType {
  HOME_LOAN
  PERSONAL_LOAN
  BUSINESS_LOAN
  VEHICLE_LOAN
}

enum RouteType {
  INTERNAL_APPLICATION
  EXTERNAL_REFERRAL
}

enum LeadStatus {
  NEW
  PROFILE_PENDING
  DOCUMENTS_PENDING
  DOCUMENTS_COMPLETE
  LOGIN
  PROCESSING
  SANCTION
  DISBURSEMENT
  REJECTED
  ON_HOLD
}

model User {
  id           String   @id @default(cuid())
  role         Role
  name         String
  mobile       String   @unique
  otpVerifiedAt DateTime?
  email        String?  @unique
  managerId    String?  // Employee -> Manager
  manager      User?    @relation("ManagerTeam", fields: [managerId], references: [id])
  team         User[]   @relation("ManagerTeam")
  createdAt    DateTime @default(now())

  leadsOwned      Lead[]        @relation("AssignedTo")
  leadsCreated    Lead[]        @relation("CreatedBy")
  activityLogs    ActivityLog[]
  notifications   Notification[]
}

model Lead {
  id             String          @id @default(cuid())
  leadCode       String          @unique // SF-2026-XXXXXX
  category       ProductCategory
  productType    String          // LoanProductType or service sub-type key
  routeType      RouteType
  status         LeadStatus      @default(NEW)
  source         String          // "google" | "direct" | "partner"
  customer       User            @relation("CustomerLeads", fields: [customerId], references: [id])
  customerId     String
  assignedTo     User?           @relation("AssignedTo", fields: [assignedToId], references: [id])
  assignedToId   String?
  createdBy      User            @relation("CreatedBy", fields: [createdById], references: [id])
  createdById    String
  lender         String?         // referral products: matched lender/partner name
  referralLink   String?         // tracked UTM + partner code URL
  application    LoanApplication?
  documents      Document[]
  statusHistory  StatusHistoryEntry[]
  notes          Remark[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model LoanApplication {
  id              String   @id @default(cuid())
  lead            Lead     @relation(fields: [leadId], references: [id])
  leadId          String   @unique
  fieldsJson      Json     // product-specific structured form data
  processingFeePaid Boolean @default(false)
  paymentRef      String?
  pdfUrl          String?
  submittedAt     DateTime?
}

model Document {
  id         String   @id @default(cuid())
  lead       Lead     @relation(fields: [leadId], references: [id])
  leadId     String
  category   String   // KYC | PROPERTY | INCOME
  docType    String   // Aadhaar Card, PAN Card, ...
  fileUrl    String
  uploadedBy String
  uploadedAt DateTime @default(now())
}

model StatusHistoryEntry {
  id        String     @id @default(cuid())
  lead      Lead       @relation(fields: [leadId], references: [id])
  leadId    String
  status    LeadStatus
  changedBy String
  changedAt DateTime   @default(now())
}

model Remark {
  id        String   @id @default(cuid())
  lead      Lead     @relation(fields: [leadId], references: [id])
  leadId    String
  authorId  String
  text      String
  createdAt DateTime @default(now())
}

model ActivityLog {
  id        String   @id @default(cuid())
  actor     User     @relation(fields: [actorId], references: [id])
  actorId   String
  action    String   // "FILE_CREATED" | "DOCUMENT_UPLOADED" | "STATUS_CHANGED" | ...
  entityType String
  entityId  String
  ipAddress String
  createdAt DateTime @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  type      String   // NEW_LEAD | FILE_SUBMITTED | FOLLOWUP_DUE | ...
  payload   Json
  readAt    DateTime?
  createdAt DateTime @default(now())
}

model Target {
  id         String   @id @default(cuid())
  userId     String   // employee or manager
  period     String   // "2026-08"
  targetValue Int
  achievedValue Int   @default(0)
}
```

Notes:
- `Lead` is the single convergence point required by Product Principle 1 — every product (internal or referral) creates exactly one `Lead`.
- `LoanApplication.fieldsJson` holds the product-specific form shape (Home Loan fields differ from Vehicle Loan fields) rather than one wide table with mostly-null columns; validate each product's shape with a Zod schema per `LoanProductType`.
- `routeType` on `Lead` is what lets one status pipeline (Product Principle 2) serve both internal-application and external-referral products.

## 3. Route/screen map

```
(public)/                                — marketing home, product category pages
(public)/apply                           — ONE lead-capture form: name, mobile, product interest
(auth)/verify                            — Mobile + OTP verification (customer's only auth step)
(public)/confirmation/[leadCode]         — "Thanks, our team will contact you" — customer flow ends here
(app)/status/[leadCode]                  — read-only customer-facing status tracker (separate from data entry)

(dashboard)/admin                        — Admin dashboard (leads, apps, disbursements, staff mgmt, reports, activity log)
(dashboard)/manager                      — Manager dashboard (team leads/apps, delayed files, targets)
(dashboard)/employee                     — Employee dashboard (my leads/files, follow-ups, targets)
(dashboard)/employee/leads/[leadId]      — manual data-entry workspace: assigned Employee enters every
                                            product-specific field (KYC, income, loan/property/vehicle
                                            details, documents, photo, payment, PDF) and advances status.
                                            One editor per product type (Home/Personal/Business/Vehicle
                                            Loan, Insurance, Tax, Banking); this is where the "Inspection
                                            Station" structure from the shaped brief actually lives.
(dashboard)/partner                      — Partner dashboard (own leads/referrals across all products)
(dashboard)/partner/leads/[leadId]       — same manual entry workspace, scoped to partner-originated leads
(dashboard)/reports                      — Filterable reports + Excel/PDF export
```

## 4. Phased roadmap

**Phase 0 — Foundation (week 1-2)**
- Repo scaffold: Next.js + TypeScript + Tailwind + Prisma + Postgres (local via Docker).
- Auth: mobile + OTP flow (stubbed provider first, swap in real SMS provider later), NextAuth session with `Role` on the JWT.
- Core Prisma schema above; seed script for the 5 roles.
- Base layout shells: public site shell, authenticated app shell, dashboard shell with role-based nav.

**Phase 1 — Lead capture + one internal flow, one referral flow (week 3-5)**
- Public lead-capture form (name, mobile, product interest) + OTP → Lead creation (auto `SF-2026-XXXXXX` generator) → confirmation page. This is the entire customer-facing surface for Phase 1.
- Build the **Home Loan** manual data-entry workspace inside `(dashboard)/employee/leads/[leadId]` as the internal-application reference implementation — an Employee-facing editor (Inspection Station structure, see shaped brief) covering KYC, employment/income, loan/property details, document upload (S3-compatible storage), customer photo, review, payment recording, PDF generation, File ID. No customer ever sees this UI.
- Build the **Personal Loan** manual entry workspace as the external-referral reference implementation: Employee/Partner enters eligibility fields, generates the referral link (UTM + partner code), records the handoff, and later updates the referral record as status comes back.
- Admin: Lead list, Lead detail, manual status change with `StatusHistoryEntry` write, Activity Log write on every mutation.

**Phase 2 — Remaining products + services (week 6-8)**
- Business Loan, Vehicle Loan using the two reference implementations as templates.
- Insurance, Tax, Banking & Cards service flows (all referral-pattern, per Phase 1's Personal Loan template).
- Notification system: in-app notification feed for the 9 trigger types; email/WhatsApp fan-out deferred to Phase 3 pending provider selection.

**Phase 3 — Dashboards, reporting, roles (week 9-11)**
- Employee, Manager dashboards with the modules listed in the product record.
- Reports & Filters module: filter combinators, Excel export (e.g. `exceljs`), PDF export (e.g. `@react-pdf/renderer`).
- Target vs. Achievement tracking (`Target` model) for Employee/Manager dashboards.
- Role-scoped query layer audit — verify every list/detail endpoint filters by session role before Phase 3 exit.

**Phase 4 — Hardening (week 12+)**
- Real OTP/SMS provider, real payment gateway, real CIBIL/credit API integration (pending user's provider selections — see Undecided list).
- WCAG 2.1 AA pass on public + application flows.
- Load testing on the reporting queries (filter-heavy, will be the first place indexes matter).
- Security review: OTP rate-limiting, document upload validation/AV scanning, PII encryption at rest for KYC data.

## 5. Integration points requiring provider decisions

| Integration | Used by | Status |
|---|---|---|
| SMS/OTP provider | Mobile+OTP verification (all flows) | **Undecided** — needed before Phase 0 can go beyond a stub |
| Payment gateway | Home Loan ₹2,950 processing fee | **Undecided** — needed before Phase 1 Home Loan can go live |
| CIBIL/credit bureau API | Personal Loan eligibility check | **Undecided** — needed before Phase 2 |
| WhatsApp Business API | Tax Service partner notification | **Undecided** — needed before Phase 2 Tax flow can go live |
| Lender/partner referral APIs or link programs | Personal/Business Loan, Insurance, Banking referral routing | **Undecided** — MVP can ship with static tracked links; status webhooks are a stretch goal |
| S3-compatible object storage | Document upload, generated PDFs | Recommend AWS S3 or Cloudflare R2 — pick based on hosting target |
| Hosting | Whole app | **Undecided** — Vercel is the lowest-friction match for Next.js if no constraint says otherwise |

## 6. Testing strategy

- Unit tests (Vitest) on: Lead code generator, status transition rules, role-scoped query filters, per-product Zod validation schemas.
- Integration tests on Route Handlers/Server Actions for each application flow's happy path + one rejected-path case per product.
- E2E (Playwright) on the two reference flows (Home Loan internal, Personal Loan referral) plus one full admin status-change → notification → activity-log chain.
- Manual QA checklist per phase exit: role-scope leakage check (log in as Employee, confirm 0 leads visible outside assignment; same for Partner/Customer).
