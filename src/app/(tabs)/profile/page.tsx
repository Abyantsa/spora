'use client';
import { useAppStore, PASSPORT } from '@/lib/store';

export default function ProfilePage() {
  const { state, openSheet, logout } = useAppStore();
  
  const tried = new Set(state.tried);
  state.sessions.forEach(s => {
    if (state.joined.has(s.id)) tried.add(s.sport.split(' ')[0]);
  });

  const userName = state.user?.email ? state.user.email.split('@')[0] : 'Kellan A.';
  const userRole = state.user?.email ? `${state.user.email} · Mahasiswa ITS` : 'Sistem Informasi ITS · Angkatan 2023 · Mulyosari';

  return (
    <div className="bg-white rounded-[14px] p-5 sm:p-8 elev-raised flex flex-col gap-6">
      
      {/* Profile Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-[#006241] text-white grid place-items-center text-[22px] sm:text-[26px] font-extrabold shrink-0 shadow-[0_2px_8px_rgba(0,98,65,0.2)]">
            {userName[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#006241] leading-tight">
              {userName}
            </h1>
            <p className="text-[13px] text-[rgba(0,0,0,0.58)] mt-0.5">
              {userRole}
            </p>
          </div>
        </div>
        
        {state.user && (
          <button
            onClick={logout}
            className="text-[12px] font-semibold text-clay border border-[#d6dbde] px-4 py-1.5 rounded-full hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
          >
            Keluar (Logout)
          </button>
        )}
      </div>

      {/* Attendance Score Highlight */}
      <div className="bg-[#edebe9] rounded-[14px] p-4 sm:p-5 border border-[#d6dbde]">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div>
            <b className="text-[15px] sm:text-[16px] text-[#006241] block">
              Skor Kehadiran & Sportivitas
            </b>
            <p className="text-[12.5px] text-[rgba(0,0,0,0.58)] mt-0.5">
              Hadir di 23 dari 25 sesi komunitas terakhir tanpa pembatalan mendadak.
            </p>
          </div>
          <span className="text-[28px] font-extrabold text-[#cba258] leading-none">
            92%
          </span>
        </div>
        <div className="w-full h-[7px] rounded-full bg-white/70 overflow-hidden">
          <div className="h-full rounded-full bg-[#cba258]" style={{ width: '92%' }} />
        </div>
      </div>

      {/* Sport Passport Stamps */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h2 className="text-[16px] sm:text-[18px] font-bold text-[#006241] tracking-[-0.01em]">
            Sport Passport Surabaya
          </h2>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">
            {tried.size} dari 6 Cabang Terbuka
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {PASSPORT.map(p => {
            const isUnlocked = tried.has(p.n);
            return (
              <div 
                key={p.n} 
                className={`rounded-[14px] p-3 text-center flex flex-col items-center gap-1 transition-all ${
                  isUnlocked 
                    ? 'bg-[#faf6ee] border-1.5 border-[#cba258] shadow-[0_2px_8px_rgba(203,162,88,0.15)]' 
                    : 'bg-[#edebe9] border-1.5 border-dashed border-[#d6dbde] opacity-60'
                }`}
              >
                <span className="text-[26px] leading-none">{p.e}</span>
                <span className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] truncate max-w-full mt-1">
                  {p.n}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isUnlocked ? 'text-[#cba258]' : 'text-[rgba(0,0,0,0.58)]'}`}>
                  {isUnlocked ? 'Terbuka ★' : 'Terkunci'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Celah Jadwal Kuliah Section */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h2 className="text-[16px] sm:text-[18px] font-bold text-[#006241] tracking-[-0.01em]">
            Celah Jadwal Luang ({state.schedules.length})
          </h2>
          <button
            onClick={() => openSheet('schedule')}
            className="text-[12px] font-bold text-[#00754A] hover:underline bg-transparent border-0 cursor-pointer"
          >
            + Kelola Jadwal
          </button>
        </div>

        {state.schedules.length > 0 ? (
          <div className="flex flex-col gap-2">
            {state.schedules.map((sch, i) => (
              <div 
                key={sch.id || i}
                className="flex justify-between items-center p-3 sm:p-3.5 bg-[#edebe9] rounded-[8px] text-[13.5px] flex-wrap gap-1.5 border border-[#d6dbde]/60"
              >
                <span className="font-semibold text-[rgba(0,0,0,0.87)]">
                  {sch.day_of_week}
                </span>
                <b className={i === 0 ? "text-[#00754A]" : "text-[rgba(0,0,0,0.87)] font-medium"}>
                  {sch.start_time} – {sch.end_time} {i === 0 ? '(Rekomendasi Utama)' : ''}
                </b>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#edebe9] rounded-[8px] text-center text-[13px] text-[rgba(0,0,0,0.58)] flex flex-col items-center gap-2">
            <span>Belum ada jadwal luang yang diatur.</span>
            <button
              onClick={() => openSheet('schedule')}
              className="px-4 py-1.5 rounded-full bg-[#00754A] text-white text-[12px] font-semibold cursor-pointer"
            >
              + Tambah Jadwal Luang
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
