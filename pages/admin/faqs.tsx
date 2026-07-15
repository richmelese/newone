import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, Eye, EyeOff, HelpCircle, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEditModal, { adminTextAreaClass } from '@/components/admin/AdminEditModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, MetricCard, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { initialAdminFaqs, loadAdminFaqs, saveAdminFaqs, type AdminFaq } from '@/lib/adminFaqs';

const PAGE_SIZE = 6;

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<AdminFaq[]>(initialAdminFaqs);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminFaq | null>(null);

  useEffect(() => setFaqs(loadAdminFaqs()), []);
  useEffect(() => setPage(1), [query]);

  const filtered = useMemo(() => faqs.filter((faq) => `${faq.question.en} ${faq.answer.en} ${faq.question.am}`.toLowerCase().includes(query.toLowerCase())), [faqs, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const publishedCount = faqs.filter((faq) => faq.published).length;

  function commit(updater: (current: AdminFaq[]) => AdminFaq[]) {
    setFaqs((current) => {
      const next = updater(current);
      saveAdminFaqs(next);
      return next;
    });
  }

  function openNewFaq() {
    setEditing({ id: `faq-${Date.now()}`, question: { en: '', am: '' }, answer: { en: '', am: '' }, published: true });
  }

  function saveFaq(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    commit((current) => current.some((faq) => faq.id === editing.id)
      ? current.map((faq) => faq.id === editing.id ? editing : faq)
      : [...current, editing]);
    setEditing(null);
  }

  function removeFaq(id: string) {
    if (!window.confirm('Remove this FAQ item?')) return;
    commit((current) => current.filter((faq) => faq.id !== id));
  }

  return (
    <AdminLayout title="FAQ" description="Manage the frequently asked questions displayed on the public FAQ page." eyebrow="Help content" actions={<AdminButton onClick={openNewFaq}><Plus size={16} /> Add FAQ</AdminButton>}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total questions" value={faqs.length} detail="English and Amharic entries" icon={<HelpCircle size={20} />} />
        <MetricCard label="Published" value={publishedCount} detail="Visible on the public website" icon={<Eye size={20} />} tone="green" />
        <MetricCard label="Drafts" value={faqs.length - publishedCount} detail="Hidden from visitors" icon={<EyeOff size={20} />} tone="orange" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions and answers..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" /></div>
          <p className="text-xs font-semibold text-ink-400">{filtered.length} questions</p>
        </div>
        <div className="divide-y divide-neutral-200">
          {paginated.map((faq, index) => (
            <article key={faq.id} className="grid gap-4 px-5 py-5 transition hover:bg-primary-50/35 sm:grid-cols-[auto_1fr_auto] sm:px-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 font-heading text-xs font-extrabold text-primary-700">{(page - 1) * PAGE_SIZE + index + 1}</span>
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-sm font-extrabold text-primary-900">{faq.question.en}</h2><StatusPill tone={faq.published ? 'green' : 'gray'}>{faq.published ? 'Published' : 'Draft'}</StatusPill></div><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{faq.answer.en}</p><p className="mt-2 truncate text-xs text-ink-400">{faq.question.am}</p></div>
              <div className="flex items-start gap-1 sm:justify-end"><button type="button" onClick={() => commit((current) => current.map((item) => item.id === faq.id ? { ...item, published: !item.published } : item))} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label={faq.published ? 'Unpublish FAQ' : 'Publish FAQ'}>{faq.published ? <Eye size={16} /> : <EyeOff size={16} />}</button><button type="button" onClick={() => setEditing(faq)} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label="Edit FAQ"><Edit3 size={16} /></button><button type="button" onClick={() => removeFaq(faq.id)} className="rounded-lg p-2 text-ink-400 hover:bg-danger-500/5 hover:text-danger-500" aria-label="Remove FAQ"><Trash2 size={16} /></button></div>
            </article>
          ))}
          {!filtered.length && <TableEmpty message="No FAQ items match your search." />}
        </div>
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>

      {editing && (
        <AdminEditModal title={faqs.some((faq) => faq.id === editing.id) ? 'Edit FAQ' : 'Add FAQ'} description="Provide both English and Amharic visitor-facing content." onClose={() => setEditing(null)} onSubmit={saveFaq}>
          <label className="text-xs font-bold text-ink-500">English question<textarea value={editing.question.en} onChange={(event) => setEditing({ ...editing, question: { ...editing.question, en: event.target.value } })} required rows={3} className={adminTextAreaClass} /></label>
          <label className="text-xs font-bold text-ink-500">Amharic question<textarea value={editing.question.am} onChange={(event) => setEditing({ ...editing, question: { ...editing.question, am: event.target.value } })} required rows={3} className={adminTextAreaClass} /></label>
          <label className="text-xs font-bold text-ink-500">English answer<textarea value={editing.answer.en} onChange={(event) => setEditing({ ...editing, answer: { ...editing.answer, en: event.target.value } })} required rows={7} className={adminTextAreaClass} /></label>
          <label className="text-xs font-bold text-ink-500">Amharic answer<textarea value={editing.answer.am} onChange={(event) => setEditing({ ...editing, answer: { ...editing.answer, am: event.target.value } })} required rows={7} className={adminTextAreaClass} /></label>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-4 text-sm font-bold text-ink-700 sm:col-span-2">Published on website<button type="button" onClick={() => setEditing({ ...editing, published: !editing.published })} className={`relative h-7 w-12 rounded-pill transition ${editing.published ? 'bg-success-500' : 'bg-neutral-300'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${editing.published ? 'left-6' : 'left-1'}`} /></button></label>
        </AdminEditModal>
      )}
    </AdminLayout>
  );
}
