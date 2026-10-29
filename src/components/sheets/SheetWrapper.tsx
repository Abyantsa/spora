'use client';
import { useAppStore } from '@/lib/store';
import DetailSheet from './DetailSheet';
import CreateSheet from './CreateSheet';
import BookSheet from './BookSheet';
import ScheduleSheet from './ScheduleSheet';
import QrisSheet from './QrisSheet';
import AddVenueSheet from './AddVenueSheet';

export default function SheetWrapper() {
  const { state, closeSheet } = useAppStore();
  const isOn = !!state.sheet.mode;

  if (!isOn) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/45 backdrop-blur-[4px] flex items-end sm:items-center justify-center z-50 p-0 sm:p-6" 
      onClick={(e) => { if ((e.target as HTMLElement).id === 'sheetWrap') closeSheet(); }}
      id="sheetWrap"
    >
      <div className="bg-white w-full sm:max-w-[560px] rounded-t-[20px] sm:rounded-[18px] max-h-[88vh] sm:max-h-[85vh] shadow-[0_10px_40px_rgba(0,0,0,0.22)] overflow-y-auto animate-up">
        {state.sheet.mode === 'detail' && <DetailSheet id={state.sheet.id!} />}
        {state.sheet.mode === 'create' && <CreateSheet initialVenueId={state.sheet.id} />}
        {state.sheet.mode === 'book' && <BookSheet id={state.sheet.id!} />}
        {state.sheet.mode === 'schedule' && <ScheduleSheet />}
        {state.sheet.mode === 'qris' && <QrisSheet />}
        {state.sheet.mode === 'add-venue' && <AddVenueSheet />}
      </div>
    </div>
  );
}
