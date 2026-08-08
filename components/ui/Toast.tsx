import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast, type ToastTone } from '@/lib/toast';

const TONE_CONFIG: Record<ToastTone, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'bg-ink-900 text-white' },
  info: { icon: Info, classes: 'bg-primary-700 text-white' },
  error: { icon: XCircle, classes: 'bg-danger-500 text-white' },
};

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { icon: Icon, classes } = TONE_CONFIG[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-card px-4 py-3 shadow-lift ${classes}`}
              role="status"
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="shrink-0 rounded-full p-0.5 opacity-80 hover:opacity-100"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
