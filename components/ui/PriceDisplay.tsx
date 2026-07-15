import { formatEtb } from '@/lib/format';

type PriceDisplayProps = {
  amount: number;
  fromLabel: string;
  perNightLabel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };

export default function PriceDisplay({ amount, fromLabel, perNightLabel, size = 'md', className }: PriceDisplayProps) {
  return (
    <div className={className}>
      <span className="block text-xs uppercase tracking-wide text-ink-400">{fromLabel}</span>
      <span className={`font-heading font-bold text-ink-900 ${sizeClasses[size]}`}>{formatEtb(amount)}</span>
      <span className="ml-1 text-sm text-ink-400">{perNightLabel}</span>
    </div>
  );
}
