'use client';
import { useState } from 'react';
import { useAppStore, SPORTS } from '@/lib/store';

export default function AddVenueSheet() {
  const { closeSheet, addVenue } = useAppStore();

  const [form, setForm] = useState({
    n: '',
    sport: 'Badminton',
    dist: '1,0 km',
    rate: 50000,
    owner: 'Komunitas Warga',
    note: 'Tersedia tempat parkir dan lampu penerangan.',
    maps_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.n.trim()) {
      alert('Nama lapangan wajib diisi.');
      return;
    }

    const sportObj = SPORTS.find(s => s.n === form.sport) || { e: '🏅' };
    const mapsLink = form.maps_url.trim() || `https://maps.google.com/?q=${encodeURIComponent(form.n + ' Surabaya')}`;

    addVenue({
      n: form.n.trim(),
      e: sportObj.e,
      sports: form.sport,
      dist: form.dist.trim() || '1,0 km',
      rate: Number(form.rate) || 0,
      owner: form.owner.trim() || 'Komunitas',
      note: form.note.trim() || 'Fasilitas olahraga terbuka.',
      maps_url: mapsLink
    });

    closeSheet();
  };

  return (
    <div className="flex flex-col">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#e7e7e7] relative">
        <button 
          onClick={closeSheet} 
          aria-label="Tutup"
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#edebe9] hover:bg-[#d6dbde] text-[rgba(0,0,0,0.87)] grid place-items-center cursor-pointer transition-all border-0 text-[15px]"
        >
          ✕
        </button>
        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#006241] pr-9 leading-tight">
          + Tambah Lapangan Baru
        </h3>
        <p className="text-[12.5px] text-[rgba(0,0,0,0.58)] mt-1 leading-normal">
          Bantu mahasiswa dan pemuda Surabaya menemukan titik sarana olahraga baru di sekitar kampus.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
        {/* Venue Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Nama Lapangan / Fasilitas *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Lapangan Futsal Asrama ITS"
            value={form.n}
            onChange={e => setForm(prev => ({ ...prev, n: e.target.value }))}
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A] focus:ring-2 focus:ring-[#00754A]/20"
          />
        </div>

        {/* Sport Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Cabang Olahraga Utama
          </label>
          <select
            value={form.sport}
            onChange={e => setForm(prev => ({ ...prev, sport: e.target.value }))}
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
          >
            {SPORTS.map(s => <option key={s.n} value={s.n}>{s.e} {s.n}</option>)}
          </select>
        </div>

        {/* Distance & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
              Jarak dari Kampus / Kos
            </label>
            <input
              type="text"
              placeholder="Contoh: 850 m / Keputih"
              value={form.dist}
              onChange={e => setForm(prev => ({ ...prev, dist: e.target.value }))}
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
              Tarif per Jam (0 jika Gratis)
            </label>
            <input
              type="number"
              step="5000"
              min="0"
              value={form.rate}
              onChange={e => setForm(prev => ({ ...prev, rate: Number(e.target.value) || 0 }))}
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
            />
          </div>
        </div>

        {/* Owner */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Pengelola / Pemilik Lapangan
          </label>
          <input
            type="text"
            placeholder="Contoh: Warga RT 02 / BEM ITS / Swasta"
            value={form.owner}
            onChange={e => setForm(prev => ({ ...prev, owner: e.target.value }))}
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
          />
        </div>

        {/* Facilities / Note */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Fasilitas & Ketentuan Main
          </label>
          <input
            type="text"
            placeholder="Contoh: Lapangan semen outdoor, lampu terang, bayar tunai di lokasi"
            value={form.note}
            onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
          />
        </div>

        {/* Google Maps Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">
            Link Titik Google Maps (Opsional)
          </label>
          <input
            type="url"
            placeholder="https://maps.app.goo.gl/... atau kosongkan"
            value={form.maps_url}
            onChange={e => setForm(prev => ({ ...prev, maps_url: e.target.value }))}
            className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white text-[15px] font-bold shadow-[0_2px_8px_rgba(0,117,74,0.25)] transition-all cursor-pointer active:scale-95 mt-1"
        >
          Tambahkan ke Direktori Komunitas
        </button>
      </form>
    </div>
  );
}

