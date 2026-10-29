'use client';
import { useAppStore } from '@/lib/store';

export default function Toast() {
  const { state } = useAppStore();
  const isOn = !!state.toastMsg;

  return (
    <div 
      className={`fixed bottom-[80px] sm:bottom-[30px] left-1/2 -translate-x-1/2 sm:left-auto sm:right-[30px] sm:translate-x-0 bg-[#1E3932] text-white px-5 py-2.5 rounded-full text-[13.5px] font-semibold flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.22)] z-50 pointer-events-none transition-all duration-200 max-w-[90vw] text-center ${
        isOn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span className="text-[#cba258] grid place-items-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span>{state.toastMsg}</span>
    </div>
  );
}
