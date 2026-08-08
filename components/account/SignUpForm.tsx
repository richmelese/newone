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

export default function SignUpForm() {
  const { t } = useLanguage();
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ name, email });
    router.push(safeNext(router.query.next));
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
    router.push(safeNext(router.query.next));
  };

  const signInHref = `/account/sign-in?next=${encodeURIComponent(safeNext(router.query.next))}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t.nameLabel}
        </label>
        <input
          id="signup-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t.emailLabel}
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t.passwordLabel}
        </label>
        <input
          id="signup-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
        />
      </div>
      <Button type="submit" fullWidth size="lg">
        {t.signUpButton}
      </Button>
      <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className="h-px flex-1 bg-neutral-200" />or<span className="h-px flex-1 bg-neutral-200" />
      </div>
      <GoogleSignInButton onClick={handleGoogleSignIn} label="Sign up with Google" />
      <p className="text-center text-sm text-ink-500">
        {t.haveAccountAlready}{' '}
        <Link href={signInHref} className="font-semibold text-primary-700 hover:underline">
          {t.signInButton}
        </Link>
      </p>
    </form>
  );
}
