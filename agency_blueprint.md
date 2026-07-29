# NativeBooking Blueprint & Architecture

## Overview
NativeBooking is a custom-made, white-label reservation and crew management system built for high-touch service businesses (clinics, studios, field service contractors, academies).

Unlike generic SaaS widgets (Calendly, Acuity), NativeBooking gives clients 100% control over their database, branding, scheduling logic, and crew dispatch workflows.

---

## Technical Architecture & Stack
- **Frontend Core**: React 18 + TypeScript + Vite
- **Mobile / Native Shell**: Capacitor JS (iOS & Android distribution)
- **Backend Services**: Firebase Firestore, Firebase Auth, Cloud Functions
- **Hosting & Edge**: Vercel
- **Quality & Standard**: Oxlint, TypeScript strict mode

---

## Service Delivery Tiers

### 1. Essential Setup (Standard White-Label)
- White-label booking flow embedded into client website
- Service catalog & staff/crew scheduling
- Automated email/SMS client notifications
- Basic payment processing (Stripe/PayPal integration)

### 2. Operational Custom (Advanced Business Engine)
- Everything in Essential
- Field crew dispatching & shift assignment dashboard
- Dynamic pricing rules & customized intake forms
- Multi-location & multi-calendar sync

### 3. Enterprise Custom
- Custom mobile app builds via Capacitor (iOS App Store & Google Play)
- Dedicated Firebase project infrastructure per client
- Custom CRM / ERP integrations via API hooks

---

## Core Agency Rules & Standards
1. **Design Principle**: Trust > Excitement, Clarity > Complexity, Professional > Flashy.
2. **No AI Slop**: Clean, human communication with no generic buzzwords (*disruptive, game-changing, AI-powered*).
3. **Data Sovereignty**: Each client receives isolated database rules and white-labeled domain assets.
