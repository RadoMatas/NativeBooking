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
      {/* Graduation Cap SVG Icon */}
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
          filter: 'drop-shadow(0 0 6px var(--accent-color))',
          transform: isDone ? 'none' : 'scale(1.1) translateY(-1px)',
          transition: 'transform 0.2s ease',
        }}
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
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
