# Booking Agency Blueprint & Polish Setup Guidelines

## 🛠️ Tech Stack & Architecture
* **Frontend:** React + Vite + TypeScript (built as a Progressive Web App with service worker).
* **Database & Auth:** Firebase Firestore & Authentication.
  * *Hybrid Architecture:* The app must operate offline via `localStorage` if Firebase credentials are missing in `.env`, and dynamically switch to live Firestore when credentials are present.
* **White-Label Abstraction:**
  * UI pages must remain 100% identical across all client projects.
  * All branding nomenclature (e.g. "Artist", "Teacher", "Consultant", "Aftercare") and checklist items must be driven dynamically by the `BUSINESS_CONFIG` object in `src/businessConfig.ts`.
  * Branding logos must be rendered via a unified `<Logo />` component in `src/components/Logo.tsx` (using SVGs or image assets as configured per folder).

## 🚀 Testing & Exposing
* To test on mobile devices or share live mockups, use Vite host exposure and host-bypass configurations:
  * Run: `npm run dev -- --host`
  * Allowed Hosts must be set to `true` in `vite.config.ts` to support tunnels.
  * Use SSH tunnels for zero-dependency previews: `ssh -R 80:localhost:5173 localhost.run`

## 🇵🇱 Polish Business & Tax Setup (JDG)
* **Company Structure:** Jednoosobowa Działalność Gospodarcza (JDG) registered via CEIDG.
* **Taxation:** Ryczałt (Lump-sum) at 12% (programming/software) or 8.5% (web design/IT consulting).
* **Social Security (ZUS):**
  * First 6 months: *Ulga na start* (health insurance contribution only, approx. 400–700 PLN/mo).
  * Next 24 months: *ZUS Preferencyjny* (reduced rate, approx. 1,100 PLN/mo).
* **Invoicing:** Issue invoices globally. Use VAT-UE (Reverse Charge) for EU B2B clients, and mark "NP" (Not Subject) for US/UK clients. Use Wise/Revolut Business for low-cost foreign currency conversions.
