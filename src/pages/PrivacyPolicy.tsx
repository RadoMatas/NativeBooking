import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090a0f',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '60px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          ← Back to Home
        </Button>
      </div>

      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        Last updated: July 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6', fontSize: '15px', color: '#cbd5e1' }}>
        <p>
          At NativeBooking, we respect your privacy and are committed to protecting the personal data of our users, clients, and partners.
        </p>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginTop: '12px' }}>
          Data We Collect
        </h2>
        <p>
          When you use our scheduling software, we collect contact information (name, email address, phone number) provided during booking, as well as session preferences and appointment details.
        </p>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginTop: '12px' }}>
          How We Use Your Data
        </h2>
        <p>
          Your data is strictly used to manage appointment reservations, issue automated notifications, and facilitate direct communications between clients and service providers. We do not sell or rent your personal information to third parties.
        </p>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginTop: '12px' }}>
          Contact Us
        </h2>
        <p>
          If you have any questions regarding this Privacy Policy, please contact us at{' '}
          <a href="mailto:info@nativebooking.co" style={{ color: '#10b981' }}>info@nativebooking.co</a>.
        </p>
      </div>
    </div>
  )
}
