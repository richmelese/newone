import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { authApi } from './api';
import type { User } from '../types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  signIn: (user: User, token?: string | null) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, hydrated] = useLocalStorage<User | null>('ethiopidia:user', null);
  const [token, setToken, tokenHydrated] = useLocalStorage<string | null>('ethiopidia:token', null);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (!hydrated || !tokenHydrated || profileChecked) return;
    let cancelled = false;

    authApi
      .getProfile(token || undefined)
      .then((profile) => {
        if (cancelled) return;
        setUser({
          name: profile.full_name,
          email: profile.email,
          avatarUrl: profile.avatar_url || undefined,
          role: profile.role,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        if (!cancelled) setProfileChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, profileChecked, setToken, setUser, token, tokenHydrated]);

  const value = useMemo(
    () => ({
      user,
      token,
      hydrated: hydrated && tokenHydrated && profileChecked,
      signIn: (next: User, nextToken?: string | null) => {
        setUser(next);
        if (nextToken !== undefined) setToken(nextToken);
      },
      signOut: () => {
        setUser(null);
        setToken(null);
      },
    }),
    [user, token, hydrated, tokenHydrated, profileChecked, setUser, setToken],
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
