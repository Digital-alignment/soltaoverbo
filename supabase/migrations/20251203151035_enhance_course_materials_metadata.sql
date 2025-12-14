/*
  # Enhance Course Materials with Metadata

  1. Changes to course_materials table
    - Add `file_size` (bigint) - Store file size in bytes for uploaded files
    - Add `mime_type` (text) - Store actual MIME type of the file
    - Add `original_filename` (text) - Preserve the original filename from upload
    - Add `is_uploaded` (boolean) - Distinguish between uploaded files and URL links
    
  2. Default Values
    - file_size: NULL (for URL-based materials)
    - mime_type: NULL (will be set during upload)
    - original_filename: NULL (will be set during upload)
    - is_uploaded: DEFAULT false (true for uploaded files, false for URL links)
    
  3. Notes
    - Maintains backward compatibility with existing materials
    - Allows for better file management and display
    - Helps with storage cleanup and file type validation
*/

-- Add new metadata columns to course_materials table
DO $$
BEGIN
  -- Add file_size column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE course_materials ADD COLUMN file_size bigint;
  END IF;

  -- Add mime_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'mime_type'
  ) THEN
    ALTER TABLE course_materials ADD COLUMN mime_type text;
  END IF;

  -- Add original_filename column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'original_filename'
  ) THEN
    ALTER TABLE course_materials ADD COLUMN original_filename text;
  END IF;

  -- Add is_uploaded column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'is_uploaded'
  ) THEN
    ALTER TABLE course_materials ADD COLUMN is_uploaded boolean DEFAULT false;
  END IF;
END $$;

-- Update existing records to mark them as URL-based (not uploaded)
UPDATE course_materials 
SET is_uploaded = false 
WHERE is_uploaded IS NULL;

-- Add a check constraint to ensure file_size is positive when present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'course_materials_file_size_positive'
  ) THEN
    ALTER TABLE course_materials 
    ADD CONSTRAINT course_materials_file_size_positive 
    CHECK (file_size IS NULL OR file_size > 0);
  END IF;
END $$;