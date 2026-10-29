'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { rp } from '@/lib/utils';

export default function Explore() {
  const { state, openSheet, showToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const unplayed = state.sessions.filter(s => {
    const mainSport = s.sport.split(' ')[0];
    const isUnplayed = !state.tried.has(mainSport);
    if (!searchQuery.trim()) return isUnplayed;
    return (
      s.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#006241] tracking-[-0.01em]">
          Jelajah Cabang & Aktivitas Terbuka
        </h1>
        <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1 max-w-[65ch] leading-relaxed">
          Temukan cabang olahraga baru untuk melengkapi Sport Passport-mu atau ikuti kegiatan komunitas tanpa biaya lapangan di sekitar Surabaya.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.58)] pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[18px] h-[18px]">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari cabang olahraga, lapangan, atau daerah (contoh: GOR Graha, Padel)..."
          className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-full border border-[#d6dbde] bg-white text-[15px] outline-none focus:border-[#00754A] focus:ring-3 focus:ring-[#00754A]/20 elev-raised transition-all"
        />
      </div>

      {/* Section 1: Tantangan Cabang Baru */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
            Tantangan Cabang Baru
          </h2>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
            Sport Passport Discovery
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {unplayed.length > 0 ? (
            unplayed.map(s => (
              <div 
                key={s.id} 
                onClick={() => openSheet('detail', s.id)}
                className="bg-white rounded-[14px] p-4 sm:p-5 elev-raised border border-transparent flex flex-col gap-2 sm:gap-3 cursor-pointer select-none transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <div className="text-[28px] leading-none">{s.emoji}</div>
                <div className="text-[15px] font-bold text-[#006241] leading-tight mt-1">{s.sport}</div>
                <div className="text-[12px] text-[rgba(0,0,0,0.58)] leading-normal flex-1">
                  {s.venue}<br/>{s.dist} · {rp(s.price)}
                </div>
                <span className="text-[11px] font-bold text-[#00754A] pt-2 border-t border-[#e7e7e7] whitespace-nowrap block">
                  + Buka Stempel Baru
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-[14px] p-8 text-center elev-raised">
              <b className="text-[#006241] text-[16px] block">Luar biasa!</b>
              <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1">
                {searchQuery ? 'Tidak ada hasil untuk pencarian ini.' : 'Semua cabang utama sudah pernah kamu coba di Surabaya.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Free Community Activities */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
            Aktivitas Terbuka Bebas Biaya Lapangan
          </h2>
          <span className="text-[12px] font-bold text-[#006241] uppercase tracking-wider">
            100% Gratis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div 
            onClick={() => showToast('Aktivitas terbuka! Langsung hadir di Taman Harmoni setiap Sabtu pagi.')}
            className="bg-white rounded-[14px] p-3.5 sm:p-4 elev-raised border border-transparent flex items-center gap-3 sm:gap-4 cursor-pointer select-none transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] rounded-[12px] bg-[#edebe9] grid place-items-center text-[20px] sm:text-[22px] shrink-0">
              🏃
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] sm:text-[16px] font-bold text-[#006241] truncate leading-snug">
                Lari Pagi Komunitas Taman Harmoni
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 truncate leading-normal">
                Sabtu 06.00 · 8 pelari terdaftar · 1,2 km dari ITS
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[13.5px] font-bold text-[#006241] block">Gratis</span>
              <span className="text-[11px] text-[rgba(0,0,0,0.58)] block">Bebas gabung</span>
            </div>
          </div>

          <div 
            onClick={() => showToast('Rute gowes Kenjeran! Titik kumpul di Bundaran ITS jam 05.30.')}
            className="bg-white rounded-[14px] p-3.5 sm:p-4 elev-raised border border-transparent flex items-center gap-3 sm:gap-4 cursor-pointer select-none transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] rounded-[12px] bg-[#edebe9] grid place-items-center text-[20px] sm:text-[22px] shrink-0">
              🚴
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] sm:text-[16px] font-bold text-[#006241] truncate leading-snug">
                Gowes Santai Pantai Kenjeran
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 truncate leading-normal">
                Minggu 05.30 · 14 pesepeda · Titik kumpul Bundaran ITS
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[13.5px] font-bold text-[#006241] block">Gratis</span>
              <span className="text-[11px] text-[rgba(0,0,0,0.58)] block">Bebas gabung</span>
            </div>
          </div>

          <div 
            onClick={() => showToast('Calisthenics terbuka setiap Senin & Kamis sore di Perpus ITS.')}
            className="bg-white rounded-[14px] p-3.5 sm:p-4 elev-raised border border-transparent flex items-center gap-3 sm:gap-4 cursor-pointer select-none transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.98] md:col-span-2"
          >
            <div className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] rounded-[12px] bg-[#edebe9] grid place-items-center text-[20px] sm:text-[22px] shrink-0">
              🤸
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] sm:text-[16px] font-bold text-[#006241] truncate leading-snug">
                Calisthenics & Pull-Up Bar Perpus ITS
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 truncate leading-normal">
                Senin & Kamis 16.30 · Taman Perpustakaan ITS
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[13.5px] font-bold text-[#006241] block">Gratis</span>
              <span className="text-[11px] text-[rgba(0,0,0,0.58)] block">Fasilitas umum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
