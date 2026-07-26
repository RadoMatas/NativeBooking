import { useState } from 'react'
import { CreditCardIcon, CheckIcon } from './ui/Icons'

export default function SavingsCalculator() {
  const [monthlyBookings, setMonthlyBookings] = useState(120)
  const [averageTicket, setAverageTicket] = useState(85)
  const otaCommissionRate = 0.18 // 18% typical marketplace commission

  const monthlyVolume = monthlyBookings * averageTicket
  const otaFeesPaidMonthly = monthlyVolume * otaCommissionRate
  const otaFeesPaidYearly = otaFeesPaidMonthly * 12

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        background: 'rgba(22, 24, 29, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '36px 28px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-color)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Commission Savings Calculator
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          Stop Paying 18% Commissions on Your Own Clients
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Third-party booking platforms take a cut of every booking. NativeBooking gives you custom software with 0% per-booking commission fees.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          alignItems: 'center',
        }}
      >
        {/* Sliders Control Panel */}
        <div
          style={{
            background: 'rgba(12, 13, 16, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Monthly Bookings Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Monthly Reservations / Jobs
              </label>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-color)' }}>
                {monthlyBookings} bookings/mo
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={monthlyBookings}
              onChange={(e) => setMonthlyBookings(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-color)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Average Ticket Value Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Average Booking / Job Value ($)
              </label>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-color)' }}>
                ${averageTicket} / booking
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={500}
              step={5}
              value={averageTicket}
              onChange={(e) => setAverageTicket(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-color)',
                cursor: 'pointer',
              }}
            />
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CreditCardIcon size={20} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
            <span>
              Monthly Revenue Volume: <strong style={{ color: '#ffffff' }}>${monthlyVolume.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Calculation Result Display */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(12, 13, 16, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Estimated Yearly Savings with NativeBooking
          </div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '8px', lineHeight: '1' }}>
            ${Math.round(otaFeesPaidYearly).toLocaleString()}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            You keep 100% of your earnings instead of giving ${Math.round(otaFeesPaidMonthly).toLocaleString()}/month to third-party marketplaces.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffff' }}>
              <CheckIcon size={16} style={{ color: 'var(--accent-color)' }} />
              <span>0% Commission on direct client bookings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffff' }}>
              <CheckIcon size={16} style={{ color: 'var(--accent-color)' }} />
              <span>Stripe funds deposit directly into your bank account</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffff' }}>
              <CheckIcon size={16} style={{ color: 'var(--accent-color)' }} />
              <span>You own your client database and domain name</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


