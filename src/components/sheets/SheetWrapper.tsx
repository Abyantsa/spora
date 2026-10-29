'use client';
import { useAppStore } from '@/lib/store';
import DetailSheet from './DetailSheet';
import CreateSheet from './CreateSheet';
import BookSheet from './BookSheet';

export default function SheetWrapper() {
  const { state, closeSheet } = useAppStore();
  const isOn = !!state.sheet.mode;

  if (!isOn) return null;

  return (
    <div 
      className="fixed inset-0 bg-ink/45 flex items-end lg:items-center justify-center z-30" 
      onClick={(e) => { if ((e.target as any).id === 'sheetWrap') closeSheet(); }}
      id="sheetWrap"
    >
      <div className="bg-paper w-full lg:max-w-[560px] rounded-[20px_20px_0_0] lg:rounded-[18px] max-h-[92%] lg:max-h-[86vh] lg:mx-[20px] overflow-y-auto animate-up">
        {state.sheet.mode === 'detail' && <DetailSheet id={state.sheet.id!} />}
        {state.sheet.mode === 'create' && <CreateSheet />}
        {state.sheet.mode === 'book' && <BookSheet id={state.sheet.id!} />}
      </div>
    </div>
  );
}
