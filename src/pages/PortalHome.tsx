import { useNavigate } from 'react-router-dom'
import {
  StudioIcon,
  ClinicIcon,
  AcademicIcon,
  ContractorIcon,
  CreditCardIcon,
  CalendarIcon,
  UsersIcon,
  ShieldIcon,
  SettingsIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon
} from '../components/ui/Icons'

export default function PortalHome() {
  const navigate = useNavigate()

  const t = {
    bg: '#09090b',
    cardBg: 'rgba(20, 20, 23, 0.75)',
    strip: 'rgba(255,255,255,0.025)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#10b981',
    accentSoft: 'rgba(16, 185, 129, 0.1)',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    textMuted: 'rgba(255,255,255,0.5)',
  }

  const industries = [
    {
      title: 'Tattoo & Creative Studios',
      icon: <StudioIcon size={22} style={{ color: '#10b981' }} />,
      status: 'Live Sandbox',
      statusColor: '#10b981',
      statusBg: 'rgba(16, 185, 129, 0.1)',
      description: 'Client queue split-view, artist profiles, deposit collection, aftercare notes, and a full admin schedule panel.',
      link: 'https://tattoo.nativebooking.co',
      badge: 'Creative Niche',
    },
    {
      title: 'Dental & Chiropractic Clinics',
      icon: <ClinicIcon size={22} style={{ color: '#0ea5e9' }} />,
      status: 'Live Sandbox',
      statusColor: '#0ea5e9',
      statusBg: 'rgba(14, 165, 233, 0.1)',
      description: 'Clean clinical look, doctor roster, symptom intake notes, appointment tracking, and no-deposit scheduling.',
      link: 'https://dental.nativebooking.co',
      badge: 'Medical Niche',
    },
    {
      title: 'Education & Academies',
      icon: <AcademicIcon size={22} style={{ color: '#0d9488' }} />,
      status: 'Live Sandbox',
      statusColor: '#0d9488',
      statusBg: 'rgba(13, 148, 136, 0.1)',
      description: 'Course enrollments, instructor assignments, class scheduling, and a student-facing lesson portal.',
      link: 'https://academic.nativebooking.co',
      badge: 'Academic Niche',
    },
    {
      title: 'HVAC & Home Services',
      icon: <ContractorIcon size={22} style={{ color: '#f59e0b' }} />,
      status: 'Live Sandbox',
      statusColor: '#f59e0b',
      statusBg: 'rgba(245, 158, 11, 0.1)',
      description: 'Internal job dispatch board, field technician assignments, job site addresses, and status pipelines — no customer portal needed.',
      link: 'https://contractor.nativebooking.co',
      badge: 'Contractor Niche',
    },
  ]

  const features = [
    { icon: <CreditCardIcon size={20} style={{ color: '#10b981' }} />, title: 'Payments & Deposits', desc: 'Stripe checkout built in. Collect deposits, authorise cards, and handle refunds — all without leaving the app.' },
    { icon: <CalendarIcon size={20} style={{ color: '#10b981' }} />, title: 'Smart Scheduling', desc: 'Picks open slots, blocks taken times, and respects your working hours, days off, and staff availability.' },
    { icon: <UsersIcon size={20} style={{ color: '#10b981' }} />, title: 'Staff & Roster', desc: 'Each team member gets their own schedule, profile, and service list. Clients pick who they want.' },
    { icon: <UsersIcon size={20} style={{ color: '#10b981' }} />, title: 'Client Portal', desc: 'Clients log in, see their bookings, request a reschedule, and track the status — no phone call needed.' },
    { icon: <SettingsIcon size={20} style={{ color: '#10b981' }} />, title: 'Admin Control Hub', desc: 'See every booking, approve changes, leave notes on completed sessions, and keep the whole team on track.' },
    { icon: <ShieldIcon size={20} style={{ color: '#10b981' }} />, title: 'Login & Access', desc: 'Email and password auth out of the box. Google Sign-in can be wired in for customer-facing builds. Role-based access keeps admin and client views fully separate.' },
  ]

  const pills = [
    { icon: <StudioIcon size={16} />, label: 'Custom Branding' },
    { icon: <SparklesIcon size={16} />, label: 'Your Own Domain' },
    { icon: <CreditCardIcon size={16} />, label: 'Payments On/Off' },
    { icon: <CreditCardIcon size={16} />, label: 'Deposits On/Off' },
    { icon: <UsersIcon size={16} />, label: 'Multi-Staff' },
    { icon: <SparklesIcon size={16} />, label: 'Mobile PWA' },
    { icon: <ShieldIcon size={16} />, label: 'Firebase Database' },
    { icon: <StudioIcon size={16} />, label: 'Custom Colors' },
    { icon: <CheckIcon size={16} />, label: 'Email Notifications' },
  ]

  const steps = [
    { num: '01', icon: <SparklesIcon size={20} style={{ color: '#10b981' }} />, title: 'Discovery', desc: 'We get on a call, talk about how your business runs day to day, and figure out exactly what to build.' },
    { num: '02', icon: <SettingsIcon size={20} style={{ color: '#10b981' }} />, title: 'Build', desc: 'We build it. Your name on it, your colors, your domain, your way of working.' },
    { num: '03', icon: <ArrowRightIcon size={20} style={{ color: '#10b981' }} />, title: 'Handover', desc: 'You get everything — the domain, the database, the source code. We stay around if you need us.' },
    { num: '04', icon: <CheckIcon size={20} style={{ color: '#10b981' }} />, title: 'The Result', desc: 'Your clients book. You manage. NativeBooking handles the rest. Less admin, more business.' },
  ]

  const scrollToDemo = () => {
    document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: `radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 50%),
                     radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.08), transparent 50%),
                     radial-gradient(rgba(16, 185, 129, 0.2) 1.5px, transparent 1.5px),
                     #09090b`,
        backgroundSize: '100% 100%, 100% 100%, 36px 36px, 100% 100%',
        backgroundAttachment: 'fixed',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nb-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .nb-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(16, 185, 129, 0.12) !important;
          border-color: rgba(16, 185, 129, 0.35) !important;
        }
        .nb-pill {
          transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .nb-pill:hover {
          background: rgba(16, 185, 129, 0.12) !important;
          border-color: rgba(16, 185, 129, 0.4) !important;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.15);
        }
        .nb-demo-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .nb-demo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 56px rgba(0,0,0,0.4) !important;
        }
        .nb-step {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .nb-step:hover {
          transform: translateY(-4px);
          border-color: rgba(16, 185, 129, 0.3) !important;
        }
        @media (max-width: 640px) {
          .nb-hero-title { font-size: 32px !important; }
          .nb-section-title { font-size: 26px !important; }
          .nb-feature-grid { grid-template-columns: 1fr !important; }
          .nb-nav { padding: 12px 16px !important; }
          .nb-logo-img { height: 34px !important; width: 34px !important; }
          .nb-logo-title { font-size: 14px !important; letter-spacing: 0.04em !important; }
          .nb-nav-actions { gap: 8px !important; }
          .nb-nav-btn { padding: 5px 10px !important; font-size: 11px !important; }
        }
        @media (max-width: 900px) {
          .nb-feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ─── NAV ──────────────────────────────────────────────── */}
      <nav
        className="nb-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          borderBottom: `1px solid ${t.border}`,
          background: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo-icon.jpg"
            alt="NativeBooking"
            className="nb-logo-img"
            style={{ height: '44px', width: '44px', borderRadius: '10px', display: 'block' }}
          />
          <span className="nb-logo-title" style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.07em', color: '#ffffff' }}>
            NATIVEBOOKING
          </span>
        </div>
        <div className="nb-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/book-call')}
            className="nb-nav-btn"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
              background: t.accent,
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(16,185,129,0.25)',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Intro Call
          </button>
          <a
            href="mailto:info@nativebooking.co"
            className="nb-nav-btn"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: t.accent,
              textDecoration: 'none',
              padding: '7px 16px',
              border: `1px solid rgba(16,185,129,0.35)`,
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
          >
            Contact Us
          </a>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '100px 24px 90px 24px',
          animation: 'fadeInUp 0.7s ease both',
          overflow: 'hidden',
        }}
      >
        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '9999px',
            border: `1px solid rgba(16,185,129,0.3)`,
            background: 'rgba(16,185,129,0.07)',
            fontSize: '12px',
            fontWeight: 600,
            color: t.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
          Custom Software for Modern Businesses
        </div>

        <h1
          className="nb-hero-title"
          style={{
            fontSize: '54px',
            fontWeight: 800,
            lineHeight: '1.15',
            letterSpacing: '-0.025em',
            color: '#ffffff',
            maxWidth: '760px',
            marginBottom: '36px',
          }}
        >
          Reservation Software{' '}
          <span style={{ color: t.accent }}>Built Around</span>{' '}
          Your Business
        </h1>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={scrollToDemo}
            style={{
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '10px',
              background: t.accent,
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(16,185,129,0.4)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)'
            }}
          >
            Explore Live Demos ↓
          </button>
          <button
            onClick={() => navigate('/book-call')}
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.05)'
            }}
          >
            Schedule Discovery Call 📅
          </button>
        </div>
        </div>
      </section>

      {/* ─── FEATURED PLATFORM DEMO VIDEO ──────────────────────── */}
      <section style={{ padding: '0 24px 60px 24px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.12) 0%, rgba(9, 9, 11, 0.95) 100%), radial-gradient(rgba(16, 185, 129, 0.22) 1.5px, transparent 1.5px)',
            backgroundSize: '100% 100%, 28px 28px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🎬</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Featured Platform Overview
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  See how NativeBooking transforms inquiries into instant bookings (90-sec walkthrough)
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              ⚡ Official Demo Video
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/hT9lzAfrMuE?rel=0&modestbranding=1"
              title="NativeBooking Official Platform Overview Demo"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ─── WHAT WE OFFER ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: '12px' }}>
            What We Build
          </p>
          <h2 className="nb-section-title" style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            What's Inside
          </h2>
        </div>
        <div
          className="nb-feature-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="nb-card"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                padding: '28px 24px',
                animation: `fadeInUp 0.6s ease ${i * 0.08}s both`,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────── */}
      <section
        style={{
          background: t.strip,
          borderTop: `1px solid ${t.border}`,
          borderBottom: `1px solid ${t.border}`,
          padding: '56px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            textAlign: 'center',
          }}
        >
          {[
            { icon: '📦', title: 'You Own the Code', desc: 'No monthly platform fee. No lock-in. The full source code is yours after delivery.' },
            { icon: '🎨', title: 'Your Brand, Not Ours', desc: 'Your logo, your colors, your domain. Your clients will never know we built it.' },
            { icon: '🛠️', title: 'We Stick Around', desc: 'Got a new feature idea? Found a bug? We stay in touch and keep things running.' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: '34px', marginBottom: '14px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.6', maxWidth: '280px', margin: '0 auto' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DEMO SANDBOXES ───────────────────────────────────── */}
      <section
        id="demos"
        style={{
          position: 'relative',
          padding: '80px 24px',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(16,185,129,0.16) 1.8px, transparent 1.8px)',
          backgroundSize: '36px 36px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: '12px' }}>
            Live Demos
          </p>
          <h2 className="nb-section-title" style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Explore Industry Sandboxes
          </h2>
          <p style={{ fontSize: '15px', color: t.textSecondary, marginTop: '12px', maxWidth: '560px', margin: '12px auto 0' }}>
            Click into any live sandbox and test it yourself — book something, log in as admin, see how it all hangs together.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="nb-demo-card"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                animation: `fadeInUp 0.6s ease ${idx * 0.1}s both`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <span style={{ fontSize: '42px', lineHeight: '1' }}>{ind.icon}</span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: ind.statusBg,
                      color: ind.statusColor,
                      border: `1px solid ${ind.statusColor}22`,
                    }}
                  >
                    {ind.link && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ind.statusColor, display: 'inline-block', boxShadow: `0 0 6px ${ind.statusColor}` }} />
                    )}
                    {ind.status}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: t.accent,
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  {ind.badge}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#ffffff' }}>{ind.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.55', color: t.textSecondary, marginBottom: '28px' }}>{ind.description}</p>
              </div>
              {ind.link ? (
                <a href={ind.link} style={{ textDecoration: 'none', width: '100%' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      borderRadius: '10px',
                      background: ind.statusColor,
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      boxShadow: `0 4px 16px ${ind.statusColor}30`,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    Launch Live Sandbox ⚡
                  </button>
                </a>
              ) : (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.2)',
                    border: `1px solid ${t.border}`,
                    cursor: 'not-allowed',
                    fontWeight: 600,
                  }}
                >
                  Blueprint Locked 🔒
                </button>
              )}
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ─── CUSTOMIZATION PILLS ──────────────────────────────── */}
      <section
        style={{
          background: t.strip,
          borderTop: `1px solid ${t.border}`,
          borderBottom: `1px solid ${t.border}`,
          padding: '72px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: '12px' }}>
          Your Call
        </p>
        <h2 className="nb-section-title" style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '14px' }}>
          You Decide What Goes In
        </h2>
        <p style={{ fontSize: '15px', color: t.textSecondary, maxWidth: '520px', margin: '0 auto 44px', lineHeight: '1.6' }}>
          Not every business works the same way. Pick what you need, skip what you don't.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            maxWidth: '860px',
            margin: '0 auto',
          }}
        >
          {pills.map((pill, i) => (
            <div
              key={i}
              className="nb-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${t.border}`,
                fontSize: '14px',
                fontWeight: 600,
                color: t.textPrimary,
                cursor: 'default',
                animation: `fadeInUp 0.5s ease ${i * 0.06}s both`,
              }}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(16,185,129,0.13) 1.5px, transparent 1.5px)',
          backgroundSize: '38px 38px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: '12px' }}>
            Process
          </p>
          <h2 className="nb-section-title" style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            How It Works
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className="nb-step"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                padding: '32px 28px',
                animation: `fadeInUp 0.6s ease ${i * 0.1}s both`,
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: t.accent,
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{s.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.6' }}>{s.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${t.border}`,
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo-icon.jpg"
            alt="NativeBooking"
            style={{ height: '40px', width: '40px', borderRadius: '9px', display: 'block' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.07em', color: '#ffffff' }}>NATIVEBOOKING</span>
        </div>
        <a
          href="mailto:info@nativebooking.co"
          style={{ fontSize: '14px', color: t.accent, textDecoration: 'none', fontWeight: 500 }}
        >
          info@nativebooking.co
        </a>
        <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
          © 2025 NativeBooking. All rights reserved.
        </p>
        <a
          href="/privacy"
          style={{ fontSize: '12px', color: t.textMuted, textDecoration: 'underline' }}
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  )
}
