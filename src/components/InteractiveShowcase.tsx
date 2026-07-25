import { useState } from 'react'
import {
  StudioIcon,
  ClinicIcon,
  AcademicIcon,
  ContractorIcon,
  CheckIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon
} from './ui/Icons'

type TabKey = 'studio' | 'clinic' | 'academic' | 'contractor'

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>('studio')

  const tabs: {
    key: TabKey
    label: string
    subtitle: string
    icon: React.ReactNode
    accent: string
    badge: string
    demoUrl: string
    features: string[]
    mockData: {
      title: string
      badge: string
      rows: { label: string; detail: string; status: string; statusBg: string; statusColor: string }[]
    }
  }[] = [
    {
      key: 'studio',
      label: 'Creative Studios',
      subtitle: 'Tattoo, Piercing & Craft Studios',
      icon: <StudioIcon size={18} />,
      accent: '#10b981',
      badge: 'Client & Deposit Engine',
      demoUrl: 'https://tattoo.nativebooking.co',
      features: [
        'Client queue & artist split-view',
        'Deposit collection via integrated Stripe',
        'Custom consent & aftercare notes',
        'Multi-artist schedule synchronization'
      ],
      mockData: {
        title: 'Ink & Art Studio — Live Queue',
        badge: '4 Appointments Today',
        rows: [
          { label: 'Marcel S. — Sleeve Tattoo Session', detail: '10:00 AM · Artist: Marcel · Deposit Paid ($50)', status: 'Confirmed', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'Elena R. — Wrist Fine Line', detail: '01:30 PM · Artist: Sophia · Deposit Paid ($30)', status: 'In Progress', statusBg: 'rgba(14, 165, 233, 0.12)', statusColor: '#38bdf8' },
          { label: 'David K. — Custom Consult', detail: '04:00 PM · Artist: Marcel · Consult Only', status: 'Upcoming', statusBg: 'rgba(245, 158, 11, 0.12)', statusColor: '#fbbf24' }
        ]
      }
    },
    {
      key: 'clinic',
      label: 'Clinics & Medical',
      subtitle: 'Dental, Chiropractic & Wellness',
      icon: <ClinicIcon size={18} />,
      accent: '#0ea5e9',
      badge: 'Patient Intake & Roster',
      demoUrl: 'https://dental.nativebooking.co',
      features: [
        'Clean clinical workflow & doctor roster',
        'Symptom & intake notes collection',
        'No-deposit flexible booking option',
        'Automated patient appointment reminders'
      ],
      mockData: {
        title: 'Apex Dental & Health — Patient Board',
        badge: '6 Patients Scheduled',
        rows: [
          { label: 'Dr. Aris V. — Teeth Cleaning & X-Ray', detail: '09:00 AM · Room 2 · Intake Form Completed', status: 'Checked In', statusBg: 'rgba(14, 165, 233, 0.12)', statusColor: '#38bdf8' },
          { label: 'Dr. Maya L. — Orthodontic Check', detail: '11:15 AM · Room 1 · Follow-up Session', status: 'Confirmed', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'Dr. Aris V. — Emergency Consult', detail: '02:00 PM · Room 3 · Symptom Note Attached', status: 'Pending', statusBg: 'rgba(245, 158, 11, 0.12)', statusColor: '#fbbf24' }
        ]
      }
    },
    {
      key: 'academic',
      label: 'Education & Academies',
      subtitle: 'Schools, Tutors & Training Hubs',
      icon: <AcademicIcon size={18} />,
      accent: '#0d9488',
      badge: 'Class & Student Portal',
      demoUrl: 'https://academic.nativebooking.co',
      features: [
        'Course enrollment & student portals',
        'Instructor timetable management',
        'Automated attendance & lesson logs',
        'Multi-student class slot capacity'
      ],
      mockData: {
        title: 'Vanguard Academy — Class Roster',
        badge: '18 Students Enrolled',
        rows: [
          { label: 'Advanced Coding Boot Camp — Module 4', detail: '10:00 AM · Instructor: Alex · 12/15 Seats Filled', status: 'Active Class', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'UX Design Workshop — Session 2', detail: '02:00 PM · Instructor: Sarah · 8/10 Seats Filled', status: 'Open Slots', statusBg: 'rgba(14, 165, 233, 0.12)', statusColor: '#38bdf8' }
        ]
      }
    },
    {
      key: 'contractor',
      label: 'Contractors & Crews',
      subtitle: 'HVAC, Construction & Home Services',
      icon: <ContractorIcon size={18} />,
      accent: '#f59e0b',
      badge: 'Crew Dispatch & Timing',
      demoUrl: 'https://contractor.nativebooking.co',
      features: [
        'Job dispatch board & site address routing',
        'Field technician & crew assignment',
        'Timing & job site labor bookkeeping',
        'Internal operational pipeline (no guest portal needed)'
      ],
      mockData: {
        title: 'Apex HVAC & Trade Dispatch Board',
        badge: '3 Active Field Crews',
        rows: [
          { label: 'Crew A (John & Pete) — Commercial HVAC Repair', detail: '08:00 AM - 12:00 PM · Site: 144 Oak St · Parts On-Site', status: 'On Site', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'Crew B (Mark) — Residential Duct Inspection', detail: '01:00 PM - 03:30 PM · Site: 88 Elm Ave · Labor Hours Tracked', status: 'Dispatched', statusBg: 'rgba(245, 158, 11, 0.12)', statusColor: '#fbbf24' }
        ]
      }
    }
  ]

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        background: 'rgba(22, 24, 29, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-color)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Tailored Workflow Engine
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          One Platform. Unlimited Industry Workflows.
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Select an industry below to see how NativeBooking configures custom rules, rosters, timing, and customer portals.
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          marginBottom: '28px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isActive ? tab.accent : 'rgba(255, 255, 255, 0.06)'}`,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: isActive ? `${tab.accent}22` : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? tab.accent : 'var(--text-secondary)',
                  display: 'flex',
                }}
              >
                {tab.icon}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? '#ffffff' : 'var(--text-primary)' }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tab.subtitle}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Tab Workspace Interactive Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '24px',
          background: 'rgba(12, 13, 16, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        {/* Features Column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: `${currentTab.accent}18`,
                border: `1px solid ${currentTab.accent}40`,
                color: currentTab.accent,
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              {currentTab.badge}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              {currentTab.label} System
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              Tailored operational rules, automated messaging, and custom database schemas built specifically for {currentTab.subtitle.toLowerCase()}.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {currentTab.features.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#f8fafc' }}>
                  <CheckIcon size={16} style={{ color: currentTab.accent, flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={currentTab.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: currentTab.accent,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            Launch Live {currentTab.label} Sandbox ➔
          </a>
        </div>

        {/* Live Interactive UI Mockup Card */}
        <div
          style={{
            background: 'rgba(20, 22, 27, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{currentTab.mockData.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Central Operational Dashboard</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: currentTab.accent, background: `${currentTab.accent}15`, padding: '3px 8px', borderRadius: '6px' }}>
              {currentTab.mockData.badge}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentTab.mockData.rows.map((row, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.detail}</div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: row.statusBg,
                    color: row.statusColor,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
