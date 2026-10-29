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

  const updateForm = (k: string, val: string | number | boolean) => {
    setForm(prev => {
      const next = { ...prev, [k]: val };
      if (k === 'venueId' || k === 'dur') {
        const v2 = state.venues.find(x => x.id === next.venueId);
        if (v2) next.cost = v2.rate * Number(next.dur);
      }
      return next;
    });
  };

  const submit = () => {
    const venueName = form.venueId === 'other' ? (form.customVenue.trim() || 'Lokasi lain') : v?.n || 'Lokasi';
    const sp = SPORTS.find(x => x.n === form.sport) || { e: '🏅' };
    const id = 'session-user-' + Date.now();
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
    showToast(`Sesi ${form.sport} berhasil diterbitkan dan masuk ke Sesiku.`);
  };

  return (
    <div className="flex flex-col">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#e7e7e7] relative">
        <button 
          onClick={closeSheet} 
          aria-label="Tutup"
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#edebe9] hover:bg-[#d6dbde] text-[rgba(0,0,0,0.87)] grid place-items-center cursor-pointer transition-all border-0 text-[15px]"
        >
          ✕
        </button>
        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#006241] pr-9 leading-tight">
          Buat Sesi Olahraga Baru
        </h3>
        <p className="text-[12.5px] text-[rgba(0,0,0,0.58)] mt-1 leading-normal">
          Buka sesi permainan, tentukan kuorum, dan ajak pemain lain patungan.
        </p>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Sport Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Cabang Olahraga
          </label>
          <select 
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A] focus:ring-2 focus:ring-[#00754A]/20"
            value={form.sport} 
            onChange={e => updateForm('sport', e.target.value)}
          >
            {SPORTS.map(s => <option key={s.n} value={s.n}>{s.e} {s.n}</option>)}
          </select>
        </div>

        {/* Venue Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Venue Lapangan
          </label>
          <select 
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A] focus:ring-2 focus:ring-[#00754A]/20"
            value={form.venueId} 
            onChange={e => updateForm('venueId', e.target.value)}
          >
            {state.venues.map(x => (
              <option key={x.id} value={x.id}>
                {x.n} ({x.rate === 0 ? 'Gratis' : rp(x.rate) + '/jam'})
              </option>
            ))}
            <option value="other">Lokasi Lain / Lapangan Kos…</option>
          </select>
          {form.venueId === 'other' ? (
            <input 
              type="text" 
              placeholder="Nama tempat atau lapangan..." 
              value={form.customVenue} 
              onChange={e => updateForm('customVenue', e.target.value)} 
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A] mt-1" 
            />
          ) : (
            <span className="text-[11.5px] text-[rgba(0,0,0,0.58)]">{v?.note}</span>
          )}
        </div>

        {/* Day & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Hari</label>
            <select 
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]" 
              value={form.day} 
              onChange={e => updateForm('day', e.target.value)}
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Jam Mulai</label>
            <select 
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]" 
              value={form.time} 
              onChange={e => updateForm('time', e.target.value)}
            >
              {SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Durasi Main</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map(d => (
              <button 
                type="button" 
                key={d} 
                onClick={() => updateForm('dur', d)} 
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  form.dur === d 
                    ? 'bg-[#00754A] text-white shadow-sm' 
                    : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.87)] hover:bg-[#edebe9]'
                }`}
              >
                {d} Jam ({endTime(form.time, d)})
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Level Kemahiran</label>
          <div className="flex gap-2 flex-wrap">
            {['Pemula', 'Menengah', 'Semua level'].map(l => (
              <button 
                type="button" 
                key={l} 
                onClick={() => updateForm('level', l)} 
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  form.level === l 
                    ? 'bg-[#00754A] text-white shadow-sm' 
                    : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.87)] hover:bg-[#edebe9]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Min Players Stepper */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Jumlah Kuorum Minimal</label>
          <div className="inline-flex items-center gap-3 bg-[#edebe9] border border-[#d6dbde] rounded-full px-3 py-1 w-fit">
            <button 
              type="button" 
              onClick={() => updateForm('min', Math.max(2, form.min - 1))}
              className="w-8 h-8 rounded-full bg-white border border-[#d6dbde] text-[16px] font-bold grid place-items-center cursor-pointer hover:bg-[#edebe9]"
            >
              −
            </button>
            <span className="text-[16px] font-bold min-w-6 text-center">{form.min}</span>
            <button 
              type="button" 
              onClick={() => updateForm('min', Math.min(24, form.min + 1))}
              className="w-8 h-8 rounded-full bg-white border border-[#d6dbde] text-[16px] font-bold grid place-items-center cursor-pointer hover:bg-[#edebe9]"
            >
              +
            </button>
            <span className="text-[12px] text-[rgba(0,0,0,0.58)] font-semibold pr-1">Orang</span>
          </div>
        </div>

        {/* Total Cost */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Total Biaya Lapangan</label>
          <input 
            type="number" 
            step="5000" 
            min="0" 
            value={form.cost} 
            onChange={e => updateForm('cost', +e.target.value || 0)} 
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]" 
          />
          <span className="text-[11.5px] text-[rgba(0,0,0,0.58)]">Terisi otomatis dari tarif venue. Ubah kalau ada biaya shuttlecock/bola.</span>
        </div>

        {/* Cost Calculation Card */}
        <div className="bg-[#edebe9] rounded-[14px] p-4 border border-[#d6dbde] flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[rgba(0,0,0,0.58)]">Jadwal Main:</span>
            <b>{form.day}, {form.time} – {endTime(form.time, form.dur)}</b>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[rgba(0,0,0,0.58)]">Kuorum Minimal:</span>
            <b>{form.min} Orang</b>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[rgba(0,0,0,0.58)]">Total Biaya:</span>
            <b>{rp(form.cost)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px] font-bold pt-2 border-t border-[#d6dbde] text-[#006241]">
            <span>Patungan per Pemain:</span>
            <b>{rp(per)}</b>
          </div>
        </div>

        <button 
          onClick={submit} 
          className="w-full py-3.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[15px] font-bold shadow-[0_2px_8px_rgba(0,117,74,0.25)] transition-all cursor-pointer active:scale-95 mt-1"
        >
          Terbitkan Sesi Olahraga
        </button>
        <p className="text-[11.5px] text-[rgba(0,0,0,0.58)] text-center -mt-2">
          Kamu otomatis terdaftar sebagai Host dan terhitung sebagai pemain pertama.
        </p>

      </div>
    </div>
  );
}
