import { jwtDecode } from 'jwt-decode';
import { firebaseAuth } from './firebase';
import { ACCESS_TOKEN_KEY } from '../types';

// Ported from agecan-front/src/app/services/account.service.ts
// (isTokenExpired / getToken / refreshToken), adapted to plain localStorage
// since this app has no @ionic/storage-angular equivalent.

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (decoded && typeof decoded === 'object' && decoded.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  return true;
}

async function refreshToken(): Promise<string> {
  const currentUser = firebaseAuth.currentUser;
  if (currentUser) {
    const idToken = await currentUser.getIdToken(true);
    localStorage.setItem(ACCESS_TOKEN_KEY, idToken);
    return idToken;
  }
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  return '';
}

export async function getToken(): Promise<string> {
  let token = localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  if (token && isTokenExpired(token)) {
    token = await refreshToken();
  }
  return token;
}
