import type { FormEvent, ReactNode } from 'react';
import { X } from 'lucide-react';

export default function AdminEditModal({
  title,
  description,
  children,
  onClose,
  onSubmit,
  submitLabel = 'Save changes',
  submitting = false,
  submittingLabel = 'Saving…',
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
  submitting?: boolean;
  submittingLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="admin-edit-title">
      <button type="button" className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm" onClick={onClose} aria-label="Close editor" />
      <form onSubmit={onSubmit} className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-hero sm:rounded-[1.5rem]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-6">
          <div><h2 id="admin-edit-title" className="font-heading text-xl font-extrabold text-primary-900">{title}</h2><p className="mt-1 text-sm text-ink-400">{description}</p></div>
          <button type="button" onClick={onClose} className="rounded-lg border border-neutral-200 p-2 text-ink-500 hover:bg-neutral-100" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">{children}</div>
        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <button type="button" onClick={onClose} disabled={submitting} className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-ink-500 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-xl bg-primary-800 px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-primary-700 disabled:cursor-wait disabled:opacity-60">{submitting ? submittingLabel : submitLabel}</button>
        </div>
      </form>
    </div>
  );
}

export const adminFieldClass = 'mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-ink-700 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-50';
export const adminTextAreaClass = 'mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm font-medium text-ink-700 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-50';
