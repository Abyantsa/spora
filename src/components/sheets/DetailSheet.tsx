'use client';
import { useAppStore } from '@/lib/store';
import { rp } from '@/lib/utils';

export default function DetailSheet({ id }: { id: string }) {
  const { state, closeSheet, toggleJoin } = useAppStore();
  const s = state.sessions.find(x => x.id === id);
  
  if (!s) return null;

  const mine = state.joined.has(s.id);
  const isHost = s.host === 'Kamu';
  const c = s.joined + (mine && !isHost ? 1 : 0);
  const pct = Math.min(100, Math.round((c / s.min) * 100));
  const isFull = c >= s.min;
  const perHead = s.price === 0 ? 0 : Math.round(s.price * s.min / Math.max(c, 1) / 500) * 500;

  const pills = [];
  for(let i=0; i<s.min; i++) {
    if(mine && i === c-1) {
      pills.push(
        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1E3932] text-white">
          {isHost ? 'Kamu (Host)' : 'Kamu'}
        </span>
      );
    } else if(i < c) {
      pills.push(
        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#edebe9] text-[rgba(0,0,0,0.87)]">
          Pemain {i+1}
        </span>
      );
    } else {
      pills.push(
        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-dashed border-[#d6dbde] text-[rgba(0,0,0,0.58)]">
          Slot Kosong
        </span>
      );
    }
  }

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
          {s.emoji} {s.sport}
        </h3>
        <p className="text-[12.5px] text-[rgba(0,0,0,0.58)] mt-1 leading-normal">
          {s.venue} · {s.day}, {s.time} ({s.dist})
        </p>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-4">
        {/* Calculation Card */}
        <div className="bg-[#edebe9] rounded-[14px] p-4 border border-[#d6dbde] flex flex-col gap-2">
          <div className="flex justify-between items-center text-[13.5px]">
            <span className="text-[rgba(0,0,0,0.58)]">Level Kemahiran</span>
            <b className="font-bold">{s.level}</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px]">
            <span className="text-[rgba(0,0,0,0.58)]">Host Penyelenggara</span>
            <b className="font-bold">{s.host}</b>
          </div>
          <div className="flex justify-between items-center text-[13.5px]">
            <span className="text-[rgba(0,0,0,0.58)]">Total Biaya Lapangan</span>
            <b className="font-bold">{s.free ? 'Gratis (Fasilitas Kampus)' : rp(s.price * s.min)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px] font-bold pt-2 border-t border-[#d6dbde] text-[#006241]">
            <span>Patungan per Pemain</span>
            <b>{s.free ? 'Rp0' : rp(perHead)}</b>
          </div>
        </div>
        
        {/* Quorum Box */}
        <div className="bg-[#edebe9] rounded-[14px] p-4 border border-[#d6dbde] flex flex-col gap-2">
          <div className="flex justify-between items-center flex-wrap gap-1">
            <b className="text-[13.5px] text-[#006241]">
              Status Kuorum ({c}/{s.min} Pemain)
            </b>
            <span className={`text-[12px] font-bold ${isFull ? 'text-[#006241]' : 'text-[rgba(0,0,0,0.58)]'}`}>
              {isFull ? '✓ Terpenuhi' : `Kurang ${s.min - c} lagi`}
            </span>
          </div>

          <div className="w-full h-[7px] rounded-full bg-white overflow-hidden my-1">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isFull ? 'bg-[#006241]' : 'bg-[#00754A]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex gap-1.5 flex-wrap mt-1">
            {pills}
          </div>
        </div>

        {/* Action Button */}
        {isHost ? (
          <div>
            <button disabled className="w-full py-3 rounded-full border border-[#d6dbde] text-[rgba(0,0,0,0.58)] bg-transparent text-[14px] font-semibold cursor-not-allowed">
              Kamu adalah Host Sesi Ini
            </button>
            <p className="text-[11.5px] text-[rgba(0,0,0,0.58)] text-center mt-2">
              Sesi ini terbuka untuk pemain sekitar ITS. Notifikasi otomatis dikirim saat kuorum penuh.
            </p>
          </div>
        ) : mine ? (
          <div>
            <button 
              onClick={() => toggleJoin(s.id)}
              className="w-full py-3 rounded-full border border-red-500 text-red-600 hover:bg-red-50 text-[14px] font-semibold transition-all cursor-pointer active:scale-95"
            >
              Batalkan Ikut Sesi (Keluar)
            </button>
            <p className="text-[11.5px] text-[rgba(0,0,0,0.58)] text-center mt-2">
              Pembatalan sebelum kuorum tercapai tidak dikenakan penalti fairplay.
            </p>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => toggleJoin(s.id)}
              className="w-full py-3.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[15px] font-bold shadow-[0_2px_8px_rgba(0,117,74,0.25)] transition-all cursor-pointer active:scale-95"
            >
              {s.free ? 'Gabung Sesi Sekarang (Gratis)' : `Gabung & Patungan ${rp(perHead)}`}
            </button>
            <p className="text-[11.5px] text-[rgba(0,0,0,0.58)] text-center mt-2">
              {s.free ? 'Fasilitas kampus bebas biaya. Cukup hadir dengan perlengkapan pribadi.' : 'Patungan aman dengan garansi 100% refund bila kuorum tidak terpenuhi.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
