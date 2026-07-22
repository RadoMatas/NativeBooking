import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { currentUserRole, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'

export default function CustomerDB() {
  const navigate = useNavigate()
  const { bookings, updateBookingStatus } = useBooking()
  const [activeTechId, setActiveTechId] = useState(BUSINESS_CONFIG.artists[0].id)

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
              🛠️ Field Worker Schedule Portal
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Field Worker Schedule" />
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '12px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* ─── TECHNICIAN SWITCHER (FOR DEMO PURPOSE) ─────────────── */}
      <div
        className="premium-card"
        style={{
          marginBottom: '28px',
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
            Active Field Technician Profile
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
            {selectedTech.avatarEmoji} {selectedTech.name} — <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>{selectedTech.specialty}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Switch Technician View:
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

      {/* ─── DAILY ROUTE & ASSIGNED JOBS ──────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
          Your Assigned Field Jobs ({techJobs.length})
        </h2>

        {techJobs.length === 0 ? (
          <div className="premium-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🛠️</span>
            <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#ffffff' }}>No Assigned Jobs Today</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Check back soon or contact dispatch for new job site assignments.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {techJobs.map((job) => {
              const isCompleted = job.status === 'Completed' || job.adminStatus === 'Completed'
              const isInProgress = job.adminStatus === 'In Progress'

              return (
                <div
                  key={job.id}
                  className="premium-card"
                  style={{
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    border: isInProgress ? '1px solid #38bdf8' : isCompleted ? '1px solid #34d399' : '1px solid var(--border-color)',
                    background: isInProgress ? 'rgba(14, 165, 233, 0.08)' : isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.8)',
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
                          background: isCompleted
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isInProgress
                            ? 'rgba(14, 165, 233, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                          color: isCompleted ? '#34d399' : isInProgress ? '#38bdf8' : '#f59e0b',
                          display: 'inline-block',
                          marginBottom: '8px',
                        }}
                      >
                        {isCompleted ? '✅ Job Completed' : isInProgress ? '▶️ In Progress' : '⏳ Assigned Work Order'}
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
                        📍 Job Site Address & Instructions:
                      </strong>
                      <div style={{ color: '#ffffff', lineHeight: '1.5' }}>
                        {job.notes}
                      </div>
                    </div>
                  )}

                  {/* Technician Status Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    {!isInProgress && !isCompleted && (
                      <button
                        onClick={() => updateBookingStatus(job.id, 'Confirmed', 'In Progress')}
                        className="btn btn-secondary"
                        style={{ padding: '10px 18px', fontSize: '13px', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)' }}
                      >
                        ▶️ Start Job (In Progress)
                      </button>
                    )}
                    {!isCompleted && (
                      <button
                        onClick={() => updateBookingStatus(job.id, 'Completed', 'Completed')}
                        className="btn btn-primary"
                        style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 700 }}
                      >
                        ✅ Mark Job Completed
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Watermark Footer */}
      <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Powered by NativeBooking Contractor Blueprint 🛠️
      </div>
    </div>
  )
}