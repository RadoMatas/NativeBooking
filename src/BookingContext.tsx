import { createContext, useContext, useEffect, useState } from 'react'
import { db, isFirebaseEnabled } from './firebase'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore'

export type Booking = {
  id: string
  ownerEmail: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: string
  date: string
  time: string
  status: string
  adminStatus?: string | null
  cancelledBy?: 'customer' | 'admin' | null
  cancellationReason?: string | null
  notes?: string | null
  originalDate?: string | null
  originalTime?: string | null
  requestedDate?: string | null
  requestedTime?: string | null
  customerNotification?: string | null
  customerNotificationType?: 'success' | 'warning' | 'error' | null
  adminNotesForCustomer?: string | null
  internalAdminNotes?: string | null
  priceCharged?: number | null
  artistId?: string | null
  artistName?: string | null
  depositAmount?: number | null
  depositPaid?: boolean | null
}

type AdminNotification = {
  message: string
  timestamp: string
}

type BookingContextType = {
  bookings: Booking[]
  notifications: AdminNotification[]
  addNotification: (message: string) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updatedBooking: Booking) => void
  updateBookingStatus: (id: string, newStatus: string, reason?: string) => void
  acknowledgeBooking: (id: string) => void
  cancelBooking: (id: string, reason?: string) => void
  clearBookings: () => void
  declineReschedule: (id: string) => void
  acceptReschedule: (id: string) => void
  resetBookings: () => void
  clearCustomerNotification: (id: string) => void
  updateSessionDetails: (
    id: string,
    details: { priceCharged: number; adminNotesForCustomer: string; internalAdminNotes: string }
  ) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const getPastDate = (daysAgo: number) => {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString().split('T')[0]
  }

  const getFutureDate = (daysAhead: number) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    return d.toISOString().split('T')[0]
  }

  const INITIAL_BOOKINGS: Booking[] = [
    {
      id: "mock-completed-1",
      ownerEmail: "customer@test.com",
      customerName: "Jane Doe",
      customerEmail: "customer@test.com",
      customerPhone: "+48 555 123 456",
      service: "Tattoo Session",
      date: getPastDate(3),
      time: "10:00",
      status: "Confirmed",
      notes: "First tattoo, wants a small flower on her wrist.",
      priceCharged: 120,
      adminNotesForCustomer: "Keep wrapped for 2 hours, wash gently with warm water, apply cream 3x daily.",
      internalAdminNotes: "Client sat very well. Skin accepted ink easily. Follow up on colors.",
      artistId: "marcel",
      artistName: "Marcel",
      depositAmount: 24,
      depositPaid: true
    },
    {
      id: "mock-upcoming-1",
      ownerEmail: "customer@test.com",
      customerName: "Jane Doe",
      customerEmail: "customer@test.com",
      customerPhone: "+48 555 123 456",
      service: "Laser Removal Session",
      date: getFutureDate(2),
      time: "14:00",
      status: "Confirmed",
      notes: "Wants to discuss laser fading options.",
      artistId: "konrad",
      artistName: "Konrad",
      depositAmount: 16,
      depositPaid: true
    },
    {
      id: "mock-pending-1",
      ownerEmail: "customer@test.com",
      customerName: "Jane Doe",
      customerEmail: "customer@test.com",
      customerPhone: "+48 555 123 456",
      service: "Permanent Make-up",
      date: getFutureDate(5),
      time: "11:00",
      status: "Pending",
      notes: "Scheduled session following design approval.",
      adminStatus: "New",
      artistId: "marcel",
      artistName: "Marcel",
      depositAmount: 40,
      depositPaid: false
    }
  ]

  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (isFirebaseEnabled) return []
    const saved = localStorage.getItem('bookings')
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS
  })

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    if (isFirebaseEnabled) return []
    const saved = localStorage.getItem('notifications')
    return saved ? JSON.parse(saved) : []
  })

  // Real-time Firebase Sync
  useEffect(() => {
    if (!isFirebaseEnabled) return

    const unsubscribeBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const updatedBookings: Booking[] = []
      snapshot.forEach((doc) => {
        updatedBookings.push(doc.data() as Booking)
      })
      setBookings(updatedBookings)
    })

    const unsubscribeNotifications = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const updatedNotifications: AdminNotification[] = []
      snapshot.forEach((doc) => {
        updatedNotifications.push(doc.data() as AdminNotification)
      })
      // Sort notifications newest first
      updatedNotifications.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setNotifications(updatedNotifications)
    })

    return () => {
      unsubscribeBookings()
      unsubscribeNotifications()
    }
  }, [])

  useEffect(() => {
    if (!isFirebaseEnabled) {
      localStorage.setItem('bookings', JSON.stringify(bookings))
    }
  }, [bookings])

  useEffect(() => {
    if (!isFirebaseEnabled) {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  useEffect(() => {
    if (isFirebaseEnabled) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'bookings') {
        const updatedBookings = event.newValue ? JSON.parse(event.newValue) : []
        setBookings(updatedBookings)
      }

      if (event.key === 'notifications') {
        const updatedNotifications = event.newValue ? JSON.parse(event.newValue) : []
        setNotifications(updatedNotifications)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const addBooking = async (booking: Booking) => {
    const bookingWithId = {
      ...booking,
      id: booking.id || crypto.randomUUID(),
      status: booking.status || 'Pending',
      adminStatus: booking.adminStatus || 'New',
      cancelledBy: undefined,
      customerNotification: undefined,
      customerNotificationType: undefined,
    }

    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'bookings', bookingWithId.id), bookingWithId)
      } catch (err) {
        console.error('Failed to add booking to Firestore:', err)
      }
    } else {
      setBookings((prev) => [bookingWithId, ...prev])
    }
  }

  const resetBookings = async () => {
    if (isFirebaseEnabled) {
      try {
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
        const batch = writeBatch(db)
        bookingsSnapshot.forEach((doc) => batch.delete(doc.ref))

        INITIAL_BOOKINGS.forEach((booking) => {
          batch.set(doc(db, 'bookings', booking.id), booking)
        })
        await batch.commit()
      } catch (err) {
        console.error('Failed to reset Firestore bookings:', err)
      }
    } else {
      setBookings(INITIAL_BOOKINGS)
    }
  }

  const addNotification = async (message: string) => {
    const newNotif = {
      message,
      timestamp: new Date().toLocaleString(),
    }

    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'notifications', crypto.randomUUID()), newNotif)
      } catch (err) {
        console.error('Failed to add notification to Firestore:', err)
      }
    } else {
      setNotifications((prev) => [newNotif, ...prev])
    }
  }

  const updateBooking = async (id: string, updatedBooking: Booking) => {
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'bookings', id), updatedBooking)
      } catch (err) {
        console.error('Failed to update Firestore booking:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      )
    }
  }

  const updateBookingStatus = async (id: string, newStatus: string, reason?: string) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), {
          status: newStatus,
          adminStatus:
            newStatus === 'Confirmed'
              ? null
              : newStatus === 'Cancelled'
              ? 'Acknowledged'
              : undefined,
          cancelledBy: newStatus === 'Cancelled' ? 'admin' : null,
          cancellationReason: newStatus === 'Cancelled' ? (reason || null) : null,
          customerNotification:
            newStatus === 'Confirmed'
              ? 'Your appointment was confirmed.'
              : newStatus === 'Cancelled'
              ? `Your booking was cancelled by admin${reason ? `: ${reason}` : '.'}`
              : null,
          customerNotificationType:
            newStatus === 'Confirmed'
              ? 'success'
              : newStatus === 'Cancelled'
              ? 'error'
              : null,
        })
      } catch (err) {
        console.error('Failed to update booking status in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: newStatus,
                adminStatus:
                  newStatus === 'Confirmed'
                    ? undefined
                    : newStatus === 'Cancelled'
                    ? 'Acknowledged'
                    : booking.adminStatus,
                cancelledBy: (newStatus === 'Cancelled' ? 'admin' : undefined) as Booking['cancelledBy'],
                cancellationReason: newStatus === 'Cancelled' ? reason : undefined,
                customerNotification:
                  newStatus === 'Confirmed'
                    ? 'Your appointment was confirmed.'
                    : newStatus === 'Cancelled'
                    ? `Your booking was cancelled by admin${reason ? `: ${reason}` : '.'}`
                    : undefined,
                customerNotificationType: (newStatus === 'Confirmed'
                  ? 'success'
                  : newStatus === 'Cancelled'
                  ? 'error'
                  : undefined) as Booking['customerNotificationType'],
              }
            : booking
        )
      )
    }
  }

  const acceptReschedule = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    const updates: Partial<Booking> = {
      date: booking.requestedDate || booking.date,
      time: booking.requestedTime || booking.time,
      status: 'Confirmed',
      adminStatus: null,
      customerNotification: `Your reschedule request was accepted. Your appointment is now confirmed for ${
        booking.requestedDate || booking.date
      } at ${booking.requestedTime || booking.time}.`,
      customerNotificationType: 'success',
      originalDate: null,
      originalTime: null,
      requestedDate: null,
      requestedTime: null,
    }

    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), updates)
      } catch (err) {
        console.error('Failed to accept reschedule in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      )
    }
  }

  const declineReschedule = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    const updates: Partial<Booking> = {
      date: booking.originalDate || booking.date,
      time: booking.originalTime || booking.time,
      status: 'Confirmed',
      adminStatus: null,
      customerNotification: `Your reschedule request was declined. Your original appointment on ${
        booking.originalDate || booking.date
      } at ${booking.originalTime || booking.time} is still confirmed. You can keep this booking or cancel it if it no longer works for you.`,
      customerNotificationType: 'warning',
      originalDate: null,
      originalTime: null,
      requestedDate: null,
      requestedTime: null,
    }

    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), updates)
      } catch (err) {
        console.error('Failed to decline reschedule in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      )
    }
  }

  const acknowledgeBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), {
          adminStatus: booking.status === 'Cancelled' ? 'Acknowledged' : booking.adminStatus,
        })
      } catch (err) {
        console.error('Failed to acknowledge booking in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                adminStatus: b.status === 'Cancelled' ? 'Acknowledged' : b.adminStatus,
              }
            : b
        )
      )
    }
  }

  const cancelBooking = async (id: string, reason?: string) => {
    const updates: Partial<Booking> = {
      status: 'Cancelled',
      adminStatus: 'Needs Action',
      cancelledBy: 'customer',
      cancellationReason: reason || null,
      customerNotification: 'Your appointment was cancelled.',
      customerNotificationType: 'error',
      requestedDate: null,
      requestedTime: null,
    }

    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), updates)
      } catch (err) {
        console.error('Failed to cancel booking in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      )
    }
  }

  const clearBookings = async () => {
    if (isFirebaseEnabled) {
      try {
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
        const notificationsSnapshot = await getDocs(collection(db, 'notifications'))

        const batch = writeBatch(db)
        bookingsSnapshot.forEach((doc) => batch.delete(doc.ref))
        notificationsSnapshot.forEach((doc) => batch.delete(doc.ref))
        await batch.commit()
      } catch (err) {
        console.error('Failed to clear Firestore database:', err)
      }
    } else {
      setBookings([])
      setNotifications([])
      localStorage.removeItem('bookings')
      localStorage.removeItem('notifications')
    }
  }

  const clearCustomerNotification = async (id: string) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), {
          customerNotification: null,
          customerNotificationType: null,
        })
      } catch (err) {
        console.error('Failed to clear customer notification in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                customerNotification: undefined,
                customerNotificationType: undefined,
              }
            : booking
        )
      )
    }
  }

  const updateSessionDetails = async (
    id: string,
    details: { priceCharged: number; adminNotesForCustomer: string; internalAdminNotes: string }
  ) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'bookings', id), {
          priceCharged: details.priceCharged,
          adminNotesForCustomer: details.adminNotesForCustomer,
          internalAdminNotes: details.internalAdminNotes,
        })
      } catch (err) {
        console.error('Failed to update session details in Firestore:', err)
      }
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                priceCharged: details.priceCharged,
                adminNotesForCustomer: details.adminNotesForCustomer,
                internalAdminNotes: details.internalAdminNotes,
              }
            : booking
        )
      )
    }
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        notifications,
        addNotification,
        addBooking,
        updateBooking,
        updateBookingStatus,
        acknowledgeBooking,
        cancelBooking,
        clearBookings,
        declineReschedule,
        acceptReschedule,
        resetBookings,
        clearCustomerNotification,
        updateSessionDetails,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error('useBooking must be used inside BookingProvider')
  }

  return context
}