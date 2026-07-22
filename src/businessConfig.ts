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
  workingDays: number[] // days of week: 0=Sunday, 1=Monday... 6=Saturday
}

export interface BusinessConfig {
  name: string
  tagline: string
  address: string
  contact: string
  openingHour: number // 24h format, e.g. 11
  closingHour: number // 24h format, e.g. 20
  slotInterval: number // in minutes, e.g. 30
  closedDays: number[] // days of week the shop is closed
  depositPercentage: number // e.g. 20 for 20%
  services: Service[]
  artists: Artist[]
  staffLabel: string
  staffLabelPlural: string
  notesLabel: string
  adminNotesLabel: string
  internalNotesLabel: string
  checklist: string[]
  dbPrefix: string
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
  name: "Apex Dental & Chiropractic",
  tagline: "Premium General Dentistry & Chiropractic Care",
  address: "12 Medical Plaza, Suite 300, Dallas, TX 75201",
  contact: "+1 (214) 555-0198",
  openingHour: 9,
  closingHour: 18,
  slotInterval: 30,
  closedDays: [0], // Sunday closed
  depositPercentage: 0, // 0% deposit
  dbPrefix: "medical",
  services: [
    { id: "dental-checkup", name: "Dental Checkup & Hygiene", price: 75, durationMin: 45 },
    { id: "teeth-whitening", name: "Teeth Whitening Session", price: 180, durationMin: 60 },
    { id: "chiro-adjustment", name: "Chiropractic Adjustment", price: 90, durationMin: 45 },
    { id: "spinal-decompression", name: "Spinal Decompression", price: 120, durationMin: 60 }
  ],
  artists: [
    { id: "dr-jenny", name: "Dr. Jenny Vance", specialty: "General Dentist", avatarEmoji: "🦷", workingDays: [1, 2, 3, 4, 5] },
    { id: "dr-marcus", name: "Dr. Marcus Vance", specialty: "Lead Chiropractor", avatarEmoji: "🩻", workingDays: [1, 2, 3, 4, 6] }
  ],
  staffLabel: "Doctor",
  staffLabelPlural: "Doctors",
  notesLabel: "Describe symptoms / treatment goals",
  adminNotesLabel: "Treatment Plan / Post-Session Guidelines",
  internalNotesLabel: "Internal Medical Notes",
  checklist: [
    "Bring your ID and list of current medications.",
    "Wear loose, comfortable clothing for chiropractic assessments.",
    "Avoid eating heavy meals 2 hours before your appointment.",
    "Arrive 10 minutes early to complete check-in."
  ],
  theme: {
    primaryColor: "#fbfbfa", // soft cream
    cardBg: "rgba(255, 255, 255, 0.8)", // white frosted glass
    accentColor: "#0284c7",  // deep clinical sky blue
    accentHover: "#0369a1",  // hover deep sky blue
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
  }
}
