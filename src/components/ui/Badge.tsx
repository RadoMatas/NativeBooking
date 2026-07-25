import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'error' | 'neutral'
}

export function Badge({ children, variant = 'neutral', style, ...props }: BadgeProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    success: {
      background: 'rgba(16, 185, 129, 0.12)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.12)',
      color: '#fbbf24',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    info: {
      background: 'rgba(14, 165, 233, 0.12)',
      color: '#38bdf8',
      border: '1px solid rgba(14, 165, 233, 0.3)',
    },
    error: {
      background: 'rgba(239, 68, 68, 0.12)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    neutral: {
      background: 'rgba(255, 255, 255, 0.06)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
    },
  }

  return (
    <span
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
