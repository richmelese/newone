import { AlertTriangle } from 'lucide-react';
import Button from './Button';

type ErrorStateProps = {
  title: string;
  subtitle?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export default function ErrorState({ title, subtitle, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card-lg bg-white px-6 py-16 text-center shadow-card">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-500/10 text-danger-500">
        <AlertTriangle size={26} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-ink-900">{title}</h3>
      {subtitle && <p className="max-w-sm text-ink-500">{subtitle}</p>}
      {onRetry && retryLabel && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
