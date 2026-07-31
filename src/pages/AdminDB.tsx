import { Navigate, useNavigate } from 'react-router-dom'
import { useRef, useMemo, useState, useEffect } from 'react'
import { currentUserRole, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'
import { MapPinIcon, LockIcon, StudioIcon, ClockIcon, CalendarIcon, CheckIcon, AlertIcon, ZapIcon } from '../components/ui/Icons'

const adminBadgeStyle = (adminStatus: string): React.CSSProperties => {
  let bg = 'rgba(255, 255, 255, 0.05)'
  let color = 'var(--text-secondary)'

  if (adminStatus === 'New' || adminStatus === 'Reschedule Requested') {
    bg = 'rgba(16, 185, 129, 0.15)'
    color = '#34d399'
  } else if (adminStatus === 'Needs Action') {
    bg = 'rgba(234, 179, 8, 0.15)'
    color = '#facc15'
  } else if (adminStatus === 'Cancelled') {
    bg = 'rgba(239, 68, 68, 0.15)'
    color = '#f87171'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '9999px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: bg,
    color: color,
  }
}

export default function AdminDB() {
  const navigate = useNavigate()
  const {
    bookings,
    updateBookingStatus,
    acknowledgeBooking,
    declineReschedule,
    acceptReschedule,
    resetBookings,
    updateSessionDetails,
    blockSlot,
  } = useBooking()
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [showAllBookings, setShowAllBookings] = useState(false)
  const detailsRef = useRef<HTMLDivElement | null>(null)

  // Block Slot Modal State
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockStaffId, setBlockStaffId] = useState(BUSINESS_CONFIG.artists[0].id)
  const [blockDate, setBlockDate] = useState(() => new Date().toISOString().split('T')[0])
  const [blockTime, setBlockTime] = useState('12:00')
  const [blockReason, setBlockReason] = useState('Lunch Break / Out of Office')

  const [statusFilter, setStatusFilter] = useState('All')
  const [artistFilter, setArtistFilter] = useState('All')

  // Completed Session Details Editor State
  const [priceChargedInput, setPriceChargedInput] = useState('')
  const [aftercareInput, setAftercareInput] = useState('')
  const [internalNotesInput, setInternalNotesInput] = useState('')

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null)
  const [cancelReasonInput, setCancelReasonInput] = useState('')

  const reviewBookings = bookings.filter(
    (booking) =>
      booking.adminStatus === 'New' ||
      booking.adminStatus === 'Reschedule Requested' ||
      booking.adminStatus === 'Needs Action'
  )

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) || null,
    [bookings, selectedBookingId]
  )

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const activeRole = currentUserRole || sessionStorage.getItem('currentUserRole')
  if (activeRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  const getDisplayStatus = (booking: any) => {
    if (!booking) return 'Pending'

    if (booking.status === 'Cancelled') {
      return 'Cancelled'
    }

    if (!booking || !booking.date) return 'Pending'
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

    const bookingDateTime = new Date(year, month - 1, day, hours, minutes)
    const now = new Date()

    if (bookingDateTime < now) {
      return 'Completed'
    }

    if (
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

  const allMatchingBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const displayStatus = getDisplayStatus(booking)

        const matchesStatus = statusFilter === 'All' || displayStatus === statusFilter
        const matchesArtist = artistFilter === 'All' || booking.artistId === artistFilter

        return matchesStatus && matchesArtist
      })
      .sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
        const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
        return timeB - timeA
      })
  }, [bookings, statusFilter, artistFilter])

  const filteredBookings = showAllBookings ? allMatchingBookings : allMatchingBookings.slice(0, 5)

  // Synchronize form inputs when the selected completed booking changes
  useEffect(() => {
    if (selectedBooking && getDisplayStatus(selectedBooking) === 'Completed') {
      const matchedService = BUSINESS_CONFIG.services.find((s) => s.name === selectedBooking.service)
      const defaultPrice = matchedService ? matchedService.price : 0

      setPriceChargedInput(String(selectedBooking.priceCharged ?? defaultPrice))
      setAftercareInput(selectedBooking.adminNotesForCustomer || '')
      setInternalNotesInput(selectedBooking.internalAdminNotes || '')
    }
  }, [selectedBookingId, selectedBooking])

  // Calculate client analytics LTV and visits dynamically
  const clientAnalytics = useMemo(() => {
    if (!selectedBooking) return { visits: 0, ltv: 0 }
    const clientEmail = selectedBooking.customerEmail

    const completedVisits = bookings.filter(
      (b) => b.customerEmail === clientEmail && getDisplayStatus(b) === 'Completed'
    )

    const visits = completedVisits.length
    const ltv = completedVisits.reduce((sum, b) => sum + (b.priceCharged || 0), 0)

    return { visits, ltv }
  }, [bookings, selectedBooking])

  const handleSaveSessionDetails = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return

    updateSessionDetails(selectedBooking.id, {
      priceCharged: Number(priceChargedInput) || 0,
      adminNotesForCustomer: aftercareInput,
      internalAdminNotes: internalNotesInput,
    })
    triggerAdminToast(
      'Session Notes Updated!',
      `Updated notes & pricing for ${selectedBooking.customerName || 'client'}. Client will receive an instant notification banner.`,
      'success'
    )
  }

  // Admin Toast Alert State
  const [adminToast, setAdminToast] = useState<{ message: string; subtext: string; variant: 'success' | 'warning' | 'error' } | null>(null)

  const triggerAdminToast = (message: string, subtext: string, variant: 'success' | 'warning' | 'error' = 'success') => {
    setAdminToast({ message, subtext, variant })
    setTimeout(() => {
      setAdminToast(null)
    }, 6000)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '24px 16px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      {/* Admin Action Feedback Toast Popup */}
      {adminToast && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '560px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: '#13151c',
            border: `1px solid ${adminToast.variant === 'success' ? '#10b981' : adminToast.variant === 'error' ? '#ef4444' : '#facc15'}`,
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
            padding: '16px 20px',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: adminToast.variant === 'success' ? 'rgba(16, 185, 129, 0.15)' : adminToast.variant === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {adminToast.variant === 'success' ? (
                <CheckIcon size={20} style={{ color: '#34d399' }} />
              ) : (
                <ClockIcon size={20} style={{ color: adminToast.variant === 'error' ? '#f87171' : '#facc15' }} />
              )}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                {adminToast.message}
              </p>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {adminToast.subtext}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminToast(null)}
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
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPinIcon size={12} style={{ color: 'var(--accent-color)' }} /> {BUSINESS_CONFIG.address}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Admin Control Hub" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowBlockModal(true)}
              className="btn btn-secondary"
              style={{ padding: '7px 12px', fontSize: '12px', border: '1px solid #10b981', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LockIcon size={12} /> Block Time Slot
            </button>
            <button onClick={resetBookings} className="btn btn-danger" style={{ padding: '7px 12px', fontSize: '12px' }}>
              Reset Data
            </button>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '12px' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '4px' }}>Admin Dashboard</h1>
        <p>Review bookings, statuses, and customer notes for {BUSINESS_CONFIG.name}.</p>
      </div>

      {/* ─── PROMINENT ACTION QUEUE TOP BANNER ───────────────────── */}
      {(() => {
        const pendingRequests = bookings.filter(
          (b) => b.adminStatus === 'Reschedule Requested' || b.status === 'Pending'
        )
        if (pendingRequests.length === 0) return null

        return (
          <div
            className="premium-card"
            style={{
              marginBottom: '28px',
              padding: '22px 26px',
              border: '1px solid #facc15',
              background: 'rgba(234, 179, 8, 0.08)',
              boxShadow: '0 8px 32px rgba(234, 179, 8, 0.16)',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <StudioIcon size={24} style={{ color: '#10b981' }} />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', margin: 0 }}>
                  Studio Action Queue ({pendingRequests.length} Pending Request{pendingRequests.length > 1 ? 's' : ''})
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Artist Schedule Board, Custom Flash Artwork & Aftercare Consent Verification.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {req.adminStatus === 'Reschedule Requested' ? (
                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.25)', color: '#facc15', border: '1px solid #facc15', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ClockIcon size={12} /> RESCHEDULE REQUEST
                        </span>
                      ) : (
                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', border: '1px solid #38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CalendarIcon size={12} /> NEW BOOKING REQUEST
                        </span>
                      )}
                      <strong style={{ color: '#ffffff', fontSize: '15px' }}>{req.service}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        — {req.customerName || 'Client'} ({req.customerEmail})
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        {BUSINESS_CONFIG.staffLabel}: {req.artistName || 'Unassigned'}
                      </span>
                    </div>

                    {req.adminStatus === 'Reschedule Requested' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                          Original: {req.date} @ {req.time}
                        </span>
                        <span style={{ color: '#facc15', fontWeight: 800, background: 'rgba(234, 179, 8, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                          👉 Requested New: {req.requestedDate} @ {req.requestedTime}
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarIcon size={13} /> Requested Slot: {req.date} at {req.time}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {req.adminStatus === 'Reschedule Requested' ? (
                      <>
                        <button
                          onClick={() => {
                            acceptReschedule(req.id)
                            triggerAdminToast(
                              'Reschedule Approved!',
                              `Session with ${req.customerName || 'Client'} confirmed for ${req.requestedDate || req.date} at ${req.requestedTime || req.time}. Review in All Bookings below.`,
                              'success'
                            )
                          }}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <CheckIcon size={12} /> Approve New Slot
                        </button>
                        <button
                          onClick={() => {
                            declineReschedule(req.id)
                            triggerAdminToast(
                              'Reschedule Declined',
                              `Original session with ${req.customerName || 'Client'} on ${req.date} at ${req.time} remains active.`,
                              'warning'
                            )
                          }}
                          className="btn btn-danger"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          ❌ Decline
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            updateBookingStatus(req.id, 'Confirmed')
                            triggerAdminToast(
                              'Booking Confirmed!',
                              `Session "${req.service}" with ${req.customerName || 'Client'} confirmed for ${req.date} at ${req.time}. Review in All Bookings below.`,
                              'success'
                            )
                          }}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
                        >
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => {
                            updateBookingStatus(req.id, 'Cancelled')
                            triggerAdminToast(
                              'Booking Cancelled',
                              `Session "${req.service}" with ${req.customerName || 'Client'} was cancelled.`,
                              'error'
                            )
                          }}
                          className="btn btn-danger"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      <div className="admin-dashboard-grid">
        {/* Left Side: Bookings list */}
        <div className="premium-card">
          <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>All Bookings</h2>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '24px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Pending', 'Upcoming', 'Cancelled', 'Completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className="btn"
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    borderRadius: '20px',
                    background: statusFilter === filter ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${statusFilter === filter ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    color: statusFilter === filter ? '#34d399' : 'var(--text-secondary)',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {BUSINESS_CONFIG.staffLabel}:
              </span>
              <select
                value={artistFilter}
                onChange={(e) => setArtistFilter(e.target.value)}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '18px', width: 'auto', background: 'rgba(255,255,255,0.03)' }}
              >
                <option value="All">All {BUSINESS_CONFIG.staffLabelPlural}</option>
                {BUSINESS_CONFIG.artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className={getDisplayStatus(booking) === 'Upcoming' ? 'upcoming-card-highlight' : ''}
                  style={{
                    padding: '20px 0',
                    borderBottom:
                      index !== filteredBookings.length - 1 ? '1px solid var(--border-color)' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <h3 style={{ fontSize: '18px' }}>{booking.service}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`status-badge ${getDisplayStatus(booking).toLowerCase()}`}>
                        {getDisplayStatus(booking)}
                      </span>
                      {booking.adminStatus && booking.adminStatus !== 'Confirmed' && (
                        <span style={adminBadgeStyle(booking.adminStatus)}>
                          {booking.adminStatus}
                        </span>
                      )}
                    </div>
                  </div>                  {/* Request Type Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {booking.adminStatus === 'Reschedule Requested' ? (
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ClockIcon size={12} /> RESCHEDULE REQUEST
                      </span>
                    ) : booking.status === 'Pending' ? (
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarIcon size={12} /> NEW BOOKING REQUEST
                      </span>
                    ) : booking.status === 'Cancelled' ? (
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertIcon size={12} /> CANCELLATION
                      </span>
                    ) : null}
                  </div>

                  {booking.adminStatus === 'Reschedule Requested' ? (
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'rgba(234, 179, 8, 0.08)',
                        border: '1px solid rgba(234, 179, 8, 0.35)',
                        borderRadius: '14px',
                        marginBottom: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <CalendarIcon size={14} style={{ color: '#94a3b8' }} />
                        <span><strong>Original Slot:</strong></span>
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 600 }}>
                          {booking.date} at {booking.time}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', flexWrap: 'wrap' }}>
                        <ZapIcon size={14} style={{ color: '#facc15' }} />
                        <span style={{ color: '#facc15', fontWeight: 800 }}><strong>Requested New Slot:</strong></span>
                        <span style={{ background: 'rgba(234, 179, 8, 0.25)', border: '1px solid #facc15', color: '#fef08a', padding: '4px 10px', borderRadius: '8px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <CalendarIcon size={12} /> {booking.requestedDate} <ClockIcon size={12} /> {booking.requestedTime}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '10px 0' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', padding: '5px 12px', borderRadius: '8px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarIcon size={13} /> {booking.date}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#34d399', background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.45)', padding: '5px 12px', borderRadius: '8px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ClockIcon size={13} /> {booking.time}
                      </span>
                    </div>
                  )}

                  <p style={{ margin: '4px 0', fontSize: '15px' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Client:</strong> {booking.customerName || 'Jane Doe'} (
                    {booking.customerEmail || 'customer@test.com'})
                  </p>

                  <p style={{ margin: '4px 0', fontSize: '15px' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>{BUSINESS_CONFIG.staffLabel}:</strong> {booking.artistName || 'None'}
                    {booking.depositAmount != null && (
                      <span style={{ marginLeft: '14px' }}>
                        <strong style={{ color: 'var(--text-secondary)' }}>Deposit:</strong> £{booking.depositAmount.toFixed(2)}
                      </span>
                    )}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        Confirm
                      </button>
                    )}

                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => {
                          setCancellingBooking(booking)
                          setCancelReasonInput('')
                        }}
                        className="btn btn-danger"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedBookingId(booking.id)
                        setTimeout(() => {
                          detailsRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                          })
                        }, 0)
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>No bookings found.</p>
          )}

          {allMatchingBookings.length > 5 && (
            <button
              onClick={() => setShowAllBookings(!showAllBookings)}
              className="btn btn-secondary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              {showAllBookings ? 'Show Less' : `Show More (${allMatchingBookings.length - 5} more)`}
            </button>
          )}
        </div>

        {/* Right Side Stack: Queue & Detail Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Review Queue */}
          <div className="premium-card">
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
              Action Queue {reviewBookings.length > 0 ? `(${reviewBookings.length})` : ''}
            </h2>

            {reviewBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviewBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    style={{
                      paddingBottom: '16px',
                      borderBottom:
                        index !== reviewBookings.length - 1 ? '1px solid var(--border-color)' : 'none',
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>{booking.service}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0' }}>
                      Client: {booking.customerName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#34d399', fontWeight: 600, margin: '2px 0 8px 0' }}>
                      {BUSINESS_CONFIG.staffLabel}: {booking.artistName || 'Unassigned'}
                    </p>

                    {booking.adminStatus === 'Reschedule Requested' ? (
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          background: 'rgba(255,255,255,0.02)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          marginBottom: '12px',
                        }}
                      >
                        <p style={{ margin: '2px 0' }}>
                          <strong>From:</strong> {booking.originalDate || booking.date} at{' '}
                          {booking.originalTime || booking.time}
                        </p>
                        <p style={{ margin: '2px 0', color: '#facc15' }}>
                          <strong>To:</strong> {booking.requestedDate} at {booking.requestedTime}
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Requested: {booking.date} at {booking.time}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          if (booking.adminStatus === 'Reschedule Requested') {
                            acceptReschedule(booking.id)
                            triggerAdminToast('Reschedule Approved!', `Approved new date ${booking.requestedDate || booking.date} at ${booking.requestedTime || booking.time} for ${booking.customerName}.`, 'success')
                          } else if (booking.status === 'Cancelled' && booking.adminStatus === 'Needs Action') {
                            acknowledgeBooking(booking.id)
                            triggerAdminToast('Cancellation Acknowledged', `Acknowledged cancellation from ${booking.customerName}.`, 'warning')
                          } else {
                            updateBookingStatus(booking.id, 'Confirmed')
                            triggerAdminToast('Booking Confirmed!', `Confirmed session "${booking.service}" for ${booking.customerName} on ${booking.date} at ${booking.time}.`, 'success')
                          }
                        }}
                        className="btn btn-primary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          background:
                            booking.status === 'Cancelled' && booking.adminStatus === 'Needs Action'
                              ? 'rgba(234, 179, 8, 0.2)'
                              : 'var(--accent-color)',
                          color:
                            booking.status === 'Cancelled' && booking.adminStatus === 'Needs Action'
                              ? '#facc15'
                              : '#ffffff',
                        }}
                      >
                        {booking.adminStatus === 'Reschedule Requested'
                          ? 'Approve'
                          : booking.status === 'Cancelled' && booking.adminStatus === 'Needs Action'
                          ? 'Acknowledge'
                          : 'Confirm'}
                      </button>
                      {booking.adminStatus === 'Reschedule Requested' && (
                        <button
                          onClick={() => declineReschedule(booking.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Decline
                        </button>
                      )}
                      {booking.status !== 'Cancelled' && (
                        <button
                          onClick={() => {
                            setCancellingBooking(booking)
                            setCancelReasonInput('')
                          }}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedBookingId(booking.id)
                          setTimeout(() => {
                            detailsRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            })
                          }, 0)
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No action items pending.</p>
            )}
          </div>

          {/* Booking Details */}
          <div ref={detailsRef} className="premium-card">
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Booking Details</h2>

            {selectedBooking ? (
              <div
                style={{
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Client Name:</strong>{' '}
                  {selectedBooking.customerName || 'Jane Doe'}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Client Email:</strong>{' '}
                  {selectedBooking.customerEmail || 'customer@test.com'}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Client Phone:</strong>{' '}
                  {selectedBooking.customerPhone || '+48 555 123 456'}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Service Type:</strong>{' '}
                  {selectedBooking.service}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>Scheduled Time:</strong>{' '}
                  {selectedBooking.date} at {selectedBooking.time}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Status:</strong>{' '}
                  <span className={`status-badge ${getDisplayStatus(selectedBooking).toLowerCase()}`}>
                    {getDisplayStatus(selectedBooking)}
                  </span>
                </p>
                {selectedBooking.artistName && (
                  <p>
                    <strong style={{ color: 'var(--text-secondary)' }}>{BUSINESS_CONFIG.staffLabel}:</strong>{' '}
                    {selectedBooking.artistName}
                  </p>
                )}
                {selectedBooking.depositAmount != null && (
                  <p>
                    <strong style={{ color: 'var(--text-secondary)' }}>Deposit Status:</strong>{' '}
                    <span style={{ color: selectedBooking.depositPaid ? 'var(--accent-color)' : '#facc15', fontWeight: 600 }}>
                      £{selectedBooking.depositAmount.toFixed(2)} ({selectedBooking.depositPaid ? 'Authorized & Paid' : 'Unpaid'})
                    </span>
                  </p>
                )}
                <p>
                  <strong style={{ color: 'var(--text-secondary)' }}>{BUSINESS_CONFIG.notesLabel}:</strong>{' '}
                  {selectedBooking.notes || 'No notes added'}
                </p>
                {selectedBooking.requestedDate && selectedBooking.requestedTime && (
                  <p style={{ color: '#facc15', fontStyle: 'italic', fontWeight: 600 }}>
                    ★ Requested reschedule to: {selectedBooking.requestedDate} at {selectedBooking.requestedTime}
                  </p>
                )}



                {/* Cancellation Details */}
                {selectedBooking.status === 'Cancelled' && (
                  <div
                    style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '10px',
                      marginTop: '4px',
                    }}
                  >
                    <p>
                      <strong style={{ color: 'var(--text-secondary)' }}>Cancelled By:</strong>{' '}
                      <span style={{ textTransform: 'capitalize' }}>
                        {selectedBooking.cancelledBy || 'system'}
                      </span>
                    </p>
                    {selectedBooking.cancellationReason && (
                      <p>
                        <strong style={{ color: 'var(--text-secondary)' }}>Cancellation Reason:</strong>{' '}
                        <span style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>
                          "{selectedBooking.cancellationReason}"
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Client Lifetime Metrics Panel */}
                <div
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    background: 'rgba(16, 185, 129, 0.04)',
                    border: '1px solid rgba(16, 185, 129, 0.12)',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                >
                  <p style={{ fontWeight: 700, color: '#34d399', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📈 Client Metrics
                  </p>
                  <p style={{ margin: '2px 0' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Completed Visits:</strong> {clientAnalytics.visits}
                  </p>
                  <p style={{ margin: '2px 0' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Lifetime LTV:</strong> ${clientAnalytics.ltv}
                  </p>
                </div>

                {/* Completed Session Details Editor Form */}
                {getDisplayStatus(selectedBooking) === 'Completed' && (
                  <form
                    onSubmit={handleSaveSessionDetails}
                    style={{
                      marginTop: '12px',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <p style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-color)' }}>
                      📝 Complete Session Notes
                    </p>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>
                        Price Charged ($)
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={priceChargedInput}
                        onChange={(e) => setPriceChargedInput(e.target.value)}
                        placeholder="e.g. 150"
                        required
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>
                        {BUSINESS_CONFIG.adminNotesLabel} (Customer-Facing)
                      </label>
                      <textarea
                        className="form-textarea"
                        value={aftercareInput}
                        onChange={(e) => setAftercareInput(e.target.value)}
                        placeholder="Instructions for customer..."
                        style={{ minHeight: '60px', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>
                        {BUSINESS_CONFIG.internalNotesLabel} (Admin-Only)
                      </label>
                      <textarea
                        className="form-textarea"
                        value={internalNotesInput}
                        onChange={(e) => setInternalNotesInput(e.target.value)}
                        placeholder="Private details, notes, progress..."
                        style={{ minHeight: '60px', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '13px', alignSelf: 'flex-end' }}>
                      Save Notes
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Select a booking from the list or review queue to inspect details.
              </p>
            )}
        </div>
      </div>
    </div>
      {cancellingBooking && (
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
              Are you sure you want to cancel <strong>{cancellingBooking.service}</strong> for{' '}
              <strong>{cancellingBooking.customerName || 'Client'}</strong>?
            </p>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '13px', marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>
                Reason for Cancellation (Optional)
              </label>
              <textarea
                className="form-textarea"
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                placeholder="e.g. Schedule conflict, client request..."
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

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Keep Appointment
              </button>

              <button
                type="button"
                onClick={() => {
                  updateBookingStatus(cancellingBooking.id, 'Cancelled', cancelReasonInput || 'No reason provided')
                  setCancellingBooking(null)
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

      {/* ─── BLOCK TIME SLOT MODAL ──────────────────────────────── */}
      {showBlockModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 10, 15, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            className="premium-card"
            style={{
              width: '100%',
              maxWidth: '460px',
              border: '1px solid #10b981',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#34d399', margin: 0 }}>
                🚫 Block Artist / Staff Time Slot
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                blockSlot(blockStaffId, blockDate, blockTime, blockReason)
                setShowBlockModal(false)
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label className="form-label">Select {BUSINESS_CONFIG.staffLabel}</label>
                <select
                  value={blockStaffId}
                  onChange={(e) => setBlockStaffId(e.target.value)}
                  className="form-select"
                >
                  {BUSINESS_CONFIG.artists.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.avatarEmoji || '👤'} {staff.name} ({staff.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Date to Block</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Time Slot</label>
                  <select
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="form-select"
                  >
                    {['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Block Reason / Label</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="form-select"
                  style={{ marginBottom: '8px' }}
                >
                  <option value="Lunch Break / Studio Rest">Lunch Break / Studio Rest</option>
                  <option value="Personal / Vacation">Personal / Guest Spot Away</option>
                  <option value="Machine Maintenance & Sterilization">Machine & Tool Sterilization</option>
                  <option value="Custom Design Work Session">Custom Design Work Session</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#10b981', borderColor: '#10b981', color: '#fff', fontWeight: 800 }}
                >
                  Block Slot 🚫
                </button>
              </div>
            </form>
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