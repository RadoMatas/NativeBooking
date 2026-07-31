
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How is NativeBooking different from generic widgets like Calendly or Acuity?",
    answer: "Unlike generic SaaS widgets that rent out standardized forms, NativeBooking gives you a custom-made, white-labeled software system. You own 100% of your database, customer data, branding, and schedule logic with zero per-booking commission fees.",
  },
  {
    question: "Can I customize booking intake forms and staff/crew dispatch rules?",
    answer: "Yes! Tier 2 (Operational Custom) and Tier 3 (Enterprise) allow fully dynamic intake questionnaires, staff split scheduling, and crew dispatch boards tailored to your exact operational workflows.",
  },
  {
    question: "How does payment processing work?",
    answer: "Payments and reservation deposit holds connect directly to your own Stripe or PayPal account. You collect 100% of earnings immediately with no middleman holding your funds.",
  },
  {
    question: "Can NativeBooking be published as a native iOS or Android mobile app?",
    answer: "Yes. Our Enterprise tier includes custom native mobile app builds powered by Capacitor JS, ready for deployment to the Apple App Store and Google Play Store under your business developer accounts.",
  },
  {
    question: "Where is my data stored and is each client isolated?",
    answer: "We enforce strict Data Sovereignty. Each client gets dedicated Firebase Firestore rules, isolated database structures, and isolated domain assets to ensure maximum privacy and security.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 text-slate-100 border-t border-slate-800/60 mt-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          Have questions about custom white-label booking software? Here is everything you need to know.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`rounded-2xl transition-all duration-200 border ${
                isOpen
                  ? 'bg-slate-900/80 border-emerald-500/30 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none rounded-2xl"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-semibold text-slate-100 pr-4">
                  {faq.question}
                </span>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-slate-400"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}