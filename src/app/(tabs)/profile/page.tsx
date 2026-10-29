'use client';
import { useAppStore, PASSPORT } from '@/lib/store';

export default function ProfilePage() {
  const { state } = useAppStore();
  
  const tried = new Set(state.tried);
  state.sessions.forEach(s => {
    if (state.joined.has(s.id)) tried.add(s.sport.split(' ')[0]);
  });

  return (
    <>
      <div className="bg-court text-white p-[20px_18px_18px] lg:p-[34px_40px_28px]">
        <h2 className="text-[20px] font-bold tracking-[-.02em]">Kellan</h2>
        <p className="text-[13px] text-white/72 mt-[4px]">Mahasiswa ITS · Mulyosari</p>
      </div>
      
      <div className="p-[16px_14px_26px] lg:p-[26px_40px_50px] lg:max-w-[1180px] lg:mx-auto lg:w-full">
        <div className="bg-card border border-line rounded-radius p-[16px] mb-[16px]">
          <div className="flex items-end gap-[12px]">
            <div className="text-[40px] font-extrabold tracking-[-.04em] leading-[.9]">92</div>
            <div className="text-[12.5px] text-muted leading-[1.45] pb-[3px]">Skor kehadiran<br/>Hadir di 23 dari 25 sesi terakhir</div>
          </div>
          <div className="h-[7px] bg-[#E6EAE6] rounded-[4px] mt-[13px] overflow-hidden">
            <i className="block h-full w-[92%] bg-court rounded-[4px]"></i>
          </div>
        </div>

        <div className="flex items-center justify-between m-[20px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Sport Passport</h3>
          <span className="text-[12px] text-muted">{tried.size}/6 dicoba</span>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-[9px]">
          {PASSPORT.map(p => {
            const isLocked = !tried.has(p.n);
            return (
              <div key={p.n} className={`bg-card border rounded-[12px] p-[12px_8px] text-center ${isLocked ? 'border-dashed border-line opacity-38' : 'border-line'}`}>
                <span className="text-[20px] block">{p.e}</span>
                <b className="text-[11px] font-semibold block mt-[6px] tracking-[-.01em]">{p.n}</b>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between m-[20px_2px_10px]">
          <h3 className="text-[15px] font-bold tracking-[-.015em]">Jadwal kosongmu</h3>
          <span className="text-[12px] text-muted">dari jadwal kuliah</span>
        </div>
        <div className="bg-card border border-line rounded-radius p-[13px] mb-[12px]">
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px]">
            <span className="text-muted">Selasa</span><b className="font-bold text-right">15.00 – 17.00</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Rabu</span><b className="font-bold text-right">16.00 – 18.00</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Jumat</span><b className="font-bold text-right">13.00 – 17.00</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Sabtu</span><b className="font-bold text-right">Seharian</b>
          </div>
        </div>
      </div>
    </>
  );
}
