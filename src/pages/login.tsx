import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, currentUserRole } from '../auth'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'

import { SparklesIcon, UsersIcon, SettingsIcon } from '../components/ui/Icons'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setErrorMsg('')

    let ok = false
    if (isSignUpMode) {
      ok = await register(email, password)
    } else {
      ok = await login(email, password)
    }
    setIsLoggingIn(false)

    if (!ok) {
      setErrorMsg(
        isSignUpMode
          ? 'Registration failed (password must be at least 6 characters, or email is already registered).'
          : 'Invalid email or password.'
      )
      return
    }

    if (currentUserRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  const handleDemoLogin = async (role: 'customer' | 'admin') => {
    setIsLoggingIn(true)
    setErrorMsg('')
    const demoEmail    = role === 'admin' ? 'admin@test.com'    : 'customer@test.com'
    const demoPassword = role === 'admin' ? 'admin123'          : 'cust123'
    const ok = await login(demoEmail, demoPassword)
    setIsLoggingIn(false)

    if (!ok) {
      setErrorMsg('Demo login failed — please try again.')
      return
    }

    if (currentUserRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      {/* Demo Disclaimer Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '9999px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.75)',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        }}
      >
        <SparklesIcon size={14} style={{ color: 'var(--accent-color)' }} />
        <span>Live product demo — all data is simulated for demonstration purposes only.</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="premium-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo size="large" />
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '6px' }}>
            {isSignUpMode ? 'Create Account' : BUSINESS_CONFIG.name}
          </h1>
          <p style={{ fontSize: '15px' }}>
            {isSignUpMode ? 'Join us and start booking your sessions.' : BUSINESS_CONFIG.tagline}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Access */}
        {!isSignUpMode && (
          <div style={{ marginBottom: '24px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              Jump straight in
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                disabled={isLoggingIn}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '13px', padding: '10px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <UsersIcon size={14} /> Try as Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoggingIn}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '13px', padding: '10px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <SettingsIcon size={14} /> Try as Admin
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        {!isSignUpMode && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or sign in manually
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. customer@test.com"
            autoComplete="off"
            required
            disabled={isLoggingIn}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
            required
            disabled={isLoggingIn}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoggingIn}>
          {isLoggingIn
            ? isSignUpMode
              ? 'Creating Account...'
              : 'Signing In...'
            : isSignUpMode
            ? 'Create Account'
            : 'Sign In'}
        </button>

        {/* Back to Portal */}
        <a
          href="https://nativebooking.co"
          style={{ textDecoration: 'none', width: '100%', display: 'block', marginTop: '12px' }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
          >
            ← Back to Industry Portal
          </button>
        </a>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => setIsSignUpMode(!isSignUpMode)}
            className="btn-link"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-color)',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline',
              fontFamily: 'inherit',
            }}
          >
            {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>

        {/* Watermark */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            letterSpacing: '0.03em',
            fontWeight: 600,
          }}
        >
          Powered by NativeBooking Software ⚡
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <a
            href="/privacy"
            style={{ fontSize: '11px', color: 'var(--text-secondary)', textDecoration: 'underline', opacity: 0.7 }}
          >
            Privacy Policy
          </a>
        </div>
      </form>
    </div>
  )
}