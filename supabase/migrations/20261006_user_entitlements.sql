-- Migration: Add user_entitlements and trial period infrastructure
-- Date: 2026-10-06
-- Description: Supports granular access for '21_dias', 'cafe_com_letras', 'ciclo_aprofundamento', and trial logic.

DO $$
BEGIN
  -- 1. Create table user_entitlements if not exists
  CREATE TABLE IF NOT EXISTS public.user_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    product_slug TEXT NOT NULL, -- '21_dias' | 'cafe_com_letras' | 'ciclo_aprofundamento'
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'expired' | 'cancelled'
    source TEXT DEFAULT 'infinitepay', -- 'infinitepay' | 'manual' | 'promo'
    order_id TEXT,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- null means lifetime, or e.g. now() + 365 days / 30 days
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 2. Indexes for fast lookups
  CREATE INDEX IF NOT EXISTS idx_user_entitlements_lookup 
    ON public.user_entitlements (user_id, product_slug, status);

  CREATE INDEX IF NOT EXISTS idx_user_entitlements_expires 
    ON public.user_entitlements (expires_at);

  -- 3. Enable RLS
  ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;

  -- 4. RLS Policies
  -- Users can view their own entitlements
  DROP POLICY IF EXISTS "Users can view own entitlements" ON public.user_entitlements;
  CREATE POLICY "Users can view own entitlements"
    ON public.user_entitlements FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  -- Admins can do everything
  DROP POLICY IF EXISTS "Admins can manage entitlements" ON public.user_entitlements;
  CREATE POLICY "Admins can manage entitlements"
    ON public.user_entitlements FOR ALL
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
  DROP TRIGGER IF EXISTS update_user_entitlements_updated_at ON public.user_entitlements;
  CREATE TRIGGER update_user_entitlements_updated_at
    BEFORE UPDATE ON public.user_entitlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

END $$;
