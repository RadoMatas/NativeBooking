import { auth, db, isFirebaseEnabled, googleProvider } from './firebase'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// ─── DEV-only flag: mock credentials are ONLY available in dev builds ───
const IS_DEV = import.meta.env.DEV

// Role and email are derived from auth state, not from sessionStorage alone.
// sessionStorage is used only for UI persistence across page reloads within
// the same browser tab — it is NOT a security boundary.
export let currentUserRole: 'admin' | 'customer' | null =
  (sessionStorage.getItem('currentUserRole') as 'admin' | 'customer' | null) || null

export let currentUserEmail: string | null =
  sessionStorage.getItem('currentUserEmail') || null


// ─── LOGIN ──────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<boolean> {
  // Mock login — only available in DEV builds (stripped from production by Vite)
  if (!isFirebaseEnabled && IS_DEV) {
    // Check mock user store first
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]') as Array<{email:string,password:string,role:'admin'|'customer'}>
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (user) {
      currentUserRole = user.role
      currentUserEmail = email
      sessionStorage.setItem('currentUserRole', user.role)
      sessionStorage.setItem('currentUserEmail', email)
      return true
    }
    // DEV-only demo credentials
    if (email === 'admin@test.com' && password === 'admin123') {
      currentUserRole = 'admin'
      currentUserEmail = email
      sessionStorage.setItem('currentUserRole', 'admin')
      sessionStorage.setItem('currentUserEmail', email)
      return true
    }
    if (email === 'customer@test.com' && password === 'cust123') {
      currentUserRole = 'customer'
      currentUserEmail = email
      sessionStorage.setItem('currentUserRole', 'customer')
      sessionStorage.setItem('currentUserEmail', email)
      return true
    }
    return false
  }

  // Firebase is disabled in production without config — block login
  if (!isFirebaseEnabled) {
    console.error('Firebase is not configured. Login unavailable.')
    return false
  }

  // Real Firebase login — NO auto-account-creation on failure
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await syncUserProfile(cred.user)
    return true
  } catch (error) {
    console.error('Firebase Email sign-in failed:', error)
    return false
  }
}


// ─── REGISTER ───────────────────────────────────────────────────────────
export async function register(email: string, password: string): Promise<boolean> {
  // Mock registration — only in DEV
  if (!isFirebaseEnabled && IS_DEV) {
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]') as Array<{email:string,password:string,role:'admin'|'customer'}>
    if (mockUsers.some(u => u.email === email)) {
      console.warn('Mock registration failed: email already exists')
      return false
    }
    const newUser = { email, password, role: 'customer' as const }
    mockUsers.push(newUser)
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
    currentUserRole = 'customer'
    currentUserEmail = email
    sessionStorage.setItem('currentUserRole', 'customer')
    sessionStorage.setItem('currentUserEmail', email)
    return true
  }

  if (!isFirebaseEnabled) {
    console.error('Firebase is not configured. Registration unavailable.')
    return false
  }

  // Real Firebase registration flow
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await syncUserProfile(cred.user)
    return true
  } catch (error) {
    console.error('Firebase registration failed:', error)
    return false
  }
}


// ─── GOOGLE SIGN-IN ─────────────────────────────────────────────────────
export async function loginWithGoogle(): Promise<boolean> {
  if (!isFirebaseEnabled && IS_DEV) {
    // DEV-only mock Google Sign-in
    currentUserRole = 'customer'
    currentUserEmail = 'google-customer@test.com'
    sessionStorage.setItem('currentUserRole', 'customer')
    sessionStorage.setItem('currentUserEmail', 'google-customer@test.com')
    return true
  }

  if (!isFirebaseEnabled) {
    console.error('Firebase is not configured. Google sign-in unavailable.')
    return false
  }

  try {
    const cred = await signInWithPopup(auth, googleProvider)
    await syncUserProfile(cred.user)
    return true
  } catch (error) {
    console.warn('Google signInWithPopup failed, attempting redirect:', error)
    try {
      await signInWithRedirect(auth, googleProvider)
      return true
    } catch (redirError) {
      console.error('Firebase Google sign-in failed:', redirError)
      return false
    }
  }
}


// ─── LOGOUT ─────────────────────────────────────────────────────────────
export async function logout() {
  if (isFirebaseEnabled && auth) {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('SignOut error:', err)
    }
  }

  currentUserRole = null
  currentUserEmail = null
  sessionStorage.removeItem('currentUserRole')
  sessionStorage.removeItem('currentUserEmail')
}


// ─── SYNC USER PROFILE ─────────────────────────────────────────────────
// Provisions a user document in Firestore and syncs session role
async function syncUserProfile(user: FirebaseUser) {
  currentUserEmail = user.email
  sessionStorage.setItem('currentUserEmail', user.email || '')

  // Default role: customer. Admin is determined from Firestore user doc,
  // NOT from a client-side email comparison (except as initial seed).
  let role: 'admin' | 'customer' = 'customer'

  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      // First-time user — seed a profile. Admin role must be set manually
      // in Firestore or via Custom Claims, not auto-assigned by email.
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || '',
        role: role,
        createdAt: new Date().toISOString()
      })
    } else {
      const data = userDoc.data()
      if (data && data.role) {
        role = data.role
      }
    }
  } catch (err) {
    console.error('Failed to sync user profile with Firestore:', err)
  }

  currentUserRole = role
  sessionStorage.setItem('currentUserRole', role)
}


// ─── AUTH STATE OBSERVER ────────────────────────────────────────────────
if (isFirebaseEnabled && auth) {
  try {
    onAuthStateChanged(auth, async (user) => {
      if (user && user.email === sessionStorage.getItem('currentUserEmail')) {
        await syncUserProfile(user)
      }
    })
  } catch (err) {
    console.error('Failed to attach onAuthStateChanged listener:', err)
  }
}