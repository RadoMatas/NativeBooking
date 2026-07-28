import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, currentUserRole } from '../auth'
import { BUSINESS_CONFIG } from '../businessConfig'

import { useNotification } from '../components/ui/NotificationStack'
import { AnimatedButton } from '../components/ui/AnimatedButton'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { notify } = useNotification()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoggingIn(true)

    const ok = await login(email, password)
    setIsLoggingIn(false)

    if (!ok) {
      notify('Invalid email or password.', 'error')
      return
    }

    if (currentUserRole === 'admin') {
      navigate('/admin')
    } else {
      // Authenticated but not admin — reject
      notify('Access denied. Admin credentials required.', 'error')
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
            <img
              src="/logo-icon.jpg"
              alt="NativeBooking logo"
              style={{ width: '96px', height: '96px', borderRadius: '16px', objectFit: 'cover' }}
            />
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '6px', color: '#10b981' }}>{BUSINESS_CONFIG.name}</h1>
          <p style={{ fontSize: '15px', color: '#10b981', fontWeight: 600 }}>Admin access only</p>
        </div>

        <div className="form-group">
          <label htmlFor="admin-email" className="form-label">
            Email Address
          </label>
          <input
            id="admin-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            required
            disabled={isLoggingIn}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label htmlFor="admin-password" className="form-label">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isLoggingIn}
          />
        </div>

        <AnimatedButton
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Signing In...' : 'Sign In'}
        </AnimatedButton>

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
      </form>
    </div>
  )
}
