/*
  # Create Missing Storage Buckets
  
  This migration creates the storage buckets that were defined in the schema
  but not actually created in the database.

  1. Storage Buckets
    - `course-thumbnails` - For course thumbnail images (public access)
    - `course-materials` - For lesson materials like PDFs (authenticated access)
    - `profile-pictures` - For user profile pictures (public access)
  
  2. Security Policies
    - Course Thumbnails: Admins can manage, everyone can view
    - Course Materials: Admins can manage, authenticated users can view
    - Profile Pictures: Users can manage their own, everyone can view
  
  3. Important Notes
    - All buckets are marked as public for easy CDN access
    - RLS policies control who can upload/modify files
    - Users can only upload profile pictures to their own folder (user_id/)
    - Profile pictures are publicly viewable by anyone
*/

-- Create storage buckets (only if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-materials', 'course-materials', true),
  ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view course thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload course thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can update course thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete course thumbnails" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can view course materials" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload course materials" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can update course materials" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete course materials" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;
END $$;

-- Course Thumbnails Policies
CREATE POLICY "Anyone can view course thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Admins can upload course thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-thumbnails' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update course thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-thumbnails' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete course thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-thumbnails' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Course Materials Policies
CREATE POLICY "Authenticated users can view course materials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload course materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update course materials"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete course materials"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Profile Pictures Policies
CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload own profile picture"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own profile picture"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile picture"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
