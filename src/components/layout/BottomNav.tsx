'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

const TABS = [
  { 
    k: 'home', 
    l: 'Beranda', 
    p: '/home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  { 
    k: 'explore', 
    l: 'Jelajah', 
    p: '/explore',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  },
  { 
    k: 'venue', 
    l: 'Venue', 
    p: '/venue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/>
        <circle cx="12" cy="10" r="2.5"/>
      </svg>
    )
  },
  { 
    k: 'mine', 
    l: 'Sesiku', 
    p: '/mine',
    hasBadge: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  { 
    k: 'chat', 
    l: 'Chat', 
    p: '/chat',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  { 
    k: 'profile', 
    l: 'Profil', 
    p: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
];

export default function BottomNav() {
  const pathname = usePathname();
  const { state } = useAppStore();
  const activeCount = state.joined.size + state.bookings.length;

  return (
    <nav className="flex lg:hidden bg-white border-t border-[#d6dbde] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] fixed left-0 right-0 bottom-0 z-30 h-[62px] px-1 items-center justify-around">
      {TABS.map(t => {
        const isActive = pathname.startsWith(t.p);
        return (
          <Link
            key={t.k}
            href={t.p}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-[3px] transition-colors relative ${
              isActive ? 'text-[#006241] font-bold' : 'text-[rgba(0,0,0,0.58)] font-medium'
            }`}
          >
            {t.icon}
            <span className="text-[10px] leading-none">{t.l}</span>
            {t.hasBadge && activeCount > 0 && (
              <span className="absolute top-[6px] right-[calc(50%-12px)] w-[6px] h-[6px] rounded-full bg-[#00754A]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
