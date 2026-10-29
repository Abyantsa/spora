'use client';
import { useAppStore } from '@/lib/store';
import { rp } from '@/lib/utils';

export default function DetailSheet({ id }: { id: string }) {
  const { state, closeSheet, toggleJoin } = useAppStore();
  const s = state.sessions.find(x => x.id === id);
  
  if (!s) return null;

  const mine = state.joined.has(s.id);
  const c = s.joined + (mine ? 1 : 0);
  const pct = Math.min(100, (c / s.min) * 100);
  const isFull = c >= s.min;
  const own = s.host === 'Kamu';
  const perHead = s.price === 0 ? 0 : Math.round(s.price * s.min / Math.max(c, 1) / 500) * 500;

  const pills = [];
  for(let i=0; i<s.min; i++) {
    if(mine && i === c-1) pills.push(<span key={i} className="text-[11px] font-semibold bg-amber text-ink p-[4px_9px] rounded-[20px]">{own ? 'Kamu (host)' : 'Kamu'}</span>);
    else if(i < c) pills.push(<span key={i} className="text-[11px] font-semibold bg-court-soft text-court p-[4px_9px] rounded-[20px]">Pemain {i+1}</span>);
    else pills.push(<span key={i} className="text-[11px] font-semibold bg-transparent border border-dashed border-ink/22 text-muted p-[3px_8px] rounded-[20px]">kosong</span>);
  }

  return (
    <>
      <div className="bg-court text-white p-[18px] lg:p-[20px] rounded-[20px_20px_0_0] lg:rounded-[18px_18px_0_0] relative">
        <button className="absolute right-[14px] top-[14px] bg-white/16 border-0 text-white w-[26px] h-[26px] rounded-full text-[15px] cursor-pointer leading-[1]" onClick={closeSheet}>✕</button>
        <h3 className="text-[21px] font-extrabold tracking-[-.025em] pr-[30px]">{s.emoji} {s.sport}</h3>
        <p className="text-[13px] text-white/75 mt-[5px] leading-[1.5]">{s.venue}<br/>{s.day}, {s.time} · {s.dist} dari kosmu</p>
      </div>
      <div className="p-[16px_14px_20px] lg:p-[20px]">
        <div className="bg-card border border-line rounded-radius p-[13px] mb-[12px]">
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px]">
            <span className="text-muted">Level</span><b className="font-bold text-right">{s.level}</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Host</span><b className="font-bold text-right">{s.host}</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Biaya lapangan</span><b className="font-bold text-right">{s.free ? 'Gratis' : rp(s.price * s.min)}</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Patungan per orang</span><b className={`font-bold text-right text-[17px] tracking-[-.02em] ${s.free ? 'text-court' : ''}`}>{s.free ? 'Rp0' : rp(perHead)}</b>
          </div>
        </div>
        
        <div className="bg-card border border-line rounded-radius p-[14px] mb-[12px]">
          <h4 className="text-[13.5px] font-bold mb-[3px]">Kuorum pemain</h4>
          <p className="text-[12.5px] text-muted leading-[1.5]">Sesi berjalan kalau terkumpul minimal {s.min} pemain.</p>
          <div className="h-[8px] bg-[#E6EAE6] rounded-[5px] my-[12px_9px] overflow-hidden">
            <i className={`block h-full rounded-[5px] transition-all duration-400 ease-in-out ${isFull ? 'bg-court' : 'bg-amber'}`} style={{ width: `${pct}%` }}></i>
          </div>
          <div className={`text-[12px] font-semibold ${isFull ? 'text-court' : 'text-clay'}`}>{isFull ? 'Kuorum tercapai — sesi dikonfirmasi' : `Kurang ${s.min - c} pemain lagi`}</div>
          <div className="flex gap-[6px] mt-[11px] flex-wrap">
            {pills}
          </div>
        </div>

        {own ? (
          <>
            <button disabled className="w-full border-0 rounded-[11px] p-[14px] text-[15px] font-bold cursor-not-allowed bg-[#CFD8D2] text-[#8B9A92]">Kamu host sesi ini</button>
            <div className="text-[11.5px] text-muted text-center mt-[9px] leading-[1.5]">Sesi terbuka untuk umum. Pemain baru bisa bergabung sampai kuorum penuh.</div>
          </>
        ) : (
          <>
            <button 
              className={`w-full rounded-[11px] p-[14px] text-[15px] font-bold cursor-pointer transition-colors ${mine ? 'bg-card text-clay border border-clay/40' : 'bg-court text-white border-0'}`}
              onClick={() => toggleJoin(s.id)}
            >
              {mine ? 'Keluar dari sesi' : (s.free ? 'Gabung sesi' : 'Gabung — ' + rp(perHead))}
            </button>
            <div className="text-[11.5px] text-muted text-center mt-[9px] leading-[1.5]">
              {s.free ? 'Fasilitas gratis. Datang langsung sesuai jadwal.' : 'Dana ditahan sistem. Kalau kuorum tidak tercapai 3 jam sebelum mulai, sesi batal dan dana kembali penuh.'}
            </div>
          </>
        )}
      </div>
    </>
  );
}
