
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
    question: 'Why choose a custom build over standard booking widgets?',
    answer: 'Standard booking tools charge subscription fees or per-booking cuts, keeping client data on their platform. With NativeBooking, you get a custom setup and own your database with 0% transaction commissions.',
  },
  {
    category: 'Pricing & Maintenance',
    question: 'How do the setup fee and monthly maintenance work?',
    answer: 'You pay a one-off build fee for custom workflow setup, branding, and database integration. The monthly fee covers server hosting, database backups, and maintenance.',
  },
  {
    category: 'Setup & Launch',
    question: 'How fast can our portal go live?',
    answer: 'Most standard portals go live within a few business days. We handle setting up your service menu, staff calendars, deposit rules, and automated reminders.',
  },
  {
    category: 'Payments',
    question: 'How do customer deposits and payments work?',
    answer: 'Payments go straight to your own Stripe or PayPal account. You can collect full payment, deposit holds, or offer pay-at-venue options with no payout delays.',
  },
  {
    category: 'Team & Dispatch',
    question: 'Can we manage staff shifts or dispatch field crews?',
    answer: 'Yes. The Advanced Operations Build includes shift scheduling, crew dispatch boards, address tracking, and staff rosters.',
  },
  {
    category: 'Mobile Experience',
    question: 'Is the booking experience mobile-friendly?',
    answer: 'Yes. Every portal is built mobile-first so your clients can view services, pick slots, and pay from any phone or desktop.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div style={{ width: '100%', maxWidth: '840px', margin: '40px auto 0', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 32px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#38bdf8',
            background: 'rgba(14, 165, 233, 0.12)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            padding: '4px 12px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '10px',
          }}
        >
          Common Questions
        </span>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 34px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
          Clear details about custom setups, pricing, and system operations.
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