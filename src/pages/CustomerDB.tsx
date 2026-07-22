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
  
  // FIX: Unacknowledged jobs ONLY counts jobs that are NOT completed and NOT cancelled/declined!
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

  const handleStartJob = (job: any) => {
    updateBooking(job.id, {
      ...job,
      acknowledgedByTech: true,
      adminStatus: 'In Progress',
      status: 'Confirmed',
    })
    addNotification(`🚀 Technician ${selectedTech.name} STARTED Job on site for ${job.customerName}`)
  }

  const handleCompleteJob = (job: any) => {
    updateBooking(job.id, {
      ...job,
      adminStatus: 'Completed',
      status: 'Completed',
    })
    addNotification(`✅ Technician ${selectedTech.name} COMPLETED Job for ${job.customerName}`)
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

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>📅 {job.date}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-color)' }}>🕒 {job.time}</div>
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
                            onClick={() => handleStartJob(job)}
                            className="btn btn-secondary"
                            style={{ padding: '9px 16px', fontSize: '13px', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)' }}
                          >
                            🚀 Start Job (On Site)
                          </button>
                        )}
                        <button
                          onClick={() => handleCompleteJob(job)}
                          className="btn btn-primary"
                          style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 700 }}
                        >
                          ✅ Complete Job
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