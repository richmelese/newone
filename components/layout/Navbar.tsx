import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown, Menu, X, Landmark } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { useAuthModal } from '@/lib/authModal';
import LanguageToggle from '@/components/ui/LanguageToggle';
import Button from '@/components/ui/Button';

type NavbarProps = {
  overlapHeader?: boolean;
};

export default function Navbar(_props: NavbarProps) {
  const { t } = useLanguage();
  const { user, hydrated, signOut } = useAuth();
  const { openSignIn } = useAuthModal();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const solid = true;

  const profileInitials = useMemo(
    () => user?.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'ET',
    [user?.name],
  );

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
    }
    document.addEventListener('mousedown', closeProfileMenu);
    return () => document.removeEventListener('mousedown', closeProfileMenu);
  }, []);

  const profileLinks = [
    { href: '/account/profile', label: 'Profile' },
    { href: '/admin/hotels', label: 'My properties' },
  ];

  const navLinks = [
    { href: '/search', label: t.navHotels },
    { href: '/destinations', label: t.navDestinations },
    { href: '/experiences', label: t.navExperiences },
  ];

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4 [perspective:1200px] sm:px-6 sm:pt-5 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          layout={!reduceMotion}
          className={clsx(
            'nav-depth flex h-16 items-center justify-between gap-4 rounded-pill px-4 transition-all duration-300 sm:px-6',
            solid
              ? 'bg-white/95 shadow-lift ring-1 ring-black/5 backdrop-blur-2xl'
              : 'bg-white/10 shadow-none ring-1 ring-white/15 backdrop-blur-md',
          )}
        >
          <Link
            href="/"
            className={clsx(
              'flex items-center gap-2 font-heading text-xl font-bold transition-colors duration-300',
              solid ? 'text-ink-900' : 'text-white',
            )}
          >
            <motion.span
              whileHover={reduceMotion ? undefined : { rotateY: 180, rotateX: -10, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 shadow-[0_6px_0_rgba(11,26,46,0.22)] [transform-style:preserve-3d]"
            >
              <Landmark size={18} className="text-white" />
            </motion.span>
            {t.brand}
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const active = router.pathname === link.href;
              return (
                <motion.span
                  key={link.href}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'relative block py-2 text-sm font-semibold transition-colors duration-300',
                      solid
                        ? active
                          ? 'text-primary-700'
                          : 'text-ink-600 hover:text-primary-700'
                        : active
                          ? 'text-accent-300'
                          : 'text-white/85 hover:text-white',
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="navbar-active-link"
                        className={clsx('absolute inset-x-0 -bottom-0.5 h-0.5 rounded-pill', solid ? 'bg-primary-500' : 'bg-primary-300')}
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.span>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle
              className={
                solid
                  ? undefined
                  : 'border-white/30 text-white hover:border-white/50 hover:text-white'
              }
            />
            {hydrated && (user ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-label="Open profile menu"
                  aria-expanded={profileMenuOpen}
                  className="flex items-center gap-2 rounded-pill py-1 pl-1 pr-2 text-sm font-semibold text-ink-800 transition hover:bg-neutral-100"
                >
                  <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-800 text-xs font-extrabold text-white shadow-soft ring-2 ring-white">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : profileInitials}
                  </span>
                  <span className="max-w-24 truncate">{user.name}</span>
                  <ChevronDown size={15} className={clsx('text-ink-400 transition-transform', profileMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute right-0 top-[calc(100%+14px)] z-50 w-48 origin-top-right rounded-xl bg-white p-2 shadow-[0_18px_45px_rgba(11,36,54,0.18)] ring-1 ring-black/5"
                    >
                      <span className="absolute -top-2 right-7 h-4 w-4 rotate-45 rounded-sm bg-white" aria-hidden="true" />
                      <nav aria-label="Profile menu" className="relative">
                        {profileLinks.map((item) => (
                          <Link key={item.label} href={item.href} onClick={() => setProfileMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#173f2a] transition hover:bg-[#8df19a]/35">
                            {item.label}
                          </Link>
                        ))}
                        <button type="button" onClick={() => { setProfileMenuOpen(false); signOut(); }} className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-[#173f2a] transition hover:bg-[#8df19a]/35">
                          Sign out
                        </button>
                      </nav>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button type="button" onClick={() => openSignIn('/account/profile')} size="sm" variant="outline">
                {t.signInButton}
              </Button>
            ))}
            <Button href="/for-hotels/get-started" size="sm" variant={solid ? 'dark' : 'secondary'}>
              {t.navListYourHotel}
            </Button>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className={clsx(
              'rounded-full p-2 transition-colors duration-300 lg:hidden',
              solid ? 'text-ink-800' : 'text-white',
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-x-0 top-full z-40 mt-2 origin-top rounded-card-lg bg-white p-4 shadow-lift lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-neutral-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 flex items-center gap-3">
                <LanguageToggle />
                {hydrated && (user ? (
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-neutral-100 px-3 py-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-800 text-xs font-extrabold text-white">
                      {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : profileInitials}
                    </span>
                    <span className="truncate text-sm font-semibold text-ink-800">{user.name}</span>
                  </div>
                ) : (
                  <Button type="button" size="sm" fullWidth variant="outline" onClick={() => { setMobileOpen(false); openSignIn('/account/profile'); }}>
                    {t.signInButton}
                  </Button>
                ))}
              </div>
              {hydrated && user && (
                <nav aria-label="Mobile profile menu" className="mt-3 border-t border-neutral-200 pt-2">
                  {profileLinks.map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#173f2a] transition hover:bg-[#8df19a]/35">{item.label}</Link>
                  ))}
                  <button type="button" onClick={() => { setMobileOpen(false); signOut(); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#173f2a] transition hover:bg-[#8df19a]/35">Sign out</button>
                </nav>
              )}
              <Button href="/for-hotels/get-started" size="sm" fullWidth variant="dark" className="mt-3" onClick={() => setMobileOpen(false)}>
                {t.navListYourHotel}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
