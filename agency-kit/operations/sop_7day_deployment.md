# Standard Operating Procedure (SOP): 7-Day Client Deployment Pipeline

**Objective:** Standardize the end-to-end delivery of a NativeBooking instance from signed contract to client handover within 7 days.

---

## Timeline & Execution Schedule

```
Day 1: Contract Signed & 50% Deposit Received -> Send Questionnaire
Day 2: Receive Client Assets & Provision Firebase & Github Repo
Day 3-5: Configure businessConfig.ts, Theme, Logo & Services
Day 6: Complete End-to-End QA, Test Booking & Mobile View Checks
Day 7: Deploy Vercel Production Build, Connect DNS, Admin Training Call
```

---

## Detailed Daily Operational Steps

### Day 1: Intake & Deposit
1. Send Client Service Agreement e-sign link + Stripe deposit invoice.
2. Upon payment notification, send `client_onboarding_questionnaire.md`.

### Day 2: Infrastructure Provisioning
1. Fork matching blueprint branch into private client repository.
2. Create dedicated Firebase Project & deploy production `firestore.rules`.

### Days 3–5: System Customization
1. Update `src/businessConfig.ts` with client services, roster, and operating hours.
2. Apply client HEX brand colors in `src/index.css`.

### Day 6: Quality Assurance (QA)
1. Run `npm run build` to confirm zero compilation errors.
2. Perform test booking, test cancellation, and mobile responsiveness check.

### Day 7: Deployment & Handover
1. Connect Vercel to client repository and assign custom domain `booking.clientdomain.com`.
2. Host 20-minute client Admin training session.
3. Collect final 50% setup fee & start monthly retainer subscription.
