import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config comes from Vite env vars, see .env.example.
// This app is web-only, so we use the native Firebase web SDK providers
// (signInWithPopup + GoogleAuthProvider / FacebookAuthProvider) instead of
// the Capacitor plugins (@capacitor-community/facebook-login,
// @codetrix-studio/capacitor-google-auth) used by the original Ionic app.
//
// A syntactically-valid placeholder is used for any unset VITE_FIREBASE_*
// var so that getAuth() never throws synchronously at module-load time —
// without this, an incomplete .env.local blanks out the entire site (every
// page imports the auth context, even pages that don't need auth) instead
// of just breaking the login feature itself. Real sign-in attempts still
// fail normally (and are already caught) once Firebase rejects the fake key.
const PLACEHOLDER_API_KEY = 'AIzaSyDUMMYDUMMYDUMMYDUMMYDUMMYDUMDUMD';

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn(
    '[firebase] Faltan las variables VITE_FIREBASE_* (ver .env.example). ' +
      'La app se renderiza igualmente, pero el login no funcionará hasta configurarlas en tu .env.local.',
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || PLACEHOLDER_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'placeholder-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'placeholder-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'placeholder-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
