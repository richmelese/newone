import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Eye, Inbox, Search, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { MetricCard, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { loadPropertyRequests, updatePropertyRequestStatus } from '@/lib/propertyRequests';
import type { PropertyRequest, PropertyRequestStatus } from '@/types';

type Filter = 'all' | PropertyRequestStatus;
const PAGE_SIZE = 8;

const statusTone: Record<PropertyRequestStatus, 'amber' | 'green' | 'red'> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRequests(loadPropertyRequests());
  }, []);

  const filtered = useMemo(
    () =>
      requests.filter((request) => {
        const matchesQuery = `${request.propertyName} ${request.contactName} ${request.city}`.toLowerCase().includes(query.toLowerCase());
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

  return (
    <AdminLayout
      title="Property requests"
      description="Review requests from owners who want to list their property. New submissions start as pending until you approve or reject them."
      eyebrow="Onboarding"
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total requests" value={requests.length} detail="Submitted through the get-started form" icon={<Inbox size={20} />} />
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
                    <p className="mt-1 text-xs text-ink-400">{request.phone}</p>
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
                      <Link href={`/admin/requests/${request.id}`} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label="View details">
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
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>
    </AdminLayout>
  );
}
