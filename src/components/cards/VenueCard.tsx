'use client';
import { Venue } from '@/types';
import { rp } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export default function VenueCard({ venue: v }: { venue: Venue }) {
  const { openSheet } = useAppStore();

  return (
    <div 
      className="bg-white rounded-[14px] p-3.5 sm:p-4 elev-raised border border-transparent flex items-center gap-3 sm:gap-4 cursor-pointer select-none transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.98]"
      tabIndex={0}
      onClick={() => openSheet('book', v.id)}
      onKeyDown={(e) => e.key === 'Enter' && openSheet('book', v.id)}
    >
      <div className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] rounded-[12px] bg-[#edebe9] grid place-items-center text-[20px] sm:text-[22px] shrink-0">
        {v.e}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] sm:text-[16px] font-bold text-[#006241] truncate leading-snug">
          {v.n}
        </div>
        <div className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 truncate leading-normal">
          {v.sports} · {v.dist} · {v.owner}
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-[13.5px] font-bold whitespace-nowrap block ${v.rate === 0 ? 'text-[#006241]' : 'text-[#00754A]'}`}>
          {v.rate === 0 ? 'Gratis' : rp(v.rate)}
        </span>
        <span className="text-[11px] text-[rgba(0,0,0,0.58)] block whitespace-nowrap">
          {v.rate === 0 ? 'Fasilitas umum' : '/ jam'}
        </span>
      </div>
    </div>
  );
}
