import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, currentUserRole } from '../auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@nativebooking.co')
  const [password, setPassword] = useState('NativeBooking2026!Admin')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    const ok = await login(email, password)
    setIsLoggingIn(false)

    if (!ok) {
      alert('Invalid admin credentials.')
      return
    }

    if (currentUserRole === 'admin') {
      navigate('/admin')
    } else {
      alert('Access denied: Admin credentials required.')
    }
  }

  const t = {
    bg: '#09090b',
    cardBg: 'rgba(20, 20, 23, 0.8)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#10b981',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background: `radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 45%),
                     radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.03), transparent 50%),
                     ${t.bg}`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: '20px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <img
            src="/logo-icon.jpg"
            alt="NativeBooking"
            style={{ height: '48px', width: '48px', borderRadius: '12px', margin: '0 auto 16px', display: 'block' }}
          />
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            NativeBooking Central
          </h1>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>
            Protected Admin Access · Authorized Personnel Only
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${t.border}`,
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${t.border}`,
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '14px',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '10px',
            background: t.accent,
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
          }}
        >
          {isLoggingIn ? 'Authenticating...' : 'Sign In to Central Control ⚡'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <a
            href="/"
            style={{ fontSize: '12px', color: t.textSecondary, textDecoration: 'none' }}
          >
            ← Return to Portal Homepage
          </a>
        </div>
      </form>
    </div>
  )
}
