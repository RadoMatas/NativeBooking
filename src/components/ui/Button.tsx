import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  style,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    fontWeight: 700,
    borderRadius: '9999px',
    border: '1px solid transparent',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    whiteSpace: 'nowrap',
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '-0.01em',
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 18px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '14px' },
    lg: { padding: '16px 32px', fontSize: '15px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent-color)',
      color: '#000000',
      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)',
    },
    purple: {
      background: '#a855f7',
      color: '#ffffff',
      boxShadow: '0 4px 20px rgba(168, 85, 247, 0.35)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.06)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(12px)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent-color)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
  }

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  }

  return (
    <button className={className} style={combinedStyles} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
      ) : null}
      {children}
    </button>
  )
}


