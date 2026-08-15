import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { initialData } from '../services/api';
import type { ICity } from '../types';

// Ported from agecan-front/src/app/services/data.service.ts (DataService.iniciar).
// Cities are loaded once when the app mounts.

interface InitialDataContextValue {
  ciudades: ICity[];
  loading: boolean;
}

const InitialDataContext = createContext<InitialDataContextValue | undefined>(undefined);

export function InitialDataProvider({ children }: { children: ReactNode }) {
  const [ciudades, setCiudades] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await initialData();
        if (!cancelled) setCiudades(data.cities ?? []);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <InitialDataContext.Provider value={{ ciudades, loading }}>{children}</InitialDataContext.Provider>;
}

export function useInitialData() {
  const ctx = useContext(InitialDataContext);
  if (!ctx) throw new Error('useInitialData must be used within an InitialDataProvider');
  return ctx;
}
