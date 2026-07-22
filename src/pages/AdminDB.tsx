import { Navigate, useNavigate } from 'react-router-dom'
import { useRef, useMemo, useState } from 'react'
import { currentUserRole, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'

const adminBadgeStyle = (adminStatus: string, status?: string): React.CSSProperties => {
  let bg = 'rgba(255, 255, 255, 0.05)'
  let color = 'var(--text-secondary)'

  if (adminStatus === 'Declined by Tech' || status === 'Cancelled' || adminStatus === 'Cancelled' || adminStatus === 'Cancelled by Admin') {
    bg = 'rgba(239, 68, 68, 0.2)'
    color = '#f87171'
  } else if (adminStatus === 'In Progress') {
    bg = 'rgba(14, 165, 233, 0.18)'
    color = '#38bdf8'
  } else if (adminStatus === 'Acknowledged') {
    bg = 'rgba(13, 148, 136, 0.18)'
    color = '#2dd4bf'
  } else if (adminStatus === 'Assigned' || adminStatus === 'New') {
    bg = 'rgba(245, 158, 11, 0.18)'
    color = '#f59e0b'
  } else if (adminStatus === 'Completed' || status === 'Completed') {
    bg = 'rgba(16, 185, 129, 0.18)'
    color = '#34d399'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 12px',
    fontSize: '11px',
    fontWeight: 800,
    borderRadius: '9999px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    backgroundColor: bg,
    color: color,
    border: `1px solid ${color}40`,
  }
}

export default function AdminDB() {
  const navigate = useNavigate()
  const {
    bookings,
    updateBooking,
    resetBookings,
    addBooking,
    addNotification,
  } = useBooking()

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [techFilter, setTechFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const detailsRef = useRef<HTMLDivElement | null>(null)

  // Dispatch Job Modal State
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [reassignJobId, setReassignJobId] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [siteAddress, setSiteAddress] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState(BUSINESS_CONFIG.services[0].id)
  const [assignedTechId, setAssignedTechId] = useState(BUSINESS_CONFIG.artists[0].id)
  const [jobDate, setJobDate] = useState(() => new Date().toISOString().split('T')[0])
  const [jobTime, setJobTime] = useState('09:00')
  const [jobNotes, setJobNotes] = useState('')

  // Admin Reschedule Modal State
  const [reschedulingJob, setReschedulingJob] = useState<any | null>(null)
  const [adminNewDate, setAdminNewDate] = useState('')
  const [adminNewTime, setAdminNewTime] = useState('09:00')
  const [adminRescheduleReason, setAdminRescheduleReason] = useState('')

  // Admin Cancel Modal State
  const [cancellingJob, setCancellingJob] = useState<any | null>(null)
  const [adminCancelReason, setAdminCancelReason] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const activeRole = currentUserRole || sessionStorage.getItem('currentUserRole')
  if (activeRole !== 'admin') {
    return <Navigate to="/login" replace />
  }

  // Filtered Jobs
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchTech = techFilter === 'All' || b.artistId === techFilter
      const isDeclined = b.adminStatus === 'Declined by Tech' || (b.status === 'Cancelled' && b.declineReason)

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Assigned' && b.adminStatus === 'Assigned') ||
        (statusFilter === 'Acknowledged' && b.adminStatus === 'Acknowledged') ||
        (statusFilter === 'In Progress' && b.adminStatus === 'In Progress') ||
        (statusFilter === 'Completed' && b.status === 'Completed') ||
        (statusFilter === 'Declined / Cancelled' && (isDeclined || b.status === 'Cancelled'))
      return matchTech && matchStatus
    })
  }, [bookings, techFilter, statusFilter])

  // Count Badges for Filters
  const counts = useMemo(() => {
    const assigned = bookings.filter((b) => b.adminStatus === 'Assigned' && b.status !== 'Cancelled').length
    const acknowledged = bookings.filter((b) => b.adminStatus === 'Acknowledged' && b.status !== 'Cancelled').length
    const inProgress = bookings.filter((b) => b.adminStatus === 'In Progress' && b.status !== 'Cancelled').length
    const completed = bookings.filter((b) => b.status === 'Completed' || b.adminStatus === 'Completed').length
    const declinedCancelled = bookings.filter((b) => b.adminStatus === 'Declined by Tech' || b.status === 'Cancelled').length

    return {
      all: bookings.length,
      assigned,
      acknowledged,
      inProgress,
      completed,
      declinedCancelled,
    }
  }, [bookings])

  // Urgent Action Items (Declined by tech)
  const urgentDeclinedJobs = useMemo(() => {
    return bookings.filter((b) => b.adminStatus === 'Declined by Tech' || (b.status === 'Cancelled' && b.declineReason))
  }, [bookings])

  const selectedBooking = useMemo(
    () => bookings.find((b) => b.id === selectedBookingId) || null,
    [bookings, selectedBookingId]
  )

  const handleInspectJob = (jobId: string) => {
    setSelectedBookingId(jobId)
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleDispatchJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !siteAddress || !clientPhone) {
      alert('Please enter client name, phone, and job site address.')
      return
    }

    const serviceObj = BUSINESS_CONFIG.services.find((s) => s.id === selectedServiceId)
    const techObj = BUSINESS_CONFIG.artists.find((a) => a.id === assignedTechId)

    if (reassignJobId) {
      // Reassign existing declined job
      const existing = bookings.find((b) => b.id === reassignJobId)
      if (existing) {
        updateBooking(reassignJobId, {
          ...existing,
          artistId: assignedTechId,
          artistName: techObj?.name || 'Technician',
          adminStatus: 'Assigned',
          status: 'Confirmed',
          acknowledgedByTech: false,
          declineReason: null,
          date: jobDate,
          time: jobTime,
        })
        addNotification(`🔄 REASSIGNED: Admin reassigned Job Order for ${clientName} to Technician ${techObj?.name}`)
      }
      setReassignJobId(null)
    } else {
      // Create new job
      addBooking({
        id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ownerEmail: 'admin@test.com',
        customerName: clientName,
        customerEmail: 'dispatch@contractor.com',
        customerPhone: clientPhone,
        service: serviceObj?.name || 'Custom Contractor Service',
        date: jobDate,
        time: jobTime,
        status: 'Confirmed',
        adminStatus: 'Assigned',
        acknowledgedByTech: false,
        notes: `📍 Site Address: ${siteAddress} | Notes: ${jobNotes || 'None'}`,
        artistId: assignedTechId,
        artistName: techObj?.name || 'Field Technician',
        depositAmount: serviceObj?.price || 0,
        depositPaid: false,
      })
      addNotification(`🛠️ DISPATCHED: New Job Order for ${clientName} assigned to Technician ${techObj?.name}`)
    }

    setShowDispatchModal(false)
    setClientName('')
    setClientPhone('')
    setSiteAddress('')
    setJobNotes('')
  }

  const handleReassignClick = (job: any) => {
    setReassignJobId(job.id)
    setClientName(job.customerName)
    setClientPhone(job.customerPhone)
    setJobDate(job.date)
    setJobTime(job.time)
    setShowDispatchModal(true)
  }

  const handleAdminConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reschedulingJob) return

    updateBooking(reschedulingJob.id, {
      ...reschedulingJob,
      date: adminNewDate,
      time: adminNewTime,
      notes: adminRescheduleReason
        ? `${reschedulingJob.notes || ''} | [ADMIN RESCHEDULED]: ${adminRescheduleReason}`
        : reschedulingJob.notes,
    })

    addNotification(`📅 ADMIN RESCHEDULED: Admin rescheduled Job for ${reschedulingJob.customerName} to ${adminNewDate} at ${adminNewTime}. Assigned Tech ${reschedulingJob.artistName} notified.`)
    setReschedulingJob(null)
    setAdminRescheduleReason('')
  }

  const handleAdminConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cancellingJob || !adminCancelReason.trim()) {
      alert('Please state a reason for cancelling this job order.')
      return
    }

    updateBooking(cancellingJob.id, {
      ...cancellingJob,
      status: 'Cancelled',
      adminStatus: 'Cancelled by Admin',
      cancellationReason: adminCancelReason,
    })

    addNotification(`🚨 ADMIN CANCELLED: Admin cancelled Job Order for ${cancellingJob.customerName} assigned to ${cancellingJob.artistName} — Reason: "${adminCancelReason}".`)
    setCancellingJob(null)
    setAdminCancelReason('')
  }

  return (
    <div className="page-container" style={{ paddingBottom: '60px' }}>
      {/* ─── HEADER ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Logo size="small" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {BUSINESS_CONFIG.name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
              📍 {BUSINESS_CONFIG.address}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <InkTypewriterHeader text="Dispatch Control Hub" />
          <button
            onClick={() => {
              setReassignJobId(null)
              setShowDispatchModal(true)
            }}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700 }}
          >
            + Dispatch New Job Order 🛠️
          </button>
          <button onClick={resetBookings} className="btn btn-danger" style={{ padding: '7px 12px', fontSize: '12px' }}>
            Reset Board
          </button>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '12px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* ─── PROMINENT TOP URGENT ACTION QUEUE BANNER ──────────── */}
      {urgentDeclinedJobs.length > 0 && (
        <div
          className="premium-card"
          style={{
            marginBottom: '28px',
            padding: '24px',
            border: '1px solid #f87171',
            background: 'rgba(239, 68, 68, 0.09)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.18)',
            borderRadius: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🛑</span>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f87171', margin: 0 }}>
                  Urgent Action Queue ({urgentDeclinedJobs.length} Order{urgentDeclinedJobs.length > 1 ? 's' : ''} Declined)
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Technicians declined work orders. Review initial scheduled date/time & reassign immediately.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {urgentDeclinedJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <strong style={{ color: '#ffffff', fontSize: '16px' }}>
                      {job.service}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 700, background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                      Client: {job.customerName} ({job.customerPhone})
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#e2e8f0', flexWrap: 'wrap' }}>
                    <span>📅 <strong>Initial Date & Time:</strong> {job.date} at {job.time}</span>
                    <span>👷 <strong>Assigned Tech:</strong> {job.artistName}</span>
                  </div>

                  <div style={{ marginTop: '6px', color: '#f87171', fontSize: '13px', fontWeight: 600 }}>
                    🚨 <strong>Decline Reason:</strong> "{job.declineReason || 'No reason specified'}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleInspectJob(job.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                  >
                    👁️ Inspect Order Details
                  </button>
                  <button
                    onClick={() => handleReassignClick(job)}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 700 }}
                  >
                    🔄 Reassign Job Order →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '4px' }}>Field Service Dispatch Board</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track job site work orders, technician acknowledgments, site addresses, and real-time status pipelines.
        </p>
      </div>

      {/* ─── STATUS FILTERS WITH COUNT BADGES ───────────────────── */}
      <div
        className="premium-card"
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 24px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'All', label: `All Jobs (${counts.all})` },
            { key: 'Assigned', label: `🟨 Assigned / Unseen (${counts.assigned})` },
            { key: 'Acknowledged', label: `🟦 Acknowledged (${counts.acknowledged})` },
            { key: 'In Progress', label: `🚀 In Progress (${counts.inProgress})` },
            { key: 'Completed', label: `✅ Completed (${counts.completed})` },
            { key: 'Declined / Cancelled', label: `🛑 Declined / Cancelled (${counts.declinedCancelled})` },
          ].map((f) => {
            const isActive = statusFilter === f.key
            const isAlertState = f.key === 'Declined / Cancelled' && counts.declinedCancelled > 0

            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                style={{
                  padding: '6px 14px',
                  fontSize: '13px',
                  borderRadius: '20px',
                  background: isActive
                    ? 'rgba(245, 158, 11, 0.2)'
                    : isAlertState
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--accent-color)'
                      : isAlertState
                      ? '#f87171'
                      : 'var(--border-color)'
                  }`,
                  color: isActive
                    ? 'var(--accent-color)'
                    : isAlertState
                    ? '#f87171'
                    : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Filter Technician:
          </span>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', background: 'rgba(255,255,255,0.05)' }}
          >
            <option value="All">All Field Technicians</option>
            {BUSINESS_CONFIG.artists.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.avatarEmoji} {tech.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── DISPATCH GRID ──────────────────────────────────────── */}
      <div className="admin-dashboard-grid">
        {/* Left: Job Orders List */}
        <div className="premium-card">
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
            Dispatched Work Orders ({filteredBookings.length})
          </h2>

          {filteredBookings.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>No dispatched jobs found matching criteria.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredBookings.map((job) => {
                const isSelected = selectedBookingId === job.id
                const isDeclined = job.adminStatus === 'Declined by Tech' || (job.status === 'Cancelled' && job.declineReason)

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedBookingId(job.id)}
                    style={{
                      background: isDeclined ? 'rgba(239, 68, 68, 0.08)' : isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isDeclined ? '#f87171' : isSelected ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      borderRadius: '14px',
                      padding: '18px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 16px rgba(245, 158, 11, 0.2)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={adminBadgeStyle(job.adminStatus || job.status, job.status)}>
                          {isDeclined ? '🛑 DECLINED BY TECH' : job.adminStatus || job.status}
                        </span>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                          {job.service}
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-color)' }}>
                          📅 {job.date}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          🕒 {job.time}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>
                        <strong>Client:</strong> {job.customerName || 'Client'} ({job.customerPhone || 'No Phone'})
                      </div>
                      <div>
                        <strong>Technician:</strong> {job.artistName} {job.acknowledgedByTech ? '👁️ (Seen)' : '⏳ (Unseen)'}
                      </div>
                      {job.notes && (
                        <div style={{ color: '#e2e8f0', fontSize: '12px', marginTop: '4px' }}>
                          {job.notes}
                        </div>
                      )}
                      {job.declineReason && (
                        <div style={{ color: '#f87171', fontSize: '12px', fontWeight: 700, background: 'rgba(239,68,68,0.15)', padding: '6px 10px', borderRadius: '6px', marginTop: '6px' }}>
                          🚨 Declined Reason: "{job.declineReason}"
                        </div>
                      )}
                    </div>

                    {/* Quick Action Controls */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                      {isDeclined && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReassignClick(job)
                          }}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '5px 12px' }}
                        >
                          🔄 Reassign Job Order
                        </button>
                      )}
                      {job.status !== 'Completed' && !isDeclined && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setReschedulingJob(job)
                              setAdminNewDate(job.date)
                              setAdminNewTime(job.time)
                            }}
                            className="btn btn-secondary"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            📅 Reschedule
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCancellingJob(job)
                              setAdminCancelReason('')
                            }}
                            className="btn btn-secondary"
                            style={{ fontSize: '11px', padding: '4px 10px', color: '#f87171' }}
                          >
                            🛑 Cancel Order
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Job Details Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div ref={detailsRef} className="premium-card">
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Job Site Details Inspector</h2>

            {selectedBooking ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={adminBadgeStyle(selectedBooking.adminStatus || selectedBooking.status, selectedBooking.status)}>
                    {selectedBooking.adminStatus || selectedBooking.status}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                    {selectedBooking.service}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 700, marginTop: '4px' }}>
                    Est. Value: ${selectedBooking.depositAmount || 0}
                  </div>
                </div>

                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Client Name:</strong>{' '}
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedBooking.customerName}</span>
                </div>

                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Client Phone / WhatsApp:</strong>{' '}
                  <a href={`tel:${selectedBooking.customerPhone}`} style={{ color: 'var(--accent-color)', textDecoration: 'underline', fontWeight: 700 }}>
                    {selectedBooking.customerPhone || 'Not provided'}
                  </a>
                </div>

                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Assigned Technician:</strong>{' '}
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedBooking.artistName}</span>{' '}
                  {selectedBooking.acknowledgedByTech ? (
                    <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}> (👁️ Acknowledged by Tech)</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}> (⏳ Unseen by Tech)</span>
                  )}
                </div>

                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Scheduled Time:</strong>{' '}
                  <span>{selectedBooking.date} at {selectedBooking.time}</span>
                </div>

                {selectedBooking.declineReason && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', padding: '14px', borderRadius: '10px', border: '1px solid #f87171', color: '#f87171' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>🚨 Declined by Technician:</strong>
                    "{selectedBooking.declineReason}"
                  </div>
                )}

                {selectedBooking.cancellationReason && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', padding: '14px', borderRadius: '10px', border: '1px solid #f87171', color: '#f87171' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>🛑 Admin Cancellation Reason:</strong>
                    "{selectedBooking.cancellationReason}"
                  </div>
                )}

                {selectedBooking.completionReport && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', padding: '14px', borderRadius: '10px', border: '1px solid #34d399', color: '#34d399' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>✅ Technician Work Report:</strong>
                    "{selectedBooking.completionReport}"
                  </div>
                )}

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Job Site Address & Specs:
                  </strong>
                  <div style={{ color: '#ffffff', lineHeight: '1.5' }}>
                    {selectedBooking.notes || 'No site specs added.'}
                  </div>
                </div>

                {/* Admin Management Controls */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {(selectedBooking.adminStatus === 'Declined by Tech' || selectedBooking.status === 'Cancelled') ? (
                    <button
                      onClick={() => handleReassignClick(selectedBooking)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                    >
                      🔄 Reassign to Tech
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setReschedulingJob(selectedBooking)
                          setAdminNewDate(selectedBooking.date)
                          setAdminNewTime(selectedBooking.time)
                        }}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                      >
                        📅 Reschedule Order
                      </button>
                      <button
                        onClick={() => {
                          setCancellingJob(selectedBooking)
                          setAdminCancelReason('')
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '10px 14px', fontSize: '13px', color: '#f87171' }}
                      >
                        🛑 Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Select a job order from the list to inspect site specs, decline notes, and technician statuses.</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── ADMIN RESCHEDULE MODAL ────────────────────────────── */}
      {reschedulingJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <form
            onSubmit={handleAdminConfirmReschedule}
            className="premium-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-color)' }}>
              📅 Reschedule Job Order
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Update schedule for <strong>{reschedulingJob.customerName}</strong> ({reschedulingJob.service}). Existing order record will be updated cleanly.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  New Date *
                </label>
                <input
                  type="date"
                  value={adminNewDate}
                  onChange={(e) => setAdminNewDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  New Time *
                </label>
                <select
                  value={adminNewTime}
                  onChange={(e) => setAdminNewTime(e.target.value)}
                  className="form-select"
                >
                  {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '16:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Reschedule Reason / Client Consent Note
              </label>
              <input
                type="text"
                value={adminRescheduleReason}
                onChange={(e) => setAdminRescheduleReason(e.target.value)}
                placeholder="e.g. Client requested Monday morning slot"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setReschedulingJob(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700 }}
              >
                Update Schedule & Notify Tech 📅
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── ADMIN CANCEL MODAL ────────────────────────────────── */}
      {cancellingJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <form
            onSubmit={handleAdminConfirmCancel}
            className="premium-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>
              🛑 Cancel Work Order
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Are you sure you want to cancel the job order for <strong>{cancellingJob.customerName}</strong> assigned to <strong>{cancellingJob.artistName}</strong>?
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Cancellation Reason *
              </label>
              <textarea
                rows={3}
                value={adminCancelReason}
                onChange={(e) => setAdminCancelReason(e.target.value)}
                placeholder="e.g. Client called to cancel due to schedule conflict..."
                className="form-textarea"
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCancellingJob(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Keep Order Active
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Confirm Cancel & Alert Tech 🛑
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── DISPATCH / REASSIGN JOB MODAL ─────────────────────── */}
      {showDispatchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <form
            onSubmit={handleDispatchJob}
            className="premium-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                {reassignJobId ? '🔄 Reassign Job Order' : '+ Dispatch New Job Order'}
              </h2>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Client Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Janusz Kowal"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Client Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+48 123 456 789"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Service Type
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="form-select"
                >
                  {BUSINESS_CONFIG.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Job Site Address *
              </label>
              <input
                type="text"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="e.g. ul. Lipowa 14 / Apt 5, Warsaw"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Assign Technician *
                </label>
                <select
                  value={assignedTechId}
                  onChange={(e) => setAssignedTechId(e.target.value)}
                  className="form-select"
                >
                  {BUSINESS_CONFIG.artists.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.avatarEmoji} {tech.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Scheduled Date & Time
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="date"
                    value={jobDate}
                    onChange={(e) => setJobDate(e.target.value)}
                    className="form-input"
                    style={{ padding: '8px' }}
                  />
                  <select
                    value={jobTime}
                    onChange={(e) => setJobTime(e.target.value)}
                    className="form-select"
                    style={{ padding: '8px' }}
                  >
                    {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '16:00'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Required Materials & Site Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={jobNotes}
                onChange={(e) => setJobNotes(e.target.value)}
                placeholder="e.g. Bring 2x copper fittings, 10m heavy wiring..."
                className="form-textarea"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '14px', marginTop: '6px' }}>
              {reassignJobId ? 'Reassign Job to Technician 🚀' : 'Dispatch Job Order 🚀'}
            </button>
          </form>
        </div>
      )}

      {/* Watermark Footer */}
      <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Powered by NativeBooking Contractor Blueprint 🛠️
      </div>
    </div>
  )
}