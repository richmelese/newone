import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Building2, Camera, CheckCircle2, Heart, LockKeyhole, Pencil, Settings, Star, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useFavorites } from '@/lib/favorites';
import { getMyReviews } from '@/lib/reviewsService';
import FavoritesList from '@/components/account/FavoritesList';
import MyReviews from '@/components/reviews/MyReviews';

const profileTabs = [
  { id: 'activity', label: 'Activity feed' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'properties', label: 'Properties' },
];

function usernameFromEmail(email: string) {
  return email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '') || 'traveler';
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, hydrated, signIn, signOut } = useAuth();
  const { favorites } = useFavorites();
  const [reviewCount, setReviewCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [name, setName] = useState('');
  const activeTab = typeof router.query.tab === 'string' && ['activity', 'favorites', 'reviews', 'properties'].includes(router.query.tab)
    ? router.query.tab
    : 'reviews';

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/account/sign-in?next=%2Faccount%2Fprofile');
    }
  }, [hydrated, router, user]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    getMyReviews(user.email).then((reviews) => setReviewCount(reviews.length));
  }, [user]);

  const initials = useMemo(
    () => user?.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'ET',
    [user?.name],
  );

  if (!hydrated || !user) {
    return (
      <Layout seo={{ title: 'Your profile', description: 'Your Ethiopidia traveler profile.', path: '/account/profile', noindex: true }} showForHotelsBand={false}>
        <div className="grid min-h-[55vh] place-items-center bg-neutral-100">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-700" aria-label="Loading profile" />
        </div>
      </Layout>
    );
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !user) return;
    signIn({ ...user, name: trimmed });
    setEditing(false);
  }

  function updateAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') signIn({ ...user, avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  return (
    <Layout seo={{ title: `${user.name}'s profile`, description: 'Your Ethiopidia traveler profile.', path: '/account/profile', noindex: true }} showForHotelsBand={false}>
      <div className="min-h-[70vh] bg-neutral-100 pb-14 pt-2 sm:pb-20 sm:pt-4">
        <PageShell>
          <section className="overflow-hidden rounded-card-lg border border-neutral-200 bg-white shadow-soft">
            <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-start sm:px-8 sm:py-8">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-visible rounded-full bg-gradient-to-br from-primary-600 to-primary-900 font-heading text-3xl font-extrabold text-white shadow-card ring-4 ring-primary-50">
                {user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name}'s profile`} className="h-full w-full rounded-full object-cover" /> : initials}
                <label className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-white bg-accent-500 text-white transition hover:scale-105 hover:bg-accent-600" aria-label="Add a profile photo">
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={updateAvatar} className="sr-only" />
                </label>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate font-heading text-2xl font-extrabold text-ink-900">{user.name}</h1>
                <p className="mt-0.5 text-sm text-ink-400">@{usernameFromEmail(user.email)}</p>
                <div className="mt-5">
                  <p className="text-sm font-bold text-primary-800">Contributions</p>
                  <p className="font-heading text-xl font-bold text-ink-400">{reviewCount}</p>
                </div>
              </div>

              <div className="relative flex gap-2 sm:ml-auto">
                <button type="button" onClick={() => setEditing(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-bold text-ink-800 transition hover:border-primary-300 hover:bg-primary-50">
                  <Pencil size={15} /> Edit profile
                </button>
                <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-lg border border-neutral-300 text-ink-600 transition hover:border-primary-300 hover:bg-primary-50" aria-label="Profile settings" aria-expanded={settingsOpen}>
                  <Settings size={17} />
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 top-12 z-20 w-60 rounded-xl border border-neutral-200 bg-white p-3 shadow-lift">
                    <p className="truncate px-2 text-xs text-ink-500">Signed in as {user.email}</p>
                    <button type="button" onClick={signOut} className="mt-2 w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-danger-500 transition hover:bg-danger-500/5">Sign out</button>
                  </div>
                )}
              </div>
            </div>

            <nav aria-label="Profile navigation" className="flex gap-1 overflow-x-auto border-t border-neutral-200 px-4 sm:px-7">
              {profileTabs.map((tab) => (
                <Link key={tab.id} href={`/account/profile?tab=${tab.id}`} scroll={false} className={`shrink-0 border-b-2 px-3 py-4 text-sm font-semibold transition ${activeTab === tab.id ? 'border-accent-500 text-primary-800' : 'border-transparent text-ink-500 hover:text-primary-700'}`}>
                  {tab.label}
                </Link>
              ))}
            </nav>
          </section>

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-card-lg border border-neutral-200 bg-white p-5 shadow-soft">
              <h2 className="font-heading text-lg font-bold text-ink-900">Your achievements</h2>
              <p className="mt-1 text-sm text-ink-500">Start sharing to unlock</p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700">{reviewCount ? <CheckCircle2 size={18} /> : <LockKeyhole size={18} />}</span>
                  <div><p className="text-sm font-bold text-ink-800">Write your first review</p><p className="mt-0.5 text-xs text-ink-500">{reviewCount ? 'Achievement unlocked' : 'Unlock review milestones'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700"><LockKeyhole size={18} /></span>
                  <div><p className="text-sm font-bold text-ink-800">Save your first favorite</p><p className="mt-0.5 text-xs text-ink-500">{favorites.length ? 'Achievement unlocked' : 'Unlock explorer milestones'}</p></div>
                </div>
                {showAllAchievements && (
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700">{user.avatarUrl ? <CheckCircle2 size={18} /> : <LockKeyhole size={18} />}</span>
                    <div><p className="text-sm font-bold text-ink-800">Add a profile photo</p><p className="mt-0.5 text-xs text-ink-500">{user.avatarUrl ? 'Achievement unlocked' : 'Make your profile yours'}</p></div>
                  </div>
                )}
              </div>
              <Button type="button" onClick={() => setShowAllAchievements((show) => !show)} variant="dark" size="sm" fullWidth className="mt-4">{showAllAchievements ? 'Show less' : 'View all'}</Button>
            </aside>

            {activeTab === 'reviews' && (
              <section className={`rounded-card-lg border border-neutral-200 bg-white shadow-soft ${reviewCount ? 'p-6' : 'px-6 py-12 text-center sm:px-12 sm:py-16'}`}>
                {reviewCount ? <MyReviews /> : <>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-50 text-accent-600"><Star size={25} /></span>
                  <h2 className="mt-4 font-heading text-xl font-extrabold text-ink-900">Write your first review!</h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-500">Your opinion matters. Help other travelers discover great hotels, experiences, and places across Ethiopia.</p>
                  <Button href="/reviews" size="md" className="mt-6">Write a review</Button>
                </>}
              </section>
            )}

            {activeTab === 'favorites' && (
              <section className="rounded-card-lg border border-neutral-200 bg-white p-6 shadow-soft"><FavoritesList /></section>
            )}

            {activeTab === 'activity' && (
              <section className="rounded-card-lg border border-neutral-200 bg-white p-6 shadow-soft">
                <h2 className="font-heading text-xl font-extrabold text-ink-900">Recent activity</h2>
                {reviewCount === 0 && favorites.length === 0 ? (
                  <div className="py-12 text-center"><p className="text-ink-500">Your travel activity will appear here.</p><Button href="/search" className="mt-5">Start exploring</Button></div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {favorites.length > 0 && <Link href="/account/profile?tab=favorites" className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4 transition hover:bg-neutral-100"><span className="grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-600"><Heart size={18} /></span><div><p className="font-semibold text-ink-800">Saved {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}</p><p className="text-sm text-ink-500">View your saved places</p></div></Link>}
                    {reviewCount > 0 && <Link href="/account/profile?tab=reviews" className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4 transition hover:bg-neutral-100"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary-700"><Star size={18} /></span><div><p className="font-semibold text-ink-800">Shared {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p><p className="text-sm text-ink-500">See your contributions</p></div></Link>}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'properties' && (
              <section className="rounded-card-lg border border-neutral-200 bg-white px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary-700"><Building2 size={25} /></span>
                <h2 className="mt-4 font-heading text-xl font-extrabold text-ink-900">My properties</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-500">View, add, and manage the properties you list on Ethiopidia.</p>
                <Button href="/admin/hotels" variant="dark" size="md" className="mt-6">Manage properties</Button>
              </section>
            )}
          </div>
        </PageShell>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-5" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
          <button type="button" onClick={() => setEditing(false)} className="absolute inset-0 bg-ink-900/65 backdrop-blur-sm" aria-label="Close edit profile" />
          <form onSubmit={saveProfile} className="relative w-full max-w-md rounded-card-lg bg-white p-7 shadow-hero">
            <button type="button" onClick={() => setEditing(false)} className="absolute right-4 top-4 rounded-full p-2 text-ink-400 hover:bg-neutral-100" aria-label="Close"><X size={19} /></button>
            <h2 id="edit-profile-title" className="font-heading text-2xl font-extrabold text-ink-900">Edit profile</h2>
            <label className="mt-6 block text-sm font-semibold text-ink-700">Display name
              <input value={name} onChange={(event) => setName(event.target.value)} required className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3.5 outline-none focus:border-primary-500" />
            </label>
            <label className="mt-4 block text-sm font-semibold text-ink-700">Email
              <input value={user.email} disabled className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-3.5 text-ink-400" />
            </label>
            <div className="mt-6 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button><Button type="submit">Save changes</Button></div>
          </form>
        </div>
      )}
    </Layout>
  );
}
