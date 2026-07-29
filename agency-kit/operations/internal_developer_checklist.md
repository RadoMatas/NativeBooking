# NativeBooking — Internal Developer Execution Checklist

Use this checklist internally for every new client project to track progress from signed deal to live handoff.

---

## Client Project Details
- **Client Business Name:** ________________________
- **Target Subdomain:** ________________________
- **Blueprint Branch Used:** `tattoo` | `dental` | `academic` | `contractor`

---

## Phase 1: Pre-Engineering & Onboarding Intake
- [ ] Contract signed & 50% deposit received.
- [ ] Send `client_onboarding_questionnaire.md` to client.
- [ ] Receive completed questionnaire, logo files, and HEX brand colors.
- [ ] Obtain DNS / Registrar access or request client to add CNAME record for `booking.clientdomain.com`.
- [ ] Obtain client Stripe API keys (Publishable & Secret keys) if processing deposits.

---

## Phase 2: Git & Repository Provisioning
- [ ] Select matching blueprint branch (`tattoo`, `dental`, `academic`, `contractor`).
- [ ] Fork/copy blueprint into a dedicated private client repo (e.g., `github.com/agency/client-apex-dental`).
- [ ] Checkout client `main` branch.

---

## Phase 3: Infrastructure & Firebase Setup
- [ ] Create a dedicated Firebase Project for client (e.g., `apex-dental-prod`).
- [ ] Enable Firebase Authentication (Email/Password).
- [ ] Enable Firestore Database.
- [ ] Deploy production `firestore.rules` (Security rules template).
- [ ] Create `.env` file in client repo with client's Firebase credentials.

---

## Phase 4: Code Base Customization & Theme Injection
- [ ] Update `src/businessConfig.ts` with client data:
  - [ ] Business Name, Address, Contact details
  - [ ] Service catalog (names, prices, durations)
  - [ ] Staff / Doctor / Artist roster
  - [ ] Opening / closing hours & slot intervals
- [ ] Inject client brand colors in `src/index.css` or CSS root variables.
- [ ] Replace `public/logo.png` with client logo.

---

## Phase 5: QA Verification & Testing
- [ ] Run `npm install` and verify dependencies.
- [ ] Run `npm run build` to confirm zero TypeScript compilation errors.
- [ ] Run `npm run dev` and perform end-to-end test booking:
  - [ ] Customer booking flow works smoothly.
  - [ ] Slot booking appears in Admin Dashboard.
  - [ ] Cancel & Reschedule workflows operate correctly.
  - [ ] Mobile responsive layout check (iOS/Android viewport check).

---

## Phase 6: Production Deployment & Domain Wiring
- [ ] Connect client GitHub repo to Vercel (or Firebase Hosting).
- [ ] Add production environment variables in Vercel project settings (`VITE_FIREBASE_*` or `NEXT_PUBLIC_FIREBASE_*`).
- [ ] Add custom domain (`booking.clientdomain.com`) in Vercel.
- [ ] Verify SSL certificate generation and DNS propagation.

---

## Phase 7: Handoff & Go-Live
- [ ] Create client Admin user account in production database.
- [ ] Conduct 20-minute client Admin training call.
- [ ] Collect remaining 50% setup fee.
- [ ] Activate monthly retainer recurring subscription billing.
- [ ] Move project status to **LIVE & MAINTAINED**.
