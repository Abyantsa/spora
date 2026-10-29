'use client';
import { useState } from 'react';
import { useAppStore, DAYS, SLOTS } from '@/lib/store';

export default function ScheduleSheet() {
  const { state, closeSheet, addScheduleSlot, deleteScheduleSlot } = useAppStore();
  const [day, setDay] = useState('Selasa');
  const [start, setStart] = useState('15.00');
  const [end, setEnd] = useState('17.00');

  const handleAdd = () => {
    const startNum = parseFloat(start.replace('.', ':'));
    const endNum = parseFloat(end.replace('.', ':'));
    if (endNum <= startNum) {
      alert('Jam selesai harus lebih akhir dari jam mulai.');
      return;
    }

    addScheduleSlot({
      day_of_week: day,
      start_time: start,
      end_time: end,
      is_free_time: true
    });
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
          Atur Jadwal Luang Mingguan
        </h3>
        <p className="text-[12.5px] text-[rgba(0,0,0,0.58)] mt-1 leading-normal">
          Tentukan hari dan jam luangmu di luar perkuliahan untuk mendapatkan rekomendasi mabar yang pas.
        </p>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-5">
        
        {/* Existing Slots */}
        <div>
          <span className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider block mb-2.5">
            Daftar Celah Waktu Aktif ({state.schedules.length})
          </span>

          {state.schedules.length > 0 ? (
            <div className="flex flex-col gap-2">
              {state.schedules.map(sch => (
                <div 
                  key={sch.id}
                  className="flex items-center justify-between p-3 sm:p-3.5 bg-[#edebe9] rounded-[10px] border border-[#d6dbde]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00754A]" />
                    <span className="text-[14px] font-bold text-[#006241]">
                      {sch.day_of_week}
                    </span>
                    <span className="text-[13px] text-[rgba(0,0,0,0.87)] font-medium">
                      {sch.start_time} – {sch.end_time}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteScheduleSlot(sch.id)}
                    title="Hapus slot waktu ini"
                    className="w-7 h-7 rounded-full bg-white hover:bg-red-50 hover:text-red-600 text-[rgba(0,0,0,0.58)] grid place-items-center border border-[#d6dbde] transition-colors cursor-pointer text-[13px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#edebe9] rounded-[10px] p-4 text-center text-[13px] text-[rgba(0,0,0,0.58)]">
              Belum ada jadwal luang yang diatur. Tambahkan slot di bawah agar sistem bisa mencocokkan sesi untukmu!
            </div>
          )}
        </div>

        {/* Add Slot Form Card */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#d6dbde] elev-raised flex flex-col gap-3.5">
          <b className="text-[14px] font-bold text-[#006241] block">
            + Tambah Celah Waktu Luang
          </b>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
              Hari
            </label>
            <select
              value={day}
              onChange={e => setDay(e.target.value)}
              className="w-full bg-[#edebe9] border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
                Mulai Jam
              </label>
              <select
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-full bg-[#edebe9] border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
              >
                {SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
                Sampai Jam
              </label>
              <select
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="w-full bg-[#edebe9] border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
              >
                {SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-2.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[14px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 mt-1"
          >
            Simpan Slot Waktu
          </button>
        </div>

      </div>
    </div>
  );
}

