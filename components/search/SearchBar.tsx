import { useState } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import Button from '@/components/ui/Button';
import DestinationAutocomplete from './DestinationAutocomplete';

function resolveDestinationSlug(text: string): string | undefined {
  const query = text.trim().toLowerCase();
  if (!query) return undefined;

  const exact = destinations.find((destination) => destination.name.toLowerCase() === query);
  if (exact) return exact.slug;

  const partial = destinations.find(
    (destination) => destination.name.toLowerCase().includes(query) || destination.region.toLowerCase().includes(query),
  );
  return partial?.slug;
}

type SearchBarProps = {
  className?: string;
  compact?: boolean;
};

export default function SearchBar({ className, compact }: SearchBarProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [destinationSlug, setDestinationSlug] = useState<string | undefined>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const resolvedSlug = destinationSlug ?? resolveDestinationSlug(destination);

    if (resolvedSlug) {
      router.push(`/destinations/${resolvedSlug}`);
      return;
    }

    const query = destination.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative z-30 grid grid-cols-1 gap-2.5 overflow-visible rounded-card-lg bg-white p-3 shadow-hero sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-3 lg:rounded-full ${className ?? ''}`}
    >
      <DestinationAutocomplete
        value={destination}
        onChange={(value, slug) => {
          setDestination(value);
          setDestinationSlug(slug);
        }}
      />

      <Button type="submit" size={compact ? 'md' : 'lg'} className="w-full sm:w-auto">
        {t.searchButton}
      </Button>
    </form>
  );
}
