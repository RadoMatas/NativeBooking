
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, CheckIcon } from './ui/Icons'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: 'Ownership & Fees',
    question: 'Why choose a custom build over standard subscription software?',
    answer: 'Standard subscription widgets charge per-booking commissions or recurring fees while keeping your client data locked in their platform. With NativeBooking, you own your custom reservation system and database with 0% booking commission cuts.',
  },
  {
    category: 'Pricing & Maintenance',
    question: 'How do the setup fee and monthly maintenance work?',
    answer: 'Each build starts with a transparent one-off setup fee covering custom workflow building, branding integration, and database setup. The small monthly maintenance fee covers secure cloud hosting, database backups, and server maintenance.',
  },
  {
    category: 'Setup & Launch',
    question: 'How fast can our business reservation portal launch?',
    answer: 'Most standard setups are configured and live within a few business days. We set up your service menu, staff schedules, deposit preferences, and automated customer reminders.',
  },
  {
    category: 'Payments',
    question: 'How do customer deposits and payments work?',
    answer: 'Funds transfer directly to your own Stripe or PayPal account. You can collect full upfront payment, partial deposit holds, or offer pay-at-venue options with zero middleman delays.',
  },
  {
    category: 'Team & Dispatch',
    question: 'Can we manage multi-staff schedules or dispatch field crews?',
    answer: 'Yes! The Advanced Business Engine includes team dispatch boards, shift scheduling, site address tracking for field crews, and practitioner rosters.',
  },
  {
    category: 'Mobile Experience',
    question: 'Is the booking experience mobile-friendly for our clients?',
    answer: '100%. Every portal is designed mobile-first so clients can easily view services, pick staff slots, and complete payments on any iPhone, Android, or desktop browser in seconds.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '48px auto 0', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 36px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#38bdf8',
            background: 'rgba(14, 165, 233, 0.12)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            padding: '6px 14px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '12px',
          }}
        >
          Got Questions?
        </span>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}
        >
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
          Everything you need to know about our custom reservation setups, pricing, and operations.
        </p>
      </div>

      {/* Accordion Cards Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={index}
              style={{
                background: isOpen ? 'rgba(23, 26, 35, 0.85)' : 'rgba(15, 17, 23, 0.65)',
                border: isOpen ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isOpen ? '0 12px 30px rgba(0, 0, 0, 0.4)' : 'none',
              }}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: isOpen ? '#34d399' : '#64748b',
                    }}
                  >
                    {faq.category}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                    {faq.question}
                  </span>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isOpen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#34d399' : '#94a3b8',
                    flexShrink: 0,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon size={16} />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 24px 20px',
                        fontSize: '14px',
                        color: '#cbd5e1',
                        lineHeight: 1.6,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '16px',
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      <CheckIcon size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                      <span>{faq.answer}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}