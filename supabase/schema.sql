-- ============================================
-- APEX BRACKET — Supabase Database Migration
-- ============================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Create the tournament_state table
CREATE TABLE IF NOT EXISTS public.tournament_state (
    id TEXT PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL,
    teams JSONB NOT NULL,
    matches JSONB NOT NULL,
    champion JSONB,
    history JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tournament_state ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if updating
DROP POLICY IF EXISTS "Allow public read access to tournament state" ON public.tournament_state;
DROP POLICY IF EXISTS "Allow public write access to tournament state" ON public.tournament_state;
DROP POLICY IF EXISTS "Allow public update to tournament state" ON public.tournament_state;
DROP POLICY IF EXISTS "Allow public insert to tournament state" ON public.tournament_state;

-- Policy 1: Public Read Access (SELECT) for Live Viewer screens & OBS stream
CREATE POLICY "Allow public read access to tournament state" 
    ON public.tournament_state FOR SELECT 
    USING (true);

-- Policy 2: Controlled Update Access (UPDATE) restricted to the tournament record ('default')
CREATE POLICY "Allow public update to tournament state" 
    ON public.tournament_state FOR UPDATE 
    USING (id = 'default') 
    WITH CHECK (id = 'default');

-- Policy 3: Controlled Insert Access (INSERT) restricted to the tournament record ('default')
CREATE POLICY "Allow public insert to tournament state" 
    ON public.tournament_state FOR INSERT 
    WITH CHECK (id = 'default');

-- 3. Enable Supabase Realtime Publication (Idempotent check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'tournament_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_state;
  END IF;
END $$;
