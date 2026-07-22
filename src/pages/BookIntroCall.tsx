import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitIntroCallRequest, type IntroCallBooking } from '../introCallHelpers'

export default function BookIntroCall() {
  const navigate = useNavigate()

  const t = {
    bg: '#09090b',
    cardBg: 'rgba(20, 20, 23, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#10b981',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    textMuted: 'rgba(255, 255, 255, 0.35)',
  }

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:00')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('Tattoo / Creative Studio')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedBooking, setSubmittedBooking] = useState<IntroCallBooking | null>(null)

  const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) {
      alert('Please fill in your name, email, and phone number.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitIntroCallRequest({
        name,
        email,
        phone,
        industry,
        notes,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      })

      // Send instant email notification via EmailJS REST API
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: 'service_jfrd3cr',
            template_id: 'template_4e7ipi1',
            user_id: 'SWLupKhyJ1aMBxMI-',
            template_params: {
              from_name: name,
              name: name,
              from_email: email,
              email: email,
              phone: phone,
              industry: industry,
              requested_date: selectedDate,
              requested_time: selectedTimeSlot,
              notes: notes || 'None',
              message: `New Discovery Call Request!\n\nClient: ${name}\nEmail: ${email}\nPhone/WhatsApp: ${phone}\nIndustry: ${industry}\nRequested Date: ${selectedDate}\nRequested Time: ${selectedTimeSlot} CET\nNotes: ${notes || 'None'}\n\nManage in Central Control:\nhttps://nativebooking.co/adminlogin`,
            },
          }),
        })
      } catch (emailErr) {
        console.warn('EmailJS notification send error:', emailErr)
      }

      setSubmittedBooking(result)
    } catch (err) {
      console.error(err)
      alert('Failed to submit call request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: `radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 45%),
                     radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.03), transparent 50%),
                     ${t.bg}`,
        paddingBottom: '80px',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .nb-bic-nav { padding: 12px 16px !important; }
          .nb-bic-logo-title { font-size: 14px !important; letter-spacing: 0.04em !important; }
          .nb-bic-btn { padding: 6px 12px !important; font-size: 12px !important; }
        }
      `}</style>
      {/* ─── NAV ──────────────────────────────────────────────── */}
      <nav
        className="nb-bic-nav"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 32px',
          borderBottom: `1px solid ${t.border}`,
          background: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img
            src="/logo-icon.jpg"
            alt="NativeBooking"
            style={{ height: '36px', width: '36px', borderRadius: '8px', display: 'block' }}
          />
          <span className="nb-bic-logo-title" style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.07em', color: '#ffffff' }}>
            NATIVEBOOKING
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="nb-bic-btn"
          style={{
            background: 'none',
            border: `1px solid ${t.border}`,
            color: t.textSecondary,
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ← Back to Portal
        </button>
      </nav>

      {/* ─── MAIN CONTENT ────────────────────────────────────── */}
      <div style={{ maxWidth: '640px', margin: '48px auto 0', padding: '0 24px' }}>
        {submittedBooking ? (
          /* ─── SUCCESS SCREEN ───────────────────────────────── */
          <div
            style={{
              background: t.cardBg,
              border: `1px solid rgba(16, 185, 129, 0.3)`,
              borderRadius: '20px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              animation: 'fadeInUp 0.5s ease both',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px',
              }}
            >
              ⚡
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Request Received!
            </h1>
            <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: '1.6', marginBottom: '28px' }}>
              Thank you, <strong style={{ color: '#ffffff' }}>{submittedBooking.name}</strong>. Your intro call request has been recorded.
            </p>

            {/* Details Box */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '28px',
                fontSize: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary }}>Requested Date:</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{submittedBooking.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary }}>Time Slot:</span>
                <span style={{ fontWeight: 700, color: t.accent }}>{submittedBooking.timeSlot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary }}>Industry:</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{submittedBooking.industry}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary }}>Status:</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(234, 179, 8, 0.15)',
                    color: '#eab308',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                  }}
                >
                  Pending Review
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.6', marginBottom: '28px' }}>
              We will review your requested time slot and send a confirmation email to{' '}
              <span style={{ color: t.accent, fontWeight: 600 }}>{submittedBooking.email}</span> shortly.
            </p>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '10px',
                background: t.accent,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
              }}
            >
              Return to Homepage
            </button>
          </div>
        ) : (
          /* ─── REQUEST FORM ─────────────────────────────────── */
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: t.accent,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Powered by NativeBooking Engine
              </span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Schedule a 1-Hour Call
              </h1>
              <p style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.5' }}>
                Select a time slot below. Experience our booking engine in action for your own business consultation.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Date Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '8px' }}>
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${t.border}`,
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  required
                />
              </div>

              {/* Time Slot Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '8px' }}>
                  Available Time Slots (CET)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: isSelected ? `1px solid ${t.accent}` : `1px solid ${t.border}`,
                          background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? t.accent : t.textPrimary,
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '8px 0' }} />

              {/* Contact Info */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Kowalski"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${t.border}`,
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="alex@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${t.border}`,
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="+48 123 456 789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${t.border}`,
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>
                  Your Business Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#18181b',
                    border: `1px solid ${t.border}`,
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option value="Tattoo / Creative Studio">Tattoo / Creative Studio</option>
                  <option value="Medical / Dental / Clinic">Medical / Dental / Clinic</option>
                  <option value="Education / Academy">Education / Academy</option>
                  <option value="HVAC / Field Contractor">HVAC / Field Contractor</option>
                  <option value="Other Service Business">Other Service Business</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>
                  Project Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us briefly about your team size, custom rules, or what you need built..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${t.border}`,
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: '12px',
                  color: t.textSecondary,
                  lineHeight: '1.5',
                  textAlign: 'center',
                  margin: '4px 0 0',
                }}
              >
                🔒 By requesting a call, you agree to our{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: t.accent, textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
                . We store your contact info solely to arrange your discovery call.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: t.accent,
                  color: '#ffffff',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSubmitting ? 'Submitting Request...' : 'Request Discovery Call 📅'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
