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
  currencySymbol: string
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
  name: "Apex Language Academy",
  tagline: "Premium Language Courses & Academic Tutoring",
  address: "88 Education Way, Suite 100, Dallas, TX 75201",
  contact: "+1 (214) 555-0152",
  openingHour: 9,
  closingHour: 20,
  slotInterval: 30,
  closedDays: [0], // Sunday closed
  depositPercentage: 0, // 0% deposit
  dbPrefix: "academic",
  currencySymbol: "$",
  services: [
    { id: "english-gen", name: "English General Course", price: 50, durationMin: 45 },
    { id: "spanish-int", name: "Spanish Intensive Class", price: 75, durationMin: 60 },
    { id: "sat-prep", name: "Private SAT Prep Tutoring", price: 90, durationMin: 60 },
    { id: "french-conv", name: "French Conversation Practice", price: 60, durationMin: 45 }
  ],
  artists: [
    { id: "sarah", name: "Prof. Sarah Jenkins", specialty: "English & French Literature", avatarEmoji: "👩‍🏫", workingDays: [1, 2, 3, 4, 5] },
    { id: "alan", name: "Prof. Alan Sterling", specialty: "Spanish Philology & SAT Mathematics", avatarEmoji: "👨‍🏫", workingDays: [1, 2, 3, 4] }
  ],
  staffLabel: "Instructor",
  staffLabelPlural: "Instructors",
  notesLabel: "Special Learning Requests / Accommodations",
  adminNotesLabel: "Homework Assignments & Study Material",
  internalNotesLabel: "Internal Faculty Assessment Notes",
  checklist: [
    "Download the digital textbook PDF sent to your email.",
    "Bring a notebook, pen, and your laptop or tablet.",
    "Complete any pre-assigned reading or homework.",
    "Join the virtual student portal 5 minutes before class starts (if online)."
  ],
  theme: {
    primaryColor: "#fbfbfa", // soft warm cream background
    cardBg: "rgba(255, 255, 255, 0.85)", // frosted white glass card
    accentColor: "#0d9488",  // classic academic teal
    accentHover: "#115e59",  // hover teal
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
  }
}
