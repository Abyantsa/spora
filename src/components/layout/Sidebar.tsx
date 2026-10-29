'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

const ICONS = {
  home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></>,
  explore: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></>,
  venue: <><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></>,
  mine: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></>,
  profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></>,
};

const TABS = [
  { k:'home', l:'Beranda', p:'/home' },
  { k:'explore', l:'Jelajah', p:'/explore' },
  { k:'venue', l:'Venue', p:'/venue' },
  { k:'mine', l:'Sesiku', p:'/mine' },
  { k:'profile', l:'Profil', p:'/profile' }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, openSheet, logout } = useAppStore();

  return (
    <aside className="hidden lg:flex flex-col w-[246px] shrink-0 bg-court text-white p-[26px_18px_20px] sticky top-0 h-screen">
      <div className="flex flex-col">
        <h1 className="text-[22px] font-extrabold tracking-[-.025em]">SPORA</h1>
        <span className="text-[11.5px] text-white/65 font-medium">Surabaya Pusat & Timur</span>
      </div>
      
      <div className="mt-[30px] flex flex-col gap-[3px]">
        {TABS.map(t => {
          const isOn = pathname.startsWith(t.p);
          return (
            <Link key={t.k} href={t.p} className={`flex items-center gap-[11px] font-semibold text-[14px] p-[11px_12px] rounded-[9px] cursor-pointer text-left w-full transition-colors ${isOn ? 'bg-white/15 text-white' : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px] shrink-0">
                {ICONS[t.k as keyof typeof ICONS]}
              </svg>
              {t.l}
            </Link>
          );
        })}
      </div>

      <button onClick={() => openSheet('create')} className="mt-[16px] w-full bg-amber text-ink border-0 rounded-[10px] p-[12px] text-[14px] font-bold cursor-pointer hover:brightness-105 transition-all">
        + Buat sesi
      </button>

      <div className="mt-auto text-[11.5px] text-white/50 leading-[1.6] border-t border-white/15 pt-[14px]">
        <div className="mb-[8px] truncate">{state.user?.email || 'Guest User'}</div>
        Skor kehadiran 92<br/>
        <button onClick={logout} className="mt-[8px] text-[11px] font-semibold bg-transparent border border-white/30 text-white/80 p-[4px_12px] rounded-[20px] hover:bg-white/10 cursor-pointer">Log Out</button>
      </div>
    </aside>
  );
}
