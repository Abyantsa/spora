'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

const NAV_ITEMS = [
  { key: 'home', label: 'Beranda', href: '/home' },
  { key: 'explore', label: 'Jelajah', href: '/explore' },
  { key: 'venue', label: 'Venue', href: '/venue' },
  { key: 'mine', label: 'Sesiku', href: '/mine', hasBadge: true },
  { key: 'chat', label: 'Chat Mabar', href: '/chat' },
  { key: 'profile', label: 'Profil', href: '/profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { state, openSheet, showToast } = useAppStore();

  const activeCount = state.joined.size + state.bookings.length;

  return (
    <header className="sticky top-0 z-40 bg-white elev-nav transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[64px] sm:h-[74px] flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo */}
        <Link href="/home" className="flex items-center gap-[10px] select-none no-underline group shrink-0">
          <div className="w-[38px] sm:w-[42px] h-[38px] sm:h-[42px] rounded-full bg-[#006241] flex items-center justify-center text-white shadow-[0_2px_6px_rgba(0,98,65,0.22)] shrink-0 transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] sm:w-[22px] h-[20px] sm:h-[22px]">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[19px] font-extrabold tracking-[-0.02em] text-[#006241] leading-[1.1]">SPORA</span>
            <span className="text-[11px] font-semibold text-[rgba(0,0,0,0.58)] tracking-[0.05em] uppercase hidden sm:block">Surabaya Sport Club</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-[6px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`inline-flex items-center gap-[6px] px-[15px] py-[8px] rounded-full text-[13.5px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#edebe9] text-[#006241] border border-[#d6dbde]'
                    : 'text-[rgba(0,0,0,0.87)] hover:bg-[#edebe9]'
                }`}
              >
                <span>{item.label}</span>
                {item.hasBadge && activeCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-full bg-[#00754A] text-white text-[10.5px] font-bold leading-none">
                    {activeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Campus Location Chip */}
          <button
            onClick={() => showToast('Radius aktif: 4 km dari Kampus ITS Sukolilo & Mulyosari.')}
            className="inline-flex items-center gap-[5px] px-[12px] py-[6px] rounded-full bg-[#edebe9] border border-[#d6dbde] text-[12.5px] font-semibold text-[#1E3932] hover:bg-[#e4e1dc] transition-all cursor-pointer whitespace-nowrap"
            title="Lokasi Aktif: ITS Sukolilo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-[#00754A] shrink-0">
              <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>
            </svg>
            <span className="hidden sm:inline">ITS Sukolilo</span>
            <span className="sm:hidden">ITS</span>
          </button>

          {/* User Status Pill (Kellan) */}
          <Link
            href="/profile"
            className="hidden md:inline-flex items-center gap-[7px] py-[4px] pr-[10px] pl-[5px] rounded-full border border-[#d6dbde] bg-white hover:bg-[#edebe9] transition-all select-none"
            title="Buka Profil & Sport Passport"
          >
            <div className="w-[24px] h-[24px] rounded-full bg-[#1E3932] text-white grid place-items-center text-[11px] font-bold">
              {state.user?.email ? state.user.email[0].toUpperCase() : 'K'}
            </div>
            <span className="text-[13px] font-semibold text-[rgba(0,0,0,0.87)]">
              {state.user?.email ? state.user.email.split('@')[0] : 'Kellan'}
            </span>
            <span className="border border-[#cba258] text-[#cba258] px-[6px] py-[1px] rounded-full text-[10.5px] font-bold">
              92%
            </span>
          </Link>

          {/* Create Session CTA Button */}
          <button
            onClick={() => openSheet('create')}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-[18px] py-[9px] rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[14px] font-semibold transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,117,74,0.2)] active:scale-95"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Buat Sesi</span>
          </button>
        </div>

      </div>
    </header>
  );
}
