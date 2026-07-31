import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckIcon, SparklesIcon } from './ui/Icons'

interface TierOption {
  id: string
  name: string
  badge?: string
  tagline: string
  forWho: string
  setupFee: string
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
    tagline: 'Your own branded reservation site with zero monthly booking fees.',
    forWho: 'Solo practitioners, studios, and small teams wanting a direct booking site.',
    setupFee: '$490 one-time build',
    monthlyMaintenance: '$29/mo (hosting & maintenance)',
    keyBenefits: [
      'Direct payments to your bank',
      'Matches your business branding',
      'Automated email & SMS reminders',
    ],
    features: [
      'Clean appointment booking flow for clients',
      'Service catalog & staff calendar management',
      'Automated client email & SMS notifications',
      'Direct Stripe & PayPal payments (100% earnings kept)',
      'Isolated database built specifically for your business',
    ],
    ctaText: 'Explore Standard Setup',
    accentColor: '#10b981',
  },
  {
    id: 'operational',
    name: 'Advanced Business Engine',
    badge: 'Most Popular',
    tagline: 'Full dispatch boards, shift scheduling, and custom intake questionnaires.',
    forWho: 'Growing clinics, multi-staff businesses, and field service teams with crew schedules.',
    setupFee: '$1,250 one-time build',
    monthlyMaintenance: '$69/mo (hosting & maintenance)',
    keyBenefits: [
      'Crew dispatch & shift board',
      'Custom customer intake forms',
      'Multi-location availability',
    ],
    features: [
      'Everything in Standard Booking Setup',
      'Field crew dispatch & shift assignment dashboard',
      'Custom deposit rules & intake questionnaires',
      'Multi-location & multi-calendar synchronization',
      'Dedicated admin workflow for front-desk and managers',
    ],
    ctaText: 'Explore Business Engine',
    accentColor: '#38bdf8',
  },
  {
    id: 'enterprise',
    name: 'Full Custom Mobile & Dedicated Setup',
    tagline: 'Native iOS & Android mobile apps published directly under your company brand.',
    forWho: 'Established businesses requiring custom mobile apps and dedicated infrastructure.',
    setupFee: 'Custom quote (from $2,900)',
    monthlyMaintenance: 'Custom dedicated hosting',
    keyBenefits: [
      'Your own mobile apps in App Store',
      'Dedicated private database',
      'Custom API & software connections',
    ],
    features: [
      'Everything in Advanced Business Engine',
      'Custom mobile app builds for iOS App Store & Google Play',
      'Dedicated private database server per client',
      'Custom integration with your existing CRM or internal systems',
      'Priority engineering support & custom service agreements',
    ],
    ctaText: 'Talk to Engineering Team',
    accentColor: '#c084fc',
  },
]

export default function PricingSection() {
  const navigate = useNavigate()
  const [selectedTier, setSelectedTier] = useState<string>('operational')
  const [estimatedBookings, setEstimatedBookings] = useState<number>(150)

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[1]
  const estimatedSavings = Math.round(estimatedBookings * 4.5)

  return (
    <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', padding: '20px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '6px 14px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '14px',
          }}
        >
          Fair & Clear Setup
        </span>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          How Our Custom Builds Work
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6 }}>
          No percentage cuts. No hidden widget fees. Choose the setup depth your team needs, and keep 100% of your earnings.
        </p>
      </div>

      {/* Interactive Mobile-Friendly Tier Selector Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            background: 'rgba(15, 17, 23, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            backdropFilter: 'blur(16px)',
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
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  background: isActive ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isActive ? '0 8px 20px rgba(0, 0, 0, 0.4)' : 'none',
                }}
              >
                <span>{tier.name.split(' ')[0]} {tier.name.split(' ')[1]}</span>
                {tier.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
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

      {/* Main Glassmorphism Featured Build Display Card */}
      <div
        style={{
          background: 'rgba(15, 17, 23, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 40px)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${currentTier.accentColor}25 0%, transparent 70%)`,
            filter: 'blur(50px)',
            pointerEvents: 'none',
            transition: 'background 0.5s ease',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '36px',
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: currentTier.accentColor,
                    background: `${currentTier.accentColor}15`,
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {currentTier.forWho}
                </span>
                {currentTier.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#08080a',
                      background: '#10b981',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {currentTier.badge}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {currentTier.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
                {currentTier.tagline}
              </p>

              {/* Price Breakdown Badge */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', display: 'block' }}>One-Off Setup</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{currentTier.setupFee}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', display: 'block' }}>Maintenance & Hosting</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: currentTier.accentColor }}>{currentTier.monthlyMaintenance}</span>
                </div>
              </div>
            </div>

            {/* Benefits Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {currentTier.keyBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <SparklesIcon size={14} style={{ color: currentTier.accentColor, flexShrink: 0 }} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Features Checklist */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '14px' }}>
                Features included in build:
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentTier.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4 }}>
                    <CheckIcon size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Action & Interactive Calculator Panel */}
          <div
            style={{
              background: 'rgba(8, 9, 12, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ffffff', marginBottom: '6px' }}>
                Estimate Monthly Savings
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                SaaS tools charge percentage commissions per booking. With your own system, keep 100% of profits.
              </p>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
                  <span>Monthly Bookings:</span>
                  <span style={{ color: '#10b981' }}>{estimatedBookings} / mo</span>
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
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Estimated savings:</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>
                    ${estimatedSavings}<span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>/mo</span>
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
                transition: 'all 0.2s ease',
                boxShadow: `0 8px 24px ${currentTier.accentColor}30`,
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