'use client';
import { useAppStore } from '@/lib/store';
import SessionCard from '@/components/cards/SessionCard';
import { rp } from '@/lib/utils';

export default function MinePage() {
  const { state } = useAppStore();
  
  const mine = state.sessions.filter(s => state.joined.has(s.id));
  const bk = state.bookings;

  const isEmpty = !mine.length && !bk.length;

  return (
    <>
      <div className="bg-court text-white p-[20px_18px_18px] lg:p-[34px_40px_28px]">
        <h2 className="text-[20px] font-bold tracking-[-.02em]">Sesiku</h2>
        <p className="text-[13px] text-white/72 mt-[4px]">Sesi dan venue yang kamu pesan</p>
      </div>
      
      <div className="p-[16px_14px_26px] lg:p-[26px_40px_50px] lg:max-w-[1180px] lg:mx-auto lg:w-full">
        {isEmpty ? (
          <div className="text-center p-[40px_20px] text-muted text-[13.5px] leading-[1.6]">
            <b className="block text-ink text-[15px] mb-[6px] font-bold">Belum ada apa-apa di sini</b>
            Gabung sesi, buat sesi sendiri, atau sewa venue — semuanya muncul di halaman ini.
          </div>
        ) : (
          <>
            {mine.length > 0 && (
              <>
                <div className="flex items-center justify-between m-[2px_2px_10px]">
                  <h3 className="text-[15px] font-bold tracking-[-.015em]">Sesi kamu</h3>
                  <span className="text-[12px] text-muted">{mine.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[10px] mb-[20px]">
                  {mine.map(s => <SessionCard key={s.id} session={s} />)}
                </div>
              </>
            )}

            {bk.length > 0 && (
              <>
                <div className="flex items-center justify-between m-[20px_2px_10px]">
                  <h3 className="text-[15px] font-bold tracking-[-.015em]">Venue yang kamu sewa</h3>
                  <span className="text-[12px] text-muted">{bk.length}</span>
                </div>
                {bk.map((b, i) => (
                  <div key={i} className="bg-card border border-line border-l-[3px] border-l-court rounded-radius p-[13px] mb-[10px]">
                    <b className="text-[14px] font-bold tracking-[-.01em]">{b.emoji} {b.venue}</b>
                    <p className="text-[12.5px] text-muted mt-[3px] leading-[1.45]">
                      {b.day}, {b.time} – {b.end} · {b.dur} jam<br/>
                      {b.total === 0 ? 'Tanpa biaya' : 'Total ' + rp(b.total) + ' · lunas'}
                    </p>
                    <div className="text-[11px] font-bold text-court mt-[8px]">Kode pemesanan {b.code}</div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
