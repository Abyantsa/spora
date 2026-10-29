'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Harap isi Email dan Password terlebih dahulu.');
      return;
    }

    setLoading(true);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Supabase credentials belum di-setup di .env.local');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/home');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError(null);
    
    if (!email.trim() || !password) {
      setError('Harap isi Email dan Password sebelum mendaftar.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Supabase credentials belum di-setup di .env.local');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Registrasi berhasil! Silakan langsung klik tombol "Masuk".');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f2f0eb] min-h-screen">
      <div className="w-full max-w-[380px]">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#006241] text-white grid place-items-center mb-3 shadow-[0_2px_8px_rgba(0,98,65,0.25)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#006241] tracking-[-0.02em] leading-tight">SPORA</h1>
          <p className="text-[13px] text-[rgba(0,0,0,0.58)] font-medium mt-1">Surabaya Matchmaking & Sports Venue</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleLogin} className="bg-white border border-[#d6dbde] rounded-[16px] p-6 sm:p-7 elev-raised flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: abyan@spora.id"
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A] focus:ring-2 focus:ring-[#00754A]/20"
              required 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-white border border-[#d6dbde] rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#00754A] focus:ring-2 focus:ring-[#00754A]/20"
              required 
            />
          </div>

          {error && (
            <div className={`text-[12.5px] font-semibold p-3 rounded-[8px] leading-snug ${
              error.includes('berhasil') ? 'bg-[#d4e9e2] text-[#006241]' : 'bg-[#FFF1D6] text-[#C2563A]'
            }`}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2.5 mt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00754A] hover:bg-[#005c3b] text-white border-0 rounded-full py-3 text-[14.5px] font-bold cursor-pointer transition-all shadow-[0_2px_6px_rgba(0,117,74,0.22)] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
            <button 
              type="button" 
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-transparent text-[#00754A] border border-[#00754A] rounded-full py-3 text-[14.5px] font-bold cursor-pointer transition-all hover:bg-[#00754A]/8 active:scale-95 disabled:opacity-50"
            >
              Daftar Akun Baru
            </button>
          </div>
        </form>

        <p className="text-[12px] text-[rgba(0,0,0,0.58)] text-center mt-6">
          Komunitas Mahasiswa & Pemuda Surabaya Timur
        </p>
      </div>
    </div>
  );
}
