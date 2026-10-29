'use client';
import { useAppStore } from '@/lib/store';
import { rp } from '@/lib/utils';

export default function QrisSheet() {
  const { state, closeSheet, completeQrisPayment } = useAppStore();
  const qris = state.qrisTarget;

  if (!qris) return null;

  return (
    <div className="flex flex-col">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#e7e7e7] relative text-center">
        <button 
          onClick={closeSheet} 
          aria-label="Tutup"
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#edebe9] hover:bg-[#d6dbde] text-[rgba(0,0,0,0.87)] grid place-items-center cursor-pointer transition-all border-0 text-[15px]"
        >
          ✕
        </button>
        <span className="text-[12px] font-bold text-[#00754A] uppercase tracking-wider block">
          Patungan Sesi Mabar
        </span>
        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#006241] mt-0.5 leading-tight">
          QRIS Spora Escrow
        </h3>
        <p className="text-[13px] text-[rgba(0,0,0,0.58)] mt-1 truncate max-w-[85%] mx-auto">
          {qris.title}
        </p>
      </div>

      <div className="p-5 sm:p-6 flex flex-col items-center gap-4">
        {/* Amount Box */}
        <div className="text-center">
          <span className="text-[12px] text-[rgba(0,0,0,0.58)] font-semibold block">Total Tagihan Patungan</span>
          <b className="text-[28px] sm:text-[32px] font-extrabold text-[#00754A] leading-tight">
            {rp(qris.amount)}
          </b>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-[16px] border-2 border-[#1E3932] shadow-md flex flex-col items-center max-w-[240px] w-full">
          <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-gray-200">
            <span className="text-[11px] font-black tracking-widest text-[#1E3932]">QRIS</span>
            <span className="text-[10px] text-gray-500 font-bold">NMID: ID192837482</span>
          </div>
          
          {/* Mock QR SVG Matrix */}
          <div className="w-[170px] h-[170px] bg-white p-2 border border-gray-100 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Corner 1 */}
              <rect x="5" y="5" width="28" height="28" fill="#1E3932"/>
              <rect x="9" y="9" width="20" height="20" fill="white"/>
              <rect x="13" y="13" width="12" height="12" fill="#1E3932"/>
              {/* Corner 2 */}
              <rect x="67" y="5" width="28" height="28" fill="#1E3932"/>
              <rect x="71" y="9" width="20" height="20" fill="white"/>
              <rect x="75" y="13" width="12" height="12" fill="#1E3932"/>
              {/* Corner 3 */}
              <rect x="5" y="67" width="28" height="28" fill="#1E3932"/>
              <rect x="9" y="71" width="20" height="20" fill="white"/>
              <rect x="13" y="75" width="12" height="12" fill="#1E3932"/>
              {/* Random Pattern Dots */}
              <rect x="40" y="10" width="8" height="8" fill="#1E3932"/>
              <rect x="52" y="15" width="6" height="6" fill="#1E3932"/>
              <rect x="42" y="24" width="7" height="7" fill="#1E3932"/>
              <rect x="15" y="42" width="8" height="8" fill="#1E3932"/>
              <rect x="28" y="48" width="6" height="6" fill="#1E3932"/>
              <rect x="45" y="45" width="10" height="10" fill="#00754A"/>
              <rect x="62" y="40" width="8" height="8" fill="#1E3932"/>
              <rect x="75" y="48" width="6" height="6" fill="#1E3932"/>
              <rect x="85" y="60" width="9" height="9" fill="#1E3932"/>
              <rect x="40" y="65" width="8" height="8" fill="#1E3932"/>
              <rect x="54" y="72" width="7" height="7" fill="#1E3932"/>
              <rect x="68" y="78" width="8" height="8" fill="#1E3932"/>
              <rect x="80" y="80" width="8" height="8" fill="#1E3932"/>
              <rect x="46" y="85" width="6" height="6" fill="#1E3932"/>
            </svg>
          </div>

          <span className="text-[11px] font-semibold text-gray-500 mt-2">
            Bisa di-scan GoPay, OVO, DANA, BCA
          </span>
        </div>

        {/* Escrow Guarantee Box */}
        <div className="bg-[#edebe9] rounded-[12px] p-3.5 border border-[#d6dbde] text-left flex items-start gap-2.5 w-full">
          <span className="text-[20px] leading-none shrink-0 mt-0.5">🔒</span>
          <div>
            <b className="text-[13px] text-[#006241] block">Proteksi Dana Escrow SPORA</b>
            <p className="text-[12px] text-[rgba(0,0,0,0.58)] mt-0.5 leading-snug">
              Dana Anda ditahan di rekening bersama aman dan baru dicairkan setelah kuorum terpenuhi. <b>Garansi 100% refund otomatis</b> bila sesi batal atau kuorum kurang.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full mt-1">
          <button
            onClick={completeQrisPayment}
            className="w-full py-3.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[15px] font-bold shadow-[0_2px_8px_rgba(0,117,74,0.25)] transition-all cursor-pointer active:scale-95"
          >
            ✓ Simulasi Bayar QRIS Berhasil
          </button>
          <button
            onClick={closeSheet}
            className="w-full py-2.5 rounded-full text-[13px] font-semibold text-[rgba(0,0,0,0.58)] hover:text-black bg-transparent border-0 cursor-pointer"
          >
            Batalkan Pembayaran
          </button>
        </div>

      </div>
    </div>
  );
}

