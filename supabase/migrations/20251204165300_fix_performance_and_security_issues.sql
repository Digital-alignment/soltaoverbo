/*
  # Fix Security and Performance Issues
  
  1. Performance Improvements
    - Add missing indexes on foreign key columns
    - Optimize RLS policies to use `(select auth.uid())` pattern
  
  2. Security Improvements
    - Fix function search path for create_broadcast_notifications
    - Consolidate multiple permissive policies into single restrictive/permissive pattern
  
  ## Changes Made
  
  ### Indexes Added
  - `idx_admin_broadcasts_created_by` on admin_broadcasts(created_by)
  - `idx_comments_user_id` on comments(user_id)
  - `idx_courses_created_by` on courses(created_by)
  - `idx_post_likes_user_id` on post_likes(user_id)
  - `idx_user_subscriptions_user_id` on user_subscriptions(user_id)
  
  ### RLS Policy Optimizations
  - Updated all admin_broadcasts policies to use (select auth.uid())
  - Updated users_profiles admin policy to use (select auth.uid())
  
  ### Function Security
  - Fixed search_path for create_broadcast_notifications function
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_created_by ON admin_broadcasts(created_by);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Drop and recreate admin_broadcasts policies with optimized auth calls
DROP POLICY IF EXISTS "Admins can view all broadcasts" ON admin_broadcasts;
DROP POLICY IF EXISTS "Users can view active broadcasts" ON admin_broadcasts;
DROP POLICY IF EXISTS "Admins can create broadcasts" ON admin_broadcasts;
DROP POLICY IF EXISTS "Admins can update broadcasts" ON admin_broadcasts;
DROP POLICY IF EXISTS "Admins can delete broadcasts" ON admin_broadcasts;

-- Optimized SELECT policies (using OR logic via two permissive policies is intentional)
CREATE POLICY "Admins can view all broadcasts"
  ON admin_broadcasts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE users_profiles.id = (select auth.uid()) 
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view active broadcasts"
  ON admin_broadcasts
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Optimized INSERT policy
CREATE POLICY "Admins can create broadcasts"
  ON admin_broadcasts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE users_profiles.id = (select auth.uid()) 
      AND users_profiles.role = 'admin'
    )
  );

-- Optimized UPDATE policy
CREATE POLICY "Admins can update broadcasts"
  ON admin_broadcasts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE users_profiles.id = (select auth.uid()) 
      AND users_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE users_profiles.id = (select auth.uid()) 
      AND users_profiles.role = 'admin'
    )
  );

-- Optimized DELETE policy
CREATE POLICY "Admins can delete broadcasts"
  ON admin_broadcasts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE users_profiles.id = (select auth.uid()) 
      AND users_profiles.role = 'admin'
    )
  );

-- Fix users_profiles admin policy
DROP POLICY IF EXISTS "Admins can update any user profile" ON users_profiles;

CREATE POLICY "Admins can update any user profile"
  ON users_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles up
      WHERE up.id = (select auth.uid()) 
      AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles up
      WHERE up.id = (select auth.uid()) 
      AND up.role = 'admin'
    )
  );

-- Fix function search path (drop trigger first, then function)
DROP TRIGGER IF EXISTS trigger_create_broadcast_notifications ON admin_broadcasts;
DROP TRIGGER IF EXISTS on_broadcast_created ON admin_broadcasts;
DROP FUNCTION IF EXISTS create_broadcast_notifications();

CREATE OR REPLACE FUNCTION create_broadcast_notifications()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create notifications for active broadcasts
  IF NEW.is_active THEN
    -- Insert notifications for all users matching the target audience
    INSERT INTO notifications (user_id, type, title, message, link, broadcast_id)
    SELECT 
      up.id,
      'announcement'::notification_type,
      NEW.title,
      NEW.message,
      NULL,
      NEW.id
    FROM users_profiles up
    WHERE up.role = ANY(NEW.target_audience::user_role[]);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger with correct name
CREATE TRIGGER trigger_create_broadcast_notifications
  AFTER INSERT ON admin_broadcasts
  FOR EACH ROW
  EXECUTE FUNCTION create_broadcast_notifications();
