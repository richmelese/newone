import { X } from 'lucide-react';
import { motion } from 'framer-motion';

type FilterChipProps = {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
};

export default function FilterChip({ label, onRemove, active, onClick }: FilterChipProps) {
  if (onRemove) {
    return (
      <motion.span
        layout
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-1.5 rounded-pill bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700"
      >
        {label}
        <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="rounded-full hover:bg-primary-100">
          <X size={14} />
        </button>
      </motion.span>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-neutral-300 bg-white text-ink-700 hover:border-primary-400 hover:text-primary-700'
      }`}
    >
      {label}
    </motion.button>
  );
}
