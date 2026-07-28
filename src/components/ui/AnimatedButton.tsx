import { motion } from 'motion/react'
import type { HTMLMotionProps, MotionStyle } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

export interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variantStyles: Record<string, CSSProperties> = {
  primary:   { background: 'var(--accent-color)', color: '#000000', boxShadow: '0 2px 10px rgba(16,185,129,0.25)' },
  purple:    { background: '#a855f7', color: '#ffffff', boxShadow: '0 2px 10px rgba(168,85,247,0.25)' },
  secondary: { background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid var(--border-color)' },
  outline:   { background: 'transparent', color: 'var(--accent-color)', border: '1px solid rgba(16,185,129,0.4)' },
  ghost:     { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
}

const sizeStyles: Record<string, CSSProperties> = {
  sm: { padding: '6px 12px',  fontSize: '12px' },
  md: { padding: '10px 18px', fontSize: '14px' },
  lg: { padding: '14px 24px', fontSize: '15px' },
}

export function AnimatedButton({
  children,
  variant,
  size,
  isLoading = false,
  className,
  onClick,
  disabled,
  type = 'button',
  style,
  ...props
}: AnimatedButtonProps) {
  const isDisabled = disabled || isLoading

  const computedStyle: MotionStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    fontWeight: 600,
    borderRadius: '10px',
    border: '1px solid transparent',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    whiteSpace: 'nowrap',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    ...(variant ? variantStyles[variant] : {}),
    ...(size    ? sizeStyles[size]       : {}),
    ...style,
  }

  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      disabled={isDisabled}
      style={computedStyle}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled   ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {isLoading
        ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
        : null}
      {children}
    </motion.button>
  )
}