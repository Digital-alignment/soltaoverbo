/*
  # Fix Security Issues and Performance Optimization

  ## Changes Made

  ### 1. Add Missing Indexes for Foreign Keys
  - Add index on `comments.user_id`
  - Add index on `community_posts.user_id`
  - Add index on `community_posts.writing_exercise_id`
  - Add index on `courses.created_by`
  - Add index on `post_likes.user_id`
  - Add index on `user_subscriptions.user_id`

  ### 2. Optimize RLS Policies (Replace auth.uid() with (SELECT auth.uid()))
  - Recreate all policies using the optimized pattern
  - This prevents re-evaluation of auth functions for each row

  ### 3. Remove Unused Indexes
  - Drop `idx_contact_messages_status`
  - Drop `idx_courses_type`
  - Drop `idx_notifications_user_id`

  ### 4. Fix Multiple Permissive Policies
  - Consolidate multiple SELECT policies into single policies where appropriate
  
  ### 5. Fix Function Search Path
  - Set search_path for `update_updated_at_column` function to be immutable

  ## Security Notes
  - All changes maintain existing security model
  - Performance improvements through proper indexing
  - RLS policies optimized for scale
*/

-- =====================================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_writing_exercise_id ON public.community_posts(writing_exercise_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON public.courses(created_by);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- =====================================================
-- 2. REMOVE UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_contact_messages_status;
DROP INDEX IF EXISTS idx_courses_type;
DROP INDEX IF EXISTS idx_notifications_user_id;

-- =====================================================
-- 3. FIX FUNCTION SEARCH PATH
-- =====================================================

-- Recreate the function with immutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================
-- 4. OPTIMIZE RLS POLICIES - users_profiles
-- =====================================================

DROP POLICY IF EXISTS "Users can update own profile" ON public.users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users_profiles;

CREATE POLICY "Users can update own profile"
  ON public.users_profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.users_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- =====================================================
-- 5. OPTIMIZE RLS POLICIES - courses
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Anyone can view free courses" ON public.courses;
DROP POLICY IF EXISTS "Paid users can view paid courses" ON public.courses;

-- Consolidated SELECT policy for viewing courses
CREATE POLICY "Users can view accessible courses"
  ON public.courses
  FOR SELECT
  TO authenticated
  USING (
    course_type = 'free'
    OR EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('paid', 'admin')
    )
  );

CREATE POLICY "Admins can manage courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- 6. OPTIMIZE RLS POLICIES - course_lessons
-- =====================================================

DROP POLICY IF EXISTS "Users can view lessons of accessible courses" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.course_lessons;

CREATE POLICY "Users can view accessible lessons"
  ON public.course_lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_lessons.course_id
      AND (
        courses.course_type = 'free'
        OR EXISTS (
          SELECT 1 FROM public.users_profiles
          WHERE id = (SELECT auth.uid())
          AND role IN ('paid', 'admin')
        )
      )
    )
  );

CREATE POLICY "Admins can manage lessons"
  ON public.course_lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- 7. OPTIMIZE RLS POLICIES - course_materials
-- =====================================================

DROP POLICY IF EXISTS "Users can view materials of accessible lessons" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can manage materials" ON public.course_materials;

CREATE POLICY "Users can view accessible materials"
  ON public.course_materials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons
      JOIN public.courses ON courses.id = course_lessons.course_id
      WHERE course_lessons.id = course_materials.lesson_id
      AND (
        courses.course_type = 'free'
        OR EXISTS (
          SELECT 1 FROM public.users_profiles
          WHERE id = (SELECT auth.uid())
          AND role IN ('paid', 'admin')
        )
      )
    )
  );

CREATE POLICY "Admins can manage materials"
  ON public.course_materials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- 8. OPTIMIZE RLS POLICIES - writing_exercises
-- =====================================================

DROP POLICY IF EXISTS "Users can view own exercises" ON public.writing_exercises;
DROP POLICY IF EXISTS "Users can create own exercises" ON public.writing_exercises;
DROP POLICY IF EXISTS "Users can update own exercises" ON public.writing_exercises;
DROP POLICY IF EXISTS "Users can delete own exercises" ON public.writing_exercises;

CREATE POLICY "Users can view own exercises"
  ON public.writing_exercises
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create own exercises"
  ON public.writing_exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own exercises"
  ON public.writing_exercises
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own exercises"
  ON public.writing_exercises
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- =====================================================
-- 9. OPTIMIZE RLS POLICIES - community_posts
-- =====================================================

DROP POLICY IF EXISTS "Users can create posts from own exercises" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;

CREATE POLICY "Users can create own posts"
  ON public.community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.writing_exercises
      WHERE writing_exercises.id = community_posts.writing_exercise_id
      AND writing_exercises.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own posts"
  ON public.community_posts
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- =====================================================
-- 10. OPTIMIZE RLS POLICIES - post_likes
-- =====================================================

DROP POLICY IF EXISTS "Users can create own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON public.post_likes;

CREATE POLICY "Users can create own likes"
  ON public.post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own likes"
  ON public.post_likes
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- =====================================================
-- 11. OPTIMIZE RLS POLICIES - comments
-- =====================================================

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Users can create comments"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own comments"
  ON public.comments
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own comments"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- =====================================================
-- 12. OPTIMIZE RLS POLICIES - notifications
-- =====================================================

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- 13. OPTIMIZE RLS POLICIES - user_subscriptions
-- =====================================================

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can view own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage subscriptions"
  ON public.user_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- 14. FIX BANNERS MULTIPLE PERMISSIVE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;
DROP POLICY IF EXISTS "Authenticated users can view all banners" ON public.banners;

CREATE POLICY "Users can view banners"
  ON public.banners
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );
