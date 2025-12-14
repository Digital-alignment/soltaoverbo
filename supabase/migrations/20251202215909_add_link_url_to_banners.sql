/*
  # Add link_url column to banners table and create dedicated storage bucket

  ## Changes Made

  ### 1. Add Missing Column
  - Add `link_url` column to banners table
  - This allows the entire banner to be clickable, not just a button
  
  ### 2. Create Dedicated Banners Storage Bucket
  - Create new `banners` storage bucket for banner images
  - Set bucket to public for easy access
  - Add storage policies for admin uploads
  - Add storage policies for public viewing

  ## Security Notes
  - Only admins can upload, update, or delete banner images
  - Everyone can view banner images (public bucket)
  - Policies use optimized (SELECT auth.uid()) pattern
*/

-- =====================================================
-- 1. ADD MISSING COLUMN TO BANNERS TABLE
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'banners' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE banners ADD COLUMN link_url text;
  END IF;
END $$;

-- =====================================================
-- 2. CREATE DEDICATED BANNERS STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. STORAGE POLICIES FOR BANNERS BUCKET
-- =====================================================

-- Anyone can view banner images
CREATE POLICY "Anyone can view banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

-- Admins can upload banner images
CREATE POLICY "Admins can upload banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE users_profiles.id = (SELECT auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- Admins can update banner images
CREATE POLICY "Admins can update banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE users_profiles.id = (SELECT auth.uid())
      AND users_profiles.role = 'admin'
    )
  );

-- Admins can delete banner images
CREATE POLICY "Admins can delete banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM public.users_profiles
      WHERE users_profiles.id = (SELECT auth.uid())
      AND users_profiles.role = 'admin'
    )
  );
