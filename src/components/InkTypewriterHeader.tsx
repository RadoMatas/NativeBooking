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
      {/* Minimalist Tattoo Needle / Pen SVG Icon */}
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
          filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))',
          transform: isDone ? 'none' : 'rotate(-10deg) translateY(-1px)',
          transition: 'transform 0.1s ease',
        }}
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18" />
        <path d="M2 2l7.5 7.5" />
        <line x1="10.4" y1="10.4" x2="16" y2="16" />
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
