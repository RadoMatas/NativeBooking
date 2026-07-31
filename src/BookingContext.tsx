import { createContext, useContext, useEffect, useState } from 'react'
import { safeCollection, safeDoc, safeSetDoc } from './firestoreHelpers'
import { db, isFirebaseEnabled } from './firebase'
import { BUSINESS_CONFIG, type Artist } from './businessConfig'
import {
  collection,
  onSnapshot,
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
  isBlocked?: boolean | null
  blockReason?: string | null
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
  blockSlot: (artistId: string, date: string, time: string, reason: string) => void
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
      id: "demo-completed-1",
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
      id: "demo-upcoming-1",
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
      id: "demo-pending-1",
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

  const bookingsKey = BUSINESS_CONFIG.dbPrefix ? `${BUSINESS_CONFIG.dbPrefix}_bookings` : 'bookings'
  const notificationsKey = BUSINESS_CONFIG.dbPrefix ? `${BUSINESS_CONFIG.dbPrefix}_notifications` : 'notifications'

  const bookingsCollectionName = BUSINESS_CONFIG.dbPrefix ? `${BUSINESS_CONFIG.dbPrefix}_bookings` : 'bookings'
  const notificationsCollectionName = BUSINESS_CONFIG.dbPrefix ? `${BUSINESS_CONFIG.dbPrefix}_notifications` : 'notifications'

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(bookingsKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {
        console.error(e)
      }
    }
    return INITIAL_BOOKINGS
  })

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem(notificationsKey)
    return saved ? JSON.parse(saved) : []
  })

  // Real-time Firebase Sync
  // Sync with Firestore when database is initialized
  useEffect(() => {
    if (!db) return

    const unsubscribeBookings = onSnapshot(
      safeCollection(bookingsCollectionName),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db)
            INITIAL_BOOKINGS.forEach((booking) => {
              batch.set(safeDoc(bookingsCollectionName, booking.id), booking)
            })
            await batch.commit()
            setBookings(INITIAL_BOOKINGS)
          } catch (err) {
            console.error('Failed to auto-seed initial bookings to Firestore:', err)
          }
          return
        }

        const updatedBookings: Booking[] = []
        snapshot.forEach((doc) => {
          updatedBookings.push(doc.data() as Booking)
        })
        setBookings(updatedBookings)
      },
      (err) => {
        console.warn('Firestore onSnapshot error (using local storage fallback):', err)
      }
    )

    const unsubscribeNotifications = onSnapshot(
      safeCollection(notificationsCollectionName),
      (snapshot) => {
        const updatedNotifications: AdminNotification[] = []
        snapshot.forEach((doc) => {
          updatedNotifications.push(doc.data() as AdminNotification)
        })
        // Sort notifications newest first
        updatedNotifications.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        if (updatedNotifications.length > 0) {
          setNotifications(updatedNotifications)
          localStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications))
        }
      },
      (err) => {
        console.warn('Firestore notifications error:', err)
      }
    )

    return () => {
      unsubscribeBookings()
      unsubscribeNotifications()
    }
  }, [])

  // ⚡ Live Instant Multi-Tab Broadcast Channel (Real-time sync without page refresh)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return

    const channel = new BroadcastChannel('nativebooking_live_sync')
    channel.onmessage = (event) => {
      if (event.data?.type === 'BOOKINGS_UPDATED' && Array.isArray(event.data.payload)) {
        setBookings((current) => {
          // Keep new local bookings if missing from broadcast payload
          const merged = [...event.data.payload]
          current.forEach((b) => {
            if (!merged.some((m) => m.id === b.id)) {
              merged.unshift(b)
            }
          })
          return merged
        })
      }
      if (event.data?.type === 'NOTIFICATIONS_UPDATED' && Array.isArray(event.data.payload)) {
        setNotifications(event.data.payload)
      }
    }

    return () => {
      channel.close()
    }
  }, [])

  const broadcastUpdate = (type: string, payload: any) => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('nativebooking_live_sync')
        channel.postMessage({ type, payload })
        channel.close()
      } catch (err) {
        console.warn('BroadcastChannel sync error:', err)
      }
    }
  }

  useEffect(() => {
    localStorage.setItem(bookingsKey, JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem(notificationsKey, JSON.stringify(notifications))
  }, [notifications])

  const addBooking = async (booking: Booking) => {
    const bookingWithId: Booking = {
      ...booking,
      id: booking.id || crypto.randomUUID(),
      status: booking.status || 'Pending',
      adminStatus: booking.adminStatus || 'New',
    }

    setBookings((prev) => {
      const updated = [bookingWithId, ...prev.filter((b) => b.id !== bookingWithId.id)]
      localStorage.setItem(bookingsKey, JSON.stringify(updated))
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        const cleanData = JSON.parse(JSON.stringify(bookingWithId))
        await safeSetDoc(safeDoc(bookingsCollectionName, bookingWithId.id), cleanData)
      } catch (err) {
        console.error('Failed to add booking to Firestore:', err)
      }
    }
  }

  const resetBookings = async () => {
    setBookings(INITIAL_BOOKINGS)
    setNotifications([])
    localStorage.setItem(bookingsKey, JSON.stringify(INITIAL_BOOKINGS))
    localStorage.removeItem(notificationsKey)

    if (isFirebaseEnabled) {
      try {
        const bookingsSnapshot = await getDocs(collection(db, bookingsCollectionName))
        const notificationsSnapshot = await getDocs(collection(db, notificationsCollectionName))

        const batch = writeBatch(db)
        bookingsSnapshot.forEach((doc) => batch.delete(doc.ref))
        notificationsSnapshot.forEach((doc) => batch.delete(doc.ref))

        INITIAL_BOOKINGS.forEach((booking) => {
          batch.set(safeDoc(bookingsCollectionName, booking.id), booking)
        })
        await batch.commit()
      } catch (err) {
        console.error('Failed to reset Firestore bookings:', err)
      }
    }
  }

  const addNotification = async (message: string) => {
    const newNotif = {
      message,
      timestamp: new Date().toLocaleString(),
    }

    if (isFirebaseEnabled) {
      try {
        await safeSetDoc(safeDoc(notificationsCollectionName, crypto.randomUUID()), newNotif)
      } catch (err) {
        console.error('Failed to add notification to Firestore:', err)
      }
    } else {
      setNotifications((prev) => {
        const updated = [newNotif, ...prev]
        broadcastUpdate('NOTIFICATIONS_UPDATED', updated)
        return updated
      })
    }
  }

  const updateBooking = async (id: string, updatedBooking: Booking) => {
    const cleanData = JSON.parse(JSON.stringify(updatedBooking))
    setBookings((prev) => {
      const updated = prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        await safeSetDoc(safeDoc(bookingsCollectionName, id), cleanData)
      } catch (err) {
        console.error('Failed to update Firestore booking:', err)
      }
    }
  }

  const updateBookingStatus = async (id: string, newStatus: string, reason?: string) => {
    const updatePayload: Record<string, any> = {
      status: newStatus,
      adminStatus:
        newStatus === 'Confirmed'
          ? null
          : newStatus === 'Cancelled'
          ? 'Acknowledged'
          : null,
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
    }

    setBookings((prev) => {
      const updated = prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              ...updatePayload,
            }
          : booking
      )
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        const cleanPayload = JSON.parse(JSON.stringify(updatePayload))
        await safeSetDoc(safeDoc(bookingsCollectionName, id), cleanPayload)
      } catch (err) {
        console.error('Failed to update booking status in Firestore:', err)
      }
    }
  }

  const acceptReschedule = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    const updates: Record<string, any> = {
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

    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        const cleanUpdates = JSON.parse(JSON.stringify(updates))
        await safeSetDoc(safeDoc(bookingsCollectionName, id), cleanUpdates)
      } catch (err) {
        console.error('Failed to accept reschedule in Firestore:', err)
      }
    }
  }

  const declineReschedule = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    const updates: Record<string, any> = {
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

    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        const cleanUpdates = JSON.parse(JSON.stringify(updates))
        await safeSetDoc(safeDoc(bookingsCollectionName, id), cleanUpdates)
      } catch (err) {
        console.error('Failed to decline reschedule in Firestore:', err)
      }
    }
  }

  const acknowledgeBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    const updates: Record<string, any> = {
      adminStatus: booking.status === 'Cancelled' ? 'Acknowledged' : (booking.adminStatus || null),
    }

    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === id
          ? {
              ...b,
              adminStatus: b.status === 'Cancelled' ? 'Acknowledged' : b.adminStatus,
            }
          : b
      )
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        const cleanUpdates = JSON.parse(JSON.stringify(updates))
        await safeSetDoc(safeDoc(bookingsCollectionName, id), cleanUpdates)
      } catch (err) {
        console.error('Failed to acknowledge booking in Firestore:', err)
      }
    }
  }

  const cancelBooking = async (id: string, reason?: string) => {
    const updates: Record<string, any> = {
      status: 'Cancelled',
      adminStatus: 'Needs Action',
      cancelledBy: 'customer',
      cancellationReason: reason || null,
      customerNotification: 'Your appointment was cancelled.',
      customerNotificationType: 'error',
      requestedDate: null,
      requestedTime: null,
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )

    if (isFirebaseEnabled) {
      try {
        const cleanUpdates = JSON.parse(JSON.stringify(updates))
        await safeSetDoc(safeDoc(bookingsCollectionName, id), cleanUpdates)
      } catch (err) {
        console.error('Failed to cancel booking in Firestore:', err)
      }
    }
  }

  const clearBookings = async () => {
    setBookings([])
    setNotifications([])
    localStorage.removeItem(bookingsKey)
    localStorage.removeItem(notificationsKey)

    if (isFirebaseEnabled) {
      try {
        const bookingsSnapshot = await getDocs(collection(db, bookingsCollectionName))
        const notificationsSnapshot = await getDocs(collection(db, notificationsCollectionName))

        const batch = writeBatch(db)
        bookingsSnapshot.forEach((doc) => batch.delete(doc.ref))
        notificationsSnapshot.forEach((doc) => batch.delete(doc.ref))
        await batch.commit()
      } catch (err) {
        console.error('Failed to clear Firestore database:', err)
      }
    }
  }

  const clearCustomerNotification = async (id: string) => {
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

    if (isFirebaseEnabled) {
      try {
        await safeSetDoc(safeDoc(bookingsCollectionName, id), {
            customerNotification: null,
            customerNotificationType: null,
          })
      } catch (err) {
        console.error('Failed to clear customer notification in Firestore:', err)
      }
    }
  }

  const updateSessionDetails = async (
    id: string,
    details: { priceCharged: number; adminNotesForCustomer: string; internalAdminNotes: string }
  ) => {
    const booking = bookings.find((b) => b.id === id)
    const notifMsg = `Your artist has updated the aftercare instructions & notes for your ${booking?.service || 'session'} on ${booking?.date || 'past date'}.`

    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === id
          ? {
              ...b,
              priceCharged: details.priceCharged,
              adminNotesForCustomer: details.adminNotesForCustomer,
              internalAdminNotes: details.internalAdminNotes,
              customerNotification: notifMsg,
              customerNotificationType: 'success' as const,
            }
          : b
      )
      broadcastUpdate('BOOKINGS_UPDATED', updated)
      return updated
    })

    if (isFirebaseEnabled) {
      try {
        await safeSetDoc(safeDoc(bookingsCollectionName, id), {
          priceCharged: details.priceCharged,
          adminNotesForCustomer: details.adminNotesForCustomer,
          internalAdminNotes: details.internalAdminNotes,
          customerNotification: notifMsg,
          customerNotificationType: 'success',
        })
      } catch (err) {
        console.error('Failed to update session details in Firestore:', err)
      }
    }
  }

  const blockSlot = async (artistId: string, date: string, time: string, reason: string) => {
    const matchedArtist = BUSINESS_CONFIG.artists.find((a: Artist) => a.id === artistId)
    const blockBooking: Booking = {
      id: `block-${crypto.randomUUID()}`,
      ownerEmail: 'admin@system.com',
      customerName: `Blocked: ${reason}`,
      customerEmail: 'admin@system.com',
      customerPhone: 'N/A',
      service: `[Blocked Slot: ${reason}]`,
      artistId,
      artistName: matchedArtist ? matchedArtist.name : 'Staff',
      date,
      time,
      status: 'Blocked',
      adminStatus: 'Blocked',
      isBlocked: true,
      blockReason: reason,
    }

    addBooking(blockBooking)
    addNotification(`Blocked slot for ${matchedArtist ? matchedArtist.name : 'Staff'} on ${date} at ${time} (${reason})`)
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
        blockSlot,
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