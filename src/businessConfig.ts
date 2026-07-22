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
  name: "NativeBooking",
  tagline: "Custom Reservation & Operations Software",
  address: "Poland",
  contact: "info@nativebooking.co",
  openingHour: 9,
  closingHour: 18,
  slotInterval: 30,
  closedDays: [0, 6], // Sat, Sun closed
  depositPercentage: 0,
  currencySymbol: "$",
  services: [
    { id: "intro_call", name: "Discovery Intro Call", price: 0, durationMin: 30 },
  ],
  artists: [
    { id: "founder", name: "NativeBooking Team", specialty: "Software Architecture", avatarEmoji: "⚡", workingDays: [1, 2, 3, 4, 5] },
  ],
  staffLabel: "Team Member",
  staffLabelPlural: "Team Members",
  notesLabel: "Project Notes",
  adminNotesLabel: "Follow-up Notes",
  internalNotesLabel: "Internal Lead Notes",
  checklist: [
    "Review prospect business type and requested slot.",
    "Prepare custom feature breakdown for discovery call.",
  ],
  theme: {
    primaryColor: "#09090b",
    cardBg: "rgba(20, 20, 23, 0.8)",
    accentColor: "#10b981",
    accentHover: "#34d399",
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  }
}
