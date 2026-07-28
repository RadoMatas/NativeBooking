import { motion } from 'motion/react'
import type React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'flat'
}

const baseStyles: React.CSSProperties = {
  background: 'var(--card-bg)',
  backdropFilter: 'blur(16px) saturate(120%)',
  WebkitBackdropFilter: 'blur(16px) saturate(120%)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius)',
  padding: '24px',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: {},
  interactive: { cursor: 'pointer' },
  flat: { background: 'rgba(255,255,255,0.02)', boxShadow: 'none' },
}

export function Card({ children, variant = 'default', style, ...props }: CardProps) {
  const combined: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...style,
  }

  if (variant === 'interactive') {
    return (
      <motion.div
        style={combined}
        whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div style={combined} {...props}>
      {children}
    </div>
  )
}