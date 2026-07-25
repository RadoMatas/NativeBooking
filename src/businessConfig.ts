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
  name: "Sanatorium Tattoo Studio",
  tagline: "Award-Winning Tattoo & Fine Body Art",
  address: "8 Drummond St, Edinburgh, EH8 9TU",
  contact: "+44 7765 899429",
  dbPrefix: "tattoo",
  openingHour: 11,
  closingHour: 20,
  slotInterval: 30,
  closedDays: [0], // Sunday closed
  depositPercentage: 20, // 20% deposit
  currencySymbol: "$",
  services: [
    { id: "tattoo", name: "Custom Tattoo Session", price: 120, durationMin: 60 },
    { id: "permanent", name: "Permanent Make-up", price: 200, durationMin: 120 },
    { id: "laser", name: "Laser Removal Session", price: 80, durationMin: 30 },
    { id: "piercing", name: "Body Piercing Session", price: 40, durationMin: 20 }
  ],
  artists: [
    { id: "marcel", name: "Marcel", specialty: "Black & Grey Realism", avatarEmoji: "🎨", workingDays: [1, 2, 3, 4, 5] },
    { id: "tomek", name: "Tomek", specialty: "Traditional & Neo-Traditional", avatarEmoji: "✒️", workingDays: [1, 2, 3, 4] },
    { id: "konrad", name: "Konrad", specialty: "Geometric & Dotwork", avatarEmoji: "📐", workingDays: [3, 4, 5, 6] },
    { id: "viktor", name: "Viktor", specialty: "Japanese Realism", avatarEmoji: "🐉", workingDays: [5, 6] }
  ],
  staffLabel: "Artist",
  staffLabelPlural: "Artists",
  notesLabel: "Special Notes / Design Ideas",
  adminNotesLabel: "Aftercare Instructions",
  internalNotesLabel: "Internal Studio Notes",
  checklist: [
    "Arrive 10 minutes prior to your scheduled slot.",
    "Bring reference photos or custom artwork files.",
    "Ensure you have eaten and are well hydrated.",
    "Wear comfortable clothing exposing the target area."
  ],
  theme: {
    primaryColor: "#09090b",
    cardBg: "rgba(20, 20, 23, 0.85)",
    accentColor: "#10b981", // Emerald accent
    accentHover: "#34d399",
    borderRadius: "12px",
    fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif"
  }
}
