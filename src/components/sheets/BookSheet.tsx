'use client';
import { useState } from 'react';
import { useAppStore, SPORTS, DAYS, SLOTS } from '@/lib/store';
import { rp, endTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function BookSheet({ id }: { id: string }) {
  const { state, addBooking, addSession, closeSheet, showToast } = useAppStore();
  const router = useRouter();

  const v = state.venues.find(x => x.id === id);
  const [b, setB] = useState({ day: 'Selasa', time: '', dur: 1, asSession: false });

  if (!v) return null;

  const total = v.rate * b.dur;
  const ready = !!b.time;

  const submit = () => {
    const code = 'SPR-' + Math.floor(1000 + Math.random() * 9000);
    const end = endTime(b.time, b.dur);
    
    addBooking({
      venue: v.n, emoji: v.e, day: b.day, time: b.time, end, dur: b.dur, total, code
    });

    if (b.asSession) {
      const sessionId = 'b' + Date.now();
      const sportName = v.sports.split(',')[0].trim();
      const sp = SPORTS.find(x => x.n === sportName) || { e: v.e };
      const min = 6;
      addSession({
        id: sessionId, sport: sportName, emoji: sp.e || v.e, venue: v.n, day: b.day,
        time: b.time + ' – ' + end,
        price: total === 0 ? 0 : Math.round(total / min / 500) * 500,
        min, joined: 1, level: 'Semua level', dist: v.dist, free: total === 0, host: 'Kamu', fits: true
      });
    }
    
    closeSheet();
    router.push('/mine');
    
    if (b.asSession) {
      showToast('Venue disewa dan sesi terbuka dibuat. Pemain lain bisa ikut patungan.');
    } else {
      showToast(total === 0 ? 'Fasilitas dipesan. Tidak ada biaya.' : `Venue disewa — ${rp(total)}. Kode pemesanan dikirim.`);
    }
  };

  return (
    <>
      <div className="bg-court text-white p-[18px] lg:p-[20px] rounded-[20px_20px_0_0] lg:rounded-[18px_18px_0_0] relative">
        <button className="absolute right-[14px] top-[14px] bg-white/16 border-0 text-white w-[26px] h-[26px] rounded-full text-[15px] cursor-pointer leading-[1]" onClick={closeSheet}>✕</button>
        <h3 className="text-[21px] font-extrabold tracking-[-.025em]">{v.e} {v.n}</h3>
        <p className="text-[13px] text-white/75 mt-[5px] leading-[1.5]">{v.sports} · {v.dist} · dikelola {v.owner}</p>
      </div>
      
      <div className="p-[16px_14px_20px] lg:p-[20px] flex flex-col gap-[14px]">
        <div className="bg-card border border-line rounded-radius p-[13px]">
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px]">
            <span className="text-muted">Tarif</span><b className="font-bold text-right">{v.rate === 0 ? 'Gratis' : rp(v.rate) + ' / jam'}</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px] py-[7px] gap-[12px] border-t border-line">
            <span className="text-muted">Keterangan</span><b className="font-medium text-muted text-right text-[12.5px]">{v.note}</b>
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Hari</label>
          <select className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1" value={b.day} onChange={e => setB(p => ({ ...p, day: e.target.value }))}>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Jam tersedia</label>
          <div className="flex gap-[7px] flex-wrap">
            {SLOTS.map(t => {
              const taken = v.taken.includes(t);
              return (
                <button 
                  key={t} disabled={taken} onClick={() => setB(p => ({ ...p, time: t }))}
                  className={`text-[12.5px] font-semibold p-[8px_13px] rounded-[20px] border ${taken ? 'opacity-35 cursor-not-allowed line-through bg-card border-line text-muted' : (b.time === t ? 'bg-court border-court text-white cursor-pointer' : 'bg-card border-line text-muted cursor-pointer')}`}
                >{t}</button>
              );
            })}
          </div>
          <div className="text-[11.5px] text-muted mt-[5px] leading-[1.45]">Jam yang dicoret sudah dipesan orang lain.</div>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Durasi</label>
          <div className="flex gap-[7px] flex-wrap">
            {[1,2,3].map(d => (
              <button key={d} onClick={() => setB(p => ({ ...p, dur: d }))} className={`text-[12.5px] font-semibold p-[8px_13px] rounded-[20px] border cursor-pointer ${b.dur === d ? 'bg-court border-court text-white' : 'bg-card border-line text-muted'}`}>{d} jam</button>
            ))}
          </div>
        </div>

        <div>
          <div className={`flex items-center gap-[11px] bg-card border border-line rounded-radius p-[12px_13px] cursor-pointer`} onClick={() => setB(p => ({ ...p, asSession: !p.asSession }))}>
            <div className={`w-[42px] h-[24px] rounded-[14px] shrink-0 relative transition-colors ${b.asSession ? 'bg-court' : 'bg-[#DDE3DE]'}`}>
              <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${b.asSession ? 'translate-x-[18px]' : ''}`}></div>
            </div>
            <div>
              <b className="text-[13.5px] font-bold block">Sekalian buka sesi terbuka</b>
              <i className="not-italic text-[11.5px] text-muted block mt-[2px] leading-[1.4]">{b.asSession ? 'Pemain lain bisa gabung dan ikut patungan biaya' : 'Venue hanya untuk kamu dan timmu'}</i>
            </div>
          </div>
        </div>

        <div className="bg-ink text-white rounded-radius p-[14px] mb-[12px]">
          <div className="flex justify-between text-[13px] py-[5px] text-white/72"><span>Jadwal</span><b className="text-white font-bold">{b.time ? b.day+', '+b.time+' – '+endTime(b.time, b.dur) : 'Pilih jam dulu'}</b></div>
          <div className="flex justify-between text-[13px] py-[5px] text-white/72"><span>Durasi</span><b className="text-white font-bold">{b.dur} jam</b></div>
          <div className="flex justify-between text-[14px] pt-[10px] mt-[6px] border-t border-white/16 text-white/72"><span className="self-center">Total</span><b className="text-white font-bold text-[19px] tracking-[-.02em]">{rp(total)}</b></div>
        </div>

        <button 
          className={`w-full rounded-[11px] p-[14px] text-[15px] font-bold border-0 ${ready ? 'bg-court text-white cursor-pointer' : 'bg-[#CFD8D2] text-[#8B9A92] cursor-not-allowed'}`} 
          disabled={!ready} onClick={submit}
        >
          {ready ? (total === 0 ? 'Pesan fasilitas' : 'Sewa venue — ' + rp(total)) : 'Pilih jam dulu'}
        </button>
        <div className="text-[11.5px] text-muted text-center mt-[9px] leading-[1.5]">
          {v.rate === 0 ? 'Fasilitas publik tanpa biaya. Pemesanan hanya untuk mencatat penggunaan.' : 'Pembayaran melalui sistem. Pembatalan gratis sampai 12 jam sebelum jadwal.'}
        </div>
      </div>
    </>
  );
}
