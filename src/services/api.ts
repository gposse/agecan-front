import { getToken } from '../lib/authToken';
import type { ICartItem, ICity, IPrice } from '../types';

// Ported from agecan-front/src/app/services/api.service.ts
// Endpoints and auth-header criteria match the original 1:1.

const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (auth) {
    const token = await getToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Intente más tarde.');
  }

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      // ignore body parse errors
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export interface IAppointmentPayload {
  datetime: string;
  addressId: string | null;
  city: string;
  location: string;
  address: string;
  name: string;
  phone: string;
  email: string;
  duration: number;
  audio?: string;
  sessionId?: string;
}

export async function addAppointment(appointment: IAppointmentPayload) {
  return request('appointment/add', { method: 'POST', body: JSON.stringify(appointment) }, true);
}

export async function addresses() {
  return request('address/list', { method: 'GET' }, true);
}

export interface IBuyPayload {
  cart: ICartItem[];
  fileData?: string;
}

export async function buy(data: IBuyPayload) {
  return request('sales/buy', { method: 'POST', body: JSON.stringify(data) }, true);
}

export interface ICalendarAvailability {
  availability: string[];
  [key: string]: unknown;
}

export async function calendarAvailability(date: string, cityId: string, locationId: string) {
  return request<ICalendarAvailability>(`calendar/available/${date}/${cityId}/${locationId}`, { method: 'GET' }, true);
}

export interface IContactPayload {
  name: string;
  email: string;
  title: string;
  message: string;
}

export async function contactSend(data: IContactPayload) {
  return request('contact/send', { method: 'POST', body: JSON.stringify(data) }, false);
}

export interface IInitialData {
  cities: ICity[];
  [key: string]: unknown;
}

export async function initialData() {
  return request<IInitialData>('base/initial-data', { method: 'GET' }, false);
}

export interface ISessionsResponse {
  sessions: { id: string }[];
  pendingPayments: { cart: ICartItem[] }[];
}

export async function sessionsUser() {
  return request<ISessionsResponse>('sessions', { method: 'GET' }, true);
}

export interface IPricesResponse {
  prices: IPrice[];
}

export async function prices() {
  return request<IPricesResponse>('sales/prices', { method: 'GET' }, false);
}
