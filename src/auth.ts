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

export let currentUserRole: 'admin' | 'customer' | null =
  (sessionStorage.getItem('currentUserRole') as 'admin' | 'customer' | null) || null

export let currentUserEmail: string | null =
  sessionStorage.getItem('currentUserEmail') || null

// Local mock login logic (runs if Firebase is disabled)


// Unified export functions
export async function login(email: string, password: string): Promise<boolean> {
  // Mock login when Firebase is disabled
  if (!isFirebaseEnabled) {
    // Check mock user store first
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]') as Array<{email:string,password:string,role:'admin'|'customer'}>;
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      currentUserRole = user.role;
      currentUserEmail = email;
      sessionStorage.setItem('currentUserRole', user.role);
      sessionStorage.setItem('currentUserEmail', email);
      return true;
    }
    // Admin credentials (strictly admin@nativebooking.co)
    const isAdminEmail = email === 'admin@nativebooking.co' 
    const isAdminPass  = password === 'NativeBooking2026!Admin' 

    if (isAdminEmail && isAdminPass) {
      currentUserRole = 'admin';
      currentUserEmail = email;
      sessionStorage.setItem('currentUserRole', 'admin');
      sessionStorage.setItem('currentUserEmail', email);
      return true;
    }
    if (email === 'customer@test.com' && password === 'cust123') {
      currentUserRole = 'customer';
      currentUserEmail = email;
      sessionStorage.setItem('currentUserRole', 'customer');
      sessionStorage.setItem('currentUserEmail', email);
      return true;
    }
    // If no match, fail
    return false;
  }

  // Real Firebase login flow
  try {
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // Auto-create account in Firebase Auth if not created yet
      cred = await createUserWithEmailAndPassword(auth, email, password);
    }
    await syncUserProfile(cred.user);
    return true;
  } catch (error) {
    console.error('Firebase Email sign-in failed:', error);
    return false;
  }
}

export async function register(email: string, password: string): Promise<boolean> {
  // Mock registration when Firebase is disabled
  if (!isFirebaseEnabled) {
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]') as Array<{email:string,password:string,role:'admin'|'customer'}>;
    // Prevent duplicate email
    if (mockUsers.some(u => u.email === email)) {
      console.warn('Mock registration failed: email already exists');
      return false;
    }
    const newUser = { email, password, role: 'customer' as const };
    mockUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    currentUserRole = 'customer';
    currentUserEmail = email;
    sessionStorage.setItem('currentUserRole', 'customer');
    sessionStorage.setItem('currentUserEmail', email);
    return true;
  }

  // Real Firebase registration flow
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await syncUserProfile(cred.user);
    return true;
  } catch (error) {
    console.error('Firebase registration failed:', error);
    return false;
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
    console.warn('Google signInWithPopup failed, attempting redirect:', error)
    try {
      // Attempt redirect flow as a fallback (especially on mobile)
      await signInWithRedirect(auth, googleProvider)
      // The redirect will bring the user back to the app; onAuthStateChanged will handle sync
      return true
    } catch (redirError) {
      console.error('Firebase Google sign-in failed:', redirError)
      return false
    }
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
  if (user.email === 'admin@nativebooking.co' ) {
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