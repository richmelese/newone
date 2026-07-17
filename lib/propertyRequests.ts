import type { PropertyRequest, PropertyRequestStatus } from '@/types';

const STORAGE_KEY = 'ethiopidia-property-requests';

export function loadPropertyRequests(): PropertyRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as PropertyRequest[]) : [];
  } catch {
    return [];
  }
}

function savePropertyRequests(requests: PropertyRequest[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function submitPropertyRequest(input: Omit<PropertyRequest, 'id' | 'submittedAt' | 'status'>): PropertyRequest {
  const request: PropertyRequest = {
    ...input,
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  savePropertyRequests([request, ...loadPropertyRequests()]);
  return request;
}

export function updatePropertyRequestStatus(id: string, status: PropertyRequestStatus): void {
  savePropertyRequests(loadPropertyRequests().map((request) => (request.id === id ? { ...request, status } : request)));
}
