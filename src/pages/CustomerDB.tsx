import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { currentUserRole, currentUserEmail, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'
import { CalendarIcon, ClockIcon, UserIcon, CheckIcon, AlertIcon, AcademicIcon } from '../components/ui/Icons'

export default function CustomerDB() {
  const { bookings, cancelBooking, addNotification, clearCustomerNotification } = useBooking()

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
    if (!booking) return 'Pending'

    if (booking.status === 'Cancelled') {
      return 'Cancelled'
    }

    // Auto-complete any appointment whose scheduled date/time has passed!
    const bookingDateTime = getBookingDateTime(booking)
    const now = new Date()
    if (bookingDateTime < now) {
      return 'Completed'
    }

    if (
      booking.status === 'Pending' ||
      booking.adminStatus === 'New' ||
      booking.adminStatus === 'Reschedule Requested' ||
      booking.adminStatus === 'Needs Action'
    ) {
      return 'Pending'
    }

    if (booking.status === 'Confirmed') {
      return 'Upcoming'
    }

    return booking.status || 'Pending'
  }

  const getBookingTimestamp = (booking: any) => {
    const bDate = getBookingDateTime(booking)
    return bDate.getTime()
  }

  const sortHistoryBookingsPrioritizeCompleted = (items: any[]) => {
    return [...items].sort((a, b) => {
      const statusA = getDisplayStatus(a)
      const statusB = getDisplayStatus(b)

      if (statusA === 'Completed' && statusB !== 'Completed') return -1
      if (statusA !== 'Completed' && statusB === 'Completed') return 1

      return getBookingTimestamp(b) - getBookingTimestamp(a)
    })
  }

  const activeUserEmail = currentUserEmail || sessionStorage.getItem('currentUserEmail') || ''
  const customerBookings = bookings.filter(
    (booking) =>
      booking.ownerEmail === activeUserEmail ||
      booking.customerEmail === activeUserEmail
  )

  const activeBookings = customerBookings.filter((booking) => {
    const displayStatus = getDisplayStatus(booking)
    return displayStatus === 'Pending' || displayStatus === 'Upcoming'
  })

  const historyBookings = customerBookings.filter((booking) => {
    const displayStatus = getDisplayStatus(booking)
    return displayStatus === 'Completed' || displayStatus === 'Cancelled'
  })

  const sortActiveBookingsPrioritizeUpcoming = (items: any[]) => {
    return [...items].sort((a, b) => {
      const statusA = getDisplayStatus(a)
      const statusB = getDisplayStatus(b)

      if (statusA === 'Upcoming' && statusB !== 'Upcoming') return -1
      if (statusA !== 'Upcoming' && statusB === 'Upcoming') return 1

      return getBookingTimestamp(b) - getBookingTimestamp(a)
    })
  }

  const sortedActiveBookings = sortActiveBookingsPrioritizeUpcoming(activeBookings)
  const sortedHistoryBookings = sortHistoryBookingsPrioritizeCompleted(historyBookings)
  const [showAllHistory, setShowAllHistory] = useState(false)
  const displayedHistoryBookings = showAllHistory
    ? sortedHistoryBookings
    : sortedHistoryBookings.slice(0, 3)

  const latestBooking = sortedActiveBookings[0]

  const latestDisplayStatus = latestBooking
    ? getDisplayStatus(latestBooking)
    : undefined

  const canManageLatestBooking =
    latestBooking != null &&
    (latestDisplayStatus === 'Pending' || latestDisplayStatus === 'Upcoming')

  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastVariant, setToastVariant] = useState<'success' | 'warning' | 'error'>('warning')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReasonInput, setCancelReasonInput] = useState('')
  

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const bookingWithNotification = customerBookings.find(
      (booking) => booking.customerNotification != null
    )

    if (bookingWithNotification) {
      const message = bookingWithNotification.customerNotification
      const variant = bookingWithNotification.customerNotificationType || 'warning'

      setToastMessage(message!)
      setToastVariant(variant)
      setShowToast(true)

      clearCustomerNotification(bookingWithNotification.id)
    }
  }, [customerBookings, clearCustomerNotification])

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
            maxWidth: '500px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: '#ffffff',
            border: '1px solid rgba(5, 150, 105, 0.35)',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
            borderLeft: `5px solid ${
              toastVariant === 'success'
                ? '#059669'
                : toastVariant === 'error'
                ? '#ef4444'
                : '#facc15'
            }`,
            padding: '16px 20px',
            color: '#0f172a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(5, 150, 105, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color:
                  toastVariant === 'success'
                    ? '#059669'
                    : toastVariant === 'error'
                    ? '#ef4444'
                    : '#b45309',
              }}
            >
              {toastVariant === 'success' ? (
                <CheckIcon size={18} style={{ color: '#059669' }} />
              ) : (
                <AlertIcon size={18} style={{ color: toastVariant === 'error' ? '#ef4444' : '#b45309' }} />
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
                  color: '#059669',
                }}
              >
                Enrollment Status Alert
              </p>
              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0f172a',
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
              📍 {BUSINESS_CONFIG.address}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Student Portal" />
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '4px' }}>Student Dashboard</h1>
        <p>Manage your active course reservations, cohort schedules, and syllabus notes.</p>
      </div>

      {/* Hero Showcase / Split View */}
      <div className="premium-card" style={{ marginBottom: '32px', padding: '28px' }}>
        {latestBooking ? (
          <div className="booking-split-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Left Column: Primary Active Session */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className={`status-badge ${getDisplayStatus(latestBooking).toLowerCase()}`}>
                  {getDisplayStatus(latestBooking)}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Primary Reservation
                </span>
              </div>

              <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {latestBooking.service}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                    margin: '8px 0',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(5, 150, 105, 0.08)',
                      borderRight: '1px solid rgba(5, 150, 105, 0.2)',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#047857', display: 'block' }}>
                      SESSION DATE
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarIcon size={15} style={{ color: '#059669' }} /> {latestBooking.adminStatus === 'Reschedule Requested' && latestBooking.requestedDate ? latestBooking.requestedDate : latestBooking.date}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '10px 18px',
                      background: 'rgba(5, 150, 105, 0.12)',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#047857', display: 'block' }}>
                      TIME SLOT
                    </span>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: '#059669', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <ClockIcon size={16} /> {latestBooking.adminStatus === 'Reschedule Requested' && latestBooking.requestedTime ? latestBooking.requestedTime : latestBooking.time}
                    </span>
                  </div>
                </div>
                {latestBooking.artistName && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>{BUSINESS_CONFIG.staffLabel}:</strong>{' '}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                        {latestBooking.artistName.charAt(0)}
                      </span>{' '}
                      {latestBooking.artistName}
                    </span>
                  </p>
                )}
                {latestBooking.depositAmount != null && latestBooking.depositAmount > 0 && (
                  <p>
                    <strong style={{ color: 'var(--text-secondary)' }}>Seat Deposit:</strong>{' '}
                    <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                      ${latestBooking.depositAmount.toFixed(2)} (Paid)
                    </span>
                  </p>
                )}
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Status:</strong>{' '}
                  <span className={`status-badge ${getDisplayStatus(latestBooking).toLowerCase()}`}>
                    {getDisplayStatus(latestBooking)}
                  </span>
                </p>
                {latestBooking.adminStatus === 'Reschedule Requested' && (
                  <p style={{ color: '#b45309', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>
                    ★ Requested new slot — awaiting faculty approval
                  </p>
                )}
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Notes:</strong>{' '}
                  {latestBooking.notes || 'No pre-requisite notes added'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <Link to="/book" style={{ textDecoration: 'none' }}>
                  <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>Book New Course</button>
                </Link>
                {canManageLatestBooking && getDisplayStatus(latestBooking) === 'Upcoming' && (
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                    onClick={() =>
                      navigate('/book', {
                        state: { isReschedule: true, bookingId: latestBooking.id },
                      })
                    }
                  >
                    Reschedule
                  </button>
                )}
                {canManageLatestBooking && (
                  <button
                    className="btn btn-danger"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                    onClick={() => {
                      setShowCancelModal(true)
                      setCancelReasonInput('')
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic Showcase or Queue List */}
            <div className="booking-split-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {sortedActiveBookings.length > 1 ? (
                // Case B: Show other active sessions list
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockIcon size={16} style={{ color: '#059669' }} /> Other Scheduled Sessions ({sortedActiveBookings.length - 1})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', paddingRight: '8px' }}>
                    {sortedActiveBookings.slice(1).map((booking) => {
                      const matchedArtist = BUSINESS_CONFIG.artists.find((a) => a.id === booking.artistId || a.name === booking.artistName)
                      return (
                        <div
                          key={booking.id}
                          style={{
                            padding: '12px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{booking.service}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CalendarIcon size={12} /> {booking.date} at {booking.time}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <UserIcon size={12} /> {booking.artistName || matchedArtist?.name}
                            </p>
                          </div>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '6px 10px', fontSize: '11px' }}
                            onClick={() => {
                              const reason = prompt('Please enter cancellation reason:')
                              if (reason !== null) {
                                cancelBooking(booking.id, reason || 'Cancelled by student')
                                addNotification(`Student cancelled course booking: ${booking.service} with ${booking.artistName}`)
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                // Case A: Show Premium Instructor Profile Showcase
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  {latestBooking.artistName ? (() => {
                    const artist = BUSINESS_CONFIG.artists.find((a) => a.id === latestBooking.artistId || a.name === latestBooking.artistName)
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(5, 150, 105, 0.12)',
                            border: '2px solid var(--accent-color)',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 800,
                            marginBottom: '12px',
                            boxShadow: '0 0 16px rgba(5, 150, 105, 0.2)',
                            overflow: 'hidden',
                          }}
                        >
                          {artist?.avatarUrl ? (
                            <img
                              src={artist.avatarUrl}
                              alt={artist.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            artist?.name ? artist.name.charAt(0) : '🎓'
                          )}
                        </div>
                        <h3 style={{ fontSize: '17px', margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-primary)' }}>
                          Your {BUSINESS_CONFIG.staffLabel}: {latestBooking.artistName}
                        </h3>
                        {artist?.specialty && (
                          <span style={{ fontSize: '11px', background: 'rgba(5, 150, 105, 0.08)', color: '#059669', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                            ✦ {artist.specialty}
                          </span>
                        )}
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '260px', lineHeight: '1.4' }}>
                          "Welcome to Vanguard Academy! Please review the pre-requisite code assessment before our first live session."
                        </p>
                      </div>
                    )
                  })() : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <AcademicIcon size={40} style={{ color: '#059669', marginBottom: '8px' }} />
                      <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', fontWeight: 700 }}>No {BUSINESS_CONFIG.staffLabel} Assigned</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                        An available senior faculty member will be assigned to your cohort.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '20px' }}>
              No course sessions scheduled right now.
            </p>
            <Link to="/book" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '10px 20px' }}>Enroll in Your First Course</button>
            </Link>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Preparation Checklist</h2>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Follow these quick guidelines before your appointment to ensure a smooth session:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {BUSINESS_CONFIG.checklist.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '15px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.4' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(234, 179, 8, 0.05)',
              border: '1px solid rgba(234, 179, 8, 0.15)',
              fontSize: '13px',
              color: '#facc15',
            }}
          >
            <strong>💡 Policy Note:</strong> Free cancellations & rescheduling available up to 24 hours before your session.
          </div>
        </div>

        <div className="premium-card">
          <h2 style={{ fontSize: '20px', marginBottom: '14px' }}>Business Details</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Name:</strong> {BUSINESS_CONFIG.name}
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Address:</strong> {BUSINESS_CONFIG.address}
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Contact:</strong> {BUSINESS_CONFIG.contact}
            </p>
          </div>

          {/* Interactive Map Embed Widget */}
          <div
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              marginBottom: '14px',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <iframe
              title="Business Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS_CONFIG.address)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
            />
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_CONFIG.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              🗺️ Get Directions / Open in Google Maps
            </button>
          </a>
        </div>
      </div>

      <div className="premium-card">
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Visit History</h2>

        {sortedHistoryBookings.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No visit history yet.</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {displayedHistoryBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  style={{
                    paddingBottom: '20px',
                    borderBottom:
                      index === displayedHistoryBookings.length - 1
                        ? 'none'
                        : '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.service}</p>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {booking.date} · {booking.time}
                      </p>
                    </div>
                    <span className={`status-badge ${getDisplayStatus(booking).toLowerCase()}`}>
                      {getDisplayStatus(booking)}
                    </span>
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '14px', display: 'flex', gap: '20px', color: 'var(--text-secondary)' }}>
                    {booking.artistName && (
                      <span>
                        <strong>{BUSINESS_CONFIG.staffLabel}:</strong> {booking.artistName}
                      </span>
                    )}
                    {booking.depositAmount != null && (
                      <span>
                        <strong>Deposit Paid:</strong> £{booking.depositAmount.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Show Aftercare Instructions if completed & notes exist */}
                  {getDisplayStatus(booking) === 'Completed' && booking.adminNotesForCustomer && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        borderRadius: '12px',
                        fontSize: '14px',
                      }}
                    >
                      <p style={{ fontWeight: 600, color: '#34d399', marginBottom: '4px' }}>
                        ✨ {BUSINESS_CONFIG.adminNotesLabel}:
                      </p>
                      <p style={{ color: 'var(--text-primary)', margin: 0 }}>
                        {booking.adminNotesForCustomer}
                      </p>
                    </div>
                  )}

                  {/* Show Cancellation details if cancelled */}
                  {booking.status === 'Cancelled' && booking.cancellationReason && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                      }}
                    >
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                        Cancellation Reason: "{booking.cancellationReason}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show Toggle Button if there are more than 3 bookings */}
            {sortedHistoryBookings.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '20px' }}
                >
                  {showAllHistory ? '▲ Show Less' : `▼ Show More (${sortedHistoryBookings.length - 3} more)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {showCancelModal && latestBooking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="premium-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Cancel Appointment
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you sure you want to cancel your appointment for <strong>{latestBooking.service}</strong> on{' '}
              <strong>{latestBooking.date}</strong> at <strong>{latestBooking.time}</strong>?
            </p>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '13px', marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>
                Reason for Cancellation (Optional)
              </label>
              <textarea
                className="form-textarea"
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                placeholder="e.g. Work conflict, feeling unwell..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  resize: 'vertical',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Keep Appointment
              </button>

              <button
                type="button"
                onClick={() => {
                  cancelBooking(latestBooking.id, cancelReasonInput || 'No reason provided')
                  addNotification(
                    `Customer cancelled: ${latestBooking.service} on ${latestBooking.date} at ${
                      latestBooking.time
                    } (Reason: ${cancelReasonInput || 'None'})`
                  )
                  setShowCancelModal(false)
                }}
                className="btn btn-danger"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek NativeBooking Watermark Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '48px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.03em',
          fontWeight: 600,
        }}
      >
        Powered by NativeBooking Software ⚡
      </div>
    </div>
  )
}