import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CART_KEY } from '../types';
import type { ICartItem } from '../types';

// Ported from agecan-front/src/app/services/cart.service.ts, persisted to
// localStorage instead of @ionic/storage-angular.

interface CartContextValue {
  items: ICartItem[];
  addProduct: (product: ICartItem) => void;
  removeFromCart: (index: number) => void;
  clean: () => void;
  itemCount: () => number;
  sessions: () => number;
  total: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart(): ICartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as ICartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>(() => readStoredCart());

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addProduct(product: ICartItem) {
    setItems((prev) => [...prev, product]);
  }

  function removeFromCart(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function clean() {
    setItems([]);
  }

  function itemCount() {
    return items.length;
  }

  function sessions() {
    let s = 0;
    items.forEach((item) => {
      if (item.type === 'Sesiones') s += item.quantity;
    });
    return s;
  }

  function total() {
    let t = 0;
    items.forEach((item) => {
      t += item.price;
    });
    return t;
  }

  const value: CartContextValue = { items, addProduct, removeFromCart, clean, itemCount, sessions, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
