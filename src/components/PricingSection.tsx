import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TierOption {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  forWho: string;
  keyBenefits: string[];
  features: string[];
  ctaText: string;
  accentColor: string;
}

const tiers: TierOption[] = [
  {
    id: 'essential',
    name: 'Standard Booking Setup',
    tagline: 'Your own branded reservation site with zero monthly booking fees.',
    forWho: 'Best for solo practitioners, studios, and small teams wanting a direct booking site.',
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
    forWho: 'Best for growing clinics, multi-staff businesses, and field service teams with crew schedules.',
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
    forWho: 'Best for established businesses requiring custom mobile apps and dedicated infrastructure.',
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
];

export default function PricingSection() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('operational');
  const [estimatedBookings, setEstimatedBookings] = useState<number>(150);

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[1];

  // Simple calculator to show zero-commission savings benefit visually
  const estimatedSavings = Math.round(estimatedBookings * 4.5);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full inline-block mb-3">
          Fair & Clear Setup
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          How Our Custom Builds Work
        </h1>
        <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
          No percentage cuts. No hidden widget fees. Choose the setup depth your team needs, and keep 100% of your earnings.
        </p>
      </div>

      {/* Interactive Mobile-Friendly Tier Selector (Tabs on mobile, pills on desktop) */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-1.5">
          {tiers.map((tier) => {
            const isActive = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{tier.name.split(' ')[0]} {tier.name.split(' ')[1]}</span>
                {tier.badge && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Popular
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tier Highlight Card (Interactive View) */}
      <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow accent matching selected tier */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
          style={{ background: currentTier.accentColor }}
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
          {/* Left Column: Summary & Benefits */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md"
                  style={{ background: `${currentTier.accentColor}20`, color: currentTier.accentColor }}
                >
                  {currentTier.forWho}
                </span>
                {currentTier.badge && (
                  <span className="bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentTier.badge}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentTier.name}
              </h2>
              <p className="text-slate-300 text-base mt-2 leading-relaxed">
                {currentTier.tagline}
              </p>
            </div>

            {/* Quick Benefits Pills for Mobile Scanning */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {currentTier.keyBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2.5"
                >
                  <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Features Checklist */}
            <div className="pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                What's Included in this build:
              </h3>
              <ul className="space-y-3">
                {currentTier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive ROI & CTA Card */}
          <div className="w-full lg:w-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                Estimate Monthly Savings
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Generic widgets take 3% to 5% per booking. With your own system, you keep all profits.
              </p>

              <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Monthly Bookings:</span>
                  <span className="text-emerald-400 font-bold">{estimatedBookings} / mo</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={estimatedBookings}
                  onChange={(e) => setEstimatedBookings(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Estimated money saved:</span>
                  <span className="text-xl font-extrabold text-emerald-400">${estimatedSavings}<span className="text-xs font-normal text-slate-400">/mo</span></span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/book-call')}
              className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm text-slate-950 transition-all duration-200 shadow-lg cursor-pointer hover:brightness-110 active:scale-95"
              style={{ background: currentTier.accentColor }}
            >
              {currentTier.ctaText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}