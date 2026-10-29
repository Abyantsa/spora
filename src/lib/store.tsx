'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Venue, Session, Booking } from '@/types';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

export const INITIAL_VENUES: Venue[] = [
  { id:'v1', n:'Lapangan Perpustakaan ITS', e:'🏀', sports:'Basket, Voli', dist:'650 m', rate:0, taken:['15.00','17.00'], owner:'Ditmawa ITS', note:'Fasilitas kampus, bebas biaya untuk mahasiswa ITS.' },
  { id:'v2', n:'GOR Graha Sepuluh Nopember', e:'🏸', sports:'Badminton, Voli', dist:'400 m', rate:60000, taken:['19.00','21.00'], owner:'Ditmawa ITS', note:'4 lapangan badminton, tersedia raket sewa.' },
  { id:'v3', n:'Lapangan Teknik Sipil ITS', e:'⚽', sports:'Futsal', dist:'800 m', rate:0, taken:['17.00'], owner:'Departemen Teknik Sipil', note:'Lapangan outdoor, perlu izin himpunan di luar jam kuliah.' },
  { id:'v4', n:'GOR Kelurahan Keputih', e:'🏐', sports:'Voli, Bulutangkis', dist:'900 m', rate:40000, taken:['08.00','19.00'], owner:'Karang Taruna Keputih', note:'Dikelola warga, pembayaran tunai di lokasi.' },
  { id:'v5', n:'Taman Harmoni Keputih', e:'🏃', sports:'Lari, Senam', dist:'1,2 km', rate:0, taken:[], owner:'Pemkot Surabaya', note:'Ruang publik, tidak perlu pemesanan.' },
  { id:'v6', n:'Champion Futsal Mulyosari', e:'⚽', sports:'Futsal', dist:'1,8 km', rate:120000, taken:['19.00','21.00'], owner:'Champion Sport', note:'Rumput sintetis, tersedia ruang ganti.' },
  { id:'v7', n:'Surabaya Padel Kertajaya', e:'🎾', sports:'Padel', dist:'3,4 km', rate:180000, taken:['06.00','08.00','17.00'], owner:'SBY Padel', note:'2 lapangan indoor, sewa raket Rp25.000.' },
];

export const INITIAL_SESSIONS: Session[] = [
  { id:'s1', sport:'Badminton', emoji:'🏸', venue:'GOR Graha Sepuluh Nopember ITS', day:'Selasa', time:'15.00 – 17.00', price:15000, min:6, joined:4, level:'Pemula', dist:'400 m', free:false, host:'Rafi (UKM Badminton)', fits:true },
  { id:'s2', sport:'Basket', emoji:'🏀', venue:'Lapangan Perpustakaan ITS', day:'Rabu', time:'16.00 – 18.00', price:0, min:8, joined:5, level:'Pemula', dist:'650 m', free:true, host:'Dimas', fits:true },
  { id:'s3', sport:'Futsal', emoji:'⚽', venue:'Champion Futsal Mulyosari', day:'Selasa', time:'19.00 – 21.00', price:25000, min:10, joined:8, level:'Menengah', dist:'1,8 km', free:false, host:'Bagas', fits:false },
  { id:'s4', sport:'Lari santai 5K', emoji:'🏃', venue:'Taman Harmoni Keputih', day:'Sabtu', time:'06.00 – 07.30', price:0, min:6, joined:3, level:'Semua level', dist:'1,2 km', free:true, host:'Nadia', fits:false },
  { id:'s5', sport:'Voli', emoji:'🏐', venue:'GOR Kelurahan Keputih', day:'Kamis', time:'16.30 – 18.30', price:10000, min:12, joined:6, level:'Pemula', dist:'900 m', free:false, host:'Karang Taruna Keputih', fits:false },
  { id:'s6', sport:'Padel', emoji:'🎾', venue:'Surabaya Padel Kertajaya', day:'Minggu', time:'08.00 – 09.30', price:45000, min:4, joined:2, level:'Menengah', dist:'3,4 km', free:false, host:'Yoga', fits:false },
];

export const PASSPORT = [
  {n:'Badminton',e:'🏸'},{n:'Futsal',e:'⚽'},{n:'Basket',e:'🏀'},
  {n:'Voli',e:'🏐'},{n:'Lari',e:'🏃'},{n:'Padel',e:'🎾'},
];

export const SPORTS = [
  {n:'Badminton',e:'🏸'},{n:'Futsal',e:'⚽'},{n:'Basket',e:'🏀'},{n:'Voli',e:'🏐'},
  {n:'Lari',e:'🏃'},{n:'Padel',e:'🎾'},{n:'Tenis meja',e:'🏓'},{n:'Sepeda',e:'🚴'},
];

export const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
export const SLOTS = ['06.00','08.00','10.00','13.00','15.00','17.00','19.00','21.00'];

type AppState = {
  user: User | null;
  sessions: Session[];
  venues: Venue[];
  joined: Set<string>;
  tried: Set<string>;
  bookings: Booking[];
  toastMsg: string | null;
  sheet: { mode: 'detail' | 'create' | 'book' | null; id?: string };
  isLoaded: boolean;
};

type AppContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toggleJoin: (id: string) => void;
  showToast: (msg: string) => void;
  addSession: (s: Session) => void;
  addBooking: (b: Booking) => void;
  openSheet: (mode: 'detail'|'create'|'book', id?: string) => void;
  closeSheet: () => void;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<AppState>({
    user: null,
    sessions: INITIAL_SESSIONS, // Default dummy data
    venues: INITIAL_VENUES, // Default dummy data
    joined: new Set(),
    tried: new Set(['Badminton', 'Futsal']),
    bookings: [],
    toastMsg: null,
    sheet: { mode: null },
    isLoaded: false,
  });

  // Init Auth & Fetch Supabase Data
  useEffect(() => {
    const isSupabaseConfigured = 
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

    const checkAuthAndFetch = async () => {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        setState(s => ({ ...s, user: session?.user || null, isLoaded: true }));

        if (session?.user) {
          // Fetch Real Venues
          const { data: venuesData } = await supabase.from('venues').select('*');
          if (venuesData && venuesData.length > 0) {
            setState(s => ({ ...s, venues: venuesData }));
          }

          // Fetch Real Sessions
          const { data: sessionsData } = await supabase.from('sessions').select('*');
          if (sessionsData && sessionsData.length > 0) {
            setState(s => ({ ...s, sessions: sessionsData }));
          }

          // Fetch joined sessions for this user
          const { data: membersData } = await supabase.from('session_members').select('session_id').eq('user_id', session.user.id);
          if (membersData) {
            setState(s => ({ ...s, joined: new Set(membersData.map(m => m.session_id)) }));
          }

          // Redirect if on login page
          if (pathname === '/login') {
            router.push('/home');
          }
        } else {
          // Not logged in but configured, force to login
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } else {
        // Fallback to dummy data gracefully if no env configured
        console.warn('Supabase not configured. Using dummy local data.');
        setState(s => ({ ...s, isLoaded: true }));
      }
    };

    checkAuthAndFetch();

    // Listen to Auth Changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setState(s => ({ ...s, user: session.user }));
        router.push('/home');
      } else if (event === 'SIGNED_OUT') {
        setState(s => ({ ...s, user: null, joined: new Set(), bookings: [] }));
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  const logout = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    } else {
      router.push('/login');
    }
  };

  const showToast = (msg: string) => {
    setState(s => ({ ...s, toastMsg: msg }));
    setTimeout(() => setState(s => ({ ...s, toastMsg: null })), 3000);
  };

  const toggleJoin = async (id: string) => {
    setState(prev => {
      const nextJoined = new Set(prev.joined);
      const s = prev.sessions.find(x => x.id === id);
      if (!s) return prev;
      
      let msg = '';
      const isLeaving = nextJoined.has(id);

      if (isLeaving) {
        nextJoined.delete(id);
        msg = `Kamu keluar dari sesi ${s.sport}. Dana patungan dikembalikan.`;
      } else {
        nextJoined.add(id);
        const sport = s.sport.split(' ')[0];
        const isFull = (s.joined + (nextJoined.has(s.id) ? 1 : 0)) >= s.min;
        if (!prev.tried.has(sport)) msg = `Sesi ${s.sport} tersimpan. Cabang baru terbuka di Sport Passport.`;
        else if (isFull) msg = 'Kuorum tercapai — sesi dikonfirmasi. Patungan ditagih otomatis.';
        else msg = 'Kamu ikut. Dana ditahan sampai kuorum tercapai.';
      }
      setTimeout(() => showToast(msg), 50);

      // Async Update to DB (non-blocking)
      if (prev.user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (isLeaving) {
          supabase.from('session_members').delete().match({ session_id: id, user_id: prev.user.id }).then();
        } else {
          supabase.from('session_members').insert({ session_id: id, user_id: prev.user.id }).then();
        }
      }

      return { ...prev, joined: nextJoined };
    });
  };

  const addSession = async (s: Session) => {
    setState(p => ({ ...p, sessions: [s, ...p.sessions], joined: new Set(p.joined).add(s.id) }));
    
    // Sync to DB
    if (state.user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.from('sessions').insert({
        sport: s.sport, emoji: s.emoji, venue: s.venue, day: s.day, time: s.time,
        price: s.price, min: s.min, level: s.level, dist: s.dist, free: s.free,
        host: s.host, host_id: state.user.id, fits: s.fits
      }).select().single();
      
      if (data) {
        // Also add the host to session_members
        await supabase.from('session_members').insert({ session_id: data.id, user_id: state.user.id });
      } else if (error) {
        showToast('Gagal menyimpan sesi ke database.');
        console.error(error);
      }
    }
  };

  const addBooking = async (b: Booking) => {
    setState(p => ({ ...p, bookings: [b, ...p.bookings] }));

    if (state.user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('bookings').insert({
        user_id: state.user.id, venue: b.venue, emoji: b.emoji, day: b.day, 
        time: b.time, end_time: b.end, dur: b.dur, total: b.total, code: b.code
      });
    }
  };

  const openSheet = (mode: 'detail'|'create'|'book', id?: string) => setState(p => ({ ...p, sheet: { mode, id } }));
  const closeSheet = () => setState(p => ({ ...p, sheet: { mode: null } }));

  return (
    <AppContext.Provider value={{ state, setState, toggleJoin, showToast, addSession, addBooking, openSheet, closeSheet, logout }}>
      {state.isLoaded ? children : <div className="min-h-screen flex items-center justify-center bg-paper font-bold text-court">Loading SPORA...</div>}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
};
