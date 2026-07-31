import { Navigate, useNavigate } from 'react-router-dom'
import { useRef, useMemo, useState } from 'react'
import { currentUserRole, logout } from '../auth'
import { useBooking } from '../BookingContext'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import InkTypewriterHeader from '../components/InkTypewriterHeader'
import { CalendarIcon, ClockIcon, UserIcon, AlertIcon, CheckIcon, ContractorIcon, MapPinIcon, RefreshCwIcon, EyeIcon, XCircleIcon, SendIcon, SparklesIcon } from '../components/ui/Icons'

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

  // Strict Technician Conflict Validation: checks if target technician ALREADY has an active job at same Date & Time!
  const dispatchConflict = useMemo(() => {
    if (!showDispatchModal) return null
    return bookings.find((b) => {
      if (b.id === reassignJobId) return false // ignore current job being reassigned
      if (b.status === 'Cancelled' || b.adminStatus === 'Declined by Tech') return false // cancelled slots are free
      return b.artistId === assignedTechId && b.date === jobDate && b.time === jobTime
    }) || null
  }, [showDispatchModal, reassignJobId, assignedTechId, jobDate, jobTime, bookings])

  const rescheduleConflict = useMemo(() => {
    if (!reschedulingJob) return null
    return bookings.find((b) => {
      if (b.id === reschedulingJob.id) return false
      if (b.status === 'Cancelled' || b.adminStatus === 'Declined by Tech') return false
      return b.artistId === reschedulingJob.artistId && b.date === adminNewDate && b.time === adminNewTime
    }) || null
  }, [reschedulingJob, adminNewDate, adminNewTime, bookings])

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

  // Top-level 12-hour AM/PM date parsing and auto-completion for past dates
  const getBookingDateTime = (booking: any) => {
    if (!booking || !booking.date) return new Date()
    const [year, month, day] = booking.date.split('-').map(Number)
    let hours = 0
    let minutes = 0

    if (booking.time) {
      const parts = booking.time.trim().split(' ')
      const [rawHours, rawMinutes] = parts[0].split(':').map(Number)
      hours = rawHours
      minutes = rawMinutes || 0

      if (parts[1]) {
        const modifier = parts[1].toUpperCase()
        if (modifier === 'PM' && hours < 12) hours += 12
        if (modifier === 'AM' && hours === 12) hours = 0
      }
    }

    return new Date(year, month - 1, day, hours, minutes)
  }

  const getDisplayStatus = (booking: any) => {
    if (!booking) return 'Pending'

    if (booking.status === 'Cancelled' || booking.adminStatus === 'Declined by Tech') {
      return 'Cancelled'
    }

    const bookingDateTime = getBookingDateTime(booking)
    const now = new Date()
    if (bookingDateTime < now) {
      return 'Completed'
    }

    if (
      booking.status === 'Pending' ||
      booking.adminStatus === 'New' ||
      booking.adminStatus === 'Reschedule Requested' ||
      booking.adminStatus === 'Needs Action'
    ) {
      return 'Pending'
    }

    if (booking.status === 'Confirmed') {
      return 'Upcoming'
    }

    return booking.status || 'Pending'
  }

  // Count Badges for Filters
  const counts = useMemo(() => {
    const assigned = bookings.filter((b) => b.adminStatus === 'Assigned' && b.status !== 'Cancelled' && getDisplayStatus(b) !== 'Completed').length
    const acknowledged = bookings.filter((b) => b.adminStatus === 'Acknowledged' && b.status !== 'Cancelled' && getDisplayStatus(b) !== 'Completed').length
    const inProgress = bookings.filter((b) => b.adminStatus === 'In Progress' && b.status !== 'Cancelled' && getDisplayStatus(b) !== 'Completed').length
    const completed = bookings.filter((b) => getDisplayStatus(b) === 'Completed' || b.status === 'Completed' || b.adminStatus === 'Completed').length
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
    const today = new Date().toISOString().split('T')[0]

    if (!clientName || !siteAddress || !clientPhone) {
      alert('Please enter client name, phone, and job site address.')
      return
    }

    if (jobDate < today) {
      alert(`Invalid Date: You cannot schedule or reassign a job order to a past date (${jobDate}). Please select today (${today}) or a future date.`)
      return
    }

    if (dispatchConflict) {
      alert(`Conflict: Technician is already booked for ${dispatchConflict.service} at ${jobTime} on ${jobDate}. Please select another slot.`)
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
        addNotification(`🔄 REASSIGNED: Admin reassigned Job Order for ${clientName} to Technician ${techObj?.name} for ${jobDate} at ${jobTime}`)
      }
      setReassignJobId(null)
    } else {
      // Create new job
      const notifMsg = `🚨 NEW DISPATCH ASSIGNMENT: You have been assigned a new job (${serviceObj?.name || 'Service'}) scheduled for ${jobDate} at ${jobTime}.`
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
        customerNotification: notifMsg,
        customerNotificationType: 'success',
      })
      addNotification(`🛠️ DISPATCHED: New Job Order for ${clientName} assigned to Technician ${techObj?.name} for ${jobDate} at ${jobTime}`)
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

    const today = new Date().toISOString().split('T')[0]
    if (adminNewDate < today) {
      alert(`Invalid Date: You cannot reschedule a job order to a past date (${adminNewDate}). Please select today (${today}) or a future date.`)
      return
    }

    if (rescheduleConflict) {
      alert(`Conflict: Technician is already booked for ${rescheduleConflict.service} at ${adminNewTime} on ${adminNewDate}.`)
      return
    }

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
              <MapPinIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{BUSINESS_CONFIG.address}
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
            style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ContractorIcon size={16} /> + Dispatch New Job Order
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
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertIcon size={20} style={{ color: '#f87171' }} />
              </div>
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={14} style={{ color: '#f59e0b' }} /> <strong>Initial Date & Time:</strong> {job.date} at {job.time}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><UserIcon size={14} style={{ color: '#f59e0b' }} /> <strong>Assigned Tech:</strong> {job.artistName}</span>
                  </div>

                  <div style={{ marginTop: '6px', color: '#f87171', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertIcon size={14} /> <strong>Decline Reason:</strong> "{job.declineReason || 'No reason specified'}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleInspectJob(job.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                  >
                    Inspect Order Details
                  </button>
                  <button
                    onClick={() => handleReassignClick(job)}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    Reassign Job Order →
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
            { key: 'Assigned', label: `Assigned / Unseen (${counts.assigned})` },
            { key: 'Acknowledged', label: `Acknowledged (${counts.acknowledged})` },
            { key: 'In Progress', label: `In Progress (${counts.inProgress})` },
            { key: 'Completed', label: `Completed (${counts.completed})` },
            { key: 'Declined / Cancelled', label: `Declined / Cancelled (${counts.declinedCancelled})` },
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
                          {isDeclined ? 'DECLINED BY TECH' : job.adminStatus || job.status}
                        </span>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                          {job.service}
                        </h3>
                      </div>
                      {/* High-Visibility Date & Time Badge */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '8px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CalendarIcon size={12} /> {job.date}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--accent-color)', background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.45)', padding: '4px 10px', borderRadius: '8px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ClockIcon size={12} /> {job.time}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>
                        <strong>Client:</strong> {job.customerName || 'Client'} ({job.customerPhone || 'No Phone'})
                      </div>
                      <div>
                        <strong>Technician:</strong> {job.artistName} {job.acknowledgedByTech ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#34d399' }}><EyeIcon size={12} /> Seen</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#f59e0b' }}><ClockIcon size={12} /> Unseen</span>}
                      </div>
                      {job.notes && (
                        <div style={{ color: '#e2e8f0', fontSize: '12px', marginTop: '4px' }}>
                          {job.notes}
                        </div>
                      )}
                      {job.declineReason && (
                        <div style={{ color: '#f87171', fontSize: '12px', fontWeight: 700, background: 'rgba(239,68,68,0.15)', padding: '6px 10px', borderRadius: '6px', marginTop: '6px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertIcon size={12} /> Declined Reason: "{job.declineReason}"</span>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><RefreshCwIcon size={12} /> Reassign Job Order</span>
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
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={12} /> Reschedule</span>
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
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircleIcon size={12} /> Cancel Order</span>
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
                    <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}> (<EyeIcon size={12} /> Acknowledged by Tech)</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}> (<ClockIcon size={12} /> Unseen by Tech)</span>
                  )}
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={13} style={{ color: '#f59e0b' }} /> Scheduled Appointment:</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={13} /> {selectedBooking.date}</span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--accent-color)', background: 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ClockIcon size={13} /> {selectedBooking.time}</span>
                  </div>
                </div>

                {selectedBooking.declineReason && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', padding: '14px', borderRadius: '10px', border: '1px solid #f87171', color: '#f87171' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><AlertIcon size={14} /> Declined by Technician:</strong>
                    "{selectedBooking.declineReason}"
                  </div>
                )}

                {selectedBooking.cancellationReason && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', padding: '14px', borderRadius: '10px', border: '1px solid #f87171', color: '#f87171' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><XCircleIcon size={14} /> Admin Cancellation Reason:</strong>
                    "{selectedBooking.cancellationReason}"
                  </div>
                )}

                {selectedBooking.completionReport && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', padding: '14px', borderRadius: '10px', border: '1px solid #34d399', color: '#34d399' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><CheckIcon size={14} /> Technician Work Report:</strong>
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
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><RefreshCwIcon size={14} /> Reassign to Tech</span>
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={14} /> Reschedule Order</span>
                      </button>
                      <button
                        onClick={() => {
                          setCancellingJob(selectedBooking)
                          setAdminCancelReason('')
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '10px 14px', fontSize: '13px', color: '#f87171' }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircleIcon size={14} /> Cancel Order</span>
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CalendarIcon size={18} /> Reschedule Job Order</span>
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Update schedule for <strong>{reschedulingJob.customerName}</strong> ({reschedulingJob.service}). Existing order record will be updated cleanly.
            </p>

            {rescheduleConflict && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #f87171', padding: '12px', borderRadius: '10px', color: '#f87171', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircleIcon size={14} /> <strong>Time Slot Conflict!</strong></span> Technician {reschedulingJob.artistName} is ALREADY booked for "{rescheduleConflict.service}" ({rescheduleConflict.customerName}) at {adminNewTime} on {adminNewDate}.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  New Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
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
                  style={{ borderColor: rescheduleConflict ? '#f87171' : undefined }}
                >
                  {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '16:00'].map((t) => {
                    const isOccupied = bookings.some(
                      (b) =>
                        b.id !== reschedulingJob.id &&
                        b.status !== 'Cancelled' &&
                        b.adminStatus !== 'Declined by Tech' &&
                        b.artistId === reschedulingJob.artistId &&
                        b.date === adminNewDate &&
                        b.time === t
                    )
                    return (
                      <option key={t} value={t} disabled={isOccupied}>
                        {t} {isOccupied ? '(⚠️ Booked)' : ''}
                      </option>
                    )
                  })}
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
                disabled={Boolean(rescheduleConflict)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, opacity: rescheduleConflict ? 0.5 : 1 }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Update Schedule & Notify Tech <CalendarIcon size={14} /></span>
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><XCircleIcon size={18} /> Cancel Work Order</span>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Confirm Cancel & Alert Tech <XCircleIcon size={14} /></span>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>{reassignJobId ? <><RefreshCwIcon size={18} /> Reassign Job Order</> : <><ContractorIcon size={18} /> + Dispatch New Job Order</>}</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {dispatchConflict && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #f87171', padding: '12px 16px', borderRadius: '12px', color: '#f87171', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircleIcon size={14} /> <strong>Time Slot Conflict!</strong></span> Technician {BUSINESS_CONFIG.artists.find((a) => a.id === assignedTechId)?.name} is ALREADY booked for <strong>"{dispatchConflict.service}"</strong> ({dispatchConflict.customerName}) at {jobTime} on {jobDate}. Please select another time slot or technician.
              </div>
            )}

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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Assign {BUSINESS_CONFIG.staffLabel} *
              </label>
              <select
                value={assignedTechId}
                onChange={(e) => setAssignedTechId(e.target.value)}
                className="form-select"
                style={{ width: '100%', padding: '10px 14px' }}
              >
                {BUSINESS_CONFIG.artists.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.avatarEmoji} {tech.name} — {tech.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Service Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={jobDate}
                  onChange={(e) => setJobDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '10px 12px', colorScheme: 'dark' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Dispatch Arrival Window *
                </label>
                <select
                  value={jobTime}
                  onChange={(e) => setJobTime(e.target.value)}
                  className="form-select"
                  style={{ width: '100%', padding: '10px 12px', borderColor: dispatchConflict ? '#f87171' : undefined }}
                  required
                >
                  {[
                    { time: '08:00', label: '🌅 Morning (08:00 - 11:00 AM)' },
                    { time: '11:00', label: '☀️ Midday (11:00 - 02:00 PM)' },
                    { time: '14:00', label: '🌇 Afternoon (02:00 - 05:00 PM)' },
                    { time: '16:00', label: '🌙 Late Dispatch (04:00 - 07:00 PM)' },
                  ].map((windowObj) => {
                    const isOccupied = bookings.some(
                      (b) =>
                        b.id !== reassignJobId &&
                        b.status !== 'Cancelled' &&
                        b.adminStatus !== 'Declined by Tech' &&
                        b.artistId === assignedTechId &&
                        b.date === jobDate &&
                        b.time === windowObj.time
                    )
                    return (
                      <option key={windowObj.time} value={windowObj.time} disabled={isOccupied}>
                        {windowObj.label} {isOccupied ? '(⚠️ Crew Dispatched)' : ''}
                      </option>
                    )
                  })}
                </select>
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

            <button
              type="submit"
              disabled={Boolean(dispatchConflict)}
              className="btn btn-primary"
              style={{ padding: '14px', fontSize: '14px', marginTop: '6px', opacity: dispatchConflict ? 0.5 : 1 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>{reassignJobId ? <><RefreshCwIcon size={14} /> Reassign Job to Technician</> : <><SendIcon size={14} /> Dispatch Job Order</>}</span>
            </button>
          </form>
        </div>
      )}

      {/* Watermark Footer */}
      <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Powered by NativeBooking Contractor Blueprint <ContractorIcon size={14} /></span>
      </div>
    </div>
  )
}