export type AdminDraftSection = 'destinations' | 'destinationGuides' | 'hotels' | 'experiences';

function storageKey(section: AdminDraftSection): string {
  return `ethiopidia-admin-${section}`;
}

function createdStorageKey(section: AdminDraftSection): string {
  return `ethiopidia-admin-created-${section}`;
}

export function loadAdminDrafts<T>(section: AdminDraftSection): Record<string, Partial<T>> {
  if (typeof window === 'undefined') return {};
  try {
    const value = window.localStorage.getItem(storageKey(section));
    return value ? JSON.parse(value) as Record<string, Partial<T>> : {};
  } catch {
    return {};
  }
}

export function saveAdminDraft<T>(section: AdminDraftSection, id: string, draft: Partial<T>): void {
  if (typeof window === 'undefined') return;
  const drafts = loadAdminDrafts<T>(section);
  window.localStorage.setItem(storageKey(section), JSON.stringify({ ...drafts, [id]: draft }));
}

export function loadAdminCreated<T>(section: AdminDraftSection): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(createdStorageKey(section));
    return value ? JSON.parse(value) as T[] : [];
  } catch {
    return [];
  }
}

export function saveAdminCreated<T extends { id: string }>(section: AdminDraftSection, item: T): void {
  if (typeof window === 'undefined') return;
  const current = loadAdminCreated<T>(section);
  const next = current.some((entry) => entry.id === item.id)
    ? current.map((entry) => entry.id === item.id ? item : entry)
    : [...current, item];
  window.localStorage.setItem(createdStorageKey(section), JSON.stringify(next));
}
