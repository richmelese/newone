import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FavoriteEntry } from '../types';

type FavoritesContextType = {
  favorites: FavoriteEntry[];
  hydrated: boolean;
  isFavorite: (hotelId: string) => boolean;
  toggleFavorite: (hotelId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites, hydrated] = useLocalStorage<FavoriteEntry[]>('ethiopidia:favorites', []);

  const value = useMemo(
    () => ({
      favorites,
      hydrated,
      isFavorite: (hotelId: string) => favorites.some((f) => f.hotelId === hotelId),
      toggleFavorite: (hotelId: string) =>
        setFavorites((prev) =>
          prev.some((f) => f.hotelId === hotelId)
            ? prev.filter((f) => f.hotelId !== hotelId)
            : [...prev, { hotelId, addedAt: new Date().toISOString() }],
        ),
    }),
    [favorites, hydrated, setFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
