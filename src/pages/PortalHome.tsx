import { useNavigate } from 'react-router-dom'
import InteractiveShowcase from '../components/InteractiveShowcase'
import SavingsCalculator from '../components/SavingsCalculator'
import WhiteLabelComparison from '../components/WhiteLabelComparison'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export default function PortalHome() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090a0f',
        color: '#f8fafc',
        fontFamily: "'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif",
        overflowX: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .aave-text-gradient-emerald {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aave-text-gradient-purple {
          background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aave-market-card {
          background: rgba(20, 22, 28, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: clamp(16px, 4vw, 28px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(16px);
          box-sizing: border-box;
          width: 100%;
        }
        .aave-market-card:hover {
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
        }
        .aave-token-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-weight: 600;
          color: #f8fafc;
        }
      `}</style>

      {/* ─── STICKY HEADER NAV BAR ───────────────────────── */}
      <header
        className="aave-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(9, 10, 15, 0.85)',
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
        {/* Brand Logo */}
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

        {/* Right Action Buttons */}
        <div className="aave-header-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/adminlogin')}
          >
            Admin Login
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/book-call')}
          >
            Use NativeBooking
          </Button>
        </div>
      </header>

      {/* ─── SECTION 1: HERO (EMERALD THEME) ─────────────────── */}
      <section
        className="aave-hero-section"
        style={{
          position: 'relative',
          padding: 'clamp(40px, 8vw, 100px) clamp(14px, 4vw, 24px)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1080px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Category Pill */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <Badge 
              variant="confirmed" 
              icon={<img src="/logo-icon.jpg" width={16} height={16} style={{ borderRadius: '4px' }} />}
              style={{ padding: '6px 16px', fontSize: '12px', fontWeight: 700 }}
            >
              NativeBooking App
            </Badge>
          </div>

          {/* Main Headline */}
          <h1
            className="aave-hero-title"
            style={{
              fontSize: 'clamp(28px, 6vw, 60px)',
              fontWeight: 800,
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '18px',
              wordBreak: 'break-word',
            }}
          >
            Reservations & Scheduling for{' '}
            <span className="aave-text-gradient-emerald">Everyone</span>
          </h1>

          {/* Description */}
          <p
            className="aave-hero-desc"
            style={{
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              color: '#94a3b8',
              maxWidth: '660px',
              margin: '0 auto 32px',
              lineHeight: '1.6',
            }}
          >
            Put your money and time slots to work, every second of every day. Custom white-label booking infrastructure with 0% marketplace commission.
          </p>

          {/* Action Buttons */}
          <div className="aave-hero-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap', width: '100%' }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/book-call')}>
              Book Demo Call ➔
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => {
                const element = document.getElementById('workbench')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Explore Client Booking
            </Button>
          </div>

          {/* Dual-View Interactive Showcase */}
          <div id="workbench" style={{ position: 'relative', zIndex: 2, width: '100%', boxSizing: 'border-box' }}>
            <InteractiveShowcase />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: PRO (PURPLE THEME) ───────────────────── */}
      <section
        className="aave-section-padding"
        style={{
          position: 'relative',
          padding: 'clamp(40px, 8vw, 120px) clamp(14px, 4vw, 24px)',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.06) 0%, rgba(9, 10, 15, 1) 70%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Badge variant="neutral" style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc', padding: '6px 16px' }}>
                🛡️ NativeBooking Pro
              </Badge>
            </div>
            <h2
              className="aave-section-title"
              style={{
                fontSize: 'clamp(24px, 5vw, 48px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                wordBreak: 'break-word',
              }}
            >
              The <span className="aave-text-gradient-purple">Full Power</span> of Automated Operations
            </h2>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Schedule, dispatch, collect deposits, and manage staff rosters. Built on NativeBooking core engine.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap', width: '100%' }}>
              <Button variant="purple" size="lg" onClick={() => navigate('/adminlogin')}>
                Open Control Board ➔
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/book-call')}>
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Market Cards Grid */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Markets for Every Strategy</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  From conservative clinic intake to high-volume tattoo deposits, pick the operational market that fits your workflow.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/book-call')}>
                View Schemas ➔
              </Button>
            </div>

            <div
              className="aave-markets-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '20px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Market Card 1 */}
              <div className="aave-market-card">
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                    General Purpose Market
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Creative Studios & Tattoo
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    High-touch client queue management with Stripe 256-bit SSL deposits and consent forms.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="aave-token-pill">💳 Stripe Deposits</span>
                  <span className="aave-token-pill">🎨 Artist Split</span>
                  <span className="aave-token-pill">📋 Consent Notes</span>
                  <span className="aave-token-pill">+3 More</span>
                </div>
              </div>

              {/* Market Card 2 */}
              <div className="aave-market-card">
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399', display: 'block', marginBottom: '6px' }}>
                    Collateral-Isolated Market
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Clinics & Medical Roster
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    Clean patient intake workflow, practitioner schedules, and zero-deposit appointment holds.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="aave-token-pill">🩺 Doctor Roster</span>
                  <span className="aave-token-pill">📝 Symptom Intake</span>
                  <span className="aave-token-pill">🔒 Zero Deposit</span>
                  <span className="aave-token-pill">+4 More</span>
                </div>
              </div>

              {/* Market Card 3 */}
              <div className="aave-market-card">
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                    Dispatch-Isolated Market
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Contractors & Trades
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    Field crew dispatch boards, site address routing, and labor timing bookkeeping.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="aave-token-pill">🚛 Crew Dispatch</span>
                  <span className="aave-token-pill">📍 Site Routing</span>
                  <span className="aave-token-pill">⏱️ Labor Clock</span>
                  <span className="aave-token-pill">+2 More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: KIT & SAVINGS CALCULATOR (EMERALD THEME) ── */}
      <section
        className="aave-section-padding"
        style={{
          position: 'relative',
          padding: 'clamp(40px, 8vw, 100px) clamp(14px, 4vw, 24px)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Badge variant="confirmed" style={{ padding: '6px 16px' }}>
                ⚡ NativeBooking Kit
              </Badge>
            </div>
            <h2
              className="aave-section-title"
              style={{
                fontSize: 'clamp(24px, 5vw, 48px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                wordBreak: 'break-word',
              }}
            >
              Build <span className="aave-text-gradient-emerald">with NativeBooking</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Launch booking and yield-like appointment systems with our integration stack.
            </p>
          </div>

          {/* Calculator Component */}
          <SavingsCalculator />

          {/* White-Label Comparison */}
          <div style={{ marginTop: '48px', width: '100%' }}>
            <WhiteLabelComparison />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer
        className="aave-footer"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#06070a',
          padding: 'clamp(40px, 6vw, 60px) clamp(14px, 4vw, 36px) 30px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: '32px',
              marginBottom: '48px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/logo-icon.jpg" width={32} height={32} style={{ borderRadius: '8px' }} />
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>NATIVEBOOKING</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                White-label reservation, scheduling & field dispatch engine for modern service businesses.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                Products
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/book')}>Client Booking Portal</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/adminlogin')}>Admin Control Hub</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/book-call')}>Discovery Call Engine</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                Resources
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                Contact
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                Email: <a href="mailto:info@nativebooking.co" style={{ color: '#10b981', textDecoration: 'none' }}>info@nativebooking.co</a>
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>© {new Date().getFullYear()} NativeBooking Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
