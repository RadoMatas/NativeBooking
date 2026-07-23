import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { currentUserRole, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'

export default function CustomerDB() {
  const navigate = useNavigate()
  const { bookings, updateBooking, addNotification, resetBookings } = useBooking()
  const [activeTechId, setActiveTechId] = useState(BUSINESS_CONFIG.artists[0].id)

  // Status Filter State for Technician
  const [statusFilter, setStatusFilter] = useState<'all' | 'unacknowledged' | 'acknowledged' | 'in_progress' | 'completed' | 'declined'>('all')

  // Decline Modal State
  const [decliningJob, setDecliningJob] = useState<any | null>(null)
  const [declineReasonText, setDeclineReasonText] = useState('')

  // Completion Report Modal State
  const [completingJob, setCompletingJob] = useState<any | null>(null)
  const [completionReportText, setCompletionReportText] = useState('')

  // Reschedule On-Start Modal State
  const [rescheduleStartJob, setRescheduleStartJob] = useState<any | null>(null)
  const [newJobDate, setNewJobDate] = useState('')
  const [newJobTime, setNewJobTime] = useState('09:00')
  const [rescheduleNote, setRescheduleNote] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const activeRole = currentUserRole || sessionStorage.getItem('currentUserRole')
  if (!activeRole) {
    return <Navigate to="/login" replace />
  }

  const selectedTech = BUSINESS_CONFIG.artists.find((a) => a.id === activeTechId) || BUSINESS_CONFIG.artists[0]

  // Filter jobs assigned to the selected technician
  const techJobs = bookings.filter((b) => b.artistId === activeTechId)
  
  // Unacknowledged jobs ONLY counts jobs that are NOT completed and NOT cancelled/declined!
  const unacknowledgedJobs = techJobs.filter(
    (b) =>
      !b.acknowledgedByTech &&
      b.status !== 'Completed' &&
      b.adminStatus !== 'Completed' &&
      b.status !== 'Cancelled' &&
      b.adminStatus !== 'Declined by Tech'
  )

  const filteredJobs = techJobs.filter((job) => {
    const isCompleted = job.status === 'Completed' || job.adminStatus === 'Completed'
    const isInProgress = job.adminStatus === 'In Progress'
    const isAcknowledged = job.acknowledgedByTech || job.adminStatus === 'Acknowledged'
    const isDeclined = job.adminStatus === 'Declined by Tech' || (job.status === 'Cancelled' && job.declineReason)
    const isUnack = !job.acknowledgedByTech && !isCompleted && !isDeclined

    if (statusFilter === 'unacknowledged') return isUnack
    if (statusFilter === 'acknowledged') return isAcknowledged && !isInProgress && !isCompleted
    if (statusFilter === 'in_progress') return isInProgress
    if (statusFilter === 'completed') return isCompleted
    if (statusFilter === 'declined') return isDeclined
    return true
  })

  const handleAcknowledge = (job: any) => {
    updateBooking(job.id, {
      ...job,
      acknowledgedByTech: true,
      adminStatus: 'Acknowledged',
      status: 'Confirmed',
    })
    addNotification(`👁️ Technician ${selectedTech.name} ACKNOWLEDGED Job order for ${job.customerName} (${job.service})`)
  }

  // Handle Start Job with Date Verification
  const handleStartJobClick = (job: any) => {
    const today = new Date().toISOString().split('T')[0]

    // If job date is NOT today, prompt technician for rescheduling verification!
    if (job.date !== today) {
      setRescheduleStartJob(job)
      setNewJobDate(today)
      setNewJobTime(job.time || '09:00')
      setRescheduleNote('Rescheduled on site with customer for early start')
      return
    }

    // Standard start for today's job
    executeStartJob(job, job.date, job.time, null)
  }

  const executeStartJob = (job: any, date: string, time: string, noteText?: string | null) => {
    const isRescheduled = date !== job.date || time !== job.time
    const updatedNotes = noteText
      ? `${job.notes || ''} | [RESCHEDULED ON SITE]: ${noteText}`
      : job.notes

    updateBooking(job.id, {
      ...job,
      date: date,
      time: time,
      notes: updatedNotes,
      acknowledgedByTech: true,
      adminStatus: 'In Progress',
      status: 'Confirmed',
    })

    if (isRescheduled) {
      addNotification(`📅 RESCHEDULED: Technician ${selectedTech.name} rescheduled with customer ${job.customerName} — job order data updated to ${date} ${time} & work in progress on site.`)
    } else {
      addNotification(`🚀 Technician ${selectedTech.name} STARTED Job on site for ${job.customerName}`)
    }

    setRescheduleStartJob(null)
  }

  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!completingJob || !completionReportText.trim()) {
      alert('Please fill out the completion report before marking the job as completed.')
      return
    }

    updateBooking(completingJob.id, {
      ...completingJob,
      adminStatus: 'Completed',
      status: 'Completed',
      completionReport: completionReportText,
    })

    addNotification(`✅ Technician ${selectedTech.name} COMPLETED Job for ${completingJob.customerName} — Report: "${completionReportText}"`)
    setCompletingJob(null)
    setCompletionReportText('')
  }

  const handleConfirmDecline = (e: React.FormEvent) => {
    e.preventDefault()
    if (!decliningJob || !declineReasonText.trim()) {
      alert('Please state a reason for declining the job.')
      return
    }

    updateBooking(decliningJob.id, {
      ...decliningJob,
      status: 'Cancelled',
      adminStatus: 'Declined by Tech',
      declineReason: declineReasonText,
      acknowledgedByTech: false,
    })

    addNotification(`🛑 URGENT: Technician ${selectedTech.name} DECLINED Job for ${decliningJob.customerName} — Reason: "${declineReasonText}"`)
    setDecliningJob(null)
    setDeclineReasonText('')
  }

  return (
    <div className="page-container" style={{ paddingBottom: '60px' }}>
      {/* ─── HEADER ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Logo size="small" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {BUSINESS_CONFIG.name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
              🛠️ Field Technician Schedule Portal
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Technician Route Schedule" />
          <button onClick={resetBookings} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '12px' }}>
            Reset Blueprint Data 🔄
          </button>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '12px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* ─── INTERACTIVE UNACKNOWLEDGED JOBS ALERT BANNER ──────── */}
      {unacknowledgedJobs.length > 0 && (
        <div
          onClick={() => setStatusFilter('unacknowledged')}
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <strong style={{ color: '#f59e0b', fontSize: '15px', display: 'block' }}>
                {unacknowledgedJobs.length} Unacknowledged Job Order{unacknowledgedJobs.length > 1 ? 's' : ''} Require Your Action!
              </strong>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Click here to view unacknowledged jobs and confirm them in your schedule.
              </span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ fontSize: '12px', padding: '8px 14px', whiteSpace: 'nowrap' }}
          >
            Filter Pending Jobs →
          </button>
        </div>
      )}

      {/* ─── TECHNICIAN SWITCHER ─────────────────────────────── */}
      <div
        className="premium-card"
        style={{
          marginBottom: '24px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-color)', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
            Active Technician Profile
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
            {selectedTech.avatarEmoji} {selectedTech.name} — <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>{selectedTech.specialty}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Switch Technician Profile:
          </span>
          <select
            value={activeTechId}
            onChange={(e) => setActiveTechId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '14px', background: 'rgba(255,255,255,0.05)' }}
          >
            {BUSINESS_CONFIG.artists.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.avatarEmoji} {tech.name} ({tech.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── STATUS FILTER PILLS FOR TECHNICIAN ────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {[
          { key: 'all', label: `All Jobs (${techJobs.length})` },
          { key: 'unacknowledged', label: `⚠️ Unacknowledged (${unacknowledgedJobs.length})` },
          { key: 'acknowledged', label: '👁️ Acknowledged' },
          { key: 'in_progress', label: '🚀 In Progress' },
          { key: 'completed', label: '✅ Completed' },
          { key: 'declined', label: '🛑 Declined' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key as any)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '20px',
              background: statusFilter === f.key ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${statusFilter === f.key ? 'var(--accent-color)' : 'var(--border-color)'}`,
              color: statusFilter === f.key ? 'var(--accent-color)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── DAILY ROUTE & WORK ORDERS ───────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
          Work Orders ({filteredJobs.length})
        </h2>

        {filteredJobs.length === 0 ? (
          <div className="premium-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🛠️</span>
            <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#ffffff' }}>No Work Orders Found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              No work orders match the selected filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJobs.map((job) => {
              const isCompleted = job.status === 'Completed' || job.adminStatus === 'Completed'
              const isInProgress = job.adminStatus === 'In Progress'
              const isAcknowledged = job.acknowledgedByTech || job.adminStatus === 'Acknowledged'
              const isDeclined = job.adminStatus === 'Declined by Tech' || (job.status === 'Cancelled' && job.declineReason)

              let badgeText = '⏳ Assigned (Unseen)'
              let badgeBg = 'rgba(245, 158, 11, 0.15)'
              let badgeColor = '#f59e0b'

              if (isDeclined) {
                badgeText = '🛑 Declined by Tech'
                badgeBg = 'rgba(239, 68, 68, 0.2)'
                badgeColor = '#f87171'
              } else if (isCompleted) {
                badgeText = '✅ Job Completed'
                badgeBg = 'rgba(16, 185, 129, 0.15)'
                badgeColor = '#34d399'
              } else if (isInProgress) {
                badgeText = '🚀 In Progress (On Site)'
                badgeBg = 'rgba(14, 165, 233, 0.15)'
                badgeColor = '#38bdf8'
              } else if (isAcknowledged) {
                badgeText = '👁️ Acknowledged & In Calendar'
                badgeBg = 'rgba(13, 148, 136, 0.15)'
                badgeColor = '#2dd4bf'
              }

              return (
                <div
                  key={job.id}
                  className="premium-card"
                  style={{
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    border: isDeclined ? '1px solid #f87171' : isInProgress ? '1px solid #38bdf8' : isCompleted ? '1px solid #34d399' : '1px solid var(--border-color)',
                    background: isDeclined ? 'rgba(239, 68, 68, 0.08)' : isInProgress ? 'rgba(14, 165, 233, 0.08)' : isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.8)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          background: badgeBg,
                          color: badgeColor,
                          display: 'inline-block',
                          marginBottom: '8px',
                        }}
                      >
                        {badgeText}
                      </span>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {job.service}
                      </h3>
                    </div>

                    {/* High-Visibility Date & Time Ticket Badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.65)',
                        border: '1px solid rgba(245, 158, 11, 0.45)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', display: 'block' }}>
                          DATE
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                          📅 {job.date}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-color)', display: 'block' }}>
                          TIME
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--accent-color)', whiteSpace: 'nowrap' }}>
                          🕒 {job.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '14px' }}>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Client Name:</strong>{' '}
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>{job.customerName || 'Client'}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Client Phone / WhatsApp:</strong>{' '}
                      <a href={`tel:${job.customerPhone}`} style={{ color: 'var(--accent-color)', fontWeight: 700, textDecoration: 'underline' }}>
                        {job.customerPhone || 'Not provided'}
                      </a>
                    </div>
                  </div>

                  {job.notes && (
                    <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        📍 Job Site Address & Specs:
                      </strong>
                      <div style={{ color: '#ffffff', lineHeight: '1.5' }}>
                        {job.notes}
                      </div>
                    </div>
                  )}

                  {job.completionReport && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '13px' }}>
                      <strong>Technician Completion Report:</strong> "{job.completionReport}"
                    </div>
                  )}

                  {job.declineReason && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px' }}>
                      <strong>Declined Reason:</strong> "{job.declineReason}"
                    </div>
                  )}

                  {/* Technician Status Action Controls */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    {!isAcknowledged && !isDeclined && !isCompleted && (
                      <button
                        onClick={() => handleAcknowledge(job)}
                        className="btn btn-primary"
                        style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 700 }}
                      >
                        👁️ Acknowledge Job (Put in Schedule)
                      </button>
                    )}

                    {!isCompleted && !isDeclined && (
                      <>
                        {!isInProgress && (
                          <button
                            onClick={() => handleStartJobClick(job)}
                            className="btn btn-secondary"
                            style={{ padding: '9px 16px', fontSize: '13px', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)' }}
                          >
                            🚀 Start Job (On Site)
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCompletingJob(job)
                            setCompletionReportText('')
                          }}
                          className="btn btn-primary"
                          style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 700 }}
                        >
                          ✅ Complete Job & Submit Report
                        </button>
                        <button
                          onClick={() => setDecliningJob(job)}
                          className="btn btn-secondary"
                          style={{ padding: '9px 16px', fontSize: '13px', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                        >
                          ❌ Decline Job
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── RESCHEDULE ON START MODAL ─────────────────────────── */}
      {rescheduleStartJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            className="premium-card"
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>📅</span>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', margin: 0 }}>
                  Reschedule & Start Work Order
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Work order is scheduled for <strong>{rescheduleStartJob.date}</strong> (not today).
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.5' }}>
              Did you reschedule on site with <strong>{rescheduleStartJob.customerName}</strong>? Select the new date & time to update the dispatch record and start work immediately.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  New Date *
                </label>
                <input
                  type="date"
                  value={newJobDate}
                  onChange={(e) => setNewJobDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  New Time *
                </label>
                <select
                  value={newJobTime}
                  onChange={(e) => setNewJobTime(e.target.value)}
                  className="form-select"
                >
                  {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '16:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Reschedule Note / Client Consent Reason
              </label>
              <input
                type="text"
                value={rescheduleNote}
                onChange={(e) => setRescheduleNote(e.target.value)}
                placeholder="e.g. Client requested early start today"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => executeStartJob(rescheduleStartJob, newJobDate, newJobTime, rescheduleNote)}
                className="btn btn-primary"
                style={{ padding: '12px', fontSize: '13px', fontWeight: 700 }}
              >
                📅 Confirm Reschedule to {newJobDate} & Start Job On Site 🚀
              </button>
              <button
                type="button"
                onClick={() => executeStartJob(rescheduleStartJob, rescheduleStartJob.date, rescheduleStartJob.time, null)}
                className="btn btn-secondary"
                style={{ padding: '10px', fontSize: '13px' }}
              >
                Keep Scheduled Date ({rescheduleStartJob.date}) & Start On Site
              </button>
              <button
                type="button"
                onClick={() => setRescheduleStartJob(null)}
                className="btn-link"
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPLETION REPORT MODAL ───────────────────────────── */}
      {completingJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <form
            onSubmit={handleConfirmCompletion}
            className="premium-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>
              ✅ Complete Work Order & Submit Report
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Please enter site work notes for <strong>{completingJob.customerName}</strong> ({completingJob.service}). This report will be logged for Admin review.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Work Performed & Materials Used *
              </label>
              <textarea
                rows={4}
                value={completionReportText}
                onChange={(e) => setCompletionReportText(e.target.value)}
                placeholder="e.g. Replaced compressor relay. Pressure test passed at 4.2 bar. Cleaned filter unit and verified operation..."
                className="form-textarea"
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCompletingJob(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700 }}
              >
                Submit Report & Mark Completed ✅
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── DECLINE JOB REASON MODAL ──────────────────────────── */}
      {decliningJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <form
            onSubmit={handleConfirmDecline}
            className="premium-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>
              Decline Work Order
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Please state why you are declining the job for <strong>{decliningJob.customerName}</strong> ({decliningJob.service}). Admin will be notified immediately.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Reason for Declining *
              </label>
              <textarea
                rows={3}
                value={declineReasonText}
                onChange={(e) => setDeclineReasonText(e.target.value)}
                placeholder="e.g. Missing 22mm copper fittings, schedule conflict, site hazard..."
                className="form-textarea"
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDecliningJob(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Confirm Decline & Alert Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Watermark Footer */}
      <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Powered by NativeBooking Contractor Blueprint 🛠️
      </div>
    </div>
  )
}