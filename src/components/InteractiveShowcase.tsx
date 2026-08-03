import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  StudioIcon,
  ClinicIcon,
  AcademicIcon,
  ContractorIcon,
  CheckIcon,
  SettingsIcon,
  UsersIcon,
  ToolboxIcon,
  LockIcon,
  ZapIcon,
  ArrowRightIcon
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
    <motion.div
      className="showcase-outer-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        background: 'linear-gradient(165deg, rgba(24, 27, 35, 0.95) 0%, rgba(14, 16, 22, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: 'clamp(16px, 3.5vw, 32px)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(24px)',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Precision Hardware Tool Chassis Top Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '14px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ToolboxIcon size={18} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', color: '#34d399', textTransform: 'uppercase' }}>
            NATIVEBOOKING ENGINE TOOLBOX
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span className="showcase-tab-subtitle-desktop" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ZapIcon size={13} style={{ color: '#10b981' }} /> 0% COMMISSION</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><LockIcon size={13} style={{ color: '#38bdf8' }} /> 256-BIT SSL</span>
          </span>
        </div>
      </div>

      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 className="aave-section-title" style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Experience Customer Booking & Admin Control Side-by-Side
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Select an industry below and toggle between the Customer Booking Portal and Admin Operations Board.
        </p>
      </div>

            {/* Hardware Tool Rack Buttons */}
            <div
              className="showcase-tabs-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isActive 
                        ? `linear-gradient(135deg, ${tab.accent}25 0%, rgba(20, 22, 28, 0.95) 100%)` 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${isActive ? tab.accent : `${tab.accent}30`}`,
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                      boxShadow: isActive ? `0 8px 24px ${tab.accent}35` : `0 2px 10px rgba(0,0,0,0.2)`,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        background: isActive ? tab.accent : `${tab.accent}20`,
                        color: isActive ? '#090a0f' : tab.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? `0 0 12px ${tab.accent}80` : 'none',
                        flexShrink: 0,
                      }}
                    >
                      {tab.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#ffffff' : tab.accent, wordBreak: 'break-word' }}>
                        {tab.label}
                      </div>
                      <div className="showcase-tab-subtitle-desktop" style={{ fontSize: '11px', color: isActive ? '#cbd5e1' : '#94a3b8' }}>{tab.subtitle}</div>
                      <div className="showcase-tab-subtitle-mobile" style={{ fontSize: '11px', color: isActive ? '#cbd5e1' : '#94a3b8', fontWeight: 500 }}>{tab.shortSubtitle}</div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Tactical Spring Latch Mode Toggle Header */}
            <div
              className="showcase-toggle-bar"
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                background: 'rgba(10, 11, 15, 0.8)',
                padding: '5px',
                borderRadius: '9999px',
                width: 'fit-content',
                margin: '0 auto 20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <motion.button
                onClick={() => setViewMode('admin')}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: viewMode === 'admin' ? currentTab.accent : 'transparent',
                  color: viewMode === 'admin' ? '#090a0f' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: viewMode === 'admin' ? `0 0 14px ${currentTab.accent}60` : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <SettingsIcon size={14} /> Admin Board
              </motion.button>
              <motion.button
                onClick={() => setViewMode('customer')}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: viewMode === 'customer' ? currentTab.accent : 'transparent',
                  color: viewMode === 'customer' ? '#090a0f' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: viewMode === 'customer' ? `0 0 14px ${currentTab.accent}60` : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <UsersIcon size={14} /> Guest Booking
              </motion.button>
            </div>

            {/* Active Tab Workspace Interactive Panel with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${viewMode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="showcase-workspace-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                  gap: '20px',
                  background: 'rgba(10, 11, 15, 0.85)',
                  border: `1px solid ${currentTab.accent}30`,
                  borderRadius: '18px',
                  padding: 'clamp(14px, 3vw, 24px)',
                  boxShadow: `0 12px 36px rgba(0, 0, 0, 0.5), inset 0 0 20px ${currentTab.accent}08`,
                }}
              >
                {/* Features Column */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
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
                        marginBottom: '12px',
                      }}
                    >
                      {currentTab.badge}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                      {currentTab.label} System
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                      Tailored operational rules, automated messaging, and custom database schemas built specifically for {currentTab.subtitle.toLowerCase()}.
                    </p>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      {currentTab.features.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#f8fafc' }}>
                          <CheckIcon size={15} style={{ color: currentTab.accent, flexShrink: 0 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.a
                    href={currentTab.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '11px 16px',
                      borderRadius: '9999px',
                      background: currentTab.accent,
                      color: '#090a0f',
                      fontWeight: 800,
                      fontSize: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: `0 4px 16px ${currentTab.accent}50`,
                      width: '100%',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                    }}
                  >
                    <span>Launch Live {currentTab.label} Sandbox</span>
                    <ArrowRightIcon size={14} />
                  </motion.a>
                </div>

                {/* Live Interactive UI Mockup Card */}
                <div
                  style={{
                    background: 'rgba(18, 20, 26, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                >
                  {viewMode === 'admin' ? (
                    /* Admin Operations Board View */
                    <>
                      <div className="showcase-mock-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word' }}>{currentTab.adminData.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Central Manager Control Hub</div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: currentTab.accent, background: `${currentTab.accent}15`, padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          {currentTab.adminData.badge}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {currentTab.adminData.rows.map((row, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            className="showcase-mock-row"
                            style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '10px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', marginBottom: '2px', wordBreak: 'break-word' }}>
                                {row.label}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>{row.detail}</div>
                            </div>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: row.statusBg,
                                color: row.statusColor,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {row.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Customer Direct Booking Portal View */
                    <>
                      <div className="showcase-mock-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word' }}>{currentTab.customerData.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Client Self-Service Experience</div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: currentTab.accent, background: `${currentTab.accent}15`, padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          {currentTab.customerData.badge}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {currentTab.customerData.fields.map((f, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                            }}
                          >
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                              {f.label}
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-word' }}>
                              {f.val}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
    </motion.div>
  )
}

