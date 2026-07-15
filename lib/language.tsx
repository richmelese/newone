import { createContext, useContext, useEffect, useMemo } from 'react';
import { translations, type Language } from '../data/translations';
import { useLocalStorage } from './useLocalStorage';
import type { Localized } from '../types';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  t: typeof translations.en;
  pick: <T>(value: Localized<T>) => T;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageRaw] = useLocalStorage<Language>('ethiopidia:language', 'en');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const t = language === 'am' ? translations.am : translations.en;
    return {
      language,
      toggleLanguage: () => setLanguageRaw((prev) => (prev === 'en' ? 'am' : 'en')),
      setLanguage: (next: Language) => setLanguageRaw(next),
      t,
      pick: <T,>(value: Localized<T>) => (language === 'am' ? value.am : value.en),
    };
  }, [language, setLanguageRaw]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
