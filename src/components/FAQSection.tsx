
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Why build a custom reservation site instead of using a standard booking tool?",
    answer: "Standard booking tools charge subscription fees or per-booking cuts, and force your clients into a generic template. With a custom build, you own the system, control your client database, match your brand look, and pay zero transaction commissions to middlemen.",
  },
  {
    question: "How long does it take to set up our business reservation portal?",
    answer: "Most standard setups are up and running within a few business days. We configure your service menu, staff schedules, deposit settings, and automated customer reminders so you can start taking bookings smoothly.",
  },
  {
    question: "How do client payments and deposits work?",
    answer: "Money goes directly into your business bank account through your own Stripe or PayPal connection. You can collect full payment, partial deposit holds, or allow pay-at-venue reservations.",
  },
  {
    question: "Can we dispatch field crews or manage team shifts?",
    answer: "Yes! Our Advanced Business Engine includes team dispatch boards, shift scheduling, address routing for field crews, and multi-staff calendars.",
  },
  {
    question: "Can our clients book from their phones?",
    answer: "100%. Every setup is built mobile-first so your clients can easily book, reschedule, and pay from any iPhone, Android device, or desktop browser in seconds.",
  },
  {
    question: "Can we get custom mobile apps in the App Store?",
    answer: "Yes. For larger teams needing dedicated mobile apps, we build and publish native iOS and Android apps directly under your company's name.",
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