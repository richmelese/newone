import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import GoogleSignInButton from '@/components/account/GoogleSignInButton';

function safeNext(value: string | string[] | undefined): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/account/profile';
}

export default function SignInForm() {
  const { t } = useLanguage();
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ name: email.split('@')[0] || 'Traveler', email });
    router.push(safeNext(router.query.next));
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
    router.push(safeNext(router.query.next));
  };

  const signUpHref = `/account/sign-up?next=${encodeURIComponent(safeNext(router.query.next))}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signin-email" className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t.emailLabel}
        </label>
        <input
          id="signin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="signin-password" className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t.passwordLabel}
        </label>
        <input
          id="signin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
        />
      </div>
      <Button type="submit" fullWidth size="lg">
        {t.signInButton}
      </Button>
      <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className="h-px flex-1 bg-neutral-200" />or<span className="h-px flex-1 bg-neutral-200" />
      </div>
      <GoogleSignInButton onClick={handleGoogleSignIn} />
      <p className="text-center text-sm text-ink-500">
        {t.noAccountYet}{' '}
        <Link href={signUpHref} className="font-semibold text-primary-700 hover:underline">
          {t.signUpButton}
        </Link>
      </p>
    </form>
  );
}
