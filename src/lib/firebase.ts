import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyAX6CWkB17-lwIfz9OmKJZaGPfTbvEyXec",
  authDomain: "shafinbdjobs.firebaseapp.com",
  projectId: "shafinbdjobs",
  storageBucket: "shafinbdjobs.firebasestorage.app",
  messagingSenderId: "564277557296",
  appId: "1:564277557296:web:9c6a8dc760bf82714095f5",
  measurementId: "G-DNHMXH4NJ0"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  type User 
};

// Initialize Analytics conditionally
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics not supported in this environment:", err);
  });
}


