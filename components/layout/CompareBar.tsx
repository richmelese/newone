import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import { useCompare } from '@/lib/compare';
import { getHotel } from '@/data/hotels';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function CompareBar() {
  const { t } = useLanguage();
  const { compareIds, hydrated, removeFromCompare, clearCompare, goToCompare } = useCompare();

  const show = hydrated && compareIds.length > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/97 px-4 py-3 shadow-lift backdrop-blur-sm sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-ink-800">
                {t.compareBarTitle} ({compareIds.length})
              </span>
              <div className="flex -space-x-2">
                <AnimatePresence initial={false}>
                  {compareIds.map((id) => {
                    const hotel = getHotel(id);
                    if (!hotel) return null;
                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-soft"
                      >
                        <Image src={hotel.photos[0]} alt={hotel.name} fill sizes="40px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFromCompare(id)}
                          aria-label={`Remove ${hotel.name}`}
                          className="absolute inset-0 hidden items-center justify-center bg-ink-900/60 text-white group-hover:flex"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={clearCompare} className="text-sm font-medium text-ink-500 transition-colors hover:text-danger-500">
                {t.filterClearAll}
              </button>
              <Button size="sm" onClick={goToCompare}>
                {t.compareBarView}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
