import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import Seo from '@/components/layout/Seo';
import Reveal from '@/components/ui/Reveal';
import SignInForm from '@/components/account/SignInForm';

export default function SignInPage() {
  const { t } = useLanguage();

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-100 px-5 py-10">
      <Seo title={t.signInTitle} description={t.signInSubtitle} path="/account/sign-in" noindex />
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-7 flex w-fit items-center gap-2 font-heading text-xl font-bold text-ink-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 shadow-soft">
            <Landmark size={19} className="text-white" />
          </span>
          {t.brand}
        </Link>
        <Reveal className="w-full rounded-card-lg border border-neutral-200 bg-white p-7 shadow-card sm:p-9">
          <div className="mb-7 text-center">
            <h1 className="font-heading text-2xl font-extrabold text-ink-900">{t.signInTitle}</h1>
            <p className="mt-2 text-sm text-ink-500">{t.signInSubtitle}</p>
          </div>
          <SignInForm />
        </Reveal>
      </div>
    </div>
  );
}
