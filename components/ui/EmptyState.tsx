import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  icon?: typeof SearchX;
  action?: ReactNode;
};

export default function EmptyState({ title, subtitle, icon: Icon = SearchX, action }: EmptyStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3 rounded-card-lg bg-white px-6 py-16 text-center shadow-card"
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-ink-400"
      >
        <Icon size={26} />
      </motion.div>
      <h3 className="font-heading text-lg font-semibold text-ink-900">{title}</h3>
      {subtitle && <p className="max-w-sm text-ink-500">{subtitle}</p>}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
