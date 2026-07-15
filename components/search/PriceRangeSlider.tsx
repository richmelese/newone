import { formatEtb } from '@/lib/format';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [lo, hi] = value;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-800">
        <span>{formatEtb(lo)}</span>
        <span>{formatEtb(hi)}</span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-pill bg-neutral-200" />
        <div
          className="absolute h-2 rounded-pill bg-primary-500"
          style={{
            left: `${((lo - min) / (max - min)) * 100}%`,
            right: `${100 - ((hi - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 100), hi])}
          className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-soft"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 100)])}
          className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-soft"
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}
