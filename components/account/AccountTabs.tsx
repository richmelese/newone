import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '@/lib/language';

export default function AccountTabs() {
  const { t } = useLanguage();
  const router = useRouter();

  const tabs = [
    { href: '/account/favorites', label: t.favoritesTitle },
    { href: '/account/history', label: t.historyTitle },
  ];

  return (
    <div className="mb-6 flex gap-2 border-b border-neutral-200">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
            router.pathname === tab.href ? 'border-primary-600 text-primary-700' : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
