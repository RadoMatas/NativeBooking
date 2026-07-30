import { useState } from 'react'
import {
  StudioIcon,
  ClinicIcon,
  AcademicIcon,
  ContractorIcon,
  CheckIcon,
  SettingsIcon,
  UsersIcon
} from './ui/Icons'

type TabKey = 'studio' | 'clinic' | 'academic' | 'contractor'
type ViewMode = 'customer' | 'admin'

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>('studio')
  const [viewMode, setViewMode] = useState<ViewMode>('admin')

  const tabs = [
    {
      key: 'studio' as TabKey,
      label: 'Creative Studios',
      subtitle: 'Tattoo, Piercing & Craft Studios',
      shortSubtitle: 'Tattoo & Craft',
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
      adminData: {
        title: 'Ink & Art Studio — Admin Operations Board',
        badge: '4 Active Appointments Today',
        rows: [
          { label: 'Marcel S. — Sleeve Tattoo Session', detail: '10:00 AM · Artist: Marcel · Deposit Paid ($50)', status: 'Confirmed', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'Elena R. — Wrist Fine Line', detail: '01:30 PM · Artist: Sophia · Deposit Paid ($30)', status: 'In Progress', statusBg: 'rgba(14, 165, 233, 0.12)', statusColor: '#38bdf8' },
          { label: 'David K. — Custom Consult', detail: '04:00 PM · Artist: Marcel · Consult Only', status: 'Upcoming', statusBg: 'rgba(245, 158, 11, 0.12)', statusColor: '#fbbf24' }
        ]
      },
      customerData: {
        title: 'Ink & Art Studio — Direct Guest Booking',
        badge: 'Select Artist & Slot',
        fields: [
          { label: 'Selected Service', val: 'Custom Full Sleeve Session (4 hrs)' },
          { label: 'Choose Artist', val: 'Marcel S. (Sleeve & Realism Specialist)' },
          { label: 'Date & Time', val: 'Tomorrow · 10:00 AM (CET)' },
          { label: 'Deposit Due Today', val: '$50.00 (Powered by Stripe 256-bit SSL)' }
        ]
      }
    },
    {
      key: 'clinic' as TabKey,
      label: 'Clinics & Medical',
      subtitle: 'Dental, Chiropractic & Wellness',
      shortSubtitle: 'Dental & Health',
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
      adminData: {
        title: 'Apex Dental & Health — Patient Clinical Board',
        badge: '6 Patients Scheduled',
        rows: [
          { label: 'Dr. Aris V. — Teeth Cleaning & X-Ray', detail: '09:00 AM · Room 2 · Intake Form Completed', status: 'Checked In', statusBg: 'rgba(14, 165, 233, 0.12)', statusColor: '#38bdf8' },
          { label: 'Dr. Maya L. — Orthodontic Check', detail: '11:15 AM · Room 1 · Follow-up Session', status: 'Confirmed', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'Dr. Aris V. — Emergency Consult', detail: '02:00 PM · Room 3 · Symptom Note Attached', status: 'Pending', statusBg: 'rgba(245, 158, 11, 0.12)', statusColor: '#fbbf24' }
        ]
      },
      customerData: {
        title: 'Apex Dental & Health — Patient Booking Portal',
        badge: 'Zero Deposit Required',
        fields: [
          { label: 'Requested Service', val: 'Comprehensive Dental Exam & Cleaning' },
          { label: 'Attending Practitioner', val: 'Dr. Aris V. (Lead Dentist)' },
          { label: 'Preferred Time', val: 'Friday · 09:00 AM (CET)' },
          { label: 'Intake Questionnaire', val: 'Medical History & Symptoms Form Attached' }
        ]
      }
    },
    {
      key: 'academic' as TabKey,
      label: 'Education & Academies',
      subtitle: 'Schools, Tutors & Training Hubs',
      shortSubtitle: 'Courses & Hubs',
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
      adminData: {
        title: 'Vanguard Academy — Class Roster & Instructor Board',
        badge: '18 Students Enrolled',
        rows: [
          { label: 'Advanced Coding Boot Camp — Module 4', detail: '10:00 AM · Instructor: Alex · 12/15 Seats Filled', status: 'Active Class', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'UX Design Workshop — Session 2', detail: '02:00 PM · Instructor: Sarah · 8/10 Seats Filled', status: 'Open Slots', statusBg: 'rgba(14, 165, 233, 0.12)', statusColor: '#38bdf8' }
        ]
      },
      customerData: {
        title: 'Vanguard Academy — Student Course Registration',
        badge: 'Instant Seat Reservation',
        fields: [
          { label: 'Selected Course', val: 'Full-Stack Software Architecture' },
          { label: 'Lead Instructor', val: 'Alex M. (Senior Architect)' },
          { label: 'Schedule', val: 'Mon & Wed · 10:00 AM (CET)' },
          { label: 'Enrollment Fee', val: '$250.00 (Includes Course Materials)' }
        ]
      }
    },
    {
      key: 'contractor' as TabKey,
      label: 'Contractors & Crews',
      subtitle: 'HVAC, Construction & Home Services',
      shortSubtitle: 'Crews & Dispatch',
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
      adminData: {
        title: 'Apex HVAC & Trade — Field Dispatch Board',
        badge: '3 Active Field Crews',
        rows: [
          { label: 'Crew A (John & Pete) — Commercial HVAC Repair', detail: '08:00 AM - 12:00 PM · Site: 144 Oak St · Parts On-Site', status: 'On Site', statusBg: 'rgba(16, 185, 129, 0.12)', statusColor: '#34d399' },
          { label: 'Crew B (Mark) — Residential Duct Inspection', detail: '01:00 PM - 03:30 PM · Site: 88 Elm Ave · Labor Hours Tracked', status: 'Dispatched', statusBg: 'rgba(245, 158, 11, 0.12)', statusColor: '#fbbf24' }
        ]
      },
      customerData: {
        title: 'Apex HVAC & Trade — Service Request Portal',
        badge: 'Job Site Dispatch',
        fields: [
          { label: 'Requested Service', val: 'Emergency HVAC Heating System Repair' },
          { label: 'Assigned Dispatch Crew', val: 'Crew A (Commercial Specialist Team)' },
          { label: 'Site Address', val: '144 Oak St, Building B, Floor 2' },
          { label: 'Labor Booking Status', val: 'Scheduled · Priority Field Dispatch' }
        ]
      }
    }
  ]

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0]

  return (
    <div
      className="showcase-outer-card"
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        background: 'rgba(22, 24, 29, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '36px 28px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <span style={{ 
            padding: '6px 14px', 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: 'var(--accent-color)', 
            fontWeight: 700 
          }}>
            Dual-View Operational Workbench
          </span>
        </div>
        <h2 className="aave-section-title" style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Experience Customer Booking & Admin Control Side-by-Side
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Select an industry below and toggle between the Customer Booking Portal and Admin Operations Board.
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        className="showcase-tabs-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
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
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '16px',
                background: isActive 
                  ? `linear-gradient(135deg, ${tab.accent}25 0%, rgba(20, 22, 28, 0.95) 100%)` 
                  : `${tab.accent}08`,
                border: `1.5px solid ${isActive ? tab.accent : `${tab.accent}30`}`,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? `0 8px 24px ${tab.accent}35` : `0 2px 10px rgba(0,0,0,0.2)`,
                transform: isActive ? 'translateY(-2px)' : 'none',
              }}
            >
              <div
                style={{
                  padding: '9px',
                  borderRadius: '12px',
                  background: isActive ? tab.accent : `${tab.accent}20`,
                  color: isActive ? '#090a0f' : tab.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? `0 0 12px ${tab.accent}80` : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {tab.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#ffffff' : tab.accent, wordBreak: 'break-word' }}>
                    {tab.label}
                  </span>
                </div>
                <div className="showcase-tab-subtitle-desktop" style={{ fontSize: '11px', color: isActive ? '#cbd5e1' : '#94a3b8' }}>{tab.subtitle}</div>
                <div className="showcase-tab-subtitle-mobile" style={{ fontSize: '11px', color: isActive ? '#cbd5e1' : '#94a3b8', fontWeight: 500 }}>{tab.shortSubtitle}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* View Mode Toggle Header */}
      <div
        className="showcase-toggle-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() => setViewMode('admin')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: viewMode === 'admin' ? `1px solid ${currentTab.accent}` : '1px solid rgba(255,255,255,0.08)',
            background: viewMode === 'admin' ? `${currentTab.accent}22` : 'rgba(255,255,255,0.02)',
            color: viewMode === 'admin' ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <SettingsIcon size={15} /> Admin Control Board
        </button>
        <button
          onClick={() => setViewMode('customer')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: viewMode === 'customer' ? `1px solid ${currentTab.accent}` : '1px solid rgba(255,255,255,0.08)',
            background: viewMode === 'customer' ? `${currentTab.accent}22` : 'rgba(255,255,255,0.02)',
            color: viewMode === 'customer' ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <UsersIcon size={15} /> Customer Booking View
        </button>
      </div>

      {/* Active Tab Workspace Interactive Panel */}
      <div
        className="showcase-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '24px',
          background: 'rgba(12, 13, 16, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
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
              padding: '12px 18px',
              borderRadius: '9999px',
              background: currentTab.accent,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 16px ${currentTab.accent}40`,
              maxWidth: '100%',
              boxSizing: 'border-box',
              textAlign: 'center',
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
          {viewMode === 'admin' ? (
            /* Admin Operations Board View */
            <>
              <div className="showcase-mock-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word' }}>{currentTab.adminData.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Central Manager Control Hub</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: currentTab.accent, background: `${currentTab.accent}15`, padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  {currentTab.adminData.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentTab.adminData.rows.map((row, index) => (
                  <div
                    key={index}
                    className="showcase-mock-row"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '2px', wordBreak: 'break-word' }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>{row.detail}</div>
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
            </>
          ) : (
            /* Customer Direct Booking Portal View */
            <>
              <div className="showcase-mock-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word' }}>{currentTab.customerData.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Client Self-Service Experience</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: currentTab.accent, background: `${currentTab.accent}15`, padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  {currentTab.customerData.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentTab.customerData.fields.map((f, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '3px' }}>
                      {f.label}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-word' }}>
                      {f.val}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
