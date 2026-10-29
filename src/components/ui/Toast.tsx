'use client';
import { useAppStore } from '@/lib/store';

export default function Toast() {
  const { state } = useAppStore();
  const isOn = !!state.toastMsg;

  return (
    <div className={`fixed left-[14px] right-[14px] bottom-[84px] lg:left-auto lg:right-[24px] lg:bottom-[28px] max-w-[340px] bg-ink text-white rounded-[11px] p-[12px_14px] text-[13px] font-medium z-40 pointer-events-none transition-all duration-240 leading-[1.45] ${isOn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {state.toastMsg}
    </div>
  );
}
