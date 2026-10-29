'use client';
import { useState } from 'react';
import { useAppStore, SPORTS } from '@/lib/store';
import VenueCard from '@/components/cards/VenueCard';

export default function VenuePage() {
  const { state, openSheet } = useAppStore();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const filteredVenues = state.venues.filter(v => {
    const matchesSport = selectedSport === 'all' || v.sports.toLowerCase().includes(selectedSport.toLowerCase());
    const matchesQuery = !searchQuery.trim() || 
      v.n.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sports.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesQuery;
  });

  const freeVenues = filteredVenues.filter(v => v.rate === 0);
  const paidVenues = filteredVenues.filter(v => v.rate > 0);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Top Header & CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[12px] font-bold text-[#00754A] uppercase tracking-wider">
            Direktori Komunitas
          </span>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#006241] tracking-[-0.01em] mt-0.5">
            Lapangan & Sarana Olahraga
          </h1>
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] mt-1 max-w-[65ch] leading-relaxed">
            Katalog crowdsourced sarana olahraga di sekitar Surabaya Timur & ITS. Buka rute Google Maps, cek tarif sewa, atau langsung bikin sesi matchmaking patungan.
          </p>
        </div>

        <button
          onClick={() => openSheet('add-venue')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[13.5px] font-bold shadow-[0_2px_8px_rgba(0,117,74,0.2)] transition-all cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
        >
          <span>+</span>
          <span>Daftarkan Lapangan Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari lapangan, nama jalan, atau pengelola..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#d6dbde] rounded-full px-4 py-2.5 pl-10 text-[13.5px] outline-none focus:border-[#00754A] focus:ring-2 focus:ring-[#00754A]/20"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-gray-400">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[12px]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sport Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSport === 'all'
                ? 'bg-[#006241] text-white'
                : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.7)] hover:bg-[#edebe9]'
            }`}
          >
            Semua
          </button>
          {SPORTS.slice(0, 6).map(s => (
            <button
              key={s.n}
              onClick={() => setSelectedSport(s.n)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                selectedSport === s.n
                  ? 'bg-[#00754A] text-white shadow-sm'
                  : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.7)] hover:bg-[#edebe9]'
              }`}
            >
              <span>{s.e}</span>
              <span>{s.n}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredVenues.length === 0 ? (
        <div className="bg-white rounded-[16px] p-8 text-center border border-[#d6dbde] flex flex-col items-center justify-center gap-2">
          <div className="text-[32px]">🏟️</div>
          <h3 className="text-[16px] font-bold text-[#006241]">Lapangan tidak ditemukan</h3>
          <p className="text-[13px] text-[rgba(0,0,0,0.6)] max-w-[40ch]">
            Belum ada lapangan yang cocok dengan pencarianmu. Kamu tahu lapangan terdekat?
          </p>
          <button
            onClick={() => openSheet('add-venue')}
            className="mt-2 text-[#00754A] font-bold text-[13px] hover:underline"
          >
            + Tambahkan sekarang ke direktori SPORA
          </button>
        </div>
      ) : (
        <>
          {/* Campus & Public Facilities */}
          {freeVenues.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
                  Fasilitas Kampus & Publik
                </h2>
                <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
                  Bebas biaya mahasiswa
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {freeVenues.map(v => <VenueCard key={v.id} venue={v} />)}
              </div>
            </div>
          )}

          {/* Commercial / Community Venues */}
          {paidVenues.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
                  Venue Komersial & Sewa Warga
                </h2>
                <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
                  Tarif sewa per jam
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {paidVenues.map(v => <VenueCard key={v.id} venue={v} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
