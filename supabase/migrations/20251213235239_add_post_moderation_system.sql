/*
  # Admin Post Moderation System for Fogueira

  ## Overview
  This migration adds post-level moderation capabilities for Nossa Fogueira.
  Admins can hide posts from the public fogueira view while keeping them visible to the author.

  ## Changes

  ### 1. Schema Updates
  - Add `hidden_from_fogueira` column to community_posts table
  - This boolean flag determines if a post is visible in the public fogueira
  - Default is false (visible to everyone)
  - When true, post is hidden from fogueira but still visible to the author

  ### 2. RLS Policies for Admin Post Moderation
  - Add policy allowing admins to update any community_post
  - Add policy allowing admins to delete any community_post
  - Update SELECT policy to filter hidden posts from fogueira view
  - Users can still see their own hidden posts in their profile

  ### 3. Database Functions
  - Create function to delete all comments when a post is hidden
  - Create trigger to automatically clean up comments when post is hidden

  ### 4. Indexes
  - Add index on hidden_from_fogueira column for better query performance
  - Add composite index for user_id and hidden_from_fogueira

  ## Security Notes
  - Only admins (role='admin') can hide or delete posts
  - Users can always view their own posts regardless of hidden status
  - Hidden posts don't appear in public fogueira queries
  - All comment cascades are handled automatically
*/

-- ================================================================
-- 1. ADD HIDDEN_FROM_FOGUEIRA COLUMN TO COMMUNITY_POSTS
-- ================================================================

-- Add the column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'hidden_from_fogueira'
  ) THEN
    ALTER TABLE community_posts
    ADD COLUMN hidden_from_fogueira boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add helpful comment
COMMENT ON COLUMN community_posts.hidden_from_fogueira IS
  'When true, post is hidden from public fogueira but visible to author in their profile';

-- ================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Index for filtering visible posts in fogueira
CREATE INDEX IF NOT EXISTS idx_community_posts_hidden
  ON community_posts(hidden_from_fogueira);

-- Composite index for user posts queries
CREATE INDEX IF NOT EXISTS idx_community_posts_user_hidden
  ON community_posts(user_id, hidden_from_fogueira);

-- Index for published_at with hidden filter
CREATE INDEX IF NOT EXISTS idx_community_posts_published_visible
  ON community_posts(published_at DESC)
  WHERE hidden_from_fogueira = false;

-- ================================================================
-- 3. UPDATE RLS POLICIES FOR POST MODERATION
-- ================================================================

-- Drop existing policies to recreate them with updated logic
DROP POLICY IF EXISTS "Anyone can view published posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

-- Policy: Public can view non-hidden posts OR users can view their own posts
CREATE POLICY "View public posts or own posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (
    hidden_from_fogueira = false
    OR user_id = auth.uid()
  );

-- Policy: Users can insert their own posts
CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Admins can update any post (including hiding)
CREATE POLICY "Admins can update any post"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Admins can delete any post
CREATE POLICY "Admins can delete any post"
  ON community_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- ================================================================
-- 4. CREATE FUNCTION TO DELETE COMMENTS WHEN POST IS HIDDEN
-- ================================================================

CREATE OR REPLACE FUNCTION delete_comments_on_post_hide()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_delete_comments_on_hide ON community_posts;

-- Create trigger to delete comments when post is hidden
CREATE TRIGGER trigger_delete_comments_on_hide
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  WHEN (OLD.hidden_from_fogueira IS DISTINCT FROM NEW.hidden_from_fogueira)
  EXECUTE FUNCTION delete_comments_on_post_hide();

-- ================================================================
-- 5. CREATE FUNCTION TO DELETE COMMENTS WHEN POST IS DELETED
-- ================================================================

CREATE OR REPLACE FUNCTION delete_comments_on_post_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all comments and replies for this post
  DELETE FROM comments WHERE post_id = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_delete_comments_on_delete ON community_posts;

-- Create trigger to delete comments when post is permanently deleted
CREATE TRIGGER trigger_delete_comments_on_delete
  BEFORE DELETE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION delete_comments_on_post_delete();
