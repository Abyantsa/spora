'use client';
import { Venue } from '@/types';
import { rp } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export default function VenueCard({ venue }: { venue: Venue }) {
  const { openSheet } = useAppStore();

  return (
    <div 
      className="bg-card border border-line rounded-radius p-[12px_13px] flex items-center gap-[11px] cursor-pointer transition-colors hover:border-court/35 focus-visible:outline-amber"
      tabIndex={0}
      onClick={() => openSheet('book', venue.id)}
      onKeyDown={(e) => e.key === 'Enter' && openSheet('book', venue.id)}
    >
      <div className="w-[34px] h-[34px] rounded-[9px] bg-court-soft grid place-items-center text-[16px] shrink-0">
        {venue.e}
      </div>
      <div>
        <div className="text-[14px] font-semibold tracking-[-.01em]">{venue.n}</div>
        <div className="text-[11.5px] text-muted mt-[2px]">{venue.sports} · {venue.dist}</div>
      </div>
      <div className={`ml-auto text-right text-[13px] font-bold whitespace-nowrap ${venue.rate === 0 ? 'text-court' : ''}`}>
        {venue.rate === 0 ? 'Gratis' : rp(venue.rate)}
        <small className="block text-[10px] text-muted font-medium mt-[1px]">{venue.rate === 0 ? 'fasilitas publik' : 'per jam'}</small>
      </div>
    </div>
  );
}
