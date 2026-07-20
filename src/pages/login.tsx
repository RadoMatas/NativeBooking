import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, loginWithGoogle, register, currentUserRole } from '../auth'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoggingIn(true)

    let ok = false
    if (isSignUpMode) {
      ok = await register(email, password)
    } else {
      ok = await login(email, password)
    }
    setIsLoggingIn(false)

    if (!ok) {
      alert(
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

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true)
    const ok = await loginWithGoogle()
    setIsLoggingIn(false)

    if (!ok) {
      alert('Google Sign-in failed')
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

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-secondary"
          style={{ width: '100%', gap: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={isLoggingIn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          {isSignUpMode ? 'Sign Up with Google' : 'Sign In with Google'}
        </button>

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

        {!isSignUpMode && (
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              lineHeight: '1.6',
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
              Demo Credentials:
            </p>
            <p>
              Admin: <code style={{ color: 'var(--accent-color)' }}>admin@test.com</code> / <code>admin123</code>
            </p>
            <p>
              Customer: <code style={{ color: 'var(--accent-color)' }}>customer@test.com</code> / <code>cust123</code>
            </p>
          </div>
        )}
      </form>
    </div>
  )
}