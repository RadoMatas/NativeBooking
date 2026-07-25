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
  name: "Apex Trade & Field Crew Dispatch",
  tagline: "Industrial Dispatch Board & Crew Timing Operations",
  address: "500 Industrial Parkway, Dispatch Hub 12, TX 75001",
  contact: "+1 (800) 555-TRADE",
  dbPrefix: "contractor",
  openingHour: 7,
  closingHour: 19,
  slotInterval: 60,
  closedDays: [0], // Sunday closed
  depositPercentage: 0,
  currencySymbol: "$",
  services: [
    { id: "hvac_comm", name: "Commercial HVAC System Repair & Overhaul", price: 280, durationMin: 180 },
    { id: "duct_res", name: "Residential Heating & Air Inspection", price: 140, durationMin: 90 },
    { id: "elec_emerg", name: "Emergency Electrical Panel Repair", price: 220, durationMin: 120 },
    { id: "plumb_site", name: "Job Site Plumbing & Pipe Maintenance", price: 350, durationMin: 240 }
  ],
  artists: [
    { id: "crew_a", name: "Crew A (John & Pete)", specialty: "Commercial HVAC & Heat Pumps", avatarEmoji: "🏗️", workingDays: [1, 2, 3, 4, 5] },
    { id: "crew_b", name: "Crew B (Mark & Dave)", specialty: "Residential Air & Ductwork", avatarEmoji: "🔧", workingDays: [1, 2, 3, 4, 5] },
    { id: "crew_c", name: "Crew C (Sam)", specialty: "Master Electrical Specialist", avatarEmoji: "⚡", workingDays: [1, 2, 3, 4, 5, 6] }
  ],
  staffLabel: "Field Crew",
  staffLabelPlural: "Field Crews",
  notesLabel: "Site Address & Gate Code Notes",
  adminNotesLabel: "Labor Hours & Dispatch Timing Log",
  internalNotesLabel: "Internal Dispatch & Parts Bookkeeping",
  checklist: [
    "Verify site address, gate codes, and building contact.",
    "Confirm parts & heavy tool inventory pre-loaded on truck.",
    "Log technician start time upon arrival at job site.",
    "Obtain client signature upon completion of work order."
  ],
  theme: {
    primaryColor: "#110f0a", // Industrial charcoal background
    cardBg: "rgba(245, 158, 11, 0.08)", // Translucent industrial amber panel
    accentColor: "#f59e0b", // Industrial Amber Accent
    accentHover: "#fbbf24",
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  }
}
