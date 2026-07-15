import { useState, type ReactNode } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';

export default function MobileFilterSheet({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-pill border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 lg:hidden"
      >
        <SlidersHorizontal size={16} />
        {t.filtersTitle}
      </motion.button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
            <motion.button
              type="button"
              aria-label="Close filters"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-ink-900/50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="relative max-h-[85vh] overflow-y-auto rounded-t-card-lg bg-white p-5 shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-ink-900">{t.filtersTitle}</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 hover:bg-neutral-100">
                  <X size={20} />
                </button>
              </div>
              {children}
              <Button onClick={() => setOpen(false)} fullWidth className="mt-6">
                {t.filterApply}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
