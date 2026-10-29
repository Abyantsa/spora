'use client';
import { useState } from 'react';
import { useAppStore, SPORTS, DAYS, SLOTS } from '@/lib/store';
import { rp, endTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

function generateBookingCode() {
  return 'SPR-' + Math.floor(1000 + Math.random() * 9000);
}

function generateSessionId() {
  return 'b' + Date.now();
}

export default function BookSheet({ id }: { id: string }) {
  const { state, addBooking, addSession, closeSheet, showToast } = useAppStore();
  const router = useRouter();

  const v = state.venues.find(x => x.id === id);
  const [b, setB] = useState({ day: 'Selasa', time: '15.00', dur: 1, asSession: false });

  if (!v) return null;

  const total = v.rate * b.dur;
  const ready = !!b.time;

  const submit = () => {
    const code = generateBookingCode();
    const end = endTime(b.time, b.dur);
    
    addBooking({
      venue: v.n, emoji: v.e, day: b.day, time: b.time, end, dur: b.dur, total, code
    });

    if (b.asSession) {
      const sessionId = generateSessionId();
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
    
    showToast(b.asSession
      ? `Venue ${v.n} dipesan & sesi matchmaking terbuka berhasil dibuat!`
      : `Pemesanan ${v.n} sukses! Kode: ${code}`);
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
          {v.e} {v.n}
        </h3>
        <p className="text-[12.5px] text-[rgba(0,0,0,0.58)] mt-1 leading-normal">
          {v.sports} · {v.dist} · Dikelola oleh {v.owner}
        </p>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-4">
        {/* Cost Info Card */}
        <div className="bg-[#edebe9] rounded-[14px] p-4 border border-[#d6dbde] flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[13.5px]">
            <span className="text-[rgba(0,0,0,0.58)]">Tarif Sewa:</span>
            <b className="font-bold">{v.rate === 0 ? 'Gratis / Bebas Biaya' : `${rp(v.rate)} / jam`}</b>
          </div>
          <div className="flex justify-between items-center text-[13px] pt-1 border-t border-[#d6dbde]">
            <span className="text-[rgba(0,0,0,0.58)]">Ketentuan:</span>
            <span className="text-[rgba(0,0,0,0.87)] text-right font-medium max-w-[70%]">{v.note}</span>
          </div>
        </div>

        {/* Day */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Pilih Hari</label>
          <select 
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]" 
            value={b.day} 
            onChange={e => setB(prev => ({ ...prev, day: e.target.value }))}
          >
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Slot Times */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Jam Tersedia</label>
          <div className="flex gap-2 flex-wrap">
            {SLOTS.map(t => {
              const isTaken = v.taken.includes(t);
              const isActive = b.time === t;
              return (
                <button 
                  type="button" 
                  key={t} 
                  disabled={isTaken}
                  title={isTaken ? 'Sudah terpesan' : ''}
                  onClick={() => setB(prev => ({ ...prev, time: t }))} 
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                    isTaken 
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 line-through cursor-not-allowed opacity-50' 
                      : isActive 
                      ? 'bg-[#00754A] text-white shadow-sm' 
                      : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.87)] hover:bg-[#edebe9]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <span className="text-[11.5px] text-[rgba(0,0,0,0.58)]">Jam yang dicoret sudah terpesan oleh tim lain.</span>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Durasi Pemesanan</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map(d => (
              <button 
                type="button" 
                key={d} 
                onClick={() => setB(prev => ({ ...prev, dur: d }))} 
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  b.dur === d 
                    ? 'bg-[#00754A] text-white shadow-sm' 
                    : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.87)] hover:bg-[#edebe9]'
                }`}
              >
                {d} Jam
              </button>
            ))}
          </div>
        </div>

        {/* Matchmaking Checkbox */}
        <div 
          onClick={() => setB(prev => ({ ...prev, asSession: !prev.asSession }))}
          className="bg-[#edebe9] rounded-[8px] p-3 border border-[#d6dbde] flex items-center gap-3 cursor-pointer select-none"
        >
          <input 
            type="checkbox" 
            checked={b.asSession} 
            onChange={() => {}} 
            className="w-4 h-4 accent-[#00754A] pointer-events-none" 
          />
          <div>
            <b className="text-[13px] text-[rgba(0,0,0,0.87)] block">Buka Sekaligus Sesi Matchmaking</b>
            <span className="text-[11.5px] text-[rgba(0,0,0,0.58)] block">Pemain lain di SPORA bisa bergabung dan otomatis ikut patungan</span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-[#edebe9] rounded-[14px] p-4 border border-[#d6dbde] flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[rgba(0,0,0,0.58)]">Jadwal Terpilih:</span>
            <b>{b.time ? `${b.day}, ${b.time} – ${endTime(b.time, b.dur)}` : 'Belum memilih jam'}</b>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[rgba(0,0,0,0.58)]">Durasi:</span>
            <b>{b.dur} Jam</b>
          </div>
          <div className="flex justify-between items-center text-[15px] font-bold pt-2 border-t border-[#d6dbde] text-[#006241]">
            <span>Total Biaya:</span>
            <b>{rp(total)}</b>
          </div>
        </div>

        <button 
          onClick={submit} 
          disabled={!ready}
          className="w-full py-3.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[15px] font-bold shadow-[0_2px_8px_rgba(0,117,74,0.25)] transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {ready ? (total === 0 ? 'Konfirmasi Pemesanan Fasilitas' : `Bayar & Sewa Venue (${rp(total)})`) : 'Pilih Jam Terlebih Dahulu'}
        </button>
        <p className="text-[11.5px] text-[rgba(0,0,0,0.58)] text-center -mt-2">
          {total === 0 
            ? 'Fasilitas kampus dicatat untuk pencegahan tabrakan jadwal.' 
            : 'Pembatalan gratis hingga 12 jam sebelum mulai. Kode booking resmi seketika diterbitkan.'}
        </p>

      </div>
    </div>
  );
}
