-- Migration: Fogueira Monthly Anthologies Infrastructure (Fase 4)
-- Date: 2026-10-06
-- Description: Creates 'fogueira_anthologies' table with RLS, indexes, and unique month/year constraint.

DO $$
BEGIN
  -- 1. Create table fogueira_anthologies
  CREATE TABLE IF NOT EXISTS public.fogueira_anthologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    curator_note TEXT,
    cover_image_url TEXT,
    featured_post_ids UUID[] NOT NULL DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_anthology_month_year UNIQUE (year, month)
  );

  -- 2. Performance indexes
  CREATE INDEX IF NOT EXISTS idx_anthologies_year_month ON public.fogueira_anthologies (year, month);
  CREATE INDEX IF NOT EXISTS idx_anthologies_published ON public.fogueira_anthologies (published);
  CREATE INDEX IF NOT EXISTS idx_anthologies_created_at ON public.fogueira_anthologies (created_at DESC);

  -- 3. Enable RLS
  ALTER TABLE public.fogueira_anthologies ENABLE ROW LEVEL SECURITY;

  -- 4. Policies for fogueira_anthologies
  -- Anyone (authenticated and public readers) can view published anthologies
  DROP POLICY IF EXISTS "Anyone can view published anthologies" ON public.fogueira_anthologies;
  CREATE POLICY "Anyone can view published anthologies"
    ON public.fogueira_anthologies FOR SELECT
    TO authenticated, anon
    USING (published = true);

  -- Admins can perform all operations (view drafts, create, update, delete)
  DROP POLICY IF EXISTS "Admins can manage anthologies" ON public.fogueira_anthologies;
  CREATE POLICY "Admins can manage anthologies"
    ON public.fogueira_anthologies FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users_profiles
        WHERE public.users_profiles.id = auth.uid()
        AND public.users_profiles.role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users_profiles
        WHERE public.users_profiles.id = auth.uid()
        AND public.users_profiles.role = 'admin'
      )
    );

  -- 5. Trigger for updated_at
  DROP TRIGGER IF EXISTS update_anthologies_updated_at ON public.fogueira_anthologies;
  CREATE TRIGGER update_anthologies_updated_at
    BEFORE UPDATE ON public.fogueira_anthologies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

END $$;
