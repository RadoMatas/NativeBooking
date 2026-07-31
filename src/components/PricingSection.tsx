import { useNavigate } from 'react-router-dom';

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge?: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'essential',
    name: '1. Essential Setup',
    subtitle: 'Standard White-Label',
    description: 'White-label booking flow embedded into client website with zero platform fees.',
    features: [
      'White-label booking flow on your domain',
      'Service catalog & staff/crew scheduling',
      'Automated email/SMS client notifications',
      'Direct Stripe & PayPal payment integration',
      'Isolated database rules & sovereignty',
    ],
    ctaText: 'Schedule Discovery Call',
  },
  {
    id: 'operational',
    name: '2. Operational Custom',
    subtitle: 'Advanced Business Engine',
    description: 'Everything in Essential plus crew dispatch, shift management, and dynamic intake rules.',
    popular: true,
    badge: 'Most Recommended',
    features: [
      'Everything in Essential Setup',
      'Field crew dispatch & shift assignment board',
      'Dynamic pricing rules & custom intake forms',
      'Multi-location & multi-calendar sync',
      'Custom client portal & admin workflow',
    ],
    ctaText: 'Discuss Operational Build',
  },
  {
    id: 'enterprise',
    name: '3. Enterprise Custom',
    subtitle: 'Dedicated Infrastructure',
    description: 'Full custom mobile apps and isolated dedicated Firebase infrastructure.',
    features: [
      'Everything in Operational Custom',
      'Custom iOS & Android mobile apps (Capacitor JS)',
      'Dedicated Firebase project infrastructure per client',
      'Custom CRM / ERP integrations via API hooks',
      'Custom SLA, contract terms & priority engineering',
    ],
    ctaText: 'Contact Enterprise Team',
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Service Delivery Tiers
        </h2>
        <p className="mt-3 text-slate-400 text-base sm:text-lg">
          Custom-made software designed for service businesses, clinics, studios, and field contractors. You own 100% of your data and customer relationships.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {pricingTiers.map((tier) => {
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 backdrop-blur-md ${
                tier.popular
                  ? 'bg-slate-900/90 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 shadow-lg'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {tier.subtitle}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{tier.name}</h3>
                <p className="mt-3 text-sm text-slate-400 min-h-[48px] leading-relaxed">
                  {tier.description}
                </p>

                <div className="mt-6 border-t border-slate-800 pt-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-4">
                    What's included
                  </span>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <svg
                          className="h-5 w-5 shrink-0 text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/book-call')}
                className={`mt-8 w-full rounded-xl py-3 px-4 text-center text-sm font-bold transition-all duration-200 cursor-pointer ${
                  tier.popular
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}