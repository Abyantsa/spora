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
    setLoading(true);
    setError(null);
    
    // Pastikan env Supabase sudah di set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Supabase credentials belum di-setup di .env.local');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
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
    setLoading(true);
    setError(null);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Supabase credentials belum di-setup di .env.local');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Registrasi berhasil! Silakan cek email Anda (jika email confirmation aktif), atau langsung Login.');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-[24px] bg-paper h-screen">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-extrabold tracking-[-.025em] text-court">SPORA</h1>
          <p className="text-[13px] text-muted mt-[4px]">Surabaya Pusat & Timur Sports</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-line rounded-radius p-[24px] flex flex-col gap-[16px]">
          <div>
            <label className="block text-[12.5px] font-bold mb-[6px] text-ink">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1"
              required 
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-bold mb-[6px] text-ink">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-line rounded-[10px] p-[11px_12px] text-[14px] focus:outline-court focus:outline-2 focus:-outline-offset-1"
              required 
            />
          </div>

          {error && <div className="text-[12px] font-semibold text-clay bg-[#FFF1D6] p-[10px] rounded-[8px]">{error}</div>}

          <div className="flex flex-col gap-[10px] mt-[8px]">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-court text-white border-0 rounded-[11px] p-[13px] text-[15px] font-bold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
            <button 
              type="button" 
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-transparent text-court border border-court rounded-[11px] p-[13px] text-[15px] font-bold cursor-pointer transition-colors hover:bg-court-soft disabled:opacity-50"
            >
              Daftar Akun Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
