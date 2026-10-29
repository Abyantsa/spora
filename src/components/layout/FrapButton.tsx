'use client';
import { useAppStore } from '@/lib/store';

export default function FrapButton() {
  const { openSheet } = useAppStore();

  return (
    <button
      onClick={() => openSheet('create')}
      aria-label="Buat Sesi Baru"
      title="Buat Sesi Olahraga Baru"
      className="fixed right-[18px] sm:right-[28px] bottom-[74px] lg:bottom-[28px] w-[54px] sm:w-[58px] h-[54px] sm:h-[58px] rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white border-0 cursor-pointer grid place-items-center elev-frap z-30 transition-all hover:-translate-y-0.5 active:scale-95"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-[24px] h-[24px]">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    </button>
  );
}

