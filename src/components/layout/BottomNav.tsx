'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex lg:hidden bg-card border-t border-line p-[7px_0_9px] fixed left-0 right-0 bottom-0 z-15">
      {TABS.map(t => {
        const isOn = pathname.startsWith(t.p);
        return (
          <Link key={t.k} href={t.p} className={`flex-1 bg-transparent border-0 text-[10px] font-semibold flex flex-col items-center gap-[4px] py-[4px] cursor-pointer transition-colors ${isOn ? 'text-court' : 'text-muted'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
              {ICONS[t.k as keyof typeof ICONS]}
            </svg>
            {t.l}
          </Link>
        );
      })}
    </nav>
  );
}
