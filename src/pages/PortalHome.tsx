import { useNavigate } from 'react-router-dom'
import InteractiveShowcase from '../components/InteractiveShowcase'
import SavingsCalculator from '../components/SavingsCalculator'
import WhiteLabelComparison from '../components/WhiteLabelComparison'
import { Button } from '../components/ui/Button'
import { PageWrapper } from '../components/ui/PageWrapper'
import {
  CreditCardIcon,
  UsersIcon,
  CalendarIcon,
  CheckIcon
} from '../components/ui/Icons'

export default function PortalHome() {
  const navigate = useNavigate()
  
  return (
    <PageWrapper>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #07080c 0%, #090a0f 50%, #050608 100%)',
          color: '#f8fafc',
          fontFamily: "'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif",
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Vibrant Glowing Ambient Mesh Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '10%',
            width: '750px',
            height: '750px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            animation: 'floatOrb 14s ease-in-out infinite alternate',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '-5%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.30) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            animation: 'floatOrb 18s ease-in-out infinite alternate-reverse',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '65%',
            left: '-5%',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.28) 0%, rgba(14, 165, 233, 0.04) 50%, transparent 70%)',
            filter: 'blur(75px)',
            pointerEvents: 'none',
            animation: 'floatOrb 16s ease-in-out infinite alternate',
            zIndex: 0,
          }}
        />

        <style>{`
          @keyframes floatOrb {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(60px, -50px) scale(1.18); }
            100% { transform: translate(-40px, 40px) scale(0.9); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        .aave-text-gradient-emerald {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aave-text-gradient-purple {
          background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aave-market-card {
          background: rgba(15, 17, 23, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: clamp(16px, 4vw, 28px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(20px);
          box-sizing: border-box;
          width: 100%;
        }
        .aave-market-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        }
        .aave-token-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
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
            onClick={() => navigate('/pricing')}
          >
            Pricing
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/book-call')}
          >
            Get in Touch
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
            Save Staff Hours &{' '}
            <span className="aave-text-gradient-emerald">Eliminate Missed Bookings</span>
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
            A clean reservation and appointment system built for your business. Protect your schedule, streamline customer check-ins, and keep 100% of your earnings.
          </p>

          {/* Action Buttons */}
          <div className="aave-hero-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap', width: '100%' }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/book-call')}>
              Schedule Discovery Meeting
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

          {/* Savings Calculator Block (High Priority under Hero) */}
          <div id="calculator" style={{ position: 'relative', zIndex: 2, width: '100%', boxSizing: 'border-box' }}>
            <SavingsCalculator />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: PRO (PURPLE THEME) ───────────────────── */}
      <section
        className="aave-section-padding"
        style={{
          position: 'relative',
          padding: 'clamp(40px, 8vw, 120px) clamp(14px, 4vw, 24px)',
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
              Streamline <span className="aave-text-gradient-purple">Daily Operations</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Organize schedules, manage deposits, and coordinate team availability seamlessly in one place.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap', width: '100%' }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/book-call')}>
                Schedule Discovery Meeting
              </Button>
            </div>
          </div>

          {/* Market Cards Grid */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Solutions for Every Business</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  From clinic appointments to studio sessions, adapt scheduling rules to your operational needs.
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  const element = document.getElementById('workbench')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                View Demonstration
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
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4fc9fa', display: 'block', marginBottom: '6px' }}>
                    General Purpose Architecture
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Creative Studios & Tattoo
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    Client queue management with direct Stripe deposits and custom consent notes.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCardIcon size={15} style={{ color: '#10b981' }} />
                    <span>Direct Stripe Deposit Holds</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UsersIcon size={15} style={{ color: '#10b981' }} />
                    <span>Artist Split Schedule Board</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon size={15} style={{ color: '#10b981' }} />
                    <span>Custom Consent Agreements</span>
                  </div>
                </div>
              </div>

              {/* Market Card 2 */}
              <div className="aave-market-card">
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399', display: 'block', marginBottom: '6px' }}>
                    Clinical Intake Engine
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Clinics & Medical Roster
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    Clean patient intake workflow, practitioner schedules, and flexible appointment holds.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UsersIcon size={15} style={{ color: '#38bdf8' }} />
                    <span>Practitioner Roster System</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon size={15} style={{ color: '#38bdf8' }} />
                    <span>Symptom Intake Questionnaire</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarIcon size={15} style={{ color: '#38bdf8' }} />
                    <span>Zero Deposit Reservation Holds</span>
                  </div>
                </div>
              </div>

              {/* Market Card 3 */}
              <div className="aave-market-card">
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                    Dispatch Roster Engine
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Contractors & Trades
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    Field crew dispatch boards, site address routing, and labor timing tracking.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UsersIcon size={15} style={{ color: '#c084fc' }} />
                    <span>Field Crew Dispatch Cards</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarIcon size={15} style={{ color: '#c084fc' }} />
                    <span>3-Hour Arrival Windows</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon size={15} style={{ color: '#c084fc' }} />
                    <span>Site Routing & Address Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: INTERACTIVE SHOWCASE (EMERALD THEME) ── */}
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
              Test <span className="aave-text-gradient-emerald">Live Booking Engine</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Experience the dual-view workflow for clients and business admins.
            </p>
          </div>

          {/* Showcase Component */}
          <div id="workbench" style={{ position: 'relative', zIndex: 2, width: '100%', boxSizing: 'border-box' }}>
            <InteractiveShowcase />
          </div>

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
          
          {/* Pre-Footer Meeting CTA Callout Box */}
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '32px', textAlign: 'left', marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>Ready to optimize your reservation workflow?</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Schedule a 1-on-1 discovery call to explore your business rules, staff schedules, and payout options.</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => navigate('/book-call')}>
              Schedule Discovery Meeting
            </Button>
          </div>

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
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/pricing')}>Service Tiers & Pricing</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/book')}>Client Booking Portal</li>
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
  </PageWrapper>
  )
}
