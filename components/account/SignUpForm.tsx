import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { authApi, extractAuthToken } from '@/lib/api';
import Button from '@/components/ui/Button';

function safeNext(value: string | string[] | undefined): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/account/profile';
}

export default function SignUpForm() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const account = await authApi.register({
        email: email.trim(),
        full_name: name.trim(),
        password,
        ...(avatarUrl.trim() && { avatar_url: avatarUrl.trim() }),
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
      await router.push(safeNext(router.query.next));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <label htmlFor="signup-avatar" className="mb-1.5 block text-sm font-semibold text-ink-700">
          Avatar URL <span className="font-normal text-ink-400">(optional)</span>
        </label>
        <input
          id="signup-avatar"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
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
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : t.signUpButton}
      </Button>
      <p className="text-center text-sm text-ink-500">
        {t.haveAccountAlready}{' '}
        <Link href={signInHref} className="font-semibold text-primary-700 hover:underline">
          {t.signInButton}
        </Link>
      </p>
    </form>
  );
}
