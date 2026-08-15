// Ported from agecan-front/src/app/models/*

export interface IUserDetails {
  email?: string;
  name?: string;
  imageUrl?: string;
  password?: string;
  source?: string;
}

export interface ICityLocation {
  id: string;
  name: string;
  zone?: string;
}

export interface ICity {
  id: string;
  name: string;
  zone?: string;
  locations?: ICityLocation[];
}

export interface IAddress {
  id: string;
  address: string;
  city: string;
  location: string;
  phone: string;
  email: string;
  name: string;
}

export interface IPrice {
  type: string;
  order: number;
  price: number;
  [key: string]: unknown;
}

export interface ISession {
  id: string;
  [key: string]: unknown;
}

export interface IPendingPayment {
  cart: ICartItem[];
  [key: string]: unknown;
}

export interface ICartItem {
  type: string;
  quantity: number;
  price: number;
}

export const ACCESS_TOKEN_KEY = 'access_token';
export const CURRENT_USER_KEY = 'CurrentUser';
export const CART_KEY = 'carrito';
