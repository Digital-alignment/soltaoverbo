/*
  # Fix Security and Performance Issues

  ## Overview
  This migration addresses multiple security and performance issues identified in the database:
  - Adds missing indexes on foreign key columns
  - Optimizes RLS policies to prevent auth function re-evaluation
  - Removes unused indexes that add unnecessary overhead
  - Consolidates multiple permissive policies
  - Fixes function search path issues

  ## Changes

  ### 1. Add Missing Foreign Key Indexes
  - admin_broadcasts.created_by
  - comments.user_id
  - courses.created_by
  - notifications.broadcast_id
  - post_likes.user_id
  - user_subscriptions.user_id

  ### 2. Optimize RLS Policies (Auth Function Initialization)
  - Wrap auth.uid() with (select auth.uid()) for better performance
  - Apply to community_posts, comments, users_profiles, stripe_customers

  ### 3. Remove Unused Indexes
  - idx_community_posts_hidden
  - idx_community_posts_user_hidden
  - idx_community_posts_published_visible

  ### 4. Consolidate Multiple Permissive Policies
  - Combine user and admin policies into single permissive policies

  ### 5. Fix Function Search Paths
  - Set explicit search_path on functions to prevent mutable search path issues

  ## Security Notes
  - All changes maintain existing security model
  - Performance improvements do not reduce security
  - RLS policies remain functionally equivalent but more performant
*/

-- ================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ================================================================

-- Index on admin_broadcasts.created_by
CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_created_by
  ON admin_broadcasts(created_by);

-- Index on comments.user_id
CREATE INDEX IF NOT EXISTS idx_comments_user_id
  ON comments(user_id);

-- Index on courses.created_by
CREATE INDEX IF NOT EXISTS idx_courses_created_by
  ON courses(created_by);

-- Index on notifications.broadcast_id
CREATE INDEX IF NOT EXISTS idx_notifications_broadcast_id
  ON notifications(broadcast_id);

-- Index on post_likes.user_id
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id
  ON post_likes(user_id);

-- Index on user_subscriptions.user_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id
  ON user_subscriptions(user_id);

-- ================================================================
-- 2. REMOVE UNUSED INDEXES
-- ================================================================

-- These indexes were added but are not being used by queries
DROP INDEX IF EXISTS idx_community_posts_hidden;
DROP INDEX IF EXISTS idx_community_posts_user_hidden;
DROP INDEX IF EXISTS idx_community_posts_published_visible;

-- ================================================================
-- 3. OPTIMIZE COMMUNITY_POSTS RLS POLICIES
-- ================================================================

-- Drop existing policies to recreate with optimized auth calls
DROP POLICY IF EXISTS "View public posts or own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can create own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Admins can update any post" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
DROP POLICY IF EXISTS "Admins can delete any post" ON community_posts;

-- SELECT: Public can view non-hidden posts OR users can view their own posts
CREATE POLICY "View public posts or own posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (
    hidden_from_fogueira = false
    OR user_id = (select auth.uid())
  );

-- INSERT: Users can create their own posts
CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- UPDATE: Users can update own posts OR admins can update any
CREATE POLICY "Users and admins can update posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- DELETE: Users can delete own posts OR admins can delete any
CREATE POLICY "Users and admins can delete posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- ================================================================
-- 4. OPTIMIZE COMMENTS RLS POLICIES
-- ================================================================

-- Drop existing policies to recreate with optimized auth calls
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Admins can update any comment" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON comments;

-- UPDATE: Users can update own comments OR admins can update any
CREATE POLICY "Users and admins can update comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- DELETE: Users can delete own comments OR admins can delete any
CREATE POLICY "Users and admins can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = (select auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- ================================================================
-- 5. OPTIMIZE USERS_PROFILES RLS POLICIES
-- ================================================================

-- Drop existing policies to recreate with optimized auth calls
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Admins can update any user profile" ON users_profiles;

-- UPDATE: Users can update own profile OR admins can update any
CREATE POLICY "Users and admins can update profiles"
  ON users_profiles FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles up
      WHERE up.id = (select auth.uid())
      AND up.role = 'admin'
    )
  )
  WITH CHECK (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users_profiles up
      WHERE up.id = (select auth.uid())
      AND up.role = 'admin'
    )
  );

-- ================================================================
-- 6. OPTIMIZE STRIPE_CUSTOMERS RLS POLICY
-- ================================================================

DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ================================================================
-- 7. FIX FUNCTION SEARCH PATHS
-- ================================================================

-- Recreate delete_comments_on_post_hide with explicit search_path
CREATE OR REPLACE FUNCTION delete_comments_on_post_hide()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If post is being hidden (not already hidden and now hidden)
  IF OLD.hidden_from_fogueira = false AND NEW.hidden_from_fogueira = true THEN
    -- Delete all comments and replies for this post
    DELETE FROM comments WHERE post_id = NEW.id;

    -- Reset comment count to 0
    NEW.comments_count = 0;
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate delete_comments_on_post_delete with explicit search_path
CREATE OR REPLACE FUNCTION delete_comments_on_post_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all comments and replies for this post
  DELETE FROM comments WHERE post_id = OLD.id;

  RETURN OLD;
END;
$$;

-- ================================================================
-- 8. ADD HELPFUL COMMENTS
-- ================================================================

COMMENT ON INDEX idx_admin_broadcasts_created_by IS 'Improves performance of queries filtering by creator';
COMMENT ON INDEX idx_comments_user_id IS 'Improves performance of queries filtering comments by user';
COMMENT ON INDEX idx_courses_created_by IS 'Improves performance of queries filtering courses by creator';
COMMENT ON INDEX idx_notifications_broadcast_id IS 'Improves performance of queries joining notifications with broadcasts';
COMMENT ON INDEX idx_post_likes_user_id IS 'Improves performance of queries filtering likes by user';
COMMENT ON INDEX idx_user_subscriptions_user_id IS 'Improves performance of queries filtering subscriptions by user';
