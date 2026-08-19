import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Check, Mail, MapPin, Phone, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Panel, PanelHeader, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { propertyListingRequestsApi } from '@/lib/api';
import { loadPropertyRequests, updatePropertyRequestStatus } from '@/lib/propertyRequests';
import type { PropertyRequest, PropertyRequestStatus } from '@/types';

const statusTone: Record<PropertyRequestStatus, 'amber' | 'green' | 'red'> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-800">{value}</p>
    </div>
  );
}

function TagList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</p>
      {items.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="rounded-pill bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-ink-600">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink-400">None selected</p>
      )}
    </div>
  );
}

const backAction = (
  <Link href="/admin/requests" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-600">
    <ArrowLeft size={16} /> Back
  </Link>
);

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

export default function RequestDetailPage() {
  const router = useRouter();
  const [request, setRequest] = useState<PropertyRequest | null | undefined>(undefined);

  useEffect(() => {
    if (typeof router.query.id !== 'string') return;
    const reqId = router.query.id;

    let isMounted = true;

    async function loadDetail() {
      try {
        const rawRes = await propertyListingRequestsApi.getById(reqId);
        if (!isMounted) return;
        if (rawRes && typeof rawRes === 'object') {
          setRequest(normalizeApiRequest(rawRes as Record<string, unknown>, 0));
          return;
        }
      } catch {
        // Fallback: check local storage
        const foundLocal = loadPropertyRequests().find((item) => item.id === reqId);
        if (isMounted) {
          setRequest(foundLocal ?? null);
        }
        return;
      }
      if (isMounted) setRequest(null);
    }

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [router.query.id]);

  function setStatus(status: PropertyRequestStatus) {
    if (!request) return;
    updatePropertyRequestStatus(request.id, status);
    setRequest({ ...request, status });
  }

  if (request === undefined) {
    return <AdminLayout title="Loading request..." description="Opening the property request."><div /></AdminLayout>;
  }

  if (request === null) {
    return (
      <AdminLayout title="Request not found" description="This property request no longer exists." eyebrow="Property request" actions={backAction}>
        <Panel><TableEmpty message="We couldn't find this property request." /></Panel>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={request.propertyName}
      description="Full submission details from the request to list your property form."
      eyebrow="Property request"
      actions={backAction}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.5fr]">
        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Property details" description="What travelers would see" />
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Property name" value={request.propertyName} />
              <Field label="Property type" value={request.propertyType || 'Not specified'} />
              <Field label="Star class" value={request.starClass || 'Not rated'} />
              <Field label="Number of rooms" value={request.rooms || 'Not specified'} />
              <Field label="City / region" value={request.city || 'Not specified'} />
              <Field label="Address / area" value={request.address || 'Not specified'} />
              <Field label="Photos & logo" value={request.mediaCount > 0 ? `${request.mediaCount} file(s) attached` : 'None attached'} />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Services & amenities" />
            <div className="space-y-5 p-5 sm:p-6">
              <TagList label="Services offered" items={request.services} />
              <TagList label="Amenities" items={request.amenities} />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Additional notes" />
            <p className="p-5 text-sm leading-relaxed text-ink-600 sm:p-6">{request.notes || 'No additional notes were provided.'}</p>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Status" />
            <div className="space-y-4 p-5 sm:p-6">
              <StatusPill tone={statusTone[request.status]}>{request.status}</StatusPill>
              <p className="text-xs text-ink-400">Submitted {new Date(request.submittedAt).toLocaleString()}</p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatus('approved')}
                  disabled={request.status === 'approved'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-success-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-success-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={16} /> Approve request
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('rejected')}
                  disabled={request.status === 'rejected'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger-500/30 bg-danger-500/5 px-4 py-2.5 text-sm font-bold text-danger-500 transition hover:bg-danger-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={16} /> Reject request
                </button>
                {request.status !== 'pending' && (
                  <button type="button" onClick={() => setStatus('pending')} className="text-xs font-bold text-ink-400 hover:text-primary-700">
                    Reset to pending
                  </button>
                )}
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Contact" />
            <div className="space-y-3 p-5 text-sm sm:p-6">
              <p className="font-bold text-ink-800">{request.contactName}</p>
              <p className="text-ink-400">{request.role || 'Role not specified'}</p>
              <p className="flex items-center gap-2 text-ink-600"><Mail size={14} /> {request.email || 'Not provided'}</p>
              <p className="flex items-center gap-2 text-ink-600"><Phone size={14} /> {request.phone || 'Not provided'}</p>
              <p className="flex items-center gap-2 text-ink-600"><MapPin size={14} /> {request.city || 'Not specified'}</p>
            </div>
          </Panel>
        </div>
      </div>
    </AdminLayout>
  );
}
