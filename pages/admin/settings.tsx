import { useState } from 'react';
import { CheckCircle2, Globe2, Languages, Mail, Save, ShieldCheck } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminButton, Panel, PanelHeader } from '@/components/admin/AdminUi';

function SettingToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div><p className="text-sm font-bold text-ink-700">{label}</p><p className="mt-1 text-xs leading-relaxed text-ink-400">{description}</p></div>
      <button type="button" onClick={onChange} className={`relative h-7 w-12 shrink-0 rounded-pill transition ${checked ? 'bg-primary-700' : 'bg-neutral-300'}`} aria-pressed={checked}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-6' : 'left-1'}`} /></button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ maintenance: false, reviews: true, bookingLinks: true, amharic: true, digest: true });
  const toggle = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  function save() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  }

  return (
    <AdminLayout
      title="Settings"
      description="Configure the frontend experience and admin preferences. Values are kept only for this browser session."
      eyebrow="Workspace configuration"
      actions={<AdminButton onClick={save}><Save size={16} /> Save changes</AdminButton>}
    >
      {saved && <div className="mb-5 flex items-center gap-2 rounded-xl border border-success-500/20 bg-success-500/10 px-4 py-3 text-sm font-bold text-success-500"><CheckCircle2 size={18} /> Settings saved in the UI preview.</div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-6">
          <Panel>
            <PanelHeader title="General website" description="Public identity and contact information" action={<Globe2 size={19} className="text-primary-600" />} />
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-xs font-bold text-ink-500">Website name<input defaultValue="Ethiopidia" className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm font-medium outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-50" /></label>
              <label className="text-xs font-bold text-ink-500">Support email<input type="email" defaultValue="hello@ethiopidia.com" className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm font-medium outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-50" /></label>
              <label className="text-xs font-bold text-ink-500 sm:col-span-2">Website description<textarea defaultValue="Discover Ethiopia's destinations, hotels, culture, and unforgettable local experiences." rows={3} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 px-3 py-3 text-sm font-medium outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-50" /></label>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Publishing controls" description="Control visible features across the visitor website" action={<ShieldCheck size={19} className="text-primary-600" />} />
            <div className="divide-y divide-neutral-200 px-5 sm:px-6">
              <SettingToggle label="Maintenance mode" description="Show a temporary maintenance message instead of public content." checked={settings.maintenance} onChange={() => toggle('maintenance')} />
              <SettingToggle label="Guest reviews" description="Display approved hotel reviews and guest rating summaries." checked={settings.reviews} onChange={() => toggle('reviews')} />
              <SettingToggle label="External booking links" description="Allow visitors to continue to partner booking websites." checked={settings.bookingLinks} onChange={() => toggle('bookingLinks')} />
              <SettingToggle label="Amharic language" description="Keep the Amharic language option available in navigation." checked={settings.amharic} onChange={() => toggle('amharic')} />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Localization" description="Default language and regional formats" action={<Languages size={19} className="text-accent-500" />} />
            <div className="space-y-5 p-5 sm:p-6">
              <label className="block text-xs font-bold text-ink-500">Default language<select defaultValue="English" className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium outline-none focus:border-primary-300"><option>English</option><option>Amharic</option></select></label>
              <label className="block text-xs font-bold text-ink-500">Currency<select defaultValue="ETB" className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium outline-none focus:border-primary-300"><option>ETB — Ethiopian Birr</option><option>USD — US Dollar</option></select></label>
              <label className="block text-xs font-bold text-ink-500">Timezone<select defaultValue="Africa/Addis_Ababa" className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium outline-none focus:border-primary-300"><option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option></select></label>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Notifications" description="Choose what reaches the admin inbox" action={<Mail size={19} className="text-accent-500" />} />
            <div className="px-5 sm:px-6"><SettingToggle label="Weekly content digest" description="A summary of listings, reviews, and content health." checked={settings.digest} onChange={() => toggle('digest')} /></div>
          </Panel>

          <div className="rounded-card-lg bg-primary-gradient p-6 text-white shadow-hero">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-200">UI prototype</p>
            <h2 className="mt-3 font-heading text-xl font-extrabold">No server connection</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-100">These controls demonstrate the complete admin experience without writing to a database or calling an API.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
