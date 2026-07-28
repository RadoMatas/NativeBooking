import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { currentUserRole, logout } from '../auth'
import { fetchIntroCalls, updateIntroCallStatus, type IntroCallBooking } from '../introCallHelpers'
import { Badge } from '../components/ui/Badge'
import { PageWrapper } from '../components/ui/PageWrapper'

export default function AdminDB() {
  const navigate = useNavigate()
  const [introCalls, setIntroCalls] = useState<IntroCallBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all')

  const loadCalls = async () => {
    setLoading(true)
    const calls = await fetchIntroCalls()
    setIntroCalls(calls)
    setLoading(false)
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

  const handleAcceptCall = async (call: IntroCallBooking) => {
    await updateIntroCallStatus(call.id, 'confirmed')

    const [startHourStr] = call.timeSlot.split(':')
    const startHour = parseInt(startHourStr, 10) || 9
    const endHour = startHour + 1
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

    const cleanDateStr = call.date.replace(/-/g, '')
    const gcalDateStr = `${cleanDateStr}T${pad(startHour)}0000Z`
    const gcalEndDateStr = `${cleanDateStr}T${pad(endHour)}0000Z`

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `NativeBooking Discovery Call — ${call.name}`
    )}&details=${encodeURIComponent(
      `Discovery call with ${call.name}\nIndustry: ${call.industry}\nPhone/WhatsApp: ${call.phone}\nNotes: ${call.notes || 'None'}`
    )}&dates=${gcalDateStr}/${gcalEndDateStr}&add=${encodeURIComponent(call.email)}`

    window.open(gcalUrl, '_blank')

    await loadCalls()
  }

  const handleDeclineCall = async (call: IntroCallBooking) => {
    await updateIntroCallStatus(call.id, 'declined')

    const mailtoSubject = encodeURIComponent(`Update on your NativeBooking Discovery Call Request`)
    const mailtoBody = encodeURIComponent(
      `Hi ${call.name},\n\nThank you for requesting a discovery call with NativeBooking for ${call.date} at ${call.timeSlot} CET.\n\n[Please enter your decline / reschedule reason here]\n\nBest regards,\nNativeBooking Team`
    )
    window.open(`mailto:${call.email}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank')

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
    <PageWrapper>
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
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            borderBottom: `1px solid ${t.border}`,
            paddingBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>NativeBooking</span>
              <span style={{ fontSize: '12px', color: t.accent, fontWeight: 700, marginLeft: '8px' }}>
                ADMIN CONTROL HUB
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: t.textPrimary,
                border: `1px solid ${t.border}`,
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Back to Portal
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            Client Discovery Calls
          </h1>
          <p style={{ fontSize: '14px', color: t.textSecondary }}>
            Manage intro call requests submitted via <code>nativebooking.co/book-call</code>.
          </p>
        </div>

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
              <span style={{ fontSize: '13px', color: t.textSecondary, fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '32px', fontWeight: 800, color: stat.color }}>
                {stat.count}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px',
            borderBottom: `1px solid ${t.border}`,
            paddingBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          {(['all', 'pending', 'confirmed', 'declined'] as const).map((filterKey) => {
            const isActive = statusFilter === filterKey
            const count = filterKey === 'all' ? introCalls.length : filterKey === 'pending' ? countPending : filterKey === 'confirmed' ? countConfirmed : countDeclined

            return (
              <button
                key={filterKey}
                onClick={() => setStatusFilter(filterKey)}
                style={{
                  background: isActive ? t.accent : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#000000' : t.textSecondary,
                  border: `1px solid ${isActive ? t.accent : t.border}`,
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{filterKey === 'all' ? 'All Requests' : filterKey === 'pending' ? '⏳ Pending' : filterKey === 'confirmed' ? '✅ Confirmed' : '❌ Declined'}</span>
                ({count})
              </button>
            )
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: t.textSecondary }}>
            Loading discovery calls...
          </div>
        ) : filteredCalls.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '20px',
              color: t.textSecondary,
            }}
          >
            No {statusFilter === 'all' ? '' : statusFilter} Discovery Calls
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCalls.map((call) => {
              const [startHourStr] = call.timeSlot.split(':')
              const startHour = parseInt(startHourStr, 10) || 9
              const endHour = startHour + 1
              const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

              const cleanDateStr = call.date.replace(/-/g, '')
              const gcalDateStr = `${cleanDateStr}T${pad(startHour)}0000Z`
              const gcalEndDateStr = `${cleanDateStr}T${pad(endHour)}0000Z`

              const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                `NativeBooking Discovery Call — ${call.name}`
              )}&details=${encodeURIComponent(
                `Discovery call with ${call.name}\nIndustry: ${call.industry}\nPhone/WhatsApp: ${call.phone}\nNotes: ${call.notes || 'None'}`
              )}&dates=${gcalDateStr}/${gcalEndDateStr}&add=${encodeURIComponent(call.email)}`

              return (
                <div
                  key={call.id}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: '20px',
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        <Badge variant={call.status === 'confirmed' ? 'confirmed' : call.status === 'declined' ? 'cancelled' : 'pending'}>
                          {call.status === 'pending' ? 'Pending Review' : call.status === 'confirmed' ? 'Confirmed' : 'Declined'}
                        </Badge>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {call.name}
                      </h3>
                      <span style={{ fontSize: '13px', color: t.accent, fontWeight: 600 }}>
                        🏢 {call.industry}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.65)',
                        border: '1px solid rgba(16, 185, 129, 0.45)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.18)',
                      }}
                    >
                      {/* Date Section */}
                      <div
                        style={{
                          padding: '10px 16px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          borderRight: '1px solid rgba(16, 185, 129, 0.35)',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent }}>
                          DATE
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                          📅 {call.date}
                        </span>
                      </div>

                      {/* Time Section */}
                      <div
                        style={{
                          padding: '10px 18px',
                          background: 'rgba(16, 185, 129, 0.28)',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ffffff' }}>
                          TIME
                        </span>
                        <span style={{ fontSize: '17px', fontWeight: 900, color: '#34d399', whiteSpace: 'nowrap' }}>
                          🕒 {call.timeSlot} CET
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '14px' }}>
                    <div>
                      <strong style={{ color: t.textSecondary }}>Client Email:</strong>{' '}
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

                  {/* Action controls according to strict status locking rules */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      paddingTop: '12px',
                      borderTop: `1px solid ${t.border}`,
                      alignItems: 'center',
                    }}
                  >
                    {call.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptCall(call)}
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
                          ✅ Accept & Add to Both Calendars
                        </button>

                        <button
                          onClick={() => handleDeclineCall(call)}
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
                          ❌ Decline Request & Write Reason
                        </button>
                      </>
                    )}

                    {call.status === 'confirmed' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 700, background: 'rgba(16,185,129,0.15)', padding: '6px 14px', borderRadius: '8px' }}>
                          ✅ Confirmed & Scheduled on Google Calendar
                        </span>
                        <a href={gcalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <button
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${t.border}`,
                              color: '#ffffff',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            📅 View Google Calendar Event (Both Attendees)
                          </button>
                        </a>
                      </div>
                    )}

                    {call.status === 'declined' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 700, background: 'rgba(239,68,68,0.15)', padding: '6px 14px', borderRadius: '8px' }}>
                          ❌ Request Declined (Locked)
                        </span>
                        <a
                          href={`mailto:${call.email}?subject=${encodeURIComponent(`Update on your NativeBooking Intro Call Request`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          <button
                            style={{
                              background: 'none',
                              border: `1px solid ${t.border}`,
                              color: t.textSecondary,
                              padding: '7px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            ✉️ Email Client Reason Again
                          </button>
                        </a>
                      </div>
                    )}
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
    </PageWrapper>
  )
}