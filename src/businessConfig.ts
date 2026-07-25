export interface Service {
  id: string
  name: string
  price: number
  durationMin: number
}

export interface Artist {
  id: string
  name: string
  specialty: string
  avatarEmoji: string
  avatarUrl?: string
  workingDays: number[]
}

export interface BusinessConfig {
  name: string
  tagline: string
  address: string
  contact: string
  dbPrefix?: string
  openingHour: number
  closingHour: number
  slotInterval: number
  closedDays: number[]
  depositPercentage: number
  currencySymbol?: string
  services: Service[]
  artists: Artist[]
  staffLabel: string
  staffLabelPlural: string
  notesLabel: string
  adminNotesLabel: string
  internalNotesLabel: string
  checklist: string[]
  theme: {
    primaryColor: string
    cardBg: string
    accentColor: string
    accentHover: string
    borderRadius: string
    fontFamily: string
  }
}

export const BUSINESS_CONFIG: BusinessConfig = {
  name: "Apex Dental & Health Clinic",
  tagline: "Pristine Clinical & Family Healthcare Engine",
  address: "42 Healthcare Ave, Medical District, NY 10001",
  contact: "+1 (800) 555-APEX",
  dbPrefix: "dental",
  openingHour: 8,
  closingHour: 18,
  slotInterval: 30,
  closedDays: [0], // Sunday closed
  depositPercentage: 0, // No deposit required for medical intake
  currencySymbol: "$",
  services: [
    { id: "exam", name: "Comprehensive Dental Exam & X-Rays", price: 150, durationMin: 45 },
    { id: "cleaning", name: "Teeth Cleaning & Fluoride Polish", price: 95, durationMin: 30 },
    { id: "ortho", name: "Orthodontic & Invisalign Consultation", price: 200, durationMin: 60 },
    { id: "emergency", name: "Emergency Tooth Repair & Pain Care", price: 180, durationMin: 45 }
  ],
  artists: [
    { id: "aris", name: "Dr. Aris Vance", specialty: "Lead Dentist & Oral Surgeon", avatarEmoji: "🩺", workingDays: [1, 2, 3, 4, 5] },
    { id: "maya", name: "Dr. Maya Lin", specialty: "Orthodontics & Invisalign", avatarEmoji: "🦷", workingDays: [1, 2, 3, 4] },
    { id: "elena", name: "Dr. Elena Rostova", specialty: "Periodontics & Gum Health", avatarEmoji: "🔬", workingDays: [2, 3, 4, 5, 6] }
  ],
  staffLabel: "Doctor",
  staffLabelPlural: "Doctors",
  notesLabel: "Symptom Notes / Medical Allergies",
  adminNotesLabel: "Treatment Plan & Clinical Notes",
  internalNotesLabel: "Internal Medical Record Notes",
  checklist: [
    "Complete online patient intake questionnaire before arrival.",
    "Bring valid medical ID and dental insurance card.",
    "List current prescriptions and any antibiotic allergies.",
    "Arrive 5 minutes early for Room 1 or Room 2 check-in."
  ],
  theme: {
    primaryColor: "#f4f8fb", // Pristine Clinical Soft Blue/Cream
    cardBg: "rgba(255, 255, 255, 0.95)", // Pure White Clinical Panel
    accentColor: "#0284c7", // Clinical Sky Blue accent
    accentHover: "#0369a1",
    borderRadius: "14px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  }
}
