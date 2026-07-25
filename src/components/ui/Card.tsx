import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'flat'
}

export function Card({ children, variant = 'default', style, ...props }: CardProps) {
  const baseStyles: React.CSSProperties = {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(16px) saturate(120%)',
    WebkitBackdropFilter: 'blur(16px) saturate(120%)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {},
    interactive: {
      cursor: 'pointer',
    },
    flat: {
      background: 'rgba(255, 255, 255, 0.02)',
      boxShadow: 'none',
    },
  }

  return (
    <div
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
