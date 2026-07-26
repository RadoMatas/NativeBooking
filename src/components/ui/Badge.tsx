import React from 'react'

export type BadgeVariant = 
  | 'success' | 'warning' | 'info' | 'error' | 'neutral'
  | 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_progress'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  showDot?: boolean
  icon?: React.ReactNode
}

export function Badge({ 
  children, 
  variant = 'neutral', 
  showDot = true,
  icon,
  style, 
  ...props 
}: BadgeProps) {
  const normalizedVariant = (variant ? variant.toLowerCase() : 'neutral') as string

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  }

  const variantMap: Record<string, { bg: string; color: string; border: string; dot: string }> = {
    success: { bg: 'rgba(16, 185, 129, 0.14)', color: '#34d399', border: 'rgba(16, 185, 129, 0.35)', dot: '#34d399' },
    confirmed: { bg: 'rgba(16, 185, 129, 0.14)', color: '#34d399', border: 'rgba(16, 185, 129, 0.35)', dot: '#34d399' },
    warning: { bg: 'rgba(245, 158, 11, 0.14)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)', dot: '#fbbf24' },
    pending: { bg: 'rgba(245, 158, 11, 0.14)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)', dot: '#fbbf24' },
    info: { bg: 'rgba(14, 165, 233, 0.14)', color: '#38bdf8', border: 'rgba(14, 165, 233, 0.35)', dot: '#38bdf8' },
    in_progress: { bg: 'rgba(14, 165, 233, 0.14)', color: '#38bdf8', border: 'rgba(14, 165, 233, 0.35)', dot: '#38bdf8' },
    completed: { bg: 'rgba(59, 130, 246, 0.14)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)', dot: '#60a5fa' },
    error: { bg: 'rgba(239, 68, 68, 0.14)', color: '#f87171', border: 'rgba(239, 68, 68, 0.35)', dot: '#f87171' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.14)', color: '#f87171', border: 'rgba(239, 68, 68, 0.35)', dot: '#f87171' },
    neutral: { bg: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.1)', dot: '#94a3b8' },
  }

  const currentVariant = variantMap[normalizedVariant] || variantMap.neutral

  return (
    <span
      style={{
        ...baseStyles,
        background: currentVariant.bg,
        color: currentVariant.color,
        border: `1px solid ${currentVariant.border}`,
        ...style,
      }}
      {...props}
    >
      {icon ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      ) : showDot ? (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentVariant.dot,
            boxShadow: `0 0 8px ${currentVariant.dot}`,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      ) : null}
      {children}
    </span>
  )
}


