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
    fontWeight: 600,
    borderRadius: '10px',
    border: '1px solid transparent',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    whiteSpace: 'nowrap',
    outline: 'none',
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 18px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '15px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent-color)',
      color: '#000000',
      boxShadow: '0 2px 10px rgba(16, 185, 129, 0.25)',
    },
    purple: {
      background: '#a855f7',
      color: '#ffffff',
      boxShadow: '0 2px 10px rgba(168, 85, 247, 0.25)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#ffffff',
      borderColor: 'var(--border-color)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent-color)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
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
    <button style={combinedStyles} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
      ) : null}
      {children}
    </button>
  )
}
