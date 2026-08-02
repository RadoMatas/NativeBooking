import { useNavigate } from 'react-router-dom'
import PricingSection from '../components/PricingSection'
import FAQSection from '../components/FAQSection'
import { PageWrapper } from '../components/ui/PageWrapper'
import { Button } from '../components/ui/Button'

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #07080c 0%, #090a0f 50%, #050608 100%)',
          color: '#f8fafc',
          fontFamily: "'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif",
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Sticky Header */}
        <header
          className="aave-header"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(9, 10, 15, 0.75)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 36px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img
              src="/logo-icon.jpg"
              alt="NativeBooking Logo"
              style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'block' }}
            />
            <span className="aave-header-logo-text" style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              NATIVEBOOKING
            </span>
          </div>

          <div className="aave-header-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/book-call')}>
              Get in Touch
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <PricingSection />
          <FAQSection />
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#06070a',
            padding: '30px clamp(14px, 4vw, 36px)',
            textAlign: 'center',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          © {new Date().getFullYear()} NativeBooking Inc. All rights reserved.
        </footer>
      </div>
    </PageWrapper>
  )
}
