import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Landmark } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import LanguageToggle from '@/components/ui/LanguageToggle';
import Button from '@/components/ui/Button';

type NavbarProps = {
  overlapHeader?: boolean;
};

export default function Navbar(_props: NavbarProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const solid = true;

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
                <Button href="/for-hotels/get-started" size="sm" fullWidth variant="dark">
                  {t.navListYourHotel}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
