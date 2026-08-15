import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { firebaseAuth } from '../lib/firebase';
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from '../types';
import type { IUserDetails } from '../types';

// Ported from agecan-front/src/app/services/account.service.ts and login.service.ts.
// Uses Firebase's native web popup providers (signInWithPopup) instead of the
// Capacitor plugins the original Ionic app used for Google/Facebook login.

interface AuthContextValue {
  user: IUserDetails | null;
  loading: boolean;
  isLoggedIn: boolean;
  loginViaEmail: (email: string, password: string) => Promise<void>;
  loginViaGoogle: () => Promise<void>;
  loginViaFacebook: () => Promise<void>;
  registerWithEmail: (email: string, password: string, nombre: string, apellido: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): IUserDetails | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as IUserDetails) : null;
  } catch {
    return null;
  }
}

function persistUser(user: IUserDetails) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        const stored = readStoredUser();
        const nextUser: IUserDetails = stored ?? {
          name: fbUser.displayName ?? fbUser.email ?? '',
          email: fbUser.email ?? '',
          imageUrl: fbUser.photoURL ?? '',
          source: 'email',
        };
        persistUser(nextUser);
        setUser(nextUser);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function loginViaEmail(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const token = await credential.user.getIdToken();
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    const nextUser: IUserDetails = {
      name: credential.user.displayName ?? email,
      email: credential.user.email ?? email,
      imageUrl: credential.user.photoURL ?? '',
      source: 'email',
    };
    persistUser(nextUser);
    setUser(nextUser);
  }

  async function loginViaGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(firebaseAuth, provider);
    const token = await credential.user.getIdToken();
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    const nextUser: IUserDetails = {
      name: credential.user.displayName ?? credential.user.email ?? '',
      email: credential.user.email ?? '',
      imageUrl: credential.user.photoURL ?? '',
      source: 'google',
    };
    persistUser(nextUser);
    setUser(nextUser);
  }

  async function loginViaFacebook() {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    const credential = await signInWithPopup(firebaseAuth, provider);
    const token = await credential.user.getIdToken();
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    const nextUser: IUserDetails = {
      name: credential.user.displayName ?? credential.user.email ?? '',
      email: credential.user.email ?? '',
      imageUrl: credential.user.photoURL ?? '',
      source: 'facebook',
    };
    persistUser(nextUser);
    setUser(nextUser);
  }

  async function registerWithEmail(email: string, password: string, nombre: string, apellido: string) {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const token = await credential.user.getIdToken();
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    const nextUser: IUserDetails = {
      name: `${nombre} ${apellido}`.trim(),
      email,
      source: 'email',
    };
    persistUser(nextUser);
    setUser(nextUser);
  }

  async function logout() {
    await signOut(firebaseAuth);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    loading,
    isLoggedIn: user !== null,
    loginViaEmail,
    loginViaGoogle,
    loginViaFacebook,
    registerWithEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
