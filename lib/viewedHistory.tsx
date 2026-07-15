import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ViewedEntry } from '../types';

const MAX_HISTORY = 20;

type ViewedHistoryContextType = {
  history: ViewedEntry[];
  hydrated: boolean;
  recordView: (hotelId: string) => void;
  clearHistory: () => void;
};

const ViewedHistoryContext = createContext<ViewedHistoryContextType | undefined>(undefined);

export function ViewedHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory, hydrated] = useLocalStorage<ViewedEntry[]>('ethiopidia:history', []);

  const value = useMemo(
    () => ({
      history,
      hydrated,
      recordView: (hotelId: string) =>
        setHistory((prev) => {
          const withoutHotel = prev.filter((h) => h.hotelId !== hotelId);
          const next = [{ hotelId, viewedAt: new Date().toISOString() }, ...withoutHotel];
          return next.slice(0, MAX_HISTORY);
        }),
      clearHistory: () => setHistory([]),
    }),
    [history, hydrated, setHistory],
  );

  return <ViewedHistoryContext.Provider value={value}>{children}</ViewedHistoryContext.Provider>;
}

export function useViewedHistory() {
  const context = useContext(ViewedHistoryContext);
  if (!context) {
    throw new Error('useViewedHistory must be used within ViewedHistoryProvider');
  }
  return context;
}
