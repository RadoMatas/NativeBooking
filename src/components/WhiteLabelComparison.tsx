import { CheckIcon } from './ui/Icons'

export default function WhiteLabelComparison() {
  const comparisonRows = [
    {
      feature: 'Domain & Branding',
      saas: 'yourbusiness.calendly.com (Their Brand)',
      nativeBooking: 'booking.yourdomain.com (100% Your Brand)',
    },
    {
      feature: 'Per-Booking Commission',
      saas: '15% – 20% Marketplace Cut',
      nativeBooking: '0% Commission (Keep 100%)',
    },
    {
      feature: 'Operational Workflows',
      saas: 'Rigid generic forms & rigid calendars',
      nativeBooking: 'Custom rules, crew dispatch & intake notes',
    },
    {
      feature: 'Data & Client Database',
      saas: 'Locked inside third-party servers',
      nativeBooking: 'Full database access & client export',
    },
    {
      feature: 'Payments & Deposits',
      saas: 'Delayed payouts with platform holds',
      nativeBooking: 'Direct Stripe payout to your bank',
    },
    {
      feature: 'Mobile App Experience',
      saas: 'Generic app store widget',
      nativeBooking: 'Branded PWA & Native Android app ready',
    },
  ]

  return (
    <div
      className="comparison-outer-card"
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        background: 'rgba(22, 24, 29, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '36px 24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-color)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Why White-Label Custom Software?
        </span>
        <h2 className="aave-section-title" style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          Off-The-Shelf Widgets vs. NativeBooking White-Label System
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Stop compromising your customer experience to fit into standard SaaS templates.
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="desktop-table-container" style={{ width: '100%', overflowX: 'hidden' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Capability</th>
              <th style={{ padding: '16px', color: 'rgba(239, 68, 68, 0.85)', fontWeight: 700 }}>Generic SaaS Platforms</th>
              <th style={{ padding: '16px', color: 'var(--accent-color)', fontWeight: 800, background: 'rgba(16, 185, 129, 0.06)', borderRadius: '8px 8px 0 0' }}>
                ⚡ NativeBooking White-Label
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '16px', color: '#ffffff', fontWeight: 600 }}>{row.feature}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{row.saas}</td>
                <td style={{ padding: '16px', color: '#ffffff', fontWeight: 700, background: 'rgba(16, 185, 129, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon size={16} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                    <span>{row.nativeBooking}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack View */}
      <div className="mobile-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {comparisonRows.map((row, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(12, 13, 16, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '6px' }}>
              {row.feature}
            </div>
            <div style={{ fontSize: '13px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '8px 12px', borderRadius: '8px' }}>
              <strong>Generic SaaS:</strong> {row.saas}
            </div>
            <div style={{ fontSize: '13px', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '8px', fontWeight: 600 }}>
              <strong>⚡ NativeBooking:</strong> {row.nativeBooking}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
