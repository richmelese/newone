import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AuthModal from '@/components/account/AuthModal';

type AuthMode = 'sign-in' | 'sign-up';

type AuthModalContextType = {
  openSignIn: (next?: string) => void;
  openSignUp: (next?: string) => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<{ mode: AuthMode; next?: string } | null>(null);
  const openSignIn = useCallback((next?: string) => setModal({ mode: 'sign-in', next }), []);
  const openSignUp = useCallback((next?: string) => setModal({ mode: 'sign-up', next }), []);
  const value = useMemo(() => ({ openSignIn, openSignUp }), [openSignIn, openSignUp]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {modal && <AuthModal initialMode={modal.mode} next={modal.next} onClose={() => setModal(null)} />}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider');
  return context;
}
