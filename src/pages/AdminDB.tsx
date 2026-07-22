import { Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { currentUserRole, logout } from '../auth'
import { BUSINESS_CONFIG } from '../businessConfig'
import {
  fetchIntroCalls,
  updateIntroCallStatus,
  generateGoogleCalendarUrl,
  type IntroCallBooking,
} from '../introCallHelpers'

export default function AdminDB() {
  const navigate = useNavigate()
  const [introCalls, setIntroCalls] = useState<IntroCallBooking[]>([])
  const [loadingCalls, setLoadingCalls] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all')

  const loadCalls = async () => {
    setLoadingCalls(true)
    const data = await fetchIntroCalls()
    setIntroCalls(data)
    setLoadingCalls(false)
  }

  useEffect(() => {
    loadCalls()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const activeRole = currentUserRole || sessionStorage.getItem('currentUserRole')
  if (activeRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleStatusChange = async (id: string, newStatus: 'confirmed' | 'declined') => {
    await updateIntroCallStatus(id, newStatus)
    await loadCalls()
  }

  const filteredCalls = introCalls.filter((c) => {
    if (statusFilter === 'all') return true
    return c.status === statusFilter
  })

  const countPending = introCalls.filter((c) => c.status === 'pending').length
  const countConfirmed = introCalls.filter((c) => c.status === 'confirmed').length
  const countDeclined = introCalls.filter((c) => c.status === 'declined').length

  const t = {
    bg: '#09090b',
    cardBg: 'rgba(20, 20, 23, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#10b981',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        padding: '32px 24px 80px',
        background: `radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 45%),
                     radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.03), transparent 50%),
                     ${t.bg}`,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* ─── TOP BAR ─────────────────────────────────────────── */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: `1px solid ${t.border}`,
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo-icon.jpg"
              alt="NativeBooking"
              style={{ height: '40px', width: '40px', borderRadius: '10px', display: 'block' }}
            />
            <div>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff', display: 'block' }}>
                NATIVEBOOKING
              </span>
              <span style={{ fontSize: '12px', color: t.textSecondary, fontWeight: 500 }}>
                Central Control Hub · Poland
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
            >
              ← Portal Homepage
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', color: '#f87171' }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* ─── DASHBOARD HEADER & STATS ──────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            Client Discovery Calls
          </h1>
          <p style={{ fontSize: '14px', color: t.textSecondary }}>
            Manage intro call requests submitted via <code>nativebooking.co/book-call</code>.
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: 'Total Requests', count: introCalls.length, color: '#ffffff', bg: 'rgba(255,255,255,0.03)' },
            { label: 'Pending Review', count: countPending, color: '#facc15', bg: 'rgba(234, 179, 8, 0.1)' },
            { label: 'Confirmed Calls', count: countConfirmed, color: '#34d399', bg: 'rgba(16, 185, 129, 0.1)' },
            { label: 'Declined', count: countDeclined, color: '#f87171', bg: 'rgba(239, 68, 68, 0.1)' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: stat.bg,
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                padding: '20px 24px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: t.textSecondary, letterSpacing: '0.05em' }}>
                {stat.label}
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: stat.color, marginTop: '4px' }}>
                {stat.count}
              </div>
            </div>
          ))}
        </div>

        {/* ─── FILTER & ACTION BAR ───────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'pending', 'confirmed', 'declined'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                style={{
                  padding: '7px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '20px',
                  background: statusFilter === filter ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${statusFilter === filter ? t.accent : t.border}`,
                  color: statusFilter === filter ? '#34d399' : t.textSecondary,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontFamily: 'inherit',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={loadCalls}
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '7px 16px' }}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* ─── CALLS LIST ────────────────────────────────────── */}
        {loadingCalls ? (
          <p style={{ color: t.textSecondary, padding: '40px 0', textAlign: 'center' }}>Loading calls...</p>
        ) : filteredCalls.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '20px',
            }}
          >
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>📞</span>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              No Call Requests Found
            </h3>
            <p style={{ fontSize: '14px', color: t.textSecondary }}>
              When potential clients request a discovery call from your homepage, they will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCalls.map((call) => {
              const gcalUrl = generateGoogleCalendarUrl(call)
              return (
                <div
                  key={call.id}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: '18px',
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
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
                          background:
                            call.status === 'confirmed'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : call.status === 'declined'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(234, 179, 8, 0.15)',
                          color:
                            call.status === 'confirmed'
                              ? '#34d399'
                              : call.status === 'declined'
                              ? '#f87171'
                              : '#facc15',
                          display: 'inline-block',
                          marginBottom: '8px',
                        }}
                      >
                        {call.status === 'pending' ? '⏳ Pending Review' : call.status === 'confirmed' ? '✅ Confirmed' : '❌ Declined'}
                      </span>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {call.name}
                      </h3>
                      <span style={{ fontSize: '13px', color: t.accent, fontWeight: 600 }}>
                        🏢 {call.industry}
                      </span>
                    </div>

                    {/* Date / Time pill */}
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '14px',
                        padding: '12px 20px',
                        textAlign: 'right',
                      }}
                    >
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>📅 {call.date}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: t.accent }}>🕒 {call.timeSlot} CET</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '14px' }}>
                    <div>
                      <strong style={{ color: t.textSecondary }}>Email:</strong>{' '}
                      <a href={`mailto:${call.email}`} style={{ color: t.accent, textDecoration: 'underline' }}>
                        {call.email}
                      </a>
                    </div>
                    <div>
                      <strong style={{ color: t.textSecondary }}>Phone / WhatsApp:</strong>{' '}
                      <a href={`tel:${call.phone}`} style={{ color: '#ffffff', fontWeight: 600 }}>
                        {call.phone}
                      </a>
                    </div>
                  </div>

                  {call.notes && (
                    <div
                      style={{
                        fontSize: '13px',
                        background: 'rgba(0,0,0,0.35)',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: `1px solid ${t.border}`,
                        color: t.textPrimary,
                        lineHeight: '1.5',
                      }}
                    >
                      <strong style={{ color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Project Notes:</strong>
                      {call.notes}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      paddingTop: '12px',
                      borderTop: `1px solid ${t.border}`,
                    }}
                  >
                    {call.status !== 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(call.id, 'confirmed')}
                        style={{
                          background: t.accent,
                          color: '#ffffff',
                          border: 'none',
                          padding: '9px 18px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(16,185,129,0.25)',
                        }}
                      >
                        ✅ Accept & Confirm
                      </button>
                    )}
                    {call.status !== 'declined' && (
                      <button
                        onClick={() => handleStatusChange(call.id, 'declined')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '9px 18px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ❌ Decline Request
                      </button>
                    )}
                    <a href={gcalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${t.border}`,
                          color: '#ffffff',
                          padding: '9px 18px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        📅 Add to Google Calendar (1-Tap)
                      </button>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '20px',
            borderTop: `1px solid ${t.border}`,
            fontSize: '12px',
            color: t.textSecondary,
            textAlign: 'center',
          }}
        >
          Powered by NativeBooking Central Control ⚡
        </div>
      </div>
    </div>
  )
}