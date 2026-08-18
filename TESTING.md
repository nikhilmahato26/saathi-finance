# Manual Testing — Phase 2 checklist

Covers everything built through Phase 2: auth, lead capture, Home Loan, Personal Loan,
Vehicle Loan, Business Loan, Admin, and role-scope. See [README.md](./README.md) for
setup and [PRODUCT.md](./PRODUCT.md) for the product record.

**OTP for everyone in dev is fixed: `123456`** (shown on screen, no log lookup needed).

Seeded staff accounts:
- Admin — `9820011223`
- Manager — `9820011224` (Viplav)
- Employee — `9820011225` (Kanhaiya)
- Partner — `9820011226` (Divyam)

---

## 0. Setup

- [ ] Dev server running at `http://localhost:3000`

## 1. Customer lead capture (public, unauthenticated)

- [ ] Go to `/apply` → submit name, mobile, pick **Vehicle Loan** as product → OTP screen appears
- [ ] Enter `123456` → lands on `/confirmation/[leadCode]` showing an `SF-2026-XXXXXX` code — note it down
- [ ] Repeat once more picking **Business Loan** — note that lead code too
- [ ] Visit `/status/[leadCode]` for one of them → read-only tracker shows status "New"

## 2. Staff login

- [ ] `/login` → mobile `9820011225` (Kanhaiya, Employee) → OTP `123456` → lands on `/dashboard`
- [ ] Sidebar nav is role-scoped (Employee shouldn't see Admin-only items like Lenders)

## 3. Admin setup (needed before testing referral flows)

- [ ] Log out, log back in as Admin — `9820011223`
- [ ] `/dashboard/admin/leads` → find your two new test leads → assign both to Kanhaiya (Employee)
- [ ] `/dashboard/admin/lenders` → confirm HDFC Bank / ICICI Bank exist
- [ ] Set a dummy `referralUrl` on one (e.g. `https://example.com`) to test the "Open {Lender}'s application" link
- [ ] Leave the other blank to confirm the "not configured yet" message still shows correctly

## 4. Vehicle Loan — Inspection Station flow

Log in as Kanhaiya (Employee) → open the Vehicle Loan lead → **Open application**
(`/dashboard/leads/[leadId]/vehicle`):

- [ ] **Customer Details** — dob, address, PAN (`ABCDE1234F` format), Aadhaar (12 digits) → Stamp & continue
- [ ] Rail marks it complete; status pill on the lead shows "Profile Pending"
- [ ] **Vehicle Details** — condition **Used**, type Car
- [ ] **Dealer & Quotation** — dealer name, model, quoted price
- [ ] **Loan Requirement** — down payment, tenure
- [ ] **Documents** — doc list includes RC/Insurance/NOC (because condition is Used) in addition to Income docs
- [ ] Upload a test file against a couple of doc types → checkmark appears
- [ ] "Mark documents complete" → status advances to "Documents Complete"
- [ ] **Review & Submit** — entered values shown correctly
- [ ] "Submit application" → status advances to "Login", station rail shows it stamped
- [ ] Revisit the station → shows "Application submitted" sealed state, not the form again
- [ ] Lead detail page → manually change status to "Sanction" then "Disbursement"
- [ ] `StatusHistoryEntry` list updates each time
- [ ] **Re-test with New condition**: second Vehicle Loan lead, pick condition **New** → Documents station does *not* show RC/Insurance/NOC, only Income docs

## 5. Business Loan — referral flow

Open the Business Loan lead → **Open referral** (`/dashboard/leads/[leadId]/business`):

- [ ] **Owner & Business Info** — business name, GSTIN, vintage years
- [ ] **Turnover & Income** — annual turnover, monthly income
- [ ] **Existing Obligations** — EMI amount, running loans count (try 0 for both — should be accepted, not rejected as required)
- [ ] **Loan Requirement** — amount, purpose
- [ ] **Documents** — upload against ITR/GST/Bank Statement, mark complete → status hits "Documents Complete"
- [ ] **Eligibility & Consent** — check consent box, pick a lender from the dropdown
- [ ] **Referral** — if lender has a `referralUrl`, "Open {Lender}'s application" opens it in a new tab
- [ ] Enter reference number, upload a screenshot file, submit
- [ ] Sealed "Referral recorded" state with a "View confirmation screenshot" link
- [ ] Lead status advances to "Login"
- [ ] `lead.lender` field shows on the lead detail page's Details panel

## 6. Regression pass on the two existing flows

- [ ] **Home Loan**: create a lead, assign, walk through KYC → Employment → Loan Details → Property → Documents → Review → Payment
- [ ] PDF link appears after payment
- [ ] **Personal Loan**: create a lead, assign, walk through Basic Details → Employment → Eligibility → Referral
- [ ] Referral proof flow still works

## 7. Role-scope check (do this last)

- [ ] Log in as Divyam (Partner, `9820011226`) or a second Employee
- [ ] Navigate directly to a lead URL you know belongs to Kanhaiya (not assigned to/created by this user) → 404, not the workspace
- [ ] Employee/Partner dashboards only list their own leads, never the full list Admin sees

---

## Notes / known non-issues

- **Neon cold-start transaction timeout**: if a mutation fails with `Transaction API error: Unable to start a transaction in the given time`, it's Neon's free-tier compute waking from auto-suspend, not a code bug — retry. Fixed in [src/lib/db.ts](./src/lib/db.ts) with a widened `transactionOptions` wait/timeout.
- **Base UI "uncontrolled FieldControl" console warning**: was showing up after every station save due to a stale `defaultValue` on an already-mounted input. Fixed by keying each station component to its saved field value across all four workspaces.
