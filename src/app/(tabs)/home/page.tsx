'use client';
import { useAppStore } from '@/lib/store';
import SessionCard from '@/components/cards/SessionCard';
import Link from 'next/link';

export default function Home() {
  const { state, openSheet } = useAppStore();
  
  const fit = state.sessions.filter(s => s.fits || s.host === 'Kamu');
  const near = state.sessions.filter(s => !s.fits && s.host !== 'Kamu');

  return (
    <>
      <div className="bg-court text-white p-[20px_18px_18px] lg:p-[34px_40px_28px] relative overflow-hidden before:content-[''] before:absolute before:-right-[46px] before:-top-[46px] before:w-[150px] before:h-[150px] before:border-[2px] before:border-white/16 before:rounded-full">
        <div className="flex lg:hidden items-baseline justify-between relative z-10 mb-[14px]">
          <h1 className="text-[19px] font-extrabold tracking-[-.02em]">SPORA</h1>
          <span className="text-[11px] text-white/70 font-medium">Surabaya Timur</span>
        </div>
        <div className="text-[22px] lg:text-[34px] font-bold tracking-[-.025em] leading-[1.2] relative z-10 lg:mt-0">
          Selasa kamu kosong <em className="not-italic text-amber">15.00 – 17.00</em>
        </div>
        <div className="mt-[5px] text-[13px] text-white/72 relative z-10">3 sesi cocok dengan jadwal dan lokasimu</div>
      </div>
      
      <div className="p-[16px_14px_26px] lg:p-[26px_40px_50px] lg:max-w-[1180px] lg:mx-auto lg:w-full">
        <div className="bg-ink text-white rounded-radius p-[16px] lg:p-[22px_24px] relative overflow-hidden mb-[14px] lg:flex lg:items-center lg:gap-[24px] before:content-[''] before:absolute before:left-0 before:right-0 before:top-1/2 before:h-[1px] before:bg-white/14 lg:before:hidden">
          <div className="relative z-10 flex-1">
            <div className="text-[11px] text-white/60 font-semibold">Celah jadwal terdekat</div>
            <div className="text-[26px] lg:text-[32px] font-extrabold tracking-[-.03em] mt-[6px]">Selasa, 15.00</div>
            <div className="text-[13px] text-white/70 mt-[6px] leading-[1.5]">Kamu, Rafi, dan 3 teman sekelas sama-sama kosong. GOR Graha ITS tersedia — 400 m dari kos.</div>
          </div>
          <button onClick={() => openSheet('detail', 's1')} className="mt-[14px] lg:mt-0 lg:w-auto shrink-0 bg-amber text-ink border-0 rounded-[9px] p-[11px_16px] lg:p-[13px_22px] text-[14px] font-bold w-full cursor-pointer relative z-10 whitespace-nowrap hover:brightness-105 transition-all">
            Lihat sesi badminton
          </button>
        </div>

        <div className="flex gap-[9px] mb-[18px] lg:max-w-[620px]">
          <button onClick={() => openSheet('create')} className="flex-1 bg-card border border-line rounded-radius p-[13px] cursor-pointer text-left flex items-center gap-[10px] hover:border-court/35 transition-colors">
            <span className="w-[32px] h-[32px] rounded-[9px] bg-court-soft text-court grid place-items-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" className="w-[17px] h-[17px] stroke-2"><path d="M12 5v14M5 12h14"/></svg>
            </span>
            <span>
              <b className="block text-[13.5px] font-bold tracking-[-.01em]">Buat sesi</b>
              <i className="block not-italic text-[11px] text-muted mt-[2px]">Atur sendiri jadwal dan aturannya</i>
            </span>
          </button>
          <Link href="/venue" className="flex-1 bg-card border border-line rounded-radius p-[13px] cursor-pointer text-left flex items-center gap-[10px] hover:border-court/35 transition-colors decoration-transparent text-ink">
            <span className="w-[32px] h-[32px] rounded-[9px] bg-court-soft text-court grid place-items-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] stroke-2"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            </span>
            <span>
              <b className="block text-[13.5px] font-bold tracking-[-.01em]">Sewa venue</b>
              <i className="block not-italic text-[11px] text-muted mt-[2px]">Pesan lapangan per jam</i>
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-between m-[2px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Cocok dengan jadwalmu</h3>
          <span className="text-[12px] text-muted">{fit.length} sesi</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[10px]">
          {fit.map(s => <SessionCard key={s.id} session={s} />)}
        </div>

        <div className="flex items-center justify-between m-[20px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Di sekitarmu</h3>
          <span className="text-[12px] text-muted">radius 4 km</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[10px]">
          {near.map(s => <SessionCard key={s.id} session={s} />)}
        </div>
      </div>
    </>
  );
}
