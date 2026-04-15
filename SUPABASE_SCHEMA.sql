-- ============================================================
-- HAYY PLATFORM - SUPABASE SCHEMA (CLEAN IDEMPOTENT VERSION)
-- Run this entire script in Supabase SQL Editor.
-- Safe to re-run multiple times.
-- ============================================================

-- ============================================================
-- STEP 1: DROP ALL DEPENDENT POLICIES (prevents type-change errors)
-- ============================================================
DO $$
BEGIN
    -- bookings policies
    DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;

    -- messages policies (depend on bookings.expert_id)
    DROP POLICY IF EXISTS "Users can view messages for their bookings" ON messages;
    DROP POLICY IF EXISTS "Users can insert messages for their bookings" ON messages;

    -- transactions policies
    DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
    DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;

    -- reviews policies
    DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
    DROP POLICY IF EXISTS "Students can write reviews for their bookings" ON reviews;

    -- profiles policies
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

    -- teachers policies
    DROP POLICY IF EXISTS "Public teachers are viewable by everyone" ON teachers;
    DROP POLICY IF EXISTS "Teachers can insert their own profile" ON teachers;
    DROP POLICY IF EXISTS "Teachers can update their own profile" ON teachers;
END $$;

-- ============================================================
-- STEP 2: FIX TYPE MISMATCH (expert_id TEXT -> UUID)
-- Now safe because all dependent policies have been dropped.
-- ============================================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bookings'
          AND column_name = 'expert_id'
          AND data_type = 'text'
    ) THEN
        ALTER TABLE bookings ALTER COLUMN expert_id TYPE UUID USING expert_id::UUID;
        RAISE NOTICE 'Migrated expert_id column from TEXT to UUID.';
    END IF;
END $$;

-- ============================================================
-- STEP 3: CREATE TABLES (IF NOT EXISTS - safe to re-run)
-- ============================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'expert')),
  avatar_url TEXT,
  device_id_hash TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create/maintain profiles automatically for new auth users
-- (keeps app assumptions true and avoids missing-profile join failures)
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url, device_id_hash, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data->>'device_id_hash', NULL),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    device_id_hash = COALESCE(EXCLUDED.device_id_hash, public.profiles.device_id_hash),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 2. TEACHERS (EXPERTS)
-- Must exist before bookings due to FK reference
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  bio TEXT,
  qualifications TEXT,
  hourly_rate NUMERIC,
  profile_pic_url TEXT,
  category TEXT DEFAULT 'Academic' CHECK (category IN ('Academic', 'Legal', 'Wellness', 'Mental Health')),
  specialty TEXT,
  -- Category-specific fields (required before going public)
  legal_bar_number TEXT,
  legal_jurisdiction TEXT,
  legal_practice_areas TEXT[] DEFAULT '{}'::text[],
  mental_license_number TEXT,
  mental_license_type TEXT,
  mental_modalities TEXT[] DEFAULT '{}'::text[],
  wellness_certification TEXT,
  wellness_specialties TEXT[] DEFAULT '{}'::text[],
  wellness_approach TEXT,
  academic_subjects TEXT[] DEFAULT '{}'::text[],
  academic_education_level TEXT,
  academic_credentials TEXT,
  portfolio_urls JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  rating_avg NUMERIC DEFAULT 0,
  review_count INT DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  available_slots JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT true,
  auto_accept_bookings BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'UTC',
  session_buffer INT DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Enforce required category fields before public listing
CREATE OR REPLACE FUNCTION public.enforce_teacher_public_requirements()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_public IS TRUE THEN
    IF NEW.category = 'Legal' THEN
      IF NEW.legal_bar_number IS NULL OR NEW.legal_jurisdiction IS NULL OR NEW.legal_practice_areas IS NULL OR array_length(NEW.legal_practice_areas, 1) IS NULL THEN
        RAISE EXCEPTION 'Legal profiles must include bar number, jurisdiction, and practice areas before being public';
      END IF;
    ELSIF NEW.category = 'Mental Health' THEN
      IF NEW.mental_license_number IS NULL OR NEW.mental_license_type IS NULL OR NEW.mental_modalities IS NULL OR array_length(NEW.mental_modalities, 1) IS NULL THEN
        RAISE EXCEPTION 'Mental Health profiles must include license info and modalities before being public';
      END IF;
    ELSIF NEW.category = 'Wellness' THEN
      IF NEW.wellness_certification IS NULL OR NEW.wellness_specialties IS NULL OR array_length(NEW.wellness_specialties, 1) IS NULL OR NEW.wellness_approach IS NULL THEN
        RAISE EXCEPTION 'Wellness profiles must include certification, specialties, and approach before being public';
      END IF;
    ELSE
      -- Academic
      IF NEW.academic_subjects IS NULL OR array_length(NEW.academic_subjects, 1) IS NULL OR NEW.academic_education_level IS NULL OR NEW.academic_credentials IS NULL THEN
        RAISE EXCEPTION 'Academic profiles must include subjects, education level, and credentials before being public';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_teacher_public_requirements ON public.teachers;
CREATE TRIGGER trg_enforce_teacher_public_requirements
BEFORE INSERT OR UPDATE ON public.teachers
FOR EACH ROW
EXECUTE FUNCTION public.enforce_teacher_public_requirements();

-- Ensure PostgREST join support for `profiles!teachers_user_id_fkey(...)`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'teachers'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'teachers_user_id_fkey'
  ) THEN
    ALTER TABLE public.teachers
      ADD CONSTRAINT teachers_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. BOOKINGS
-- expert_id is UUID referencing teachers.id
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  video_link TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Ensure PostgREST join support for `profiles!bookings_user_id_fkey(...)`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'bookings'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'bookings_user_id_fkey'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Ensure PostgREST join support for `profiles!messages_sender_id_fkey(...)`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'messages_sender_id_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_sender_id_fkey
      FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. TRANSACTION ENGINE (Escrow)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings ON DELETE CASCADE NOT NULL,
  payer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  payee_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'held' CHECK (status IN ('pending', 'held', 'released', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Ensure PostgREST join support for `profiles!transactions_payee_id_fkey(...)` etc.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'transactions'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'transactions_payer_id_fkey'
  ) THEN
    ALTER TABLE public.transactions
      ADD CONSTRAINT transactions_payer_id_fkey
      FOREIGN KEY (payer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'transactions'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'transactions_payee_id_fkey'
  ) THEN
    ALTER TABLE public.transactions
      ADD CONSTRAINT transactions_payee_id_fkey
      FOREIGN KEY (payee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 6. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings ON DELETE CASCADE NOT NULL,
  expert_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Ensure PostgREST join support and consistent profile references
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'reviews'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'reviews_expert_id_fkey'
  ) THEN
    ALTER TABLE public.reviews
      ADD CONSTRAINT reviews_expert_id_fkey
      FOREIGN KEY (expert_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'reviews'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'reviews_student_id_fkey'
  ) THEN
    ALTER TABLE public.reviews
      ADD CONSTRAINT reviews_student_id_fkey
      FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- STEP 4: ADD MISSING COLUMNS (idempotent)
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='timezone') THEN
        ALTER TABLE teachers ADD COLUMN timezone TEXT DEFAULT 'UTC';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='session_buffer') THEN
        ALTER TABLE teachers ADD COLUMN session_buffer INT DEFAULT 15;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='is_public') THEN
        ALTER TABLE teachers ADD COLUMN is_public BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='auto_accept_bookings') THEN
        ALTER TABLE teachers ADD COLUMN auto_accept_bookings BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='available_slots') THEN
        ALTER TABLE teachers ADD COLUMN available_slots JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='is_online') THEN
        ALTER TABLE teachers ADD COLUMN is_online BOOLEAN DEFAULT false;
    END IF;

    -- NEW: Session Management and Messaging
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='session_url') THEN
        ALTER TABLE bookings ADD COLUMN session_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='is_read') THEN
        ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================================
-- STEP 5: RECREATE ALL RLS POLICIES (clean, with correct types)
-- ============================================================

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- TEACHERS
CREATE POLICY "Public teachers are viewable by everyone"
  ON teachers FOR SELECT USING (true);

CREATE POLICY "Teachers can insert their own profile"
  ON teachers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can update their own profile"
  ON teachers FOR UPDATE USING (auth.uid() = user_id);

-- BOOKINGS
-- expert_id is now UUID — compare directly with auth.uid()
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = expert_id)
  );

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allows both the student (cancel) and the expert (approve/complete) to update
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = expert_id)
  );

-- MESSAGES
-- expert_id is UUID, so auth.uid() matches directly
CREATE POLICY "Users can view messages for their bookings"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
        AND (
          bookings.user_id = auth.uid()
          OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = bookings.expert_id)
        )
    )
  );

CREATE POLICY "Users can insert messages for their bookings"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
        AND (
          bookings.user_id = auth.uid()
          OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = bookings.expert_id)
        )
    )
  );

-- TRANSACTIONS
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Expert marks funds as released after session completion
CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = payee_id);

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Students can write reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ============================================================
-- STEP 6: LEGAL PRACTICE MODULE (Matters, Documents, Time)
-- ============================================================

CREATE TABLE IF NOT EXISTS matters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS matter_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matter_id UUID REFERENCES matters(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  -- For storage-backed uploads, this is the storage object path (bucket: legal_docs).
  -- For external links, this may be a full URL.
  url TEXT NOT NULL,
  requires_signature BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE matter_documents ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS matter_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matter_id UUID REFERENCES matters(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document_added', 'signature_requested', 'signature_updated', 'time_logged')),
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE matter_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS esign_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES matter_documents(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  signer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'signed', 'declined', 'voided')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE esign_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matter_id UUID REFERENCES matters(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  minutes INT NOT NULL CHECK (minutes > 0),
  note TEXT,
  happened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- FK joins to profiles for UI convenience
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='matters'
      AND constraint_type='FOREIGN KEY' AND constraint_name='matters_client_id_fkey'
  ) THEN
    ALTER TABLE public.matters
      ADD CONSTRAINT matters_client_id_fkey
      FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='matter_documents'
      AND constraint_type='FOREIGN KEY' AND constraint_name='matter_documents_uploader_id_fkey'
  ) THEN
    ALTER TABLE public.matter_documents
      ADD CONSTRAINT matter_documents_uploader_id_fkey
      FOREIGN KEY (uploader_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='esign_requests'
      AND constraint_type='FOREIGN KEY' AND constraint_name='esign_requests_requester_id_fkey'
  ) THEN
    ALTER TABLE public.esign_requests
      ADD CONSTRAINT esign_requests_requester_id_fkey
      FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='esign_requests'
      AND constraint_type='FOREIGN KEY' AND constraint_name='esign_requests_signer_id_fkey'
  ) THEN
    ALTER TABLE public.esign_requests
      ADD CONSTRAINT esign_requests_signer_id_fkey
      FOREIGN KEY (signer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- RLS policies
DROP POLICY IF EXISTS "Lawyers can manage own matters" ON matters;
CREATE POLICY "Lawyers can manage own matters"
  ON matters
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM teachers WHERE id = teacher_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM teachers WHERE id = teacher_id));

DROP POLICY IF EXISTS "Clients can view own matters" ON matters;
CREATE POLICY "Clients can view own matters"
  ON matters
  FOR SELECT
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Matter participants can view docs" ON matter_documents;
CREATE POLICY "Matter participants can view docs"
  ON matter_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id = matter_documents.matter_id
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

DROP POLICY IF EXISTS "Matter participants can add docs" ON matter_documents;
CREATE POLICY "Matter participants can add docs"
  ON matter_documents
  FOR INSERT
  WITH CHECK (
    auth.uid() = uploader_id
    AND EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id = matter_documents.matter_id
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

DROP POLICY IF EXISTS "Participants can view esign requests" ON esign_requests;
CREATE POLICY "Participants can view esign requests"
  ON esign_requests
  FOR SELECT
  USING (
    auth.uid() = requester_id OR auth.uid() = signer_id
  );

DROP POLICY IF EXISTS "Requester can create esign requests" ON esign_requests;
CREATE POLICY "Requester can create esign requests"
  ON esign_requests
  FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Signer can update own esign status" ON esign_requests;
CREATE POLICY "Signer can update own esign status"
  ON esign_requests
  FOR UPDATE
  USING (auth.uid() = signer_id);

DROP POLICY IF EXISTS "Matter participants can view events" ON matter_events;
CREATE POLICY "Matter participants can view events"
  ON matter_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id = matter_events.matter_id
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

DROP POLICY IF EXISTS "Matter participants can add events" ON matter_events;
CREATE POLICY "Matter participants can add events"
  ON matter_events
  FOR INSERT
  WITH CHECK (
    auth.uid() = actor_id
    AND EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id = matter_events.matter_id
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

DROP POLICY IF EXISTS "Lawyers can manage time entries" ON time_entries;
CREATE POLICY "Lawyers can manage time entries"
  ON time_entries
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM teachers WHERE id = teacher_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM teachers WHERE id = teacher_id));

-- ============================================================
-- STEP 6: STORAGE BUCKETS & POLICIES
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('legal_docs', 'legal_docs', false)
ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies before recreating
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio files are privately accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own portfolio files" ON storage.objects;

DROP POLICY IF EXISTS "Legal docs are privately accessible" ON storage.objects;
DROP POLICY IF EXISTS "Matter participants can upload legal docs" ON storage.objects;
DROP POLICY IF EXISTS "Matter participants can delete legal docs" ON storage.objects;

-- Avatars: Public read, owner-only write
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Portfolios: Owner-only access
CREATE POLICY "Portfolio files are privately accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own portfolio files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Legal docs: matter participants only.
-- Object key format MUST be: <matterId>/<filename>
CREATE POLICY "Legal docs are privately accessible"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'legal_docs'
    AND EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id::text = (storage.foldername(name))[1]
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

CREATE POLICY "Matter participants can upload legal docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'legal_docs'
    AND EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id::text = (storage.foldername(name))[1]
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

CREATE POLICY "Matter participants can delete legal docs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'legal_docs'
    AND EXISTS (
      SELECT 1 FROM matters
      WHERE matters.id::text = (storage.foldername(name))[1]
        AND (auth.uid() = matters.client_id OR auth.uid() IN (SELECT user_id FROM teachers WHERE id = matters.teacher_id))
    )
  );

-- ============================================================
-- DONE. Schema is clean and production-ready.
-- ============================================================
