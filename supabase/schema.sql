-- ============================================
-- APEX BRACKET — SaaS Multi-Tenant Migration
-- ============================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Create Profiles table (organizer profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    organization_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Tournaments table (multi-tenant tournament data linked to profiles)
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    settings JSONB NOT NULL,
    teams JSONB NOT NULL,
    matches JSONB NOT NULL,
    champion JSONB,
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Also keep single-tournament fallback table for local/demo compatibility
CREATE TABLE IF NOT EXISTS public.tournament_state (
    id TEXT PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL,
    teams JSONB NOT NULL,
    matches JSONB NOT NULL,
    champion JSONB,
    history JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_state ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if updating
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow owner update to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access to tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Allow owner write access to tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Allow public read access to tournament state" ON public.tournament_state;
DROP POLICY IF EXISTS "Allow public update to tournament state" ON public.tournament_state;
DROP POLICY IF EXISTS "Allow public insert to tournament state" ON public.tournament_state;

-- RLS Policies for Profiles
CREATE POLICY "Allow public read access to profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Allow owner update to profiles"
    ON public.profiles FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- RLS Policies for Tournaments
CREATE POLICY "Allow public read access to tournaments"
    ON public.tournaments FOR SELECT
    USING (true);

CREATE POLICY "Allow owner write access to tournaments"
    ON public.tournaments FOR ALL
    USING (auth.uid() = organizer_id)
    WITH CHECK (auth.uid() = organizer_id);

-- RLS Policies for Single-tournament fallback table ('default')
CREATE POLICY "Allow public read access to tournament state" 
    ON public.tournament_state FOR SELECT 
    USING (true);

CREATE POLICY "Allow public update to tournament state" 
    ON public.tournament_state FOR UPDATE 
    USING (id = 'default') 
    WITH CHECK (id = 'default');

CREATE POLICY "Allow public insert to tournament state" 
    ON public.tournament_state FOR INSERT 
    WITH CHECK (id = 'default');

-- 4. Automatically create profile row on user sign up trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, organization_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'organization_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable Supabase Realtime Publication for tournaments & tournament_state
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'tournaments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'tournament_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_state;
  END IF;
END $$;
