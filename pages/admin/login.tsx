import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Landmark } from 'lucide-react';
import Seo from '@/components/layout/Seo';
import Button from '@/components/ui/Button';
import { authApi, extractAuthToken, removeStoredAuthToken, storeAuthToken } from '@/lib/api';
import { useAuth } from '@/lib/auth';

function safeNext(value: string | string[] | undefined) {
  return typeof value === 'string' && value.startsWith('/admin') && !value.startsWith('//') ? value : '/admin';
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, hydrated, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hydrated && user?.role?.toUpperCase() === 'ADMIN') {
      router.replace(safeNext(router.query.next));
    }
  }, [hydrated, router, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    let storedLoginToken = false;

    try {
      const login = await authApi.login({ email: email.trim(), password });
      const token = extractAuthToken(login);
      if (!token) {
        throw new Error('The login response did not include an access token.');
      }

      storeAuthToken(token);
      storedLoginToken = true;
      const profile = await authApi.getProfile(token);

      if (profile.role?.toUpperCase() !== 'ADMIN') {
        throw new Error('This account does not have administrator access.');
      }

      signIn(
        {
          name: profile.full_name,
          email: profile.email,
          avatarUrl: profile.avatar_url || undefined,
          role: profile.role,
        },
        token,
      );
      await router.push(safeNext(router.query.next));
    } catch (caughtError) {
      if (storedLoginToken) removeStoredAuthToken();
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const unauthorized = router.query.error === 'unauthorized';

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 px-5 py-12">
      <Seo title="Admin sign in" description="Sign in to the Ethiopidia administration workspace." path="/admin/login" noindex />
      <section className="w-full max-w-md rounded-card-lg bg-white p-8 shadow-hero sm:p-10">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-500 text-white shadow-cta"><Landmark size={23} /></span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-primary-900">Admin sign in</h1>
            <p className="mt-1 text-sm text-ink-500">Access the Ethiopidia workspace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-ink-700">Email
            <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-neutral-300 px-3.5 outline-none focus:border-primary-500" />
          </label>
          <label className="block text-sm font-semibold text-ink-700">Password
            <span className="relative mt-1.5 block">
              <input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-xl border border-neutral-300 px-3.5 pr-12 outline-none focus:border-primary-500" />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-ink-400 transition hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </span>
          </label>
          {(error || unauthorized) && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error || 'Administrator access is required.'}</p>}
          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in as admin'}</Button>
        </form>
      </section>
    </main>
  );
}
