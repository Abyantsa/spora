'use client';
import { useAppStore } from '@/lib/store';
import SessionCard from '@/components/cards/SessionCard';
import { rp } from '@/lib/utils';
import Link from 'next/link';

export default function MinePage() {
  const { state } = useAppStore();
  
  const mine = state.sessions.filter(s => state.joined.has(s.id) || s.host === 'Kamu');
  const bk = state.bookings;

  const isEmpty = !mine.length && !bk.length;

  if (isEmpty) {
    return (
      <div className="bg-white rounded-[14px] p-8 sm:p-12 text-center elev-raised flex flex-col items-center gap-3">
        <b className="text-[#006241] text-[18px]">Belum ada sesi atau pemesanan</b>
        <p className="text-[14px] text-[rgba(0,0,0,0.58)] max-w-[44ch] leading-relaxed">
          Gabung sesi olahraga yang cocok dengan jadwalmu, atau sewa venue untuk main bersama kawan.
        </p>
        <Link
          href="/home"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#00754A] text-white font-semibold text-[14px] hover:bg-[#005c3b] transition-all mt-2 no-underline"
        >
          Jelajahi Sesi Tersedia
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#006241] tracking-[-0.01em]">
          Sesiku & Pemesanan Lapangan
        </h1>
        <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1 max-w-[65ch] leading-relaxed">
          Pantau status kuorum sesi yang kamu ikuti dan tiket booking venue yang aktif.
        </p>
      </div>

      {mine.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
              Sesi yang Kamu Ikuti
            </h2>
            <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
              {mine.length} sesi aktif
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {mine.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </div>
      )}

      {bk.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#006241] tracking-[-0.01em]">
              Tiket Booking Venue Aktif
            </h2>
            <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
              {bk.length} pemesanan
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {bk.map((b, i) => (
              <div 
                key={i} 
                className="bg-white rounded-[14px] p-4 sm:p-5 elev-raised border border-[#d6dbde] flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[15px] sm:text-[16px] font-bold text-[#006241]">
                    {b.emoji} {b.venue}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#edebe9] border border-[#d6dbde] font-mono text-[11.5px] font-bold text-[#1E3932]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {b.code}
                  </span>
                </div>
                <p className="text-[13.5px] text-[rgba(0,0,0,0.58)] leading-relaxed">
                  Jadwal: <b className="text-[rgba(0,0,0,0.87)]">{b.day}, {b.time} – {b.end}</b> ({b.dur} Jam)<br/>
                  {b.total === 0 ? 'Fasilitas Kampus ITS (Bebas Biaya)' : `Total ${rp(b.total)} · Terverifikasi Lunas`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
