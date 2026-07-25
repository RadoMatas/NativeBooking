import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useBooking } from '../BookingContext'
import { currentUserRole, currentUserEmail } from '../auth'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'

export default function BookAppointment() {
  const navigate = useNavigate()
  const activeRole = currentUserRole || sessionStorage.getItem('currentUserRole')
  if (activeRole !== 'customer') {
    return <Navigate to="/" replace />
  }

  const { bookings, addBooking, updateBooking, addNotification } = useBooking()
  const location = useLocation()
  const isReschedule = location.state?.isReschedule
  const bookingId = location.state?.bookingId
  const latestBooking = bookings.find((b) => b.id === bookingId) || bookings[0]

  const today = new Date().toISOString().split('T')[0]
  const openingHour = BUSINESS_CONFIG.openingHour
  const closingHour = BUSINESS_CONFIG.closingHour
  const slotInterval = BUSINESS_CONFIG.slotInterval

  const generateTimeSlots = () => {
    const slots: string[] = []

    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += slotInterval) {
        const formattedHour = String(hour).padStart(2, '0')
        const formattedMinutes = String(minutes).padStart(2, '0')
        slots.push(`${formattedHour}:${formattedMinutes}`)
      }
    }

    return slots
  }

  const [customerName, setCustomerName] = useState(() => {
    if (isReschedule && latestBooking) return latestBooking.customerName || 'Jane Doe'
    return 'Jane Doe'
  })
  const [customerEmail, setCustomerEmail] = useState(() => {
    if (isReschedule && latestBooking) return latestBooking.customerEmail || 'customer@test.com'
    return sessionStorage.getItem('currentUserEmail') || currentUserEmail || 'customer@test.com'
  })
  const [customerPhone, setCustomerPhone] = useState(() => {
    if (isReschedule && latestBooking) return latestBooking.customerPhone || '+48 555 123 456'
    return '+48 555 123 456'
  })

  const [service, setService] = useState(
    isReschedule && latestBooking ? latestBooking.service : ''
  )
  const [artistId, setArtistId] = useState(
    isReschedule && latestBooking ? latestBooking.artistId || '' : ''
  )
  const [date, setDate] = useState(() => {
    if (isReschedule && latestBooking) {
      return latestBooking.date < today ? today : latestBooking.date
    }
    return ''
  })
  const [time, setTime] = useState(() => {
    if (isReschedule && latestBooking) {
      return latestBooking.date < today ? '' : latestBooking.time
    }
    return ''
  })
  const [notes, setNotes] = useState(
    isReschedule && latestBooking ? latestBooking.notes || '' : ''
  )

  // Simulated Checkout Modal/Step States
  const [showCheckout, setShowCheckout] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const availableTimeSlots = generateTimeSlots().filter((slot) => {
    // Check if the selected artist is booked at this exact date & time
    const isArtistBooked = bookings.some(
      (booking) =>
        (booking.id !== (isReschedule ? latestBooking?.id : null)) &&
        booking.date === date &&
        booking.time === slot &&
        booking.artistId === artistId &&
        booking.status !== 'Cancelled'
    )

    if (isArtistBooked) return false

    if (date !== today) return true

    const now = new Date()
    const [slotHour, slotMinute] = slot.split(':').map(Number)

    const slotDate = new Date()
    slotDate.setHours(slotHour, slotMinute, 0, 0)

    return slotDate > now
  })

  // Date and Roster validation
  const getDateValidationError = (dateString: string) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    const dayOfWeek = d.getDay() // 0=Sunday, 1=Monday... 6=Saturday

    if (BUSINESS_CONFIG.closedDays.includes(dayOfWeek)) {
      return `The studio is closed on Sundays.`
    }

    if (artistId) {
      const artist = BUSINESS_CONFIG.artists.find((a) => a.id === artistId)
      if (artist && !artist.workingDays.includes(dayOfWeek)) {
        const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const workingNames = artist.workingDays.map((dayNum) => daysMap[dayNum]).join(', ')
        return `${artist.name} only works on: ${workingNames}.`
      }
    }

    return ''
  }

  const selectedService = BUSINESS_CONFIG.services.find((s) => s.name === service)
  const servicePrice = selectedService ? selectedService.price : 0
  const depositAmount = (servicePrice * BUSINESS_CONFIG.depositPercentage) / 100

  const dateError = getDateValidationError(date)

  const processBooking = () => {
    const matchedArtist = BUSINESS_CONFIG.artists.find((a) => a.id === artistId)

    if (isReschedule && latestBooking) {
      const bookingData = {
        ...latestBooking,
        ownerEmail: currentUserEmail || customerEmail || latestBooking.ownerEmail,
        customerName,
        customerEmail,
        customerPhone,
        service,
        artistId,
        artistName: matchedArtist ? matchedArtist.name : '',
        depositAmount: latestBooking.depositAmount ?? depositAmount,
        depositPaid: latestBooking.depositPaid ?? (depositAmount > 0),
        notes,
        status: 'Pending',
        adminStatus: 'Reschedule Requested',
        originalDate: latestBooking.date,
        originalTime: latestBooking.time,
        requestedDate: date,
        requestedTime: time,
      }

      updateBooking(latestBooking.id, bookingData)
      addNotification(
        `Customer requested reschedule: ${service} with ${matchedArtist ? matchedArtist.name : ('any ' + BUSINESS_CONFIG.staffLabel)} to ${date} at ${time}`
      )
    } else {
      const activeEmail = sessionStorage.getItem('currentUserEmail') || currentUserEmail || customerEmail || 'customer@test.com'
      const bookingData = {
        id: crypto.randomUUID(),
        ownerEmail: activeEmail,
        customerName,
        customerEmail,
        customerPhone,
        service,
        artistId,
        artistName: matchedArtist ? matchedArtist.name : '',
        depositAmount,
        depositPaid: depositAmount > 0,
        date,
        time,
        notes,
        status: 'Pending',
        adminStatus: 'New',
      }

      addBooking(bookingData)
      addNotification(`New booking: ${service} with ${matchedArtist ? matchedArtist.name : ('any ' + BUSINESS_CONFIG.staffLabel)} on ${date} at ${time}`)
    }

    navigate('/dashboard')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!service) {
      alert('Please select a service before proceeding.')
      return
    }

    if (!artistId) {
      alert(`Please select a ${BUSINESS_CONFIG.staffLabel.toLowerCase()} before proceeding.`)
      return
    }

    if (!date) {
      alert('Please select a date before proceeding.')
      return
    }

    if (!time) {
      alert('Please select a time slot before proceeding.')
      return
    }

    if (dateError) {
      alert(dateError)
      return
    }

    // Bypass payment modal if rescheduling OR if deposit is 0%
    if (isReschedule || BUSINESS_CONFIG.depositPercentage === 0) {
      processBooking()
    } else {
      setShowCheckout(true)
    }
  }

  const handleConfirmPayment = () => {
    if (!cardNumber || !cardExpiry || !cardCvc) {
      alert('Please fill in card details to complete the payment.')
      return
    }

    processBooking()
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 9, 11, 0.85)',
            backdropFilter: 'blur(8px)',
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
              maxWidth: '480px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)',
            }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--accent-color)' }}>
              Secure Checkout
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Confirm your booking by completing the card authorization for the required deposit.
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '15px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{BUSINESS_CONFIG.staffLabel}:</span>
                <span style={{ fontWeight: 600 }}>{BUSINESS_CONFIG.artists.find((a) => a.id === artistId)?.name || ('Any ' + BUSINESS_CONFIG.staffLabel)}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '15px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Session:</span>
                <span style={{ fontWeight: 600 }}>{service}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '15px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Date & Time:</span>
                <span style={{ fontWeight: 600 }}>{date} at {time}</span>
              </p>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '10px 0' }} />
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '16px', color: 'var(--accent-color)' }}>
                <span style={{ fontWeight: 700 }}>Deposit to Pay:</span>
                <span style={{ fontWeight: 700 }}>£{depositAmount.toFixed(2)}</span>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '12px' }}>Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Expiry Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>CVC</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                Authorize & Book
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="premium-card"
        style={{
          width: '100%',
          maxWidth: '640px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <Logo size="large" />
        </div>
        <h1 style={{ fontSize: '30px', marginBottom: '8px', textAlign: 'center' }}>
          {isReschedule ? 'Reschedule Appointment' : 'Book Appointment'}
        </h1>
        <p style={{ marginBottom: '28px', textAlign: 'center' }}>
          {isReschedule
            ? 'Update your appointment details and submit your new preferred slot.'
            : 'Choose your service, date, time, and add notes if needed.'}
        </p>

        {/* Booking Stepper Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '28px',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '9999px',
            border: '1px solid var(--border-color)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <span style={{ color: 'var(--accent-color)' }}>① Client & Service</span>
          <span style={{ color: 'var(--text-secondary)' }}>➔</span>
          <span style={{ color: artistId && date && time ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
            ② Slot & {BUSINESS_CONFIG.staffLabel}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>➔</span>
          <span style={{ color: 'var(--text-secondary)' }}>③ Confirm</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-input"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="form-input"
                placeholder="e.g. john@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="form-input"
                placeholder="e.g. +48 555 123 456"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
              Select Service
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {BUSINESS_CONFIG.services.map((srv) => {
                const isSelected = service === srv.name
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setService(srv.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `2px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: isSelected ? '#34d399' : 'var(--text-primary)' }}>
                        {srv.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        ⏱️ {srv.durationMin} mins
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: isSelected ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      £{srv.price}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
              Select {BUSINESS_CONFIG.staffLabel}
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
              }}
            >
              {BUSINESS_CONFIG.artists.map((art) => {
                const isSelected = artistId === art.id
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => setArtistId(art.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '14px 10px',
                      borderRadius: '14px',
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `2px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        marginBottom: '8px',
                        boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
                      }}
                    >
                      {art.avatarUrl ? (
                        <img
                          src={art.avatarUrl}
                          alt={art.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        art.avatarEmoji || '👤'
                      )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? '#34d399' : 'var(--text-primary)' }}>
                      {art.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.2' }}>
                      {art.specialty}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                style={{ borderColor: dateError ? '#f87171' : 'var(--border-color)' }}
                required
              />
              {dateError && (
                <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px', margin: '4px 0 0 0' }}>
                  ⚠ {dateError}
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Available Time Slots</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-select"
                disabled={!date || !!dateError}
                required
              >
                <option value="">Select a time</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deposit Pricing Display Card */}
          {service && !isReschedule && BUSINESS_CONFIG.depositPercentage > 0 && (
            <div
              style={{
                marginTop: '8px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Service Total Price:</span>
                <span style={{ fontWeight: 600 }}>£{servicePrice.toFixed(2)}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontSize: '14px', color: 'var(--accent-color)' }}>
                <span style={{ fontWeight: 700 }}>Required Booking Deposit ({BUSINESS_CONFIG.depositPercentage}%):</span>
                <span style={{ fontWeight: 700 }}>£{depositAmount.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{BUSINESS_CONFIG.notesLabel}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Job site address details, building/unit #, gate access code, or emergency dispatch instructions..."
              className="form-textarea"
              style={{ minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!!dateError || !time}
            >
              {isReschedule ? 'Submit Reschedule Request' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}