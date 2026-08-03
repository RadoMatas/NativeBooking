import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import emailjs from '@emailjs/browser'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageWrapper } from '../components/ui/PageWrapper'
import { CheckIcon, ArrowRightIcon } from '../components/ui/Icons'
import { submitIntroCallRequest, subscribeToIntroCalls, type IntroCallBooking } from '../introCallHelpers'

// Helper to get local date string YYYY-MM-DD in user's timezone (e.g. Krakow / Europe/Warsaw)
const getLocalTodayStr = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const TIMEZONE_OPTIONS = [
  { zone: 'Europe/Warsaw', label: 'Europe/Warsaw (CEST / UTC+2)' },
  { zone: 'America/New_York', label: 'America/New_York (EDT / UTC-4)' },
  { zone: 'America/Chicago', label: 'America/Chicago (CDT / UTC-5)' },
  { zone: 'America/Los_Angeles', label: 'America/Los_Angeles (PDT / UTC-7)' },
  { zone: 'Europe/London', label: 'Europe/London (BST / UTC+1)' },
  { zone: 'Asia/Tokyo', label: 'Asia/Tokyo (JST / UTC+9)' },
  { zone: 'Australia/Sydney', label: 'Australia/Sydney (AEST / UTC+10)' },
]

export default function BookIntroCall() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingBookings, setExistingBookings] = useState<IntroCallBooking[]>([])

  const todayStr = getLocalTodayStr()
  const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Warsaw'
  const [selectedTimezone, setSelectedTimezone] = useState(detectedZone)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Tattoo & Creative Studio',
    date: todayStr,
    time: '14:00',
    notes: '',
  })

  // Subscribe to real-time booked intro calls so booked slots become unavailable instantly
  useEffect(() => {
    const unsub = subscribeToIntroCalls((calls) => {
      setExistingBookings(calls)
    })
    return () => unsub()
  }, [])

  // Format slot label in both Selected Timezone & Host CEST (14:00 CEST)
  const formatSlotLabel = (cestTime: string) => {
    const [hStr] = cestTime.split(':')
    const baseDate = new Date(`${formData.date}T${hStr}:00:00+02:00`)

    try {
      const userLocalTimeStr = baseDate.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

      const shortZoneName = selectedTimezone.split('/')[1]?.replace('_', ' ') || selectedTimezone

      if (selectedTimezone === 'Europe/Warsaw' || selectedTimezone.includes('CEST')) {
        return `${cestTime} CEST (${userLocalTimeStr})`
      }

      return `${userLocalTimeStr} (${shortZoneName}) · ${cestTime} CEST Host`
    } catch {
      return `${cestTime} CEST`
    }
  }

  // All standard daily slots
  const ALL_SLOTS = [
    { time: '10:00', rawHour: 10 },
    { time: '12:00', rawHour: 12 },
    { time: '14:00', rawHour: 14 },
    { time: '16:00', rawHour: 16 },
    { time: '18:00', rawHour: 18 },
  ]

  // Filter out past hours for today & already-booked slots for selected date
  const availableSlots = ALL_SLOTS.filter((slot) => {
    const isToday = formData.date === todayStr
    if (isToday) {
      const nowHour = new Date().getHours()
      if (slot.rawHour <= nowHour) return false
    }

    // Check if slot is already booked for this date
    const isAlreadyBooked = existingBookings.some(
      (b) => b.date === formData.date && b.timeSlot === slot.time && b.status !== 'declined'
    )
    return !isAlreadyBooked
  })

  // Ensure default selected time is always a valid available slot
  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.some((s) => s.time === formData.time)) {
      setFormData((prev) => ({ ...prev, time: availableSlots[0].time }))
    }
  }, [formData.date, existingBookings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitIntroCallRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'N/A',
        industry: formData.businessType,
        date: formData.date,
        timeSlot: formData.time,
        notes: formData.notes,
      })

      // Send EmailJS alert to admin if configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_jfrd3cr'
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_4e7ipi1'
      const userId = import.meta.env.VITE_EMAILJS_USER_ID || 'SWLupKhyJ1aMBxMI-'

      if (serviceId && templateId && userId) {
        console.log('Dispatching EmailJS with params:', {
          serviceId,
          templateId,
          userId,
          to_email: 'info@nativebooking.co',
        })
        const res = await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: 'info@nativebooking.co',
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || 'N/A',
            industry: formData.businessType,
            requested_date: formData.date,
            requested_time: formData.time,
            service: `[Discovery Call] ${formData.businessType}`,
            date: formData.date,
            time: formData.time,
            notes: formData.notes || 'No notes provided',
          },
          userId
        )
        console.log('EmailJS response success:', res)
      } else {
        console.warn('Missing EmailJS environment variables!', { serviceId, templateId, userId })
      }
    } catch (err) {
      console.error('Failed to submit intro call request or send email:', err)
    } finally {
      setIsSubmitting(false)
      setSubmitted(true)
    }
  }

  return (
    <PageWrapper>
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090a0f',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(20, 22, 28, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '36px 28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ textAlign: 'center', padding: '30px 0' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#34d399' }}>
                <CheckIcon size={28} />
              </div>
              <Badge variant="confirmed" style={{ fontSize: '14px', padding: '6px 16px', marginBottom: '16px' }}>
                Discovery Call Requested
              </Badge>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Thank You, {formData.name || 'Partner'}!
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
                Our team has received your request and will reach out to <strong>{formData.email}</strong> shortly to confirm your strategy call.
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/')}>
                Return to NativeBooking Home
              </Button>
            </motion.div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Schedule a Discovery Meeting
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                  Speak with our team to discover how a dedicated reservation system can streamline your appointments and protect your earnings.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@yourbusiness.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Industry / Business Niche
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#12141a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <option value="Tattoo & Creative Studio">Tattoo & Creative Studio</option>
                    <option value="Clinic & Medical Roster">Clinic & Medical Roster</option>
                    <option value="Education & Academy">Education & Academy</option>
                    <option value="Contractor & Crew Dispatch">Contractor & Crew Dispatch</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Select Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      colorScheme: 'dark',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Your Timezone
                  </label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#12141a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      marginBottom: '14px',
                    }}
                  >
                    {TIMEZONE_OPTIONS.map((opt) => (
                      <option key={opt.zone} value={opt.zone}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Select Available Time Slot (CEST / Local) *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {availableSlots.map((slot) => {
                      const isSelected = formData.time === slot.time
                      const slotLabel = formatSlotLabel(slot.time)

                      return (
                        <motion.button
                          key={slot.time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time: slot.time })}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            color: isSelected ? '#34d399' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: isSelected ? 800 : 500,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {slotLabel}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {availableSlots.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#facc15', background: 'rgba(234, 179, 8, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                    All slots for today ({todayStr}) have passed or are booked. Please select tomorrow or a future date on the date picker.
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Notes / Specific Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your team size, custom rules, preferred call times, or integration goals..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', lineHeight: '1.4' }}>
                    <em>Having trouble finding a suitable time due to timezone differences? Feel free to pick any available slot above and state your ideal time or timezone in the notes — we will gladly accommodate you.</em>
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    background: isSubmitting ? 'rgba(16, 185, 129, 0.6)' : '#10b981',
                    color: '#08080a',
                    fontWeight: 800,
                    fontSize: '15px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 18px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #08080a', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                        <span>Confirming Slot...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span>Request Discovery Call</span>
                        <ArrowRightIcon size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
    </PageWrapper>
  )
}
