import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckIcon } from './ui/Icons'

interface TierOption {
  id: string
  name: string
  badge?: string
  tagline: string
  forWho: string
  setupFee: string
  setupFeeNumber: number
  monthlyMaintenance: string
  keyBenefits: string[]
  features: string[]
  ctaText: string
  accentColor: string
}

const tiers: TierOption[] = [
  {
    id: 'essential',
    name: 'Standard Booking Setup',
    tagline: 'A direct booking website with no monthly per-booking commissions.',
    forWho: 'Solo studios, independent practitioners, and small local services.',
    setupFee: '$750',
    setupFeeNumber: 750,
    monthlyMaintenance: '$39/mo',
    keyBenefits: [
      '100% direct bank payouts',
      'Matches your custom domain',
      'Automated SMS & email reminders',
    ],
    features: [
      'Mobile-ready appointment calendar for clients',
      'Service menu & staff availability controls',
      'Automated email and SMS booking confirmations',
      'Direct Stripe & PayPal payment collection',
      'Dedicated database setup for your business',
    ],
    ctaText: 'Choose Standard Setup',
    accentColor: '#10b981',
  },
  {
    id: 'operational',
    name: 'Advanced Operations Build',
    badge: 'Most Popular',
    tagline: 'Staff shift scheduling, field crew dispatching, and custom intake forms.',
    forWho: 'Clinics, field service contractors, and multi-staff businesses.',
    setupFee: '$1,850',
    setupFeeNumber: 1850,
    monthlyMaintenance: '$89/mo',
    keyBenefits: [
      'Field crew dispatch & shift roster',
      'Custom customer intake forms',
      'Multi-location schedule sync',
    ],
    features: [
      'Everything in Standard Booking Setup',
      'Dispatch board for field crews and staff shifts',
      'Custom intake forms & deposit rules',
      'Multi-location & multi-calendar sync',
      'Separate admin dashboard for managers and reception',
    ],
    ctaText: 'Choose Operations Build',
    accentColor: '#38bdf8',
  },
  {
    id: 'enterprise',
    name: 'Custom Mobile & Dedicated Build',
    tagline: 'Dedicated iOS & Android mobile apps published under your company name.',
    forWho: 'Established franchises and multi-location service providers.',
    setupFee: '$4,500+',
    setupFeeNumber: 4500,
    monthlyMaintenance: '$199/mo',
    keyBenefits: [
      'App Store & Google Play apps',
      'Private dedicated server',
      'Custom CRM & software hooks',
    ],
    features: [
      'Everything in Advanced Operations Build',
      'Native iOS and Android mobile app builds',
      'Private database infrastructure per client',
      'Integrations with your internal software or CRM',
      'Direct developer support and SLA',
    ],
    ctaText: 'Talk to Engineering',
    accentColor: '#c084fc',
  },
]

export default function PricingSection() {
  const navigate = useNavigate()
  const [selectedTier, setSelectedTier] = useState<string>('operational')
  const [estimatedBookings, setEstimatedBookings] = useState<number>(150)

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[1]
  const estimatedSavings = Math.round(estimatedBookings * 5)

  return (
    <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', padding: '16px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '4px 12px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '12px',
          }}
        >
          Clear & Direct Pricing
        </span>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '10px',
          }}
        >
          Simple One-Off Setup & Maintenance
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.5 }}>
          Pay for setup once. Keep 100% of your booking revenues with zero transaction fees.
        </p>
      </div>

      {/* Tier Selection Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '28px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            background: 'rgba(15, 17, 23, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
          }}
        >
          {tiers.map((tier) => {
            const isActive = selectedTier === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  flex: '1 1 180px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                  background: isActive ? 'rgba(30, 41, 59, 0.95)' : 'transparent',
                  color: isActive ? '#ffffff' : '#a1a1aa',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{tier.name.split(' ')[0]} {tier.name.split(' ')[1]}</span>
                {tier.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: '#10b981',
                      color: '#08080a',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    Popular
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Feature Display Box */}
      <div
        style={{
          background: 'rgba(15, 17, 23, 0.85)',
          border: `2px solid ${currentTier.accentColor}`,
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 36px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: currentTier.accentColor,
                    background: `${currentTier.accentColor}18`,
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {currentTier.forWho}
                </span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {currentTier.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
                {currentTier.tagline}
              </p>
            </div>

            {/* Standout Price Hero Box */}
            <div
              style={{
                background: 'rgba(8, 10, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', display: 'block' }}>
                  One-Time Build Fee
                </span>
                <span style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>
                  {currentTier.setupFee}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', display: 'block' }}>
                  Hosting & Support
                </span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: currentTier.accentColor }}>
                  {currentTier.monthlyMaintenance}
                </span>
              </div>
            </div>

            {/* Included Features */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '12px' }}>
                What is included in this build:
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentTier.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: 1.4 }}>
                    <CheckIcon size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Calculator & CTA */}
          <div
            style={{
              background: 'rgba(8, 9, 12, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ffffff', marginBottom: '4px' }}>
                Commission Savings Calculator
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
                Typical booking widgets take 3% to 5% per appointment. NativeBooking takes 0%.
              </p>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  <span>Monthly Bookings:</span>
                  <span style={{ color: '#34d399' }}>{estimatedBookings} / mo</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={500}
                  step={10}
                  value={estimatedBookings}
                  onChange={(e) => setEstimatedBookings(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#10b981',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Money saved monthly:</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#34d399' }}>
                    ${estimatedSavings}<span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>/mo</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/book-call')}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 800,
                color: '#08080a',
                background: currentTier.accentColor,
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              {currentTier.ctaText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}