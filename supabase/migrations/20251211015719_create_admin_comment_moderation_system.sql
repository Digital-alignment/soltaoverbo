/*
  # Admin Comment Moderation System

  ## Overview
  This migration adds admin moderation capabilities for comments in Nossa Fogueira.
  Admins can edit and delete any comment, and receive notifications when new comments are posted.

  ## Changes

  ### 1. RLS Policies for Admin Comment Moderation
  - Add policy allowing admins to update any comment
  - Add policy allowing admins to delete any comment
  - Existing user policies remain unchanged

  ### 2. Notification System for Admin Alerts
  - Create function to notify all admins when new comments are posted
  - Create trigger on comments table to send admin notifications
  - Notifications include post title, commenter name, and comment type (comment/reply)

  ### 3. Security
  - Only users with role='admin' can moderate all comments
  - Notifications are sent only to admin users
  - All changes respect existing RLS policies

  ## Notes
  - This is an internal moderation system
  - Users will not see any indication of admin moderation
  - Admins receive real-time notifications for community monitoring
*/

-- ================================================================
-- 1. ADD ADMIN POLICIES FOR COMMENT MODERATION
-- ================================================================

-- Allow admins to update any comment
CREATE POLICY "Admins can update any comment"
  ON comments FOR UPDATE
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

-- Allow admins to delete any comment
CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- ================================================================
-- 2. CREATE FUNCTION TO NOTIFY ADMINS OF NEW COMMENTS
-- ================================================================

CREATE OR REPLACE FUNCTION notify_admins_of_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  admin_record RECORD;
  post_title text;
  commenter_name text;
  notification_message text;
  notification_title text;
  is_reply boolean;
BEGIN
  -- Check if this is a reply or a main comment
  is_reply := NEW.parent_comment_id IS NOT NULL;

  -- Get the commenter's name
  SELECT display_name INTO commenter_name
  FROM users_profiles
  WHERE id = NEW.user_id;

  -- Get the post title if this is a community post comment
  IF NEW.post_id IS NOT NULL THEN
    SELECT we.title INTO post_title
    FROM community_posts cp
    JOIN writing_exercises we ON we.id = cp.writing_exercise_id
    WHERE cp.id = NEW.post_id;

    -- Create notification message
    IF is_reply THEN
      notification_title := 'Nova resposta na Fogueira';
      notification_message := commenter_name || ' respondeu em "' || post_title || '"';
    ELSE
      notification_title := 'Novo comentário na Fogueira';
      notification_message := commenter_name || ' comentou em "' || post_title || '"';
    END IF;

    -- Send notification to all admins
    FOR admin_record IN 
      SELECT id FROM users_profiles WHERE role = 'admin'
    LOOP
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        link,
        is_read,
        created_at
      ) VALUES (
        admin_record.id,
        CASE WHEN is_reply THEN 'reply'::notification_type ELSE 'comment'::notification_type END,
        notification_title,
        notification_message,
        '/fogueira',
        false,
        now()
      );
    END LOOP;
  END IF;

  -- Update comment count on the post
  IF NEW.post_id IS NOT NULL THEN
    UPDATE community_posts
    SET comments_count = (
      SELECT COUNT(*)
      FROM comments
      WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 3. CREATE TRIGGER FOR ADMIN NOTIFICATIONS
-- ================================================================

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_notify_admins_new_comment ON comments;

-- Create trigger to notify admins when new comments are created
CREATE TRIGGER trigger_notify_admins_new_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_admins_of_new_comment();

-- ================================================================
-- 4. CREATE FUNCTION TO UPDATE COMMENT COUNT ON DELETE
-- ================================================================

CREATE OR REPLACE FUNCTION update_comment_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Update comment count on the post
  IF OLD.post_id IS NOT NULL THEN
    UPDATE community_posts
    SET comments_count = (
      SELECT COUNT(*)
      FROM comments
      WHERE post_id = OLD.post_id
    )
    WHERE id = OLD.post_id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_comment_count_delete ON comments;

-- Create trigger to update comment count when comments are deleted
CREATE TRIGGER trigger_update_comment_count_delete
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_count_on_delete();

-- ================================================================
-- 5. CREATE INDEX FOR BETTER PERFORMANCE
-- ================================================================

-- Index for finding recent comments (for moderation dashboard)
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Index for finding comments by user (for moderation)
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
