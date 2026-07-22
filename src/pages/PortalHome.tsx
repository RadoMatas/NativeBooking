export default function PortalHome() {
  const portalTheme = {
    bg: '#09090b',
    cardBg: 'rgba(20, 20, 23, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    accentColor: '#10b981',
  }

  const industries = [
    {
      title: 'Tattoo & Creative Studios',
      icon: '🎨',
      status: 'Live Sandbox',
      statusColor: '#10b981',
      statusBg: 'rgba(16, 185, 129, 0.1)',
      description: 'Features dynamic client split-queues, artist showcase profiles, automated aftercare guidelines, and admin schedule panels.',
      link: 'https://tattoo.nativebooking.co',
      badge: 'Creative Niche',
    },
    {
      title: 'Dental & Chiropractic Clinics',
      icon: '🩺',
      status: 'Live Sandbox',
      statusColor: '#0ea5e9',
      statusBg: 'rgba(14, 165, 233, 0.1)',
      description: 'Features a light clinical cream-blue theme, doctor roster lists, client symptom forms, treatment plan logs, and zero-deposit scheduling.',
      link: 'https://dentist.nativebooking.co',
      badge: 'Medical Niche',
    },
    {
      title: 'Education & Academies',
      icon: '📚',
      status: 'In Development',
      statusColor: '#f59e0b',
      statusBg: 'rgba(245, 158, 11, 0.1)',
      description: 'Features student course enrollments, class capacity tracking, instructor assignments, and lesson packages scheduler.',
      link: null,
      badge: 'Academic Niche',
    },
    {
      title: 'HVAC & Home Services',
      icon: '🛠️',
      status: 'In Planning',
      statusColor: '#a855f7',
      statusBg: 'rgba(168, 85, 247, 0.1)',
      description: 'Features dispatcher diagnostic bookings, technician tracking, on-site service reports, and dynamic invoice estimators.',
      link: null,
      badge: 'Contractor Niche',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: portalTheme.bg,
        color: portalTheme.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        padding: '80px 24px 40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: `radial-gradient(circle at top right, rgba(16, 185, 129, 0.04), transparent 45%),
                     radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.03), transparent 45%),
                     ${portalTheme.bg}`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* SaaS Logo Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <span style={{ fontSize: '32px' }}>⚡</span>
        <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '0.08em', color: '#ffffff' }}>
          NATIVEBOOKING
        </span>
      </div>

      {/* Hero Headline */}
      <div style={{ textAlign: 'center', maxWidth: '700px', marginBottom: '60px' }}>
        <h1
          style={{
            fontSize: '44px',
            fontWeight: 800,
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            color: '#ffffff',
          }}
        >
          Select Your Industry Sandbox
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: portalTheme.textSecondary,
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Test-drive our specialized reservation engines. Every blueprint is fully interactive and features customizable client control hubs, real-time sync, and admin control panels.
        </p>
      </div>

      {/* Grid of Sandboxes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          maxWidth: '1200px',
          width: '100%',
          gap: '24px',
          marginBottom: '80px',
        }}
      >
        {industries.map((ind, idx) => (
          <div
            key={idx}
            className="premium-card"
            style={{
              background: portalTheme.cardBg,
              border: `1px solid ${portalTheme.borderColor}`,
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{ fontSize: '42px', lineHeight: '1' }}>{ind.icon}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: ind.statusBg,
                    color: ind.statusColor,
                    border: `1px solid ${ind.statusColor}20`,
                  }}
                >
                  {ind.status}
                </span>
              </div>

              {/* Title & Badge */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--accent-color)',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                {ind.badge}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#ffffff' }}>
                {ind.title}
              </h3>

              {/* Description */}
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: portalTheme.textSecondary, marginBottom: '28px' }}>
                {ind.description}
              </p>
            </div>

            {/* Launch Button */}
            {ind.link ? (
              <a
                href={ind.link}
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '10px',
                    backgroundColor: ind.statusColor,
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${ind.statusColor}25`,
                  }}
                >
                  Launch Live Sandbox ⚡
                </button>
              </a>
            ) : (
              <button
                className="btn btn-secondary"
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  color: 'rgba(255, 255, 255, 0.2)',
                  border: `1px solid ${portalTheme.borderColor}`,
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

      {/* Footer Branding */}
      <div
        style={{
          borderTop: `1px solid ${portalTheme.borderColor}`,
          paddingTop: '20px',
          width: '100%',
          maxWidth: '1200px',
          textAlign: 'center',
          fontSize: '13px',
          color: portalTheme.textSecondary,
        }}
      >
        NativeBooking Software © 2026. All rights reserved.
      </div>
    </div>
  )
}
