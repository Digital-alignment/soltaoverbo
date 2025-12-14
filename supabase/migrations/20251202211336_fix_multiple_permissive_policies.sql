/*
  # Fix Multiple Permissive Policies

  ## Changes Made

  ### 1. Consolidate Multiple Permissive SELECT Policies
  The issue with multiple permissive policies is that they all evaluate and if ANY returns true,
  access is granted. We need to consolidate them into single policies that handle all cases.

  ### Tables Affected
  - `courses` - Merge admin and user view policies
  - `course_lessons` - Merge admin and user view policies  
  - `course_materials` - Merge admin and user view policies
  - `user_subscriptions` - Merge admin and user view policies

  ### Note on Unused Indexes
  The indexes flagged as "unused" were just created in the previous migration.
  They will be used by queries once the application runs queries against these tables.
  These indexes are critical for foreign key performance and should NOT be removed.

  ## Security Notes
  - All changes maintain existing security model
  - Policies are consolidated to eliminate multiple permissive policies warning
  - Admin access is preserved in all cases
*/

-- =====================================================
-- FIX COURSES - CONSOLIDATE SELECT POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view accessible courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;

-- Single consolidated SELECT policy
CREATE POLICY "View accessible courses"
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

-- Separate policies for INSERT, UPDATE, DELETE (admin only)
CREATE POLICY "Admins can insert courses"
  ON public.courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update courses"
  ON public.courses
  FOR UPDATE
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

CREATE POLICY "Admins can delete courses"
  ON public.courses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- FIX COURSE_LESSONS - CONSOLIDATE SELECT POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view accessible lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.course_lessons;

-- Single consolidated SELECT policy
CREATE POLICY "View accessible lessons"
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

-- Separate policies for INSERT, UPDATE, DELETE (admin only)
CREATE POLICY "Admins can insert lessons"
  ON public.course_lessons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update lessons"
  ON public.course_lessons
  FOR UPDATE
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

CREATE POLICY "Admins can delete lessons"
  ON public.course_lessons
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- FIX COURSE_MATERIALS - CONSOLIDATE SELECT POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view accessible materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can manage materials" ON public.course_materials;

-- Single consolidated SELECT policy
CREATE POLICY "View accessible materials"
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

-- Separate policies for INSERT, UPDATE, DELETE (admin only)
CREATE POLICY "Admins can insert materials"
  ON public.course_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update materials"
  ON public.course_materials
  FOR UPDATE
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

CREATE POLICY "Admins can delete materials"
  ON public.course_materials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- =====================================================
-- FIX USER_SUBSCRIPTIONS - CONSOLIDATE SELECT POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.user_subscriptions;

-- Single consolidated SELECT policy
CREATE POLICY "View subscriptions"
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

-- Separate policies for INSERT, UPDATE, DELETE (admin only)
CREATE POLICY "Admins can insert subscriptions"
  ON public.user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update subscriptions"
  ON public.user_subscriptions
  FOR UPDATE
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

CREATE POLICY "Admins can delete subscriptions"
  ON public.user_subscriptions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );
