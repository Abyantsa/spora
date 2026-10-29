'use client';
import { Session } from '@/types';
import { useAppStore } from '@/lib/store';
import { rp } from '@/lib/utils';

export default function SessionCard({ session: s }: { session: Session }) {
  const { state, openSheet } = useAppStore();

  const isMine = state.joined.has(s.id);
  const isHost = s.host === 'Kamu';
  const count = s.joined + (isMine && !isHost ? 1 : 0);
  const isFull = count >= s.min;
  const pct = Math.min(100, Math.round((count / s.min) * 100));

  return (
    <article
      onClick={() => openSheet('detail', s.id)}
      className={`bg-white rounded-[14px] p-4 sm:p-5 elev-raised border border-black/5 flex flex-col gap-3 sm:gap-4 cursor-pointer select-none transition-all hover:elev-card-hover hover:border-[#d6dbde] hover:-translate-y-0.5 active:scale-[0.98] ${
        isHost
          ? 'border-l-4 border-l-[#006241]'
          : isMine
          ? 'border-l-4 border-l-[#00754A]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-full bg-[#edebe9] grid place-items-center text-[15px] shrink-0">
              {s.emoji}
            </span>
            <span className="text-[17px] sm:text-[18px] font-bold text-[#006241] leading-tight truncate">
              {s.sport}
            </span>
          </div>
          <div className="text-[14px] text-[rgba(0,0,0,0.87)] font-medium leading-snug truncate">
            {s.venue}
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5">
            {s.day}, {s.time} · {s.dist}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className={`text-[17px] font-bold leading-tight whitespace-nowrap ${s.free ? 'text-[#006241]' : 'text-[#00754A]'}`}>
            {rp(s.price)}
          </div>
          <span className="text-[11px] text-[rgba(0,0,0,0.58)] block mt-0.5 whitespace-nowrap">
            {s.free ? 'Bebas biaya' : 'per pemain'}
          </span>
        </div>
      </div>

      {/* Quorum Progress Bar */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-[#e7e7e7]">
        <div className="w-full h-[7px] rounded-full bg-[#edebe9] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isFull ? 'bg-[#006241]' : 'bg-[#00754A]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#edebe9] text-[rgba(0,0,0,0.87)]">
              {s.level}
            </span>
            {s.free && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#d4e9e2] text-[#006241]">
                Gratis
              </span>
            )}
            {isHost ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#006241] text-white">
                Sesimu (Host)
              </span>
            ) : isMine ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1E3932] text-white">
                Kamu Ikut
              </span>
            ) : null}
          </div>
          <span className="text-[12px] font-semibold text-[rgba(0,0,0,0.87)] whitespace-nowrap">
            {count}/{s.min} Kuorum
          </span>
        </div>
      </div>
    </article>
  );
}
