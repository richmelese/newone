import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { User } from '../types';

type AuthContextType = {
  user: User | null;
  hydrated: boolean;
  signIn: (user: User) => void;
  signInWithGoogle: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, hydrated] = useLocalStorage<User | null>('ethiopidia:user', null);

  const value = useMemo(
    () => ({
      user,
      hydrated,
      signIn: (next: User) => setUser(next),
      signInWithGoogle: () => setUser({ name: 'Google Traveler', email: 'traveler@gmail.com' }),
      signOut: () => setUser(null),
    }),
    [user, hydrated, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
