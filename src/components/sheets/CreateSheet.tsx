'use client';
import { useState } from 'react';
import { useAppStore, SPORTS, DAYS, SLOTS } from '@/lib/store';
import { rp, endTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CreateSheet() {
  const { state, addSession, closeSheet, showToast } = useAppStore();
  const router = useRouter();

  const [form, setForm] = useState({
    sport: 'Badminton', venueId: 'v2', customVenue: '', day: 'Selasa', 
    time: '15.00', dur: 2, level: 'Pemula', min: 6, cost: 120000, openSession: true
  });

  const v = state.venues.find(x => x.id === form.venueId);
  const per = form.cost === 0 ? 0 : Math.round(form.cost / form.min / 500) * 500;

  const updateForm = (k: string, val: any) => {
    setForm(prev => {
      const next = { ...prev, [k]: val };
      if (k === 'venueId' || k === 'dur') {
        const v2 = state.venues.find(x => x.id === next.venueId);
        if (v2) next.cost = v2.rate * next.dur;
      }
      return next;
    });
  };

  const submit = () => {
    const venueName = form.venueId === 'other' ? (form.customVenue.trim() || 'Lokasi lain') : v?.n || 'Lokasi';
    const sp = SPORTS.find(x => x.n === form.sport) || { e: '🏅' };
    const id = 'u' + Date.now();
    addSession({
      id, sport: form.sport, emoji: sp.e, venue: venueName,
      day: form.day, time: form.time + ' – ' + endTime(form.time, form.dur),
      price: form.cost === 0 ? 0 : Math.round(form.cost / form.min / 500) * 500,
      min: form.min, joined: 1, level: form.level,
      dist: form.venueId === 'other' ? '—' : (v?.dist || '—'),
      free: form.cost === 0, host: 'Kamu', fits: true,
    });
    closeSheet();
    router.push('/mine');
    showToast(`Sesi ${form.sport} dibuat. ${form.openSession ? 'Sudah terbuka untuk umum.' : 'Bagikan tautan ke temanmu.'}`);
  };

  return (
    <>
      <div className="bg-court text-white p-[18px] lg:p-[20px] rounded-[20px_20px_0_0] lg:rounded-[18px_18px_0_0] relative">
        <button className="absolute right-[14px] top-[14px] bg-white/16 border-0 text-white w-[26px] h-[26px] rounded-full text-[15px] cursor-pointer leading-[1]" onClick={closeSheet}>✕</button>
        <h3 className="text-[21px] font-extrabold tracking-[-.025em]">Buat sesi</h3>
        <p className="text-[13px] text-white/75 mt-[5px] leading-[1.5]">Atur sendiri cabang, tempat, waktu, dan aturan patungannya.</p>
      </div>
      <div className="p-[16px_14px_20px] lg:p-[20px] flex flex-col gap-[14px]">
        
        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Cabang olahraga</label>
          <select className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1" value={form.sport} onChange={e => updateForm('sport', e.target.value)}>
            {SPORTS.map(s => <option key={s.n} value={s.n}>{s.n}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Tempat</label>
          <select className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1" value={form.venueId} onChange={e => updateForm('venueId', e.target.value)}>
            {state.venues.map(x => <option key={x.id} value={x.id}>{x.n} — {x.rate === 0 ? 'gratis' : rp(x.rate) + '/jam'}</option>)}
            <option value="other">Lokasi lain…</option>
          </select>
          {form.venueId === 'other' ? (
            <input type="text" placeholder="Nama tempat" value={form.customVenue} onChange={e => updateForm('customVenue', e.target.value)} className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court mt-[9px]" />
          ) : (
            <div className="text-[11.5px] text-muted mt-[5px] leading-[1.45]">{v?.note}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-[10px]">
          <div>
            <label className="block text-[12.5px] font-bold mb-[6px]">Hari</label>
            <select className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1" value={form.day} onChange={e => updateForm('day', e.target.value)}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-bold mb-[6px]">Jam mulai</label>
            <select className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1" value={form.time} onChange={e => updateForm('time', e.target.value)}>
              {SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Durasi</label>
          <div className="flex gap-[7px] flex-wrap">
            {[1,2,3].map(d => (
              <button key={d} onClick={() => updateForm('dur', d)} className={`text-[12.5px] font-semibold p-[8px_13px] rounded-[20px] border cursor-pointer ${form.dur === d ? 'bg-court border-court text-white' : 'bg-card border-line text-muted'}`}>{d} jam</button>
            ))}
          </div>
          <div className="text-[11.5px] text-muted mt-[5px] leading-[1.45]">Selesai pukul {endTime(form.time, form.dur)}</div>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Level pemain</label>
          <div className="flex gap-[7px] flex-wrap">
            {['Pemula','Menengah','Semua level'].map(l => (
              <button key={l} onClick={() => updateForm('level', l)} className={`text-[12.5px] font-semibold p-[8px_13px] rounded-[20px] border cursor-pointer ${form.level === l ? 'bg-court border-court text-white' : 'bg-card border-line text-muted'}`}>{l}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Jumlah pemain minimal</label>
          <div className="flex items-center gap-[12px]">
            <button onClick={() => updateForm('min', Math.max(2, form.min - 1))} className="w-[38px] h-[38px] rounded-[10px] border border-line bg-card text-[19px] font-semibold cursor-pointer">−</button>
            <b className="text-[19px] font-extrabold min-w-[34px] text-center">{form.min}</b>
            <button onClick={() => updateForm('min', Math.min(24, form.min + 1))} className="w-[38px] h-[38px] rounded-[10px] border border-line bg-card text-[19px] font-semibold cursor-pointer">+</button>
            <span className="text-[12.5px] text-muted">Sesi batal otomatis kalau tidak tercapai</span>
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold mb-[6px]">Total biaya lapangan</label>
          <input type="number" step="5000" min="0" value={form.cost} onChange={e => updateForm('cost', +e.target.value || 0)} className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1" />
          <div className="text-[11.5px] text-muted mt-[5px] leading-[1.45]">Terisi otomatis dari tarif venue. Ubah kalau ada biaya lain seperti sewa raket atau bola.</div>
        </div>

        <div>
          <div className={`flex items-center gap-[11px] bg-card border border-line rounded-radius p-[12px_13px] cursor-pointer ${form.openSession ? 'on' : ''}`} onClick={() => updateForm('openSession', !form.openSession)}>
            <div className={`w-[42px] h-[24px] rounded-[14px] shrink-0 relative transition-colors ${form.openSession ? 'bg-court' : 'bg-[#DDE3DE]'}`}>
              <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${form.openSession ? 'translate-x-[18px]' : ''}`}></div>
            </div>
            <div>
              <b className="text-[13.5px] font-bold block">Buka untuk umum</b>
              <i className="not-italic text-[11.5px] text-muted block mt-[2px] leading-[1.4]">{form.openSession ? 'Siapa pun bisa gabung sampai kuorum penuh' : 'Hanya lewat tautan undangan yang kamu bagikan'}</i>
            </div>
          </div>
        </div>

        <div className="bg-ink text-white rounded-radius p-[14px] mb-[12px]">
          <div className="flex justify-between text-[13px] py-[5px] text-white/72"><span>Jadwal</span><b className="text-white font-bold">{form.day}, {form.time} – {endTime(form.time, form.dur)}</b></div>
          <div className="flex justify-between text-[13px] py-[5px] text-white/72"><span>Pemain minimal</span><b className="text-white font-bold">{form.min} orang</b></div>
          <div className="flex justify-between text-[13px] py-[5px] text-white/72"><span>Biaya lapangan</span><b className="text-white font-bold">{rp(form.cost)}</b></div>
          <div className="flex justify-between text-[14px] pt-[10px] mt-[6px] border-t border-white/16 text-white/72"><span className="self-center">Patungan per orang</span><b className="text-white font-bold text-[19px] tracking-[-.02em]">{rp(per)}</b></div>
        </div>

        <button className="w-full bg-court text-white border-0 rounded-[11px] p-[14px] text-[15px] font-bold cursor-pointer" onClick={submit}>Buat sesi</button>
        <div className="text-[11.5px] text-muted text-center mt-[9px] leading-[1.5]">Kamu otomatis jadi host dan terhitung sebagai pemain pertama.</div>
      </div>
    </>
  );
}
