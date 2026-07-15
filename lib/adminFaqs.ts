import { translations } from '@/data/translations';
import type { Localized } from '@/types';

export interface AdminFaq {
  id: string;
  question: Localized;
  answer: Localized;
  published: boolean;
}

export const initialAdminFaqs: AdminFaq[] = [1, 2, 3, 4, 5].map((number) => ({
  id: `faq-${number}`,
  question: {
    en: translations.en[`faqQ${number}` as keyof typeof translations.en],
    am: translations.am[`faqQ${number}` as keyof typeof translations.am],
  },
  answer: {
    en: translations.en[`faqA${number}` as keyof typeof translations.en],
    am: translations.am[`faqA${number}` as keyof typeof translations.am],
  },
  published: true,
})) as AdminFaq[];

const FAQ_STORAGE_KEY = 'ethiopidia-admin-faqs';

export function loadAdminFaqs(): AdminFaq[] {
  if (typeof window === 'undefined') return initialAdminFaqs;
  try {
    const stored = window.localStorage.getItem(FAQ_STORAGE_KEY);
    return stored ? JSON.parse(stored) as AdminFaq[] : initialAdminFaqs;
  } catch {
    return initialAdminFaqs;
  }
}

export function saveAdminFaqs(faqs: AdminFaq[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs));
}
