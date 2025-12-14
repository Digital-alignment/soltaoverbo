/*
  # Soltar o Verbo - Initial Database Schema

  ## Overview
  This migration creates the complete database schema for the "Soltar o Verbo" writing community platform.
  The platform supports three user roles (admin, free, paid) with courses, writing exercises, community feed, and notifications.

  ## 1. New Tables

  ### users_profiles
  - `id` (uuid, primary key, references auth.users)
  - `display_name` (text)
  - `bio` (text)
  - `profile_picture_url` (text)
  - `role` (text) - admin, free, or paid
  - `instagram_url` (text)
  - `linkedin_url` (text)
  - `substack_url` (text)
  - `email_public` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### courses
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `thumbnail_url` (text)
  - `course_type` (text) - free or paid
  - `stripe_payment_link` (text, optional)
  - `created_by` (uuid, references users_profiles)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### course_lessons
  - `id` (uuid, primary key)
  - `course_id` (uuid, references courses)
  - `title` (text)
  - `day_number` (integer, for free courses)
  - `description` (text)
  - `audio_url` (text, optional)
  - `zoom_link` (text, optional)
  - `recording_url` (text, optional)
  - `order_index` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### course_materials
  - `id` (uuid, primary key)
  - `lesson_id` (uuid, references course_lessons)
  - `title` (text)
  - `file_url` (text)
  - `file_type` (text)
  - `created_at` (timestamptz)

  ### writing_exercises
  - `id` (uuid, primary key)
  - `user_id` (uuid, references users_profiles)
  - `title` (text)
  - `content` (text)
  - `is_published` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### community_posts
  - `id` (uuid, primary key)
  - `writing_exercise_id` (uuid, references writing_exercises)
  - `user_id` (uuid, references users_profiles)
  - `likes_count` (integer)
  - `comments_count` (integer)
  - `published_at` (timestamptz)

  ### post_likes
  - `id` (uuid, primary key)
  - `post_id` (uuid, references community_posts)
  - `user_id` (uuid, references users_profiles)
  - `created_at` (timestamptz)

  ### comments
  - `id` (uuid, primary key)
  - `post_id` (uuid, references community_posts, optional)
  - `lesson_id` (uuid, references course_lessons, optional)
  - `user_id` (uuid, references users_profiles)
  - `parent_comment_id` (uuid, references comments, optional for replies)
  - `content` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references users_profiles)
  - `type` (text) - comment, reply, like, announcement, course_update
  - `title` (text)
  - `message` (text)
  - `link` (text, optional)
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ### user_subscriptions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references users_profiles)
  - `stripe_payment_id` (text)
  - `status` (text) - active, expired, cancelled
  - `started_at` (timestamptz)
  - `expires_at` (timestamptz, optional)

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Add policies for admins to manage all content
  - Add policies for public read access to community posts
  - Add policies for paid users to access paid courses
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'free', 'paid');
CREATE TYPE course_type AS ENUM ('free', 'paid');
CREATE TYPE notification_type AS ENUM ('comment', 'reply', 'like', 'announcement', 'course_update');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');

-- Users Profiles Table
CREATE TABLE IF NOT EXISTS users_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text DEFAULT '',
  profile_picture_url text,
  role user_role NOT NULL DEFAULT 'free',
  instagram_url text,
  linkedin_url text,
  substack_url text,
  email_public text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON users_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  course_type course_type NOT NULL DEFAULT 'free',
  stripe_payment_link text,
  created_by uuid REFERENCES users_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view free courses"
  ON courses FOR SELECT
  TO authenticated
  USING (course_type = 'free');

CREATE POLICY "Paid users can view paid courses"
  ON courses FOR SELECT
  TO authenticated
  USING (
    course_type = 'paid' AND (
      EXISTS (
        SELECT 1 FROM users_profiles
        WHERE users_profiles.id = auth.uid()
        AND users_profiles.role IN ('paid', 'admin')
      )
    )
  );

CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
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

-- Course Lessons Table
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  day_number integer,
  description text NOT NULL DEFAULT '',
  audio_url text,
  zoom_link text,
  recording_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lessons of accessible courses"
  ON course_lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_lessons.course_id
      AND (
        courses.course_type = 'free'
        OR EXISTS (
          SELECT 1 FROM users_profiles
          WHERE users_profiles.id = auth.uid()
          AND users_profiles.role IN ('paid', 'admin')
        )
      )
    )
  );

CREATE POLICY "Admins can manage lessons"
  ON course_lessons FOR ALL
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

-- Course Materials Table
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view materials of accessible lessons"
  ON course_materials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_lessons
      JOIN courses ON courses.id = course_lessons.course_id
      WHERE course_lessons.id = course_materials.lesson_id
      AND (
        courses.course_type = 'free'
        OR EXISTS (
          SELECT 1 FROM users_profiles
          WHERE users_profiles.id = auth.uid()
          AND users_profiles.role IN ('paid', 'admin')
        )
      )
    )
  );

CREATE POLICY "Admins can manage materials"
  ON course_materials FOR ALL
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

-- Writing Exercises Table
CREATE TABLE IF NOT EXISTS writing_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE writing_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercises"
  ON writing_exercises FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own exercises"
  ON writing_exercises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises"
  ON writing_exercises FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises"
  ON writing_exercises FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_exercise_id uuid NOT NULL REFERENCES writing_exercises(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  published_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts from own exercises"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post Likes Table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT comment_target_check CHECK (
    (post_id IS NOT NULL AND lesson_id IS NULL) OR
    (post_id IS NULL AND lesson_id IS NOT NULL)
  )
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  stripe_payment_id text NOT NULL,
  status subscription_status DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage subscriptions"
  ON user_subscriptions FOR ALL
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

-- Create indexes for better performance
CREATE INDEX idx_courses_type ON courses(course_type);
CREATE INDEX idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX idx_course_materials_lesson_id ON course_materials(lesson_id);
CREATE INDEX idx_writing_exercises_user_id ON writing_exercises(user_id);
CREATE INDEX idx_community_posts_published_at ON community_posts(published_at DESC);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_lesson_id ON comments(lesson_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_profiles_updated_at BEFORE UPDATE ON users_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_writing_exercises_updated_at BEFORE UPDATE ON writing_exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
