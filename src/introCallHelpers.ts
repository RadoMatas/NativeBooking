import { safeCollection, safeDoc, safeSetDoc } from './firestoreHelpers'
import { getDocs, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export interface IntroCallBooking {
  id: string
  name: string
  email: string
  phone: string
  industry: string
  notes?: string
  date: string       // YYYY-MM-DD
  timeSlot: string   // e.g. "14:00"
  status: 'pending' | 'confirmed' | 'declined'
  createdAt: string  // ISO string
}

const LOCAL_STORAGE_KEY = 'nativebooking_intro_calls'

export const getIntroCallsLocal = (): IntroCallBooking[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const saveIntroCallsLocal = (calls: IntroCallBooking[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(calls))
  } catch (err) {
    console.error('Failed to save intro calls to localStorage', err)
  }
}

export const fetchIntroCalls = async (): Promise<IntroCallBooking[]> => {
  const localCalls = getIntroCallsLocal()
  if (!db) return localCalls

  try {
    const colRef = safeCollection('intro_call_bookings')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    const remoteCalls: IntroCallBooking[] = []
    snap.forEach((docSnap) => {
      remoteCalls.push(docSnap.data() as IntroCallBooking)
    })

    // Merge remote with local to ensure offline test items aren't lost
    const mergedMap = new Map<string, IntroCallBooking>()
    localCalls.forEach((c) => mergedMap.set(c.id, c))
    remoteCalls.forEach((c) => mergedMap.set(c.id, c))
    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    saveIntroCallsLocal(merged)
    return merged
  } catch (err) {
    console.warn('Firestore fetch failed, returning local storage intro calls', err)
    return localCalls
  }
}

export const submitIntroCallRequest = async (
  booking: Omit<IntroCallBooking, 'id' | 'status' | 'createdAt'>
): Promise<IntroCallBooking> => {
  const newCall: IntroCallBooking = {
    ...booking,
    id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  // 1. Save to local storage
  const current = getIntroCallsLocal()
  const updated = [newCall, ...current]
  saveIntroCallsLocal(updated)

  // 2. Try Firestore
  if (db) {
    try {
      const docRef = safeDoc('intro_call_bookings', newCall.id)
      await safeSetDoc(docRef, newCall)
    } catch (err) {
      console.warn('Firestore setDoc failed for intro call, saved locally', err)
    }
  }

  return newCall
}

export const updateIntroCallStatus = async (
  id: string,
  status: 'confirmed' | 'declined'
): Promise<void> => {
  // Update local storage
  const current = getIntroCallsLocal()
  const updated = current.map((c) => (c.id === id ? { ...c, status } : c))
  saveIntroCallsLocal(updated)

  // Update Firestore
  if (db) {
    try {
      const docRef = safeDoc('intro_call_bookings', id)
      await safeSetDoc(docRef, { status }, { merge: true })
    } catch (err) {
      console.warn('Firestore update failed for intro call status', err)
    }
  }
}

/**
 * Generate a 1-tap Google Calendar event creation URL for the admin
 */
export const generateGoogleCalendarUrl = (call: IntroCallBooking): string => {
  const title = encodeURIComponent(`NativeBooking Call: ${call.name} (${call.industry})`)
  
  // Format dates: YYYYMMDDTHHmmSSZ
  const [year, month, day] = call.date.split('-')
  const [hour, minute] = call.timeSlot.split(':')
  
  const startHour = parseInt(hour, 10)
  const startMin = parseInt(minute, 10)
  
  const startDate = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), startHour, startMin))
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // 30 mins

  const toGCalIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')

  const datesStr = `${toGCalIso(startDate)}/${toGCalIso(endDate)}`
  
  const detailsStr = encodeURIComponent(
    `NativeBooking Discovery Call\n\nClient Name: ${call.name}\nEmail: ${call.email}\nPhone/WhatsApp: ${call.phone}\nIndustry: ${call.industry}\nNotes: ${call.notes || 'None'}`
  )
  
  const guestEmail = encodeURIComponent(call.email)

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesStr}&details=${detailsStr}&location=${locationStr}&add=${guestEmail}&authuser=antony@nativebooking.co`
}
