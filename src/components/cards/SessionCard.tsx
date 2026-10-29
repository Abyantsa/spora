'use client';
import { Session } from '@/types';
import { rp } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export default function SessionCard({ session }: { session: Session }) {
  const { state, openSheet } = useAppStore();
  
  const mine = state.joined.has(session.id);
  const c = session.joined + (mine ? 1 : 0);
  const pct = Math.min(100, (c / session.min) * 100);
  const own = session.host === 'Kamu';
  const isFull = c >= session.min;

  const levelTagCls = session.level === 'Pemula' ? '' : session.level === 'Semua level' ? 'bg-[#EEF1EE] text-muted' : 'bg-[#FFF1D6] text-[#8A5A00]';

  return (
    <div 
      className={`bg-card border rounded-radius p-[13px] cursor-pointer transition-colors flex flex-col hover:border-court/35 ${own ? 'border-l-[3px] border-l-amber border-y-line border-r-line' : 'border-line'}`}
      tabIndex={0}
      onClick={() => openSheet('detail', session.id)}
      onKeyDown={(e) => e.key === 'Enter' && openSheet('detail', session.id)}
    >
      <div className="flex justify-between items-start gap-[10px] flex-1">
        <div>
          <div className="text-[15px] font-bold tracking-[-.01em]">{session.emoji} {session.sport}</div>
          <div className="text-[12.5px] text-muted mt-[3px] leading-[1.45]">{session.venue}<br/>{session.day}, {session.time} · {session.dist}</div>
        </div>
        <div className={`text-[14px] font-bold whitespace-nowrap text-right ${session.free ? 'text-court' : ''}`}>
          {rp(session.price)}
          <small className="block text-[10.5px] text-muted font-medium mt-[1px]">{session.free ? 'tanpa biaya' : 'per orang'}</small>
        </div>
      </div>
      
      <div className="flex items-center gap-[8px] mt-[11px] pt-[11px] border-t border-line flex-wrap">
        <span className={`text-[11px] font-semibold py-[3px] px-[8px] rounded-[20px] ${levelTagCls || 'bg-court-soft text-court'}`}>{session.level}</span>
        {session.free && <span className="text-[11px] font-semibold py-[3px] px-[8px] rounded-[20px] bg-[#DDF0E4] text-[#186B41]">Gratis</span>}
        {own ? (
          <span className="text-[11px] font-semibold py-[3px] px-[8px] rounded-[20px] bg-amber text-ink">Sesimu</span>
        ) : (mine ? (
          <span className="text-[11px] font-semibold py-[3px] px-[8px] rounded-[20px] bg-[#FFF1D6] text-[#8A5A00]">Kamu ikut</span>
        ) : null)}
        
        <div className="ml-auto text-[11.5px] text-muted font-semibold flex items-center gap-[6px]">
          <div className="w-[44px] h-[5px] bg-[#E6EAE6] rounded-[3px] overflow-hidden">
            <i className={`block h-full rounded-[3px] transition-all duration-350 ease-in-out ${isFull ? 'bg-court' : 'bg-amber'}`} style={{ width: `${pct}%` }}></i>
          </div>
          {c}/{session.min}
        </div>
      </div>
    </div>
  );
}
