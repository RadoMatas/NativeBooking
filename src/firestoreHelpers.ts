import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
/**
 * Safely get a Firestore collection reference. Throws if `db` is not initialized.
 */
export const safeCollection = (path: string) => {
  if (!db) {
    throw new Error('Firestore not initialized – collection request aborted');
  }
  return collection(db, path);
};

/**
 * Safely get a Firestore doc reference.
 */
export const safeDoc = (path: string, id: string) => {
  if (!db) {
    throw new Error('Firestore not initialized – doc request aborted');
  }
  return doc(db, path, id);
};

/**
 * Safely set a document in Firestore. Throws if `db` is not initialized.
 */
export const safeSetDoc = (docRef: any, data: any, options?: any) => {
  if (!db) {
    throw new Error('Firestore not initialized – setDoc request aborted');
  }
  return setDoc(docRef, data, options);
};
