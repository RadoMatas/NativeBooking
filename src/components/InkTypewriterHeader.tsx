import { useEffect, useState } from 'react'

export default function InkTypewriterHeader({ text }: { text?: string }) {
  const fullText = text || 'Manage Your Booking'
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    setDisplayedText('')
    setIsDone(false)

    const timer = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsDone(true)
        clearInterval(timer)
      }
    }, 90) // speed of typing per letter

    return () => clearInterval(timer)
  }, [fullText])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 14px',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Contractor Wrench & Hammer SVG Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))',
          transform: isDone ? 'none' : 'rotate(-10deg) translateY(-1px)',
          transition: 'transform 0.1s ease',
        }}
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>

      {/* Letter by Letter Typewriter Text */}
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {displayedText}
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '14px',
            backgroundColor: 'var(--accent-color)',
            marginLeft: '4px',
            verticalAlign: 'middle',
            animation: isDone ? 'blink 1.2s infinite' : 'none',
            boxShadow: '0 0 8px var(--accent-color)',
          }}
        />
      </span>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
