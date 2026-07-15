import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';

export default function SignInForm() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ name: email.split('@')[0] || 'Traveler', email });
    router.push('/account/favorites');
  };

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
      <p className="text-center text-sm text-ink-500">
        {t.noAccountYet}{' '}
        <Link href="/account/sign-up" className="font-semibold text-primary-700 hover:underline">
          {t.signUpButton}
        </Link>
      </p>
    </form>
  );
}
