/*
  # Add Like Notifications
  
  This migration adds automatic notifications when users like posts in the community.

  ## 1. Like Notification Trigger
    - Creates trigger function to notify post authors when someone likes their post
    - Automatically inserts notification with proper metadata
    - Includes liker's name and link to the post
    - Prevents self-notifications (when liking own post)
    - Uses SECURITY DEFINER for proper permissions

  ## 2. Security
    - Function uses explicit schema references (public.*)
    - Secure search_path configuration prevents injection attacks
    - Works with existing notification RLS policies
    - Only notifies the post author, maintaining privacy

  ## Important Notes
    - Trigger runs automatically when a like is inserted
    - Notifications are created server-side for reliability
    - No notification is sent when users like their own posts
    - All existing security policies remain intact
*/

-- =====================================================
-- CREATE TRIGGER FUNCTION FOR LIKE NOTIFICATIONS
-- =====================================================

-- Function to create notification when someone likes a post
CREATE OR REPLACE FUNCTION public.notify_post_like()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id uuid;
  post_title text;
  liker_name text;
BEGIN
  -- Get the post author and title
  SELECT cp.user_id, we.title
  INTO post_author_id, post_title
  FROM public.community_posts cp
  JOIN public.writing_exercises we ON cp.writing_exercise_id = we.id
  WHERE cp.id = NEW.post_id;
  
  -- Get liker's name
  SELECT display_name INTO liker_name
  FROM public.users_profiles
  WHERE id = NEW.user_id;
  
  -- Create notification if not liking own post
  IF post_author_id IS NOT NULL AND post_author_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      post_author_id,
      'like',
      'Alguém curtiu sua história',
      liker_name || ' curtiu sua história "' || post_title || '"',
      '/fogueira'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Create trigger for like notifications
DROP TRIGGER IF EXISTS trigger_notify_like ON post_likes;
CREATE TRIGGER trigger_notify_like
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_post_like();
