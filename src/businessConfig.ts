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
  name: "Sanatorium Tattoo",
  tagline: "Award-Winning Tattoo Studio",
  address: "8 Drummond St, Edinburgh, EH8 9TU",
  contact: "+44 7765 899429",
  openingHour: 11,
  closingHour: 20,
  slotInterval: 30,
  closedDays: [0], // Sunday closed
  depositPercentage: 0, // 20% deposit
  services: [
    { id: "tattoo", name: "Tattoo Session", price: 120, durationMin: 60 },
    { id: "permanent", name: "Permanent Make-up", price: 200, durationMin: 120 },
    { id: "laser", name: "Laser Removal Session", price: 80, durationMin: 30 },
    { id: "piercing", name: "Piercing Session", price: 40, durationMin: 20 }
  ],
  artists: [
    { id: "marcel", name: "Marcel", specialty: "Black & Grey Realism", avatarEmoji: "🎨", workingDays: [1, 2, 3, 4, 5] },
    { id: "tomek", name: "Tomek", specialty: "Traditional & Neo-Traditional", avatarEmoji: "✒️", workingDays: [1, 2, 3, 4] },
    { id: "konrad", name: "Konrad", specialty: "Geometric & Dotwork", avatarEmoji: "📐", workingDays: [3, 4, 5, 6] },
    { id: "viktor", name: "Viktor", specialty: "Japanese Realism", avatarEmoji: "🐉", workingDays: [5, 6] }
  ],
  staffLabel: "Artist",
  staffLabelPlural: "Artists",
  notesLabel: "Special Notes / Requests",
  adminNotesLabel: "Aftercare Instructions",
  internalNotesLabel: "Internal Admin Notes",
  checklist: [
    "Please arrive 10 minutes early.",
    "Bring any reference photos or design ideas.",
    "Ensure you have eaten and are well hydrated.",
    "Wear comfortable clothing exposing the tattoo area."
  ],
  theme: {
    primaryColor: "#09090b", // zinc 950
    cardBg: "rgba(20, 20, 23, 0.8)", // zinc 900 glass
    accentColor: "#10b981",  // emerald green
    accentHover: "#34d399",  // light emerald
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
  }
}
