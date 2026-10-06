-- Migration: Coupons and Community Grants Infrastructure (Fase 3)
-- Date: 2026-10-06
-- Description: Creates 'coupons' and 'coupon_redemptions' tables with RLS and performance indexes.

DO $$
BEGIN
  -- 1. Create table coupons
  CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- Stored in UPPERCASE (e.g., 'LIRICA2026')
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('trial_extension', 'discount_percent', 'free_access')),
    benefit_value NUMERIC NOT NULL, -- Days for trial_extension, percent for discount, or 100 for free_access
    product_target TEXT NOT NULL DEFAULT 'all' CHECK (product_target IN ('all', '21_dias', 'cafe_com_letras', 'ciclo_aprofundamento')),
    max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
    used_count INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ DEFAULT NULL, -- NULL = no expiry
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 2. Create table coupon_redemptions
  CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    coupon_code TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    user_email TEXT,
    benefit_type TEXT NOT NULL,
    benefit_value NUMERIC NOT NULL,
    product_slug TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 3. Indexes
  CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons (code);
  CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons (active);
  CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON public.coupon_redemptions (user_id, coupon_id);
  CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_code ON public.coupon_redemptions (coupon_code);

  -- 4. Enable RLS
  ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

  -- 5. Policies for coupons
  DROP POLICY IF EXISTS "Anyone can check active coupons" ON public.coupons;
  CREATE POLICY "Anyone can check active coupons"
    ON public.coupons FOR SELECT
    TO authenticated, anon
    USING (active = true);

  DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
  CREATE POLICY "Admins can manage coupons"
    ON public.coupons FOR ALL
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

  -- 6. Policies for coupon_redemptions
  DROP POLICY IF EXISTS "Users can view own redemptions" ON public.coupon_redemptions;
  CREATE POLICY "Users can view own redemptions"
    ON public.coupon_redemptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Admins can view all redemptions" ON public.coupon_redemptions;
  CREATE POLICY "Admins can view all redemptions"
    ON public.coupon_redemptions FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users_profiles
        WHERE public.users_profiles.id = auth.uid()
        AND public.users_profiles.role = 'admin'
      )
    );

  -- 7. Trigger for updated_at
  DROP TRIGGER IF EXISTS update_coupons_updated_at ON public.coupons;
  CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

END $$;
