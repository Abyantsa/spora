'use client';
import { useAppStore } from '@/lib/store';
import { rp } from '@/lib/utils';

export default function Explore() {
  const { state, openSheet } = useAppStore();
  
  const baru = state.sessions.filter(s => !state.tried.has(s.sport.split(' ')[0]));

  return (
    <>
      <div className="bg-court text-white p-[20px_18px_18px] lg:p-[34px_40px_28px]">
        <h2 className="text-[20px] font-bold tracking-[-.02em]">Jelajah</h2>
        <p className="text-[13px] text-white/72 mt-[4px]">Cabang baru dan aktivitas di sekitarmu</p>
      </div>
      
      <div className="p-[16px_14px_26px] lg:p-[26px_40px_50px] lg:max-w-[1180px] lg:mx-auto lg:w-full">
        <div className="flex items-center justify-between m-[2px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Belum pernah kamu coba</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[10px]">
          {baru.length > 0 ? baru.map(s => (
            <div 
              key={s.id} 
              className="bg-card border border-line rounded-radius p-[13px] cursor-pointer hover:border-court/35 transition-colors focus-visible:outline-amber" 
              tabIndex={0} 
              onClick={() => openSheet('detail', s.id)}
              onKeyDown={(e) => e.key === 'Enter' && openSheet('detail', s.id)}
            >
              <div className="text-[22px]">{s.emoji}</div>
              <div className="text-[14px] font-bold mt-[8px] tracking-[-.01em]">{s.sport}</div>
              <div className="text-[11.5px] text-muted mt-[3px] leading-[1.4]">{s.dist} · {rp(s.price)}<br/>{s.level}</div>
              <div className="inline-block mt-[8px] text-[10.5px] font-bold text-clay">Sesi pemula tersedia</div>
            </div>
          )) : (
            <div className="text-center p-[40px_20px] text-muted text-[13.5px] leading-[1.6] col-span-2 lg:col-span-full">
              Semua cabang sudah kamu coba.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between m-[20px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Aktivitas tanpa lapangan</h3>
          <span className="text-[12px] text-muted">gratis</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[9px]">
          <div className="bg-card border border-line rounded-radius p-[12px_13px] flex items-center gap-[11px]">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-court-soft grid place-items-center text-[16px] shrink-0">🏃</div>
            <div>
              <div className="text-[14px] font-semibold tracking-[-.01em]">Lari pagi Taman Harmoni</div>
              <div className="text-[11.5px] text-muted mt-[2px]">Sabtu 06.00 · 3 orang ikut</div>
            </div>
            <span className="ml-auto text-[11px] font-semibold bg-[#DDF0E4] text-[#186B41] py-[3px] px-[8px] rounded-[20px]">Gratis</span>
          </div>
          <div className="bg-card border border-line rounded-radius p-[12px_13px] flex items-center gap-[11px]">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-court-soft grid place-items-center text-[16px] shrink-0">🚴</div>
            <div>
              <div className="text-[14px] font-semibold tracking-[-.01em]">Sepeda santai Pantai Kenjeran</div>
              <div className="text-[11.5px] text-muted mt-[2px]">Minggu 05.30 · 7 orang ikut</div>
            </div>
            <span className="ml-auto text-[11px] font-semibold bg-[#DDF0E4] text-[#186B41] py-[3px] px-[8px] rounded-[20px]">Gratis</span>
          </div>
        </div>
      </div>
    </>
  );
}
