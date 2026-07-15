import { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useLocalStorage } from './useLocalStorage';

const MAX_COMPARE = 4;

type CompareContextType = {
  compareIds: string[];
  hydrated: boolean;
  isComparing: (hotelId: string) => boolean;
  toggleCompare: (hotelId: string) => void;
  removeFromCompare: (hotelId: string) => void;
  clearCompare: () => void;
  atMax: boolean;
  goToCompare: () => void;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds, hydrated] = useLocalStorage<string[]>('ethiopidia:compare', []);
  const router = useRouter();

  const value = useMemo(
    () => ({
      compareIds,
      hydrated,
      isComparing: (hotelId: string) => compareIds.includes(hotelId),
      toggleCompare: (hotelId: string) =>
        setCompareIds((prev) => {
          if (prev.includes(hotelId)) return prev.filter((id) => id !== hotelId);
          if (prev.length >= MAX_COMPARE) return prev;
          return [...prev, hotelId];
        }),
      removeFromCompare: (hotelId: string) => setCompareIds((prev) => prev.filter((id) => id !== hotelId)),
      clearCompare: () => setCompareIds([]),
      atMax: compareIds.length >= MAX_COMPARE,
      goToCompare: () => router.push(`/compare?ids=${compareIds.join(',')}`),
    }),
    [compareIds, hydrated, setCompareIds, router],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
