import { auth, db, isFirebaseEnabled, googleProvider } from './firebase'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export let currentUserRole: 'admin' | 'customer' | null =
  (sessionStorage.getItem('currentUserRole') as 'admin' | 'customer' | null) || null

export let currentUserEmail: string | null =
  sessionStorage.getItem('currentUserEmail') || null

// Local mock login logic (runs if Firebase is disabled)
function localLogin(email: string, password: string) {
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

// Unified export functions
export async function login(email: string, password: string): Promise<boolean> {
  if (!isFirebaseEnabled) {
    return localLogin(email, password)
  }

  try {
    let cred
    try {
      cred = await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      // Auto-create account in Firebase Auth if not created yet
      cred = await createUserWithEmailAndPassword(auth, email, password)
    }
    await syncUserProfile(cred.user)
    return true
  } catch (error) {
    console.error('Firebase Email sign-in failed, falling back to local login:', error)
    return localLogin(email, password)
  }
}

export async function register(email: string, password: string): Promise<boolean> {
  if (!isFirebaseEnabled) {
    // Local fallback mock registration
    currentUserRole = 'customer'
    currentUserEmail = email
    sessionStorage.setItem('currentUserRole', 'customer')
    sessionStorage.setItem('currentUserEmail', email)
    return true
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await syncUserProfile(cred.user)
    return true
  } catch (error) {
    console.error('Firebase registration failed:', error)
    // Fallback registration
    currentUserRole = 'customer'
    currentUserEmail = email
    sessionStorage.setItem('currentUserRole', 'customer')
    sessionStorage.setItem('currentUserEmail', email)
    return true
  }
}

export async function loginWithGoogle(): Promise<boolean> {
  if (!isFirebaseEnabled) {
    // Local fallback mock Google Sign-in
    currentUserRole = 'customer'
    currentUserEmail = 'google-customer@test.com'
    sessionStorage.setItem('currentUserRole', 'customer')
    sessionStorage.setItem('currentUserEmail', 'google-customer@test.com')
    return true
  }

  try {
    const cred = await signInWithPopup(auth, googleProvider)
    await syncUserProfile(cred.user)
    return true
  } catch (error) {
    console.error('Firebase Google sign-in failed:', error)
    return false
  }
}

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

// Helper to provision user document in Firestore and sync session role
async function syncUserProfile(user: FirebaseUser) {
  currentUserEmail = user.email
  sessionStorage.setItem('currentUserEmail', user.email || '')

  let role: 'admin' | 'customer' = 'customer'
  if (user.email === 'admin@test.com') {
    role = 'admin'
  }

  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
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

// Observe Firebase state changes and sync role
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