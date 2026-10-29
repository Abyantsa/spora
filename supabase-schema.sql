-- ====================================================================
-- SPORA: Supabase Database Schema
-- Platform Integrasi Penyewaan Sarana Olahraga & Rekomendasi Hiperlokal
-- Jalankan file SQL ini di SQL Editor Supabase
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. TABEL PROFILES (Akun User, Venue Owner, & Admin)
-- --------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'venue_owner', 'admin')),
  university TEXT,
  phone_number TEXT,
  attendance_score INTEGER NOT NULL DEFAULT 100 CHECK (attendance_score BETWEEN 0 AND 100),
  tried_sports TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. TABEL VENUES (Komersial, Non-Komersial, & Publik)
-- --------------------------------------------------------------------
CREATE TABLE venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  n TEXT NOT NULL, -- Nama venue
  e TEXT NOT NULL, -- Emoji
  category TEXT NOT NULL CHECK (category IN ('komersial', 'non-komersial', 'publik')),
  sports TEXT NOT NULL,
  dist TEXT NOT NULL,
  rate INTEGER NOT NULL DEFAULT 0,
  owner TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  taken TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. TABEL SESSIONS (Open Slot & Patungan Mabar)
-- --------------------------------------------------------------------
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport TEXT NOT NULL,
  emoji TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  min INTEGER NOT NULL,
  joined INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL,
  dist TEXT NOT NULL,
  free BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'confirmed', 'completed', 'cancelled')),
  host TEXT NOT NULL,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fits BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. TABEL SESSION MEMBERS (Anggota Sesi & Split Bill)
-- --------------------------------------------------------------------
CREATE TABLE session_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_status TEXT NOT NULL DEFAULT 'held' CHECK (payment_status IN ('held', 'captured', 'refunded')),
  attendance_status TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'attended', 'absent')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- --------------------------------------------------------------------
-- 5. TABEL BOOKINGS (Sewa Privat Lapangan)
-- --------------------------------------------------------------------
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  venue TEXT NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  emoji TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  dur INTEGER NOT NULL,
  total INTEGER NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. TABEL USER SCHEDULES (Smart Schedule Matching)
-- --------------------------------------------------------------------
CREATE TABLE user_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_free_time BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. TABEL SPORT PASSPORT (Gamifikasi Cabang Olahraga)
-- --------------------------------------------------------------------
CREATE TABLE sport_passport (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sport_name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  sessions_completed INTEGER DEFAULT 1,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sport_name)
);

-- ====================================================================
-- TRIGGERS & AUTOMATION FUNCTIONS
-- ====================================================================

-- A. Update Kuorum & Status Sesi Otomatis
CREATE OR REPLACE FUNCTION update_session_joined_count()
RETURNS TRIGGER AS $$
DECLARE
  v_joined_count INT;
  v_min_count INT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sessions 
    SET joined = joined + 1 
    WHERE id = NEW.session_id
    RETURNING joined, min INTO v_joined_count, v_min_count;

    IF v_joined_count >= v_min_count THEN
      UPDATE sessions SET status = 'confirmed' WHERE id = NEW.session_id;
      UPDATE session_members SET payment_status = 'captured' WHERE session_id = NEW.session_id;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sessions 
    SET joined = joined - 1 
    WHERE id = OLD.session_id
    RETURNING joined, min INTO v_joined_count, v_min_count;

    IF v_joined_count < v_min_count THEN
      UPDATE sessions SET status = 'open' WHERE id = OLD.session_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_joined
AFTER INSERT OR DELETE ON session_members
FOR EACH ROW EXECUTE FUNCTION update_session_joined_count();

-- B. Sync Profil Otomatis saat Sign Up
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, university)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'university'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_passport ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_venue_owner() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('venue_owner', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Venues viewable by everyone" ON venues FOR SELECT USING (true);
CREATE POLICY "Venue owners and admins can insert venues" ON venues FOR INSERT WITH CHECK (is_venue_owner());
CREATE POLICY "Venue owners can update own venue" ON venues FOR UPDATE USING (is_venue_owner());
CREATE POLICY "Only admins can delete venues" ON venues FOR DELETE USING (is_admin());

CREATE POLICY "Sessions viewable by everyone" ON sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their sessions" ON sessions FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete their sessions" ON sessions FOR DELETE USING (auth.uid() = host_id);

CREATE POLICY "Session members viewable by everyone" ON session_members FOR SELECT USING (true);
CREATE POLICY "Users can join sessions" ON session_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave sessions" ON session_members FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own schedules" ON user_schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own schedules" ON user_schedules FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own passport" ON sport_passport FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own passport" ON sport_passport FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- 8. INITIAL SEED DATA (Data Awal Lapangan / Venue Surabaya)
-- ====================================================================
INSERT INTO venues (n, e, category, sports, dist, rate, owner, note, taken) VALUES
('Lapangan Perpustakaan ITS', '🏀', 'non-komersial', 'Basket, Voli', '650 m', 0, 'Ditmawa ITS', 'Fasilitas kampus, bebas biaya untuk mahasiswa ITS.', ARRAY['15.00','17.00']),
('GOR Graha Sepuluh Nopember', '🏸', 'non-komersial', 'Badminton, Voli', '400 m', 60000, 'Ditmawa ITS', '4 lapangan badminton, tersedia raket sewa.', ARRAY['19.00','21.00']),
('Lapangan Teknik Sipil ITS', '⚽', 'non-komersial', 'Futsal', '800 m', 0, 'Departemen Teknik Sipil', 'Lapangan outdoor, perlu izin himpunan di luar jam kuliah.', ARRAY['17.00']),
('GOR Kelurahan Keputih', '🏐', 'non-komersial', 'Voli, Bulutangkis', '900 m', 40000, 'Karang Taruna Keputih', 'Dikelola warga, pembayaran tunai di lokasi.', ARRAY['08.00','19.00']),
('Taman Harmoni Keputih', '🏃', 'publik', 'Lari, Senam', '1,2 km', 0, 'Pemkot Surabaya', 'Ruang publik, tidak perlu pemesanan.', ARRAY[]::TEXT[]),
('Champion Futsal Mulyosari', '⚽', 'komersial', 'Futsal', '1,8 km', 120000, 'Champion Sport', 'Rumput sintetis, tersedia ruang ganti.', ARRAY['19.00','21.00']),
('Surabaya Padel Kertajaya', '🎾', 'komersial', 'Padel', '3,4 km', 180000, 'SBY Padel', '2 lapangan indoor, sewa raket Rp25.000.', ARRAY['06.00','08.00','17.00'])
ON CONFLICT DO NOTHING;


