/*
  # Replace day_number with tags in course_lessons

  ## Summary
  This migration transforms the lesson system from using rigid day numbers to a flexible tagging system.
  Admins can now add any text, numbers, or custom labels as tags for lessons.

  ## Changes Made
  
  ### Modified Tables
  - `course_lessons`
    - Removed `day_number` column (integer, nullable)
    - Added `tags` column (text array, stores multiple tags per lesson)
    - Existing day_number values are migrated to tags (e.g., day_number: 1 → tags: ['Dia 1'])
  
  ### Indexes
  - Added index on `order_index` for better sorting performance
  
  ## Important Notes
  - Data Migration: Existing day_number values are preserved by converting them to tags
  - Backward Compatibility: The order_index field remains the source of truth for lesson ordering
  - Tags are stored as a PostgreSQL text array for flexibility
  - Empty/null tags are allowed (not all lessons need tags)
*/

-- First, add the tags column (text array)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'tags'
  ) THEN
    ALTER TABLE course_lessons ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Migrate existing day_number values to tags
UPDATE course_lessons
SET tags = ARRAY['Dia ' || day_number::text]
WHERE day_number IS NOT NULL AND (tags IS NULL OR tags = '{}');

-- Now drop the day_number column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'day_number'
  ) THEN
    ALTER TABLE course_lessons DROP COLUMN day_number;
  END IF;
END $$;

-- Add index on order_index for better sorting performance
CREATE INDEX IF NOT EXISTS idx_course_lessons_order_index 
ON course_lessons(course_id, order_index);

-- Add comment to document the tags column
COMMENT ON COLUMN course_lessons.tags IS 'Flexible tags for lessons - can contain any text, numbers, or custom labels (e.g., "Dia 1", "Intro", "Advanced")';
