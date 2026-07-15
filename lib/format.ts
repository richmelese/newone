export function formatEtb(amount: number): string {
  return `ETB ${amount.toLocaleString('en-US')}`;
}

/** e.g. "Coffee House" -> "coffee-house", for use in URLs. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(iso: string, locale: 'en' | 'am' = 'en'): string {
  return new Date(iso).toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
