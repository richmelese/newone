import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import GoogleSignInButton from '@/components/account/GoogleSignInButton';

type AuthMode = 'sign-in' | 'sign-up';

function safeNext(value?: string) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : undefined;
}

export default function AuthModal({ initialMode, next, onClose }: { initialMode: AuthMode; next?: string; onClose: () => void }) {
  const { signIn, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  async function finish() {
    const destination = safeNext(next);
    onClose();
    if (destination) await router.push(destination);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn({ name: mode === 'sign-up' ? name.trim() : email.split('@')[0] || 'Traveler', email: email.trim() });
    await finish();
  }

  async function handleGoogle() {
    signInWithGoogle();
    await finish();
  }

  const isSignUp = mode === 'sign-up';

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink-900/65 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative z-10 w-full max-w-md rounded-card-lg border border-white/60 bg-white p-7 shadow-hero sm:p-9">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-ink-400 transition hover:bg-neutral-100 hover:text-ink-800">
          <X size={19} />
        </button>
        <div className="mb-7 pr-9">
          <h2 id="auth-modal-title" className="font-heading text-2xl font-extrabold text-ink-900">{isSignUp ? t.signUpTitle : t.signInTitle}</h2>
          <p className="mt-2 text-sm text-ink-500">{isSignUp ? t.signUpSubtitle : t.signInSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <label className="block text-sm font-semibold text-ink-700">
              {t.nameLabel}
              <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-neutral-300 px-3.5 text-sm outline-none focus:border-primary-500" />
            </label>
          )}
          <label className="block text-sm font-semibold text-ink-700">
            {t.emailLabel}
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-neutral-300 px-3.5 text-sm outline-none focus:border-primary-500" />
          </label>
          <label className="block text-sm font-semibold text-ink-700">
            {t.passwordLabel}
            <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-neutral-300 px-3.5 text-sm outline-none focus:border-primary-500" />
          </label>
          <Button type="submit" size="lg" fullWidth>{isSignUp ? t.signUpButton : t.signInButton}</Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
          <span className="h-px flex-1 bg-neutral-200" />or<span className="h-px flex-1 bg-neutral-200" />
        </div>
        <GoogleSignInButton onClick={handleGoogle} label={isSignUp ? 'Sign up with Google' : 'Continue with Google'} />

        <p className="mt-6 text-center text-sm text-ink-500">
          {isSignUp ? t.haveAccountAlready : t.noAccountYet}{' '}
          <button type="button" onClick={() => setMode(isSignUp ? 'sign-in' : 'sign-up')} className="font-semibold text-primary-700 hover:underline">
            {isSignUp ? t.signInButton : t.signUpButton}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
