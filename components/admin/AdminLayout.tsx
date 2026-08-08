import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import {
  Bell,
  Compass,
  ExternalLink,
  Hotel,
  HelpCircle,
  Inbox,
  Landmark,
  LayoutDashboard,
  Map,
  Menu,
  MessageSquare,
  Search,
  Settings,
  X,
} from 'lucide-react';
import Seo from '@/components/layout/Seo';
import { loadPropertyRequests } from '@/lib/propertyRequests';

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
};

const navigation = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/destinations', label: 'Destinations', icon: Map },
  { href: '/admin/hotels', label: 'Properties', icon: Hotel },
  { href: '/admin/requests', label: 'Property requests', icon: Inbox },
  { href: '/admin/experiences', label: 'Things to do', icon: Compass },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/faqs', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    setPendingRequests(loadPropertyRequests().filter((request) => request.status === 'pending').length);
  }, []);

  return (
    <div className="flex h-full flex-col bg-primary-900 text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 shadow-cta">
          <Landmark size={20} />
        </span>
        <div>
          <p className="font-heading text-lg font-extrabold leading-none">Ethiopidia</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-300">Admin studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6" aria-label="Admin navigation">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-300">Workspace</p>
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? router.pathname === href : router.pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all',
                active
                  ? 'bg-white text-primary-900 shadow-soft'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon size={18} className={active ? 'text-accent-500' : 'text-primary-300'} />
              <span className="flex-1">{label}</span>
              {href === '/admin/requests' && pendingRequests > 0 && (
                <span className={clsx('rounded-pill px-2 py-0.5 text-[10px] font-bold', active ? 'bg-accent-500 text-white' : 'bg-accent-500/20 text-accent-200')}>
                  {pendingRequests}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-primary-100 transition-colors hover:bg-white/10 hover:text-white"
        >
          View website
          <ExternalLink size={15} />
        </Link>
        <div className="mt-4 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 font-heading text-sm font-extrabold text-accent-700">EA</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">Ethiopidia Admin</p>
            <p className="truncate text-xs text-primary-300">Content manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children, title, description, eyebrow = 'Admin workspace', actions }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-ink-900">
      <Seo title={`${title} — Admin`} description={description} path="/admin" noindex />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <AdminSidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-primary-900/55 backdrop-blur-sm" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-[min(84vw,18rem)] shadow-hero">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-full bg-white/10 p-2 text-white"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-neutral-200 p-2.5 text-ink-600 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                placeholder="Search content, hotels, destinations..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-100/70 pl-10 pr-4 text-sm outline-none transition focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-50"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-pill bg-success-500/10 px-3 py-1.5 text-xs font-bold text-success-500 sm:inline-flex">Website live</span>
              <button type="button" className="relative rounded-xl border border-neutral-200 bg-white p-2.5 text-ink-600 transition hover:bg-neutral-100" aria-label="Notifications">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-600">{eyebrow}</p>
                <h1 className="mt-2 font-heading text-2xl font-extrabold text-primary-900 sm:text-3xl">{title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p>
              </div>
              {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
