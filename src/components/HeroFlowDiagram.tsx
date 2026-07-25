/**
 * HeroFlowDiagram
 * ----------------
 * Ambient background layer for the hero section.
 * Renders the "Customer → NativeBooking → Booked" signal-flow diagram
 * as a blurred, ghost-opacity layer behind the hero text.
 *
 * Design rules (design.md / brand.md):
 *  - No gradient backgrounds, no glassmorphism cards
 *  - structural / editorial feel, not SaaS-template
 *  - Trust > excitement — one subtle animation only
 *  - Brand green #10b981 at very low opacity
 */

import { useRef } from 'react'

const ACCENT = '#10b981'

// ── SVG icon paths (thin-line, same stroke convention as Icons.tsx) ─────────

function PersonSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function GlobeSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
    </svg>
  )
}

function CalendarCheckSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  )
}

// ── Node ─────────────────────────────────────────────────────────────────────

interface NodeProps {
  icon: React.ReactNode
  label: string
  sublabel: string
  delay: string
}

function FlowNode({ icon, label, sublabel, delay }: NodeProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        animation: `nbFlowFadeIn 1.2s ease both`,
        animationDelay: delay,
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: '72px',
          height: '72px',
          border: `1px solid rgba(16, 185, 129, 0.2)`,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(16, 185, 129, 0.04)',
          boxShadow: '0 0 32px rgba(16, 185, 129, 0.07)',
          position: 'relative',
        }}
      >
        {icon}
      </div>
      {/* Labels */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: `rgba(16, 185, 129, 0.6)`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.04em',
            marginTop: '2px',
            fontFamily: "'Plus Jakarta Sans', monospace",
          }}
        >
          {sublabel}
        </div>
      </div>
    </div>
  )
}

// ── Animated connector line with travelling pulse dot ─────────────────────

interface ConnectorProps {
  delay: string
}

function FlowConnector({ delay }: ConnectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '90px',
        position: 'relative',
        marginTop: '-22px', /* vertically align with icon centres */
      }}
    >
      {/* Static line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: `linear-gradient(to right, rgba(16,185,129,0.0), rgba(16,185,129,0.25), rgba(16,185,129,0.0))`,
        }}
      />
      {/* Arrowhead */}
      <svg
        width="8" height="8" viewBox="0 0 8 8"
        style={{ position: 'absolute', right: 0, transform: 'translateX(1px)' }}
      >
        <polyline
          points="1,1 7,4 1,7"
          fill="none"
          stroke={`rgba(16,185,129,0.35)`}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Travelling pulse dot */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: ACCENT,
          animation: `nbPulseTravel 3s ease-in-out infinite`,
          animationDelay: delay,
          opacity: 0,
        }}
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HeroFlowDiagram() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <style>{`
        @keyframes nbFlowFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes nbPulseTravel {
          0%   { left: 0%;   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { left: calc(100% - 5px); opacity: 0; }
        }
      `}</style>

      <div
        ref={wrapperRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          /* Blur the entire layer to push it behind the text */
          filter: 'blur(0.6px)',
          opacity: 0.55,
        }}
      >
        {/* Three nodes + two connectors — horizontal row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0px',
            /* Nudge slightly downward so it sits behind the CTA buttons area */
            marginTop: '60px',
          }}
        >
          <FlowNode
            icon={<PersonSVG />}
            label="Customer"
            sublabel="visits your site"
            delay="0.2s"
          />

          <FlowConnector delay="0s" />

          <FlowNode
            icon={<GlobeSVG />}
            label="Your Booking System"
            sublabel="built on NativeBooking"
            delay="0.5s"
          />

          <FlowConnector delay="1.5s" />

          <FlowNode
            icon={<CalendarCheckSVG />}
            label="Confirmed"
            sublabel="appointment booked"
            delay="0.8s"
          />
        </div>
      </div>
    </>
  )
}
