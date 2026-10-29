'use client';
import { useAppStore } from '@/lib/store';
import VenueCard from '@/components/cards/VenueCard';

export default function VenuePage() {
  const { state } = useAppStore();
  
  const freeVenues = state.venues.filter(v => v.rate === 0);
  const paidVenues = state.venues.filter(v => v.rate > 0);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#006241] tracking-[-0.01em]">
          Sewa Lapangan & Fasilitas Olahraga
        </h1>
        <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1 max-w-[65ch] leading-relaxed">
          Pesan lapangan per jam di area Surabaya Timur & Kampus ITS. Bisa langsung dibuka jadi sesi matchmaking patungan.
        </p>
      </div>

      {/* Campus & Public Facilities */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
            Fasilitas Kampus & Publik
          </h2>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
            Bebas biaya mahasiswa
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {freeVenues.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>
      </div>

      {/* Commercial Venues */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
            Venue Komersial Terverifikasi
          </h2>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
            Tarif sewa resmi per jam
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {paidVenues.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>
      </div>
    </div>
  );
}
