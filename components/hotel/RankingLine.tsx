import { useLanguage } from '@/lib/language';
import { rankWithinDestination } from '@/lib/ranking';
import type { Hotel } from '@/types';

export default function RankingLine({ hotel, destinationName, className }: { hotel: Hotel; destinationName: string; className?: string }) {
  const { t } = useLanguage();
  const { rank, total } = rankWithinDestination(hotel);

  return (
    <p className={`text-xs font-semibold text-primary-700 ${className ?? ''}`}>
      {t.rankingPrefix}
      {rank} {t.rankingOf} {total} {t.rankingHotelsIn} {destinationName}
    </p>
  );
}
