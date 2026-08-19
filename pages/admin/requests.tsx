import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { Check, Eye, Inbox, Plus, RefreshCw, Search, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { MetricCard, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { citiesApi, propertyListingRequestsApi, type City } from '@/lib/api';
import { loadPropertyRequests, updatePropertyRequestStatus } from '@/lib/propertyRequests';
import type { PropertyRequest, PropertyRequestStatus } from '@/types';

type Filter = 'all' | PropertyRequestStatus;
const PAGE_SIZE = 8;

const statusTone: Record<PropertyRequestStatus, 'amber' | 'green' | 'red'> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

function normalizeApiRequest(item: Record<string, unknown>, index: number): PropertyRequest {
  const id = String(item._id || item.id || `req-api-${index}`);
  const contactName = String(item.owner_name || item.contactName || item.business_name || 'Anonymous');
  const role = String(item.owner_role || item.role || 'Owner');
  const email = String(item.email || '');
  const phone = String(item.phone || '');
  const propertyName = String(item.property_name || item.business_name || item.propertyName || 'Untitled Property');
  const propertyType = String(item.property_type || item.propertyType || 'Hotel');
  
  let cityStr = 'Not specified';
  if (typeof item.city === 'object' && item.city !== null) {
    const cityObj = item.city as { name_en?: string; name_am?: string };
    cityStr = cityObj.name_en || cityObj.name_am || 'Not specified';
  } else if (item.city) {
    cityStr = String(item.city);
  } else if (item.location) {
    cityStr = String(item.location);
  }

  const address = String(item.address || item.location || '');
  const submittedAt = String(item.created_at || item.submittedAt || new Date().toISOString());
  const statusStr = String(item.status || 'pending').toLowerCase();
  const status: PropertyRequestStatus = statusStr === 'approved' ? 'approved' : statusStr === 'rejected' ? 'rejected' : 'pending';

  const photos = Array.isArray(item.photos) ? item.photos : [];

  return {
    id,
    contactName,
    role,
    email,
    phone,
    propertyName,
    propertyType,
    starClass: String(item.starClass || ''),
    rooms: String(item.rooms || ''),
    city: cityStr,
    address,
    services: Array.isArray(item.services) ? item.services.map(String) : [],
    amenities: Array.isArray(item.amenities) ? item.amenities.map(String) : [],
    notes: String(item.notes || ''),
    mediaCount: photos.length || (typeof item.mediaCount === 'number' ? item.mediaCount : 0),
    submittedAt,
    status,
  };
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [citiesList, setCitiesList] = useState<City[]>([]);

  useEffect(() => {
    citiesApi.list()
      .then(setCitiesList)
      .catch((err) => console.warn('Could not load cities for request modal:', err));
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const local = loadPropertyRequests();
      let apiItems: Record<string, unknown>[] = [];
      
      try {
        const res = await propertyListingRequestsApi.list();
        if (Array.isArray(res)) {
          apiItems = res as Record<string, unknown>[];
        }
      } catch (err) {
        console.warn('Could not fetch remote property listing requests:', err);
      }

      const normalizedRemote = apiItems.map((item, idx) => normalizeApiRequest(item, idx));
      
      // Combine remote and local, avoiding duplicates
      const seenIds = new Set<string>();
      const combined: PropertyRequest[] = [];

      normalizedRemote.forEach((req) => {
        if (!seenIds.has(req.id)) {
          seenIds.add(req.id);
          combined.push(req);
        }
      });

      local.forEach((req) => {
        if (!seenIds.has(req.id)) {
          seenIds.add(req.id);
          combined.push(req);
        }
      });

      setRequests(combined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load property listing requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const filtered = useMemo(
    () =>
      requests.filter((request) => {
        const matchesQuery = `${request.propertyName} ${request.contactName} ${request.city} ${request.phone}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (filter === 'all' || request.status === filter);
      }),
    [filter, query, requests],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendingCount = requests.filter((request) => request.status === 'pending').length;
  const approvedCount = requests.filter((request) => request.status === 'approved').length;

  useEffect(() => setPage(1), [filter, query]);

  function setStatus(id: string, status: PropertyRequestStatus) {
    updatePropertyRequestStatus(id, status);
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
  }

  const handleCreateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const owner_name = String(formData.get('owner_name') ?? '').trim();
    const owner_role = String(formData.get('owner_role') ?? '').trim() || 'owner';
    const business_name = String(formData.get('business_name') ?? '').trim() || String(formData.get('property_name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const property_name = String(formData.get('property_name') ?? '').trim();
    const property_type = String(formData.get('property_type') ?? '').trim() || 'hotel';
    const address = String(formData.get('address') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();
    const location = String(formData.get('location') ?? address ?? city).trim();
    const photoFiles = formData.getAll('photos').filter((entry): entry is File => entry instanceof File && entry.size > 0);

    try {
      await propertyListingRequestsApi.create({
        owner_name,
        owner_role,
        business_name,
        email,
        phone,
        property_name,
        property_type,
        address,
        city,
        location,
        hasAgreed: true,
        photos: photoFiles.length > 0 ? photoFiles : null,
      });

      setIsModalOpen(false);
      void fetchRequests();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create request.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout
      title="Property requests"
      description="Review requests from owners who want to list their property on Ethiopidia (/property-listing-requests). New submissions start as pending."
      eyebrow="Onboarding"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchRequests()}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 shadow-sm transition hover:bg-neutral-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <Button type="button" onClick={() => setIsModalOpen(true)} size="sm" className="inline-flex items-center gap-1.5">
            <Plus size={16} /> Create request
          </Button>
        </div>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total requests" value={requests.length} detail="Submitted through get-started form & API" icon={<Inbox size={20} />} />
        <MetricCard label="Pending review" value={pendingCount} detail="Waiting on a decision" tone="orange" icon={<Search size={20} />} />
        <MetricCard label="Approved" value={approvedCount} detail="Cleared for onboarding" tone="green" icon={<Check size={20} />} />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search requests..."
              className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-pill px-3.5 py-2 text-xs font-bold capitalize transition ${filter === item ? 'bg-primary-800 text-white' : 'bg-neutral-100 text-ink-500 hover:bg-primary-50'}`}
              >
                {item}
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold text-ink-400">{filtered.length} results</span>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead className="bg-neutral-100/80 text-[10px] uppercase tracking-[0.14em] text-ink-400">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Property</th>
                  <th className="px-4 py-3.5 font-bold">Contact</th>
                  <th className="px-4 py-3.5 font-bold">Location</th>
                  <th className="px-4 py-3.5 font-bold">Submitted</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {paginated.map((request) => (
                  <tr key={request.id} className="transition hover:bg-primary-50/40">
                    <td className="px-5 py-4">
                      <p className="max-w-[220px] truncate text-sm font-bold text-primary-900">{request.propertyName}</p>
                      <p className="mt-1 text-xs text-ink-400">{request.propertyType || 'Not specified'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-ink-600">{request.contactName}</p>
                      <p className="mt-1 text-xs text-ink-400">{request.phone || request.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-ink-600">{request.city || 'Not specified'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-ink-600">{new Date(request.submittedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill tone={statusTone[request.status]}>{request.status}</StatusPill>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/requests/${encodeURIComponent(request.id)}`} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label="View details">
                          <Eye size={16} />
                        </Link>
                        {request.status !== 'approved' && (
                          <button type="button" onClick={() => setStatus(request.id, 'approved')} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-success-500" aria-label="Approve request">
                            <Check size={16} />
                          </button>
                        )}
                        {request.status !== 'rejected' && (
                          <button type="button" onClick={() => setStatus(request.id, 'rejected')} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-danger-500" aria-label="Reject request">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <TableEmpty message="No property requests match the current filters." />}
          </div>
        )}
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900">Create Property Request</h3>
                <p className="text-xs text-slate-500">POST /property-listing-requests</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {createError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    name="owner_name"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Role</label>
                  <input
                    type="text"
                    name="owner_role"
                    defaultValue="owner"
                    placeholder="e.g. owner"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    placeholder="e.g. Hotel Sunshine"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Name *</label>
                  <input
                    type="text"
                    name="property_name"
                    required
                    placeholder="e.g. Hotel Sunshine"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="owner@example.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+251911000000"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Type *</label>
                  <select
                    name="property_type"
                    required
                    defaultValue="hotel"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="hotel">hotel</option>
                    <option value="resort">resort</option>
                    <option value="lodge">lodge</option>
                    <option value="guesthouse">guesthouse</option>
                    <option value="boutique hotel">boutique hotel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    name="city"
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Select city...</option>
                    {citiesList.map((c) => {
                      const cid = c._id || c.id || c.name_en;
                      return (
                        <option key={cid} value={cid}>
                          {c.name_en}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Main St"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Bole, Addis Ababa"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload Photos</label>
                <input
                  type="file"
                  name="photos"
                  accept="image/*"
                  multiple
                  className="w-full text-xs text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-orange-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={creating}>
                  {creating ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
