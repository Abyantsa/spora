'use client';
import { useState } from 'react';
import { useAppStore, SPORTS } from '@/lib/store';
import SessionCard from '@/components/cards/SessionCard';
import Link from 'next/link';

const CATEGORIES = [
  { n: 'Semua', e: '🔥' },
  ...SPORTS
];

export default function Home() {
  const { state, openSheet, showToast } = useAppStore();
  const [activeCat, setActiveCat] = useState('Semua');

  const filtered = state.sessions.filter(s => {
    if (activeCat === 'Semua') return true;
    return s.sport.toLowerCase().includes(activeCat.toLowerCase());
  });

  const fit = filtered.filter(s => s.fits || s.host === 'Kamu');
  const near = filtered.filter(s => !s.fits && s.host !== 'Kamu');

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      
      {/* HERO SCHEDULE GAP BANNER */}
      <section className="bg-white rounded-[14px] p-5 sm:p-6 lg:p-8 elev-raised border border-[#006241]/10 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-8 items-center relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#006241] uppercase tracking-[0.12em] mb-2">
            <span className="w-[7px] h-[7px] rounded-full bg-[#00754A] animate-pulse" />
            Celah Jadwal Kampus Terdeteksi
          </div>
          <h1 className="text-[24px] sm:text-[30px] lg:text-[34px] font-bold text-[#006241] leading-tight tracking-[-0.01em] mb-3">
            Selasa kamu kosong <em className="not-italic text-[#00754A] border-b-2 border-[#00754A]">15.00 – 17.00</em>
          </h1>
          <p className="text-[15px] text-[rgba(0,0,0,0.87)] leading-relaxed max-w-[54ch] mb-5">
            Kamu, Rafi, dan 3 rekan sekelasmu terdeteksi kosong bersamaan. GOR Graha Sepuluh Nopember ITS siap digunakan — hanya 400 m dari kosmu di Gebang.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => openSheet('detail', 's1')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[14px] font-semibold transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,117,74,0.22)] active:scale-95"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Ikut Sesi Badminton (Kurang 2 Orang)</span>
            </button>
            <button
              onClick={() => openSheet('create')}
              className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-[#00754A] text-[#00754A] hover:bg-[#00754A]/8 bg-transparent text-[14px] font-semibold transition-all cursor-pointer active:scale-95"
            >
              Atur Sesi Sendiri
            </button>
          </div>
        </div>

        {/* Side Quick Preview Card */}
        <div className="bg-[#edebe9] rounded-[14px] p-4 sm:p-5 border border-[#d6dbde] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#d6dbde] text-[11.5px] font-semibold text-[#006241]">
              🏸 GOR Graha ITS
            </span>
            <span className="text-[12.5px] font-semibold text-[rgba(0,0,0,0.58)]">400 m</span>
          </div>
          <div className="text-[16px] font-bold text-[rgba(0,0,0,0.87)] leading-snug">
            Badminton Ganda Putra & Campuran
          </div>
          <div className="text-[12.5px] text-[rgba(0,0,0,0.58)]">
            Selasa 15.00–17.00 · Host: Rafi (UKM) · Vinyl Court 2
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e7e7e7] flex-wrap">
            <span className="text-[12.5px] font-semibold text-[rgba(0,0,0,0.87)]">4 dari 6 Kuorum Terkumpul</span>
            <span className="text-[16px] font-bold text-[#00754A]">Rp15.000 / orang</span>
          </div>
        </div>
      </section>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        <button
          onClick={() => openSheet('create')}
          className="bg-white rounded-[14px] p-4 elev-raised border border-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer text-left transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.97]"
        >
          <div className="w-10 h-10 rounded-full bg-[#d4e9e2] text-[#00754A] grid place-items-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-[19px] h-[19px]">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <b className="text-[14px] font-bold text-[rgba(0,0,0,0.87)] leading-tight">Buat Sesi</b>
            <span className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 leading-snug">Atur patungan & kuorum</span>
          </div>
        </button>

        <Link
          href="/venue"
          className="bg-white rounded-[14px] p-4 elev-raised border border-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer text-left transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.97] no-underline"
        >
          <div className="w-10 h-10 rounded-full bg-[#d4e9e2] text-[#00754A] grid place-items-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
              <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <b className="text-[14px] font-bold text-[rgba(0,0,0,0.87)] leading-tight">Sewa Venue</b>
            <span className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 leading-snug">Kampus & komersial</span>
          </div>
        </Link>

        <Link
          href="/explore"
          className="bg-white rounded-[14px] p-4 elev-raised border border-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer text-left transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.97] no-underline"
        >
          <div className="w-10 h-10 rounded-full bg-[#d4e9e2] text-[#00754A] grid place-items-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-[19px] h-[19px]">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <b className="text-[14px] font-bold text-[rgba(0,0,0,0.87)] leading-tight">Jelajah Baru</b>
            <span className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 leading-snug">Coba cabang olahraga lain</span>
          </div>
        </Link>

        <Link
          href="/profile"
          className="bg-white rounded-[14px] p-4 elev-raised border border-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer text-left transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.97] no-underline"
        >
          <div className="w-10 h-10 rounded-full bg-[#faf6ee] text-[#cba258] border border-[#cba258]/35 grid place-items-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <b className="text-[14px] font-bold text-[rgba(0,0,0,0.87)] leading-tight">Sport Passport</b>
            <span className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 leading-snug">Skor 92% Kehadiran</span>
          </div>
        </Link>
      </div>

      {/* SPORT FILTER RAIL */}
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 pb-1 min-w-max">
          {CATEGORIES.map(item => (
            <button
              key={item.n}
              onClick={() => setActiveCat(item.n)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeCat === item.n
                  ? 'bg-[#00754A] text-white shadow-[0_2px_6px_rgba(0,117,74,0.22)]'
                  : 'bg-white text-[rgba(0,0,0,0.87)] border border-[#d6dbde] hover:bg-[#edebe9]'
              }`}
            >
              <span>{item.e}</span>
              <span>{item.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: MATCHING SCHEDULE */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#006241] tracking-[-0.01em]">
            Cocok dengan Jadwal & Lokasimu
          </h2>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
            {fit.length} sesi aktif
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {fit.length > 0 ? (
            fit.map(s => <SessionCard key={s.id} session={s} />)
          ) : (
            <div className="col-span-full bg-white rounded-[14px] p-8 text-center elev-raised">
              <b className="text-[#006241] text-[16px] block">Tidak ada sesi</b>
              <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1">Belum ada sesi di kategori ini yang pas dengan jadwal perkuliahanmu.</p>
            </div>
          )}
        </div>
      </div>

      {/* HOUSE GREEN FEATURE BAND (SPORT PASSPORT REWARDS) */}
      <section className="bg-[#1E3932] rounded-[14px] p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] items-center gap-6 lg:gap-12">
          <div>
            <div className="text-[12px] font-bold text-[#cba258] tracking-[0.15em] uppercase mb-2">
              SPORT PASSPORT SURABAYA · REWARDS CEREMONY
            </div>
            <h2 className="text-[22px] sm:text-[28px] lg:text-[30px] font-bold leading-tight mb-3">
              Makin konsisten main, makin tinggi sportivitasmu.
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed max-w-[52ch] mb-5">
              Kumpulkan stempel cabang olahraga di Surabaya, buka akses prioritas sewa lapangan kampus, dan nikmati diskon patungan bersama komunitas mahasiswa.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-[#00754A] font-semibold text-[14px] hover:bg-white/90 transition-all text-center no-underline"
              >
                Buka Sport Passport
              </Link>
              <button
                onClick={() => showToast('Fairplay score dihitung dari kehadiran tanpa pembatalan h-3.')}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white text-white font-semibold text-[14px] hover:bg-white/10 transition-all text-center cursor-pointer bg-transparent"
              >
                Pelajari Sistem Fairplay
              </button>
            </div>
          </div>

          <div className="bg-white/8 border border-white/15 rounded-[14px] p-5 sm:p-6 backdrop-blur-md flex flex-col gap-3">
            <div className="text-[40px] font-extrabold leading-none tracking-tight">
              92% <span className="text-[#cba258] text-[30px]">★</span>
            </div>
            <div className="text-[14px] text-white/90 leading-snug">
              <b>Skor Kehadiran & Fairplay Komunitas</b><br />
              Tergolong 5% pemain paling konsisten di Sukolilo.
            </div>
            <span className="text-[12px] text-white/70">
              3 dari 6 Cabang Olahraga Terbuka
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: NEARBY SESSIONS */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#006241] tracking-[-0.01em]">
            Sesi Lain di Sekitarmu (Radius 4 km)
          </h2>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
            {near.length} sesi
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {near.length > 0 ? (
            near.map(s => <SessionCard key={s.id} session={s} />)
          ) : (
            <div className="col-span-full bg-white rounded-[14px] p-8 text-center elev-raised">
              <b className="text-[#006241] text-[16px] block">Semua sesi telah ditampilkan</b>
              <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1">Tidak ada sesi tambahan di kategori ini.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
