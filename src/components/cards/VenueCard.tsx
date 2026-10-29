'use client';
import { Venue } from '@/types';
import { rp } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export default function VenueCard({ venue: v }: { venue: Venue }) {
  const { openSheet } = useAppStore();

  const mapsLink = v.maps_url || `https://maps.google.com/?q=${encodeURIComponent(v.n + ' Surabaya')}`;

  return (
    <div 
      className="bg-white rounded-[16px] p-4 sm:p-5 elev-raised border border-[#e7e7e7] flex flex-col justify-between transition-all hover:elev-card-hover hover:border-[#00754A]/30"
    >
      <div>
        {/* Header row */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-[46px] sm:w-[50px] h-[46px] sm:h-[50px] rounded-[12px] bg-[#edebe9] grid place-items-center text-[22px] sm:text-[24px] shrink-0 border border-[#d6dbde]">
            {v.e}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#006241] leading-snug line-clamp-1">
                {v.n}
              </h3>
              <span className={`text-[13px] sm:text-[13.5px] font-bold shrink-0 px-2 py-0.5 rounded-full ${
                v.rate === 0 
                  ? 'bg-[#d4e9e2] text-[#006241]' 
                  : 'bg-[#edebe9] text-[#00754A]'
              }`}>
                {v.rate === 0 ? 'Gratis' : rp(v.rate) + '/jam'}
              </span>
            </div>
            
            <p className="text-[12px] text-[rgba(0,0,0,0.65)] mt-1 line-clamp-1">
              🏅 {v.sports} · 📍 {v.dist} · 🏢 {v.owner}
            </p>
          </div>
        </div>

        {/* Note / fasilitas */}
        {v.note && (
          <div className="mt-3 text-[12px] text-[rgba(0,0,0,0.6)] bg-[#faf9f8] p-2.5 rounded-[8px] border border-[#f0eeeb] line-clamp-2">
            💡 {v.note}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 pt-3 border-t border-[#f0eeeb] flex items-center justify-between gap-2">
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#00754A] hover:bg-[#edebe9] border border-[#d6dbde] transition-colors"
          title="Buka rute di Google Maps"
        >
          <span>📍</span>
          <span>Buka di Maps</span>
          <span className="text-[10px]">↗</span>
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSheet('book', v.id)}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-[rgba(0,0,0,0.75)] hover:bg-[#edebe9] transition-colors"
          >
            Jadwal
          </button>
          
          <button
            type="button"
            onClick={() => openSheet('create', v.id)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-[#00754A] hover:bg-[#005c3b] text-white shadow-sm transition-all active:scale-95"
          >
            <span>+</span>
            <span>Buat Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
