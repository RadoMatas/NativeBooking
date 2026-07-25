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
  name: "Vanguard Academy & Learning Hub",
  tagline: "High-Impact Software Architecture & Design Courses",
  address: "100 Tech University Way, Innovation Park, CA 94107",
  contact: "+1 (415) 555-VANGUARD",
  dbPrefix: "academic",
  openingHour: 9,
  closingHour: 21,
  slotInterval: 60,
  closedDays: [0], // Sunday closed
  depositPercentage: 10, // 10% enrollment seat deposit
  currencySymbol: "$",
  services: [
    { id: "bootcamp", name: "Full-Stack Software Architecture Bootcamp", price: 250, durationMin: 120 },
    { id: "ux_intensive", name: "UX/UI Design & Product Intensive", price: 180, durationMin: 90 },
    { id: "data_seminar", name: "Data Engineering & AI Systems Seminar", price: 200, durationMin: 120 },
    { id: "mentorship", name: "1-on-1 Code Review & Career Mentorship", price: 90, durationMin: 60 }
  ],
  artists: [
    { id: "alex", name: "Alex Mercer", specialty: "Senior Systems Architect", avatarEmoji: "💻", workingDays: [1, 2, 3, 4, 5] },
    { id: "sarah", name: "Sarah Jenkins", specialty: "Lead UX Researcher & Designer", avatarEmoji: "🎨", workingDays: [1, 2, 3, 4] },
    { id: "david", name: "David Kim", specialty: "Principal Data Engineer", avatarEmoji: "📊", workingDays: [2, 3, 4, 5, 6] }
  ],
  staffLabel: "Instructor",
  staffLabelPlural: "Instructors",
  notesLabel: "Pre-Requisite Knowledge / Goals",
  adminNotesLabel: "Attendance & Syllabus Notes",
  internalNotesLabel: "Internal Student Progress Log",
  checklist: [
    "Verify laptop specs & development environment setup.",
    "Complete initial pre-course code assessment.",
    "Join the dedicated Discord student workspace.",
    "Review syllabus and instructor office hours."
  ],
  theme: {
    primaryColor: "#071215", // Deep campus teal background
    cardBg: "rgba(13, 148, 136, 0.08)", // Translucent teal panel
    accentColor: "#0d9488", // Deep Campus Teal accent
    accentHover: "#14b8a6",
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  }
}
