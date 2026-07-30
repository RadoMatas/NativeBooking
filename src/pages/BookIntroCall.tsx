import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageWrapper } from '../components/ui/PageWrapper'
import { useBooking, type Booking } from '../BookingContext'

export default function BookIntroCall() {
  const navigate = useNavigate()
  const { addBooking, addNotification } = useBooking()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Tattoo & Creative Studio',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const discoveryBooking: Booking = {
      id: `intro-${crypto.randomUUID()}`,
      ownerEmail: formData.email,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone || 'N/A',
      service: `[Discovery Call] ${formData.businessType}`,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      status: 'Pending',
      adminStatus: 'Pending',
      notes: formData.notes || 'Discovery Call Request from Portal',
    }

    addBooking(discoveryBooking)
    addNotification(`🚀 New Discovery Call requested by ${formData.name} (${formData.email})`)
    setSubmitted(true)
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

        <div
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
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <Badge variant="confirmed" style={{ fontSize: '14px', padding: '6px 16px', marginBottom: '16px' }}>
                Discovery Call Requested
              </Badge>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Thank You, {formData.name || 'Partner'}!
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
                Our team has received your demo request and will reach out to <strong>{formData.email}</strong> shortly.
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/')}>
                Return to NativeBooking Home
              </Button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <Badge variant="info" style={{ padding: '6px 14px', marginBottom: '12px' }}>
                  ⚡ NativeBooking Architecture Call
                </Badge>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Schedule a White-Label Demo
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                  Talk to our tech team about custom booking infrastructure, Stripe setup, and zero-commission deployments.
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
                    Notes / Specific Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your team size, custom rules, or integration goals..."
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
                </div>

                <Button variant="primary" size="lg" type="submit" style={{ marginTop: '8px' }}>
                  Request Discovery Call ➔
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}
