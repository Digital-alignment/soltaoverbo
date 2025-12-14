/*
  # Improve Fogueira Community Features
  
  This migration enhances the community features with automatic comment counting,
  notifications for engagement, and performance optimizations.

  ## 1. Automatic Comment Counting
    - Creates trigger function to auto-increment comments_count when comment added
    - Creates trigger function to auto-decrement comments_count when comment deleted
    - Ensures accurate counts even if application code fails
    - Handles both top-level comments and replies

  ## 2. Community Engagement Notifications
    - Creates trigger to notify post authors when someone comments
    - Creates trigger to notify comment authors when someone replies
    - Automatically inserts notifications with proper metadata
    - Includes commenter name and link to the post

  ## 3. Performance Optimizations
    - Adds index on comments.post_id for faster comment loading
    - Adds index on comments.parent_comment_id for faster reply loading
    - Adds composite index on notifications for faster queries
    - Improves overall query performance for community features

  ## 4. Security Updates
    - Updates RLS policy to allow trigger-based notification creation
    - Maintains security while enabling automatic notifications
    - Users can still only read their own notifications

  ## Important Notes
    - Triggers run automatically on database operations
    - Notifications are created server-side for reliability
    - Comment counts are always accurate
    - All existing security policies remain intact
*/

-- =====================================================
-- 1. CREATE TRIGGER FUNCTION FOR COMMENT COUNTING
-- =====================================================

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = comments_count + 1
  WHERE id = NEW.post_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = OLD.post_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for comment counting
DROP TRIGGER IF EXISTS trigger_increment_comment_count ON comments;
CREATE TRIGGER trigger_increment_comment_count
  AFTER INSERT ON comments
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL)
  EXECUTE FUNCTION increment_comment_count();

DROP TRIGGER IF EXISTS trigger_decrement_comment_count ON comments;
CREATE TRIGGER trigger_decrement_comment_count
  AFTER DELETE ON comments
  FOR EACH ROW
  WHEN (OLD.post_id IS NOT NULL)
  EXECUTE FUNCTION decrement_comment_count();

-- =====================================================
-- 2. CREATE TRIGGER FUNCTION FOR NOTIFICATIONS
-- =====================================================

-- Function to create notification when someone comments on a post
CREATE OR REPLACE FUNCTION notify_post_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id uuid;
  post_title text;
  commenter_name text;
BEGIN
  -- Don't notify if commenting on own post
  IF NEW.parent_comment_id IS NULL THEN
    -- This is a top-level comment on a post
    SELECT cp.user_id, we.title
    INTO post_author_id, post_title
    FROM community_posts cp
    JOIN writing_exercises we ON cp.writing_exercise_id = we.id
    WHERE cp.id = NEW.post_id;
    
    -- Get commenter's name
    SELECT display_name INTO commenter_name
    FROM users_profiles
    WHERE id = NEW.user_id;
    
    -- Create notification if not commenting on own post
    IF post_author_id IS NOT NULL AND post_author_id != NEW.user_id THEN
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        post_author_id,
        'comment',
        'Novo comentário na sua história',
        commenter_name || ' comentou na sua história "' || post_title || '"',
        '/fogueira'
      );
    END IF;
  ELSE
    -- This is a reply to a comment
    DECLARE
      parent_comment_author_id uuid;
    BEGIN
      -- Get the parent comment author
      SELECT user_id INTO parent_comment_author_id
      FROM comments
      WHERE id = NEW.parent_comment_id;
      
      -- Get commenter's name
      SELECT display_name INTO commenter_name
      FROM users_profiles
      WHERE id = NEW.user_id;
      
      -- Create notification if not replying to own comment
      IF parent_comment_author_id IS NOT NULL AND parent_comment_author_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (
          parent_comment_author_id,
          'reply',
          'Nova resposta ao seu comentário',
          commenter_name || ' respondeu ao seu comentário',
          '/fogueira'
        );
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for comment notifications
DROP TRIGGER IF EXISTS trigger_notify_comment ON comments;
CREATE TRIGGER trigger_notify_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL)
  EXECUTE FUNCTION notify_post_comment();

-- =====================================================
-- 3. CREATE PERFORMANCE INDEXES
-- =====================================================

-- Index for faster comment loading by post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Index for faster reply loading
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);

-- Composite index for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
  ON notifications(user_id, is_read, created_at DESC);

-- Index for faster community posts queries
CREATE INDEX IF NOT EXISTS idx_community_posts_published 
  ON community_posts(published_at DESC);

-- =====================================================
-- 4. UPDATE RLS POLICIES FOR NOTIFICATIONS
-- =====================================================

-- Allow system (triggers) to create notifications
-- This policy allows the trigger functions to insert notifications
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
