/*
  # Setup Storage Buckets for Course Materials

  1. Storage Buckets
    - `course-thumbnails` - For course thumbnail images
    - `course-materials` - For lesson materials (PDFs, documents, etc)
    - `profile-pictures` - For user profile pictures

  2. Security
    - Enable RLS on storage buckets
    - Allow authenticated users to read files
    - Allow admins to upload and manage files
    - Allow users to upload their own profile pictures
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-materials', 'course-materials', true),
  ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Course Thumbnails: Admins can upload, everyone can view
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

-- Course Materials: Admins can manage, authenticated users can view
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

-- Profile Pictures: Users can manage their own, everyone can view
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
