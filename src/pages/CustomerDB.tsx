import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { currentUserRole, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'
import { ContractorIcon, CalendarIcon, ClockIcon, CheckIcon, AlertIcon, MapPinIcon } from '../components/ui/Icons'

export default function CustomerDB() {
  const { bookings, updateBookingStatus, clearCustomerNotification, addNotification } = useBooking()
  const navigate = useNavigate()

  const [activeTechId, setActiveTechId] = useState(BUSINESS_CONFIG.artists[0]?.id || 'crew_a')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastVariant, setToastVariant] = useState<'success' | 'warning' | 'error'>('warning')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getBookingDateTime = (booking: any) => {
    if (!booking || !booking.date) return new Date()
    const [year, month, day] = booking.date.split('-').map(Number)
    let hours = 0
    let minutes = 0

    if (booking.time) {
      const parts = booking.time.trim().split(' ')
      const [rawHours, rawMinutes] = parts[0].split(':').map(Number)
      hours = rawHours
      minutes = rawMinutes || 0

      if (parts[1]) {
        const modifier = parts[1].toUpperCase()
        if (modifier === 'PM' && hours < 12) hours += 12
        if (modifier === 'AM' && hours === 12) hours = 0
      }
    }

    return new Date(year, month - 1, day, hours, minutes)
  }

  const getDisplayStatus = (booking: any) => {
    if (!booking) return 'Assigned'

    if (booking.status === 'Cancelled' || booking.adminStatus === 'Declined by Tech') {
      return 'Cancelled'
    }

    if (booking.status === 'Completed' || booking.adminStatus === 'Completed') {
      return 'Completed'
    }

    const bookingDateTime = getBookingDateTime(booking)
    const now = new Date()
    if (bookingDateTime < now) {
      return 'Completed'
    }

    if (booking.adminStatus === 'In Progress') {
      return 'In Progress'
    }

    if (booking.adminStatus === 'Acknowledged') {
      return 'Acknowledged'
    }

    return booking.status === 'Confirmed' ? 'Assigned' : booking.status || 'Assigned'
  }

  const activeTech = BUSINESS_CONFIG.artists.find((a) => a.id === activeTechId) || BUSINESS_CONFIG.artists[0]

  // Filter jobs for selected field crew
  const techJobs = bookings.filter(
    (b) => b.artistId === activeTechId || b.artistName === activeTech?.name
  )

  useEffect(() => {
    const bookingWithNotif = techJobs.find((b) => b.customerNotification != null)
    if (bookingWithNotif) {
      setToastMessage(bookingWithNotif.customerNotification!)
      setToastVariant(bookingWithNotif.customerNotificationType || 'warning')
      setShowToast(true)
      clearCustomerNotification(bookingWithNotif.id)
    }
  }, [techJobs, clearCustomerNotification])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const activeRole = currentUserRole || sessionStorage.getItem('currentUserRole')
  if (activeRole !== 'customer') {
    return <Navigate to="/" replace />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '24px 16px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Toast Notification Alert */}
      {showToast && toastMessage && (
        <div
          role="alert"
          className="premium-card toast-container"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '520px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: '#141417',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
            borderLeft: `5px solid ${
              toastVariant === 'success'
                ? '#f59e0b'
                : toastVariant === 'error'
                ? '#ef4444'
                : '#fbbf24'
            }`,
            padding: '16px 20px',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: toastVariant === 'success' ? '#fbbf24' : toastVariant === 'error' ? '#f87171' : '#f59e0b',
              }}
            >
              {toastVariant === 'success' ? (
                <CheckIcon size={18} style={{ color: '#fbbf24' }} />
              ) : (
                <AlertIcon size={18} style={{ color: toastVariant === 'error' ? '#f87171' : '#f59e0b' }} />
              )}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#fbbf24',
                }}
              >
                Dispatch Work Order Alert
              </p>
              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                {toastMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Logo size="small" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {BUSINESS_CONFIG.name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
              <MapPinIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{BUSINESS_CONFIG.address}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Field Worker Terminal" />
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '4px' }}>Field Worker Dispatch Terminal</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review your assigned trade work orders, job site addresses, client phone contacts, and site entry codes.
        </p>
      </div>

      {/* Technician View Selector */}
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
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ContractorIcon size={24} style={{ color: '#f59e0b' }} /> {activeTech.name} — <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>{activeTech.specialty}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Switch Crew View:
          </span>
          <select
            value={activeTechId}
            onChange={(e) => setActiveTechId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '14px', background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid var(--border-color)' }}
          >
            {BUSINESS_CONFIG.artists.map((tech) => (
              <option key={tech.id} value={tech.id} style={{ background: '#141417', color: '#ffffff' }}>
                {tech.name} ({tech.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assigned Work Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ContractorIcon size={20} style={{ color: '#f59e0b' }} /> Assigned Field Work Orders ({techJobs.length})
        </h2>

        {techJobs.length === 0 ? (
          <div className="premium-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <ContractorIcon size={40} style={{ color: '#f59e0b', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#ffffff' }}>No Assigned Jobs Today</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Check back soon or contact dispatch for new job site assignments.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {techJobs.map((job) => {
              const displayStatus = getDisplayStatus(job)
              const isCompleted = displayStatus === 'Completed'
              const isInProgress = displayStatus === 'In Progress'

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
                    background: isInProgress ? 'rgba(14, 165, 233, 0.08)' : isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(20, 20, 23, 0.85)',
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
                        {isCompleted ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckIcon size={12} /> Job Completed</span> : isInProgress ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ClockIcon size={12} /> In Progress</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertIcon size={12} /> Assigned Work Order</span>}
                      </span>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {job.service}
                      </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarIcon size={14} style={{ color: '#f59e0b' }} /> {job.date}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <ClockIcon size={14} /> {job.time}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '14px' }}>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Client Name:</strong>{' '}
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>{job.customerName || 'Client'}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Client Phone / Contact:</strong>{' '}
                      <a href={`tel:${job.customerPhone}`} style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'underline' }}>
                        {job.customerPhone || 'Not provided'}
                      </a>
                    </div>
                  </div>

                  {job.notes && (
                    <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MapPinIcon size={14} /> Job Site Address & Dispatch Notes:</span>
                      </strong>
                      <div style={{ color: '#ffffff', lineHeight: '1.5', fontSize: '14px' }}>
                        {job.notes}
                      </div>
                    </div>
                  )}

                  {/* Technician Status Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    {!isInProgress && !isCompleted && (
                      <button
                        onClick={() => {
                          updateBookingStatus(job.id, 'Confirmed', 'In Progress')
                          addNotification(`▶ IN PROGRESS: ${activeTech.name} started job for ${job.customerName} (${job.service}).`)
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '10px 18px', fontSize: '13px', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)' }}
                      >
                        ▶ Start Job (In Progress)
                      </button>
                    )}
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          updateBookingStatus(job.id, 'Completed', 'Completed')
                          addNotification(`✅ COMPLETED: ${activeTech.name} marked job as completed for ${job.customerName} (${job.service}).`)
                        }}
                        className="btn btn-primary"
                        style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 700 }}
                      >
                        ✓ Mark Job Completed
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Powered by NativeBooking Contractor Blueprint <ContractorIcon size={14} /></span>
      </div>
    </div>
  )
}