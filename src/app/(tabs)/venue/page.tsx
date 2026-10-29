'use client';
import { useAppStore } from '@/lib/store';
import VenueCard from '@/components/cards/VenueCard';

export default function VenuePage() {
  const { state } = useAppStore();
  
  const freeVenues = state.venues.filter(v => v.rate === 0);
  const paidVenues = state.venues.filter(v => v.rate > 0);

  return (
    <>
      <div className="bg-court text-white p-[20px_18px_18px] lg:p-[34px_40px_28px]">
        <h2 className="text-[20px] font-bold tracking-[-.02em]">Sewa venue</h2>
        <p className="text-[13px] text-white/72 mt-[4px]">Pesan lapangan per jam, termasuk fasilitas kampus</p>
      </div>
      
      <div className="p-[16px_14px_26px] lg:p-[26px_40px_50px] lg:max-w-[1180px] lg:mx-auto lg:w-full">
        <div className="flex items-center justify-between m-[2px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Fasilitas kampus & publik</h3>
          <span className="text-[12px] text-muted">bebas biaya</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[9px]">
          {freeVenues.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>

        <div className="flex items-center justify-between m-[20px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Venue komersial</h3>
          <span className="text-[12px] text-muted">sewa per jam</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[9px]">
          {paidVenues.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>
      </div>
    </>
  );
}
