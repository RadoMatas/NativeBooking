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
  name: "Apex Field Services",
  tagline: "HVAC, Plumbing, Electrical & Contractor Dispatch",
  address: "Field Operations & Dispatch Hub",
  contact: "+48 123 456 789",
  openingHour: 7,
  closingHour: 19,
  slotInterval: 60,
  closedDays: [0], // Sunday closed
  depositPercentage: 0,
  currencySymbol: "$",
  services: [
    { id: "hvac", name: "HVAC Diagnostics & Repair", price: 150, durationMin: 120 },
    { id: "renovation", name: "Bathroom & Interior Renovation", price: 1200, durationMin: 480 },
    { id: "electrical", name: "Electrical Rewiring & Panel Upgrade", price: 350, durationMin: 180 },
    { id: "plumbing", name: "Emergency Plumbing & Pipe Repair", price: 200, durationMin: 90 },
    { id: "roofing", name: "Roof Inspection & Waterproofing", price: 450, durationMin: 240 }
  ],
  artists: [
    { id: "marek", name: "Marek Kowal", specialty: "Master Plumber & HVAC Specialist", avatarEmoji: "🔧", workingDays: [1, 2, 3, 4, 5] },
    { id: "piotr", name: "Piotr Nowak", specialty: "Licensed Master Electrician", avatarEmoji: "⚡", workingDays: [1, 2, 3, 4, 5] },
    { id: "tomek", name: "Tomek Wisniewski", specialty: "General Contractor & Renovation Lead", avatarEmoji: "🔨", workingDays: [1, 2, 3, 4, 6] },
    { id: "viktor", name: "Viktor Dubczak", specialty: "Roofing & Structural Inspector", avatarEmoji: "🏗️", workingDays: [1, 2, 3, 5, 6] }
  ],
  staffLabel: "Technician",
  staffLabelPlural: "Technicians",
  notesLabel: "Job Site Address & Work Specs",
  adminNotesLabel: "Dispatched Equipment & Site Instructions",
  internalNotesLabel: "Required Materials Checklist",
  checklist: [
    "Verify site access and safety gear (hard hat, steel boots).",
    "Confirm required tools and replacement parts in van inventory.",
    "Call client 15 minutes before arrival at job site.",
    "Document before and after site photos upon completion."
  ],
  theme: {
    primaryColor: "#0f172a", // slate 900
    cardBg: "rgba(30, 41, 59, 0.8)", // slate 800 glass
    accentColor: "#f59e0b", // amber gold
    accentHover: "#fbbf24", // bright amber
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  }
}
