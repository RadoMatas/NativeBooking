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
      }}
    >
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .aave-hero-glow-emerald {
          position: absolute;
          width: 600px;
          height: 600px;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.02) 60%, transparent 80%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 8s ease-in-out infinite;
        }
        .aave-hero-glow-purple {
          position: absolute;
          width: 700px;
          height: 700px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.02) 60%, transparent 80%);
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 10s ease-in-out infinite;
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
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(16px);
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
        @media (max-width: 768px) {
          .aave-hero-title { font-size: 38px !important; }
        }
      `}</style>

      {/* ─── AAVE STICKY HEADER NAV BAR ───────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(9, 10, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <img
            src="/logo-icon.jpg"
            alt="NativeBooking Logo"
            style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'block' }}
          />
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            NATIVEBOOKING
          </span>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        style={{
          position: 'relative',
          padding: '100px 24px 80px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className="aave-hero-glow-emerald" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          {/* Category Pill */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
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
              fontSize: '60px',
              fontWeight: 800,
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '20px',
            }}
          >
            Reservations & Scheduling for{' '}
            <span className="aave-text-gradient-emerald">Everyone</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              maxWidth: '660px',
              margin: '0 auto 36px',
              lineHeight: '1.6',
            }}
          >
            Put your money and time slots to work, every second of every day. Custom white-label booking infrastructure with 0% marketplace commission.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
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
          <div id="workbench" style={{ position: 'relative', zIndex: 2 }}>
            <InteractiveShowcase />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: PRO (PURPLE THEME) ───────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '120px 24px 100px',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.06) 0%, rgba(9, 10, 15, 1) 70%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="aave-hero-glow-purple" />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Badge variant="neutral" style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc', padding: '6px 16px' }}>
                🛡️ NativeBooking Pro
              </Badge>
            </div>
            <h2
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              The <span className="aave-text-gradient-purple">Full Power</span> of Automated Operations
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Schedule, dispatch, collect deposits, and manage staff rosters. Built on NativeBooking core engine.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '32px' }}>
              <Button variant="purple" size="lg" onClick={() => navigate('/adminlogin')}>
                Open Control Board ➔
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/book-call')}>
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Market Cards Grid */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>Markets for Every Strategy</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
                  From conservative clinic intake to high-volume tattoo deposits, pick the operational market that fits your workflow.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/book-call')}>
                View Schemas ➔
              </Button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Market Card 1 */}
              <div className="aave-market-card">
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                    General Purpose Market
                  </span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
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
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399', display: 'block', marginBottom: '6px' }}>
                    Collateral-Isolated Market
                  </span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
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
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                    Dispatch-Isolated Market
                  </span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
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
        style={{
          position: 'relative',
          padding: '100px 24px 120px',
        }}
      >
        <div className="aave-hero-glow-emerald" />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Badge variant="confirmed" style={{ padding: '6px 16px' }}>
                ⚡ NativeBooking Kit
              </Badge>
            </div>
            <h2
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              Build <span className="aave-text-gradient-emerald">with NativeBooking</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Launch booking and yield-like appointment systems with our integration stack.
            </p>
          </div>

          {/* Calculator Component */}
          <SavingsCalculator />

          {/* White-Label Comparison */}
          <div style={{ marginTop: '60px' }}>
            <WhiteLabelComparison />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#06070a',
          padding: '60px 36px 40px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              marginBottom: '60px',
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
              paddingTop: '24px',
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
