/*
  # Fix RLS Performance and Security Issues

  1. Performance Improvements
    - Optimize auth.uid() calls in RLS policies by wrapping with SELECT
    - This prevents re-evaluation for each row and improves query performance

  2. Security Improvements
    - Consolidate multiple permissive policies on checkout_attempts
    - Fix function search path for trigger function

  3. Changes Made
    - Update stripe_subscriptions RLS policy
    - Update stripe_orders RLS policy
    - Update checkout_attempts RLS policies
    - Fix update_checkout_attempts_updated_at function if it exists
*/

-- Drop existing policies to recreate them with optimized queries
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;
DROP POLICY IF EXISTS "Admins can view all checkout attempts" ON checkout_attempts;
DROP POLICY IF EXISTS "Users can view own checkout attempts" ON checkout_attempts;

-- Recreate stripe_subscriptions policy with optimized auth.uid()
CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = (select auth.uid()) AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Recreate stripe_orders policy with optimized auth.uid()
CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = (select auth.uid()) AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Recreate checkout_attempts policies with optimized auth.uid() and consolidated logic
CREATE POLICY "Users and admins can view checkout attempts"
  ON checkout_attempts
  FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own attempts
    (select auth.uid()) = user_id
    OR
    -- Admins can view all attempts
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- Fix function search path if the function exists
DROP FUNCTION IF EXISTS public.update_checkout_attempts_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_checkout_attempts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_checkout_attempts_updated_at ON checkout_attempts;
CREATE TRIGGER update_checkout_attempts_updated_at
  BEFORE UPDATE ON checkout_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_checkout_attempts_updated_at();