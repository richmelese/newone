import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { MapPin, Search } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { useLanguage } from '@/lib/language';

type DestinationAutocompleteProps = {
  value: string;
  onChange: (value: string, slug?: string) => void;
};

export default function DestinationAutocomplete({ value, onChange }: DestinationAutocompleteProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q));
  }, [value]);

  const select = (slug: string, name: string) => {
    onChange(name, slug);
    setOpen(false);
    router.push(`/destinations/${slug}`);
  };

  return (
    <div className="relative w-full min-w-0">
      <div className="flex items-center gap-2.5 rounded-pill border border-neutral-300/90 bg-white/90 px-4 py-3 shadow-[inset_0_1px_2px_rgba(11,36,54,.04)] transition-all duration-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-400/15">
        <Search size={18} className="shrink-0 text-primary-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t.searchDestinationPlaceholder}
          aria-label={t.searchDestinationLabel}
          className="w-full min-w-0 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
        />
      </div>
      {open && matches.length > 0 && (
        <ul className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-72 overflow-y-auto rounded-card border border-neutral-200 bg-white p-2 shadow-lift">
          {matches.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(d.slug, d.name)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-neutral-100"
              >
                <MapPin size={16} className="shrink-0 text-primary-600" />
                <span>
                  <span className="block text-sm font-semibold text-ink-800">{d.name}</span>
                  <span className="block text-xs text-ink-400">{d.region}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
