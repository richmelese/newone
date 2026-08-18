import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { authApi, extractAuthToken } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';

type AuthMode = 'sign-in' | 'sign-up';

function safeNext(value?: string) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : undefined;
}

export default function AuthModal({ initialMode, next, onClose }: { initialMode: AuthMode; next?: string; onClose: () => void }) {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'sign-up') {
        const account = await authApi.register({
          email: email.trim(),
          full_name: name.trim(),
          password,
        });
        const token = extractAuthToken(account);
        signIn(
          {
            name: account.full_name || name.trim(),
            email: account.email || email.trim(),
            avatarUrl: account.avatar_url || undefined,
          },
          token || null,
        );
      } else {
        const login = await authApi.login({ email: email.trim(), password });
        const token = extractAuthToken(login);
        if (!token) {
          throw new Error('The login response did not include an access token.');
        }
        const profile = await authApi.getProfile(token);
        signIn(
          {
            name: profile.full_name,
            email: profile.email,
            avatarUrl: profile.avatar_url || undefined,
            role: profile.role,
          },
          token,
        );
      }
      await finish();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? (isSignUp ? 'Creating account…' : 'Signing in…') : (isSignUp ? t.signUpButton : t.signInButton)}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          {isSignUp ? t.haveAccountAlready : t.noAccountYet}{' '}
          <button type="button" onClick={() => setMode(isSignUp ? 'sign-in' : 'sign-up')} className="font-semibold text-primary-700 hover:underline">
            {isSignUp ? t.signInButton : t.signUpButton}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
