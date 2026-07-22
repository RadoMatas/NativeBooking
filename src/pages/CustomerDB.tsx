import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { currentUserRole, currentUserEmail, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'

export default function CustomerDB() {
  const { bookings, cancelBooking, addNotification, clearCustomerNotification } = useBooking()

  console.log('currentUserEmail:', currentUserEmail)
  console.log('all bookings:', bookings)

  const getBookingDateTime = (booking: any) => {
    return new Date(`${booking.date}T${booking.time}`)
  }

  const getDisplayStatus = (booking: any) => {
    if (!booking) return 'Pending'

    if (booking.status === 'Cancelled') {
      return 'Cancelled'
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
      const bookingDateTime = getBookingDateTime(booking)
      const now = new Date()

      if (bookingDateTime < now) {
        return 'Completed'
      }

      return 'Upcoming'
    }

    return booking.status || 'Pending'
  }

  const getBookingTimestamp = (booking: any) => {
    const [year, month, day] = booking.date.split('-').map(Number)

    let hours = 0
    let minutes = 0

    if (booking.time) {
      const [timePart, modifier] = booking.time.split(' ')
      const [rawHours, rawMinutes] = timePart.split(':').map(Number)

      hours = rawHours
      minutes = rawMinutes

      if (modifier === 'AM' && hours === 12) {
        hours = 0
      } else if (modifier === 'PM' && hours !== 12) {
        hours += 12
      }
    }

    return new Date(year, month - 1, day, hours, minutes).getTime()
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
            background: 'rgba(20, 20, 23, 0.95)',
            borderLeft: `4px solid ${
              toastVariant === 'success'
                ? '#4ade80'
                : toastVariant === 'error'
                ? '#f87171'
                : '#facc15'
            }`,
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color:
                  toastVariant === 'success'
                    ? '#4ade80'
                    : toastVariant === 'error'
                    ? '#f87171'
                    : '#facc15',
              }}
            >
              {toastVariant === 'success' ? '✓' : '!'}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)',
                }}
              >
                Booking Update
              </p>
              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                {toastMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            aria-label="Dismiss notification"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Branding Navigation Header Bar */}
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
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {BUSINESS_CONFIG.name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
              📍 {BUSINESS_CONFIG.address}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Manage Your Booking" />
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '12px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '4px' }}>My Dashboard</h1>
        <p>View your bookings, check appointment updates, and manage your visits.</p>
      </div>

      <div
        className="premium-card"
        style={{
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '20px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Appointments
        </h2>

        {latestBooking ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Left Column: Next Appointment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                    🔥 Next Session
                  </span>
                </div>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Service:</strong>{' '}
                  {latestBooking.service}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Date:</strong>{' '}
                  {latestBooking.adminStatus === 'Reschedule Requested' && latestBooking.requestedDate
                    ? latestBooking.requestedDate
                    : latestBooking.date}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Time:</strong>{' '}
                  {latestBooking.adminStatus === 'Reschedule Requested' && latestBooking.requestedTime
                    ? latestBooking.requestedTime
                    : latestBooking.time}
                </p>
                {latestBooking.artistName && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>{BUSINESS_CONFIG.staffLabel}:</strong>{' '}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      {BUSINESS_CONFIG.artists.find((a) => a.id === latestBooking.artistId || a.name === latestBooking.artistName)?.avatarEmoji || '👤'}{' '}
                      {latestBooking.artistName}
                    </span>
                  </p>
                )}
                {latestBooking.depositAmount != null && (
                  <p>
                    <strong style={{ color: 'var(--text-secondary)' }}>Deposit Amount:</strong>{' '}
                    <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                      £{latestBooking.depositAmount.toFixed(2)} (Paid)
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
                  <p style={{ color: '#facc15', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>
                    ★ Requested new slot — awaiting approval
                  </p>
                )}
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Notes:</strong>{' '}
                  {latestBooking.notes || 'No notes added'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <Link to="/book" style={{ textDecoration: 'none' }}>
                  <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>Book New</button>
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
                    ⏳ Other Scheduled Sessions ({sortedActiveBookings.length - 1})
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
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              📅 {booking.date} at {booking.time}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              👤 {matchedArtist?.avatarEmoji || '👤'} {booking.artistName}
                            </p>
                          </div>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '6px 10px', fontSize: '11px' }}
                            onClick={() => {
                              const reason = prompt('Please enter cancellation reason:')
                              if (reason !== null) {
                                cancelBooking(booking.id, reason || 'Cancelled by customer')
                                addNotification(`Customer cancelled booking: ${booking.service} with ${booking.artistName}`)
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
                // Case A: Show Premium Artist Profile Showcase
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
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '2px solid var(--accent-color)',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            marginBottom: '12px',
                            boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)',
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
                            artist?.avatarEmoji || '👤'
                          )}
                        </div>
                        <h3 style={{ fontSize: '17px', margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-primary)' }}>
                          Your Artist: {latestBooking.artistName}
                        </h3>
                        {artist?.specialty && (
                          <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                            ✦ {artist.specialty}
                          </span>
                        )}
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '260px', lineHeight: '1.4' }}>
                          "Excited to work on your design! Make sure to stay hydrated and bring your reference photos."
                        </p>
                      </div>
                    )
                  })() : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎨</div>
                      <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', fontWeight: 700 }}>No Artist Selected</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                        Any available professional artist will be assigned to your service.
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
              No appointments scheduled right now.
            </p>
            <Link to="/book" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '10px 20px' }}>Book Your First Appointment</button>
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
              <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                📋 Visit Readiness
              </span>
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

          {/* Interactive Google Maps Embed Widget */}
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
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS_CONFIG.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {sortedHistoryBookings.map((booking, index) => (
              <div
                key={booking.id}
                style={{
                  paddingBottom: '20px',
                  borderBottom:
                    index === sortedHistoryBookings.length - 1
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
        )}
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
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              Cancel Appointment
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
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
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
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
      </div>
    </div>
  )
}