import { Languages } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t.languageToggleAria}
      className={`inline-flex items-center gap-1.5 rounded-pill border border-neutral-300 px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-400 hover:text-primary-700 ${className ?? ''}`}
    >
      <Languages size={16} />
      {language === 'en' ? 'EN' : 'አማ'}
    </button>
  );
}
