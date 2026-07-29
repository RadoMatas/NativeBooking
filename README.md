# Reservation Blueprint

A reservation and appointment scheduling web application built with React, TypeScript, Vite, and Firebase, featuring Android mobile support via Capacitor.

## Features

- **Customer Booking Flow**: Select services, date, time slots, and confirm appointments.
- **Customer Dashboard**: View personal booking history and manage account details.
- **Admin Dashboard**: Manage appointments, service catalog, time availability, and user roles.
- **Authentication**: Firebase Auth supporting email/password and role-based access control.
- **Mobile Ready**: Capacitor integration for Android build and deployment.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/
│   ├── BookAppointment.tsx  # Customer booking flow
│   ├── CustomerDB.tsx       # Customer dashboard & history
│   ├── AdminDB.tsx          # Admin management dashboard
│   └── login.tsx            # Auth page
├── BookingContext.tsx   # Global booking state & business logic
├── auth.ts              # Authentication helpers
├── businessConfig.ts    # Service definitions & default settings
├── firebase.ts          # Firebase SDK initialization
└── firestoreHelpers.ts  # Database CRUD utilities
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router v7
- **Backend & Database**: Firebase Auth, Firestore
- **Mobile**: Capacitor 8 (Android)
- **Linting**: Oxlint

## Local Setup & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Mobile (Android) Build

```bash
npx cap sync android
npx cap open android
```
