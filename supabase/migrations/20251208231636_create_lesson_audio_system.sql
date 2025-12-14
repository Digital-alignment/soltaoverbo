/*
  # Audio File Management System

  1. New Storage Bucket
    - `lesson-audio` - For lesson audio files with 10-minute max duration
    
  2. New Tables
    - `lesson_audio_files`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key to course_lessons)
      - `title` (text) - Display title for the audio
      - `audio_file_url` (text) - Public URL from storage
      - `duration_seconds` (integer) - Duration in seconds (max 600)
      - `file_size_bytes` (bigint) - File size
      - `original_filename` (text) - Original uploaded filename
      - `mime_type` (text) - Audio MIME type
      - `order_index` (integer) - For multiple audios per lesson
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on lesson_audio_files table
    - Admins can manage all audio files
    - Authenticated users can read audio files
    - Storage policies for lesson-audio bucket
*/

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-audio', 'lesson-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for lesson-audio bucket
CREATE POLICY "Anyone can view lesson audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lesson-audio');

CREATE POLICY "Admins can upload lesson audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lesson-audio' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lesson audio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'lesson-audio' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete lesson audio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'lesson-audio' AND
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Create lesson_audio_files table
CREATE TABLE IF NOT EXISTS lesson_audio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  audio_file_url text NOT NULL,
  duration_seconds integer NOT NULL CHECK (duration_seconds > 0 AND duration_seconds <= 600),
  file_size_bytes bigint NOT NULL CHECK (file_size_bytes > 0),
  original_filename text NOT NULL,
  mime_type text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lesson_audio_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_audio_files
CREATE POLICY "Authenticated users can view audio files"
  ON lesson_audio_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert audio files"
  ON lesson_audio_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update audio files"
  ON lesson_audio_files FOR UPDATE
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

CREATE POLICY "Admins can delete audio files"
  ON lesson_audio_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_lesson_audio_files_lesson_id ON lesson_audio_files(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_audio_files_order ON lesson_audio_files(lesson_id, order_index);