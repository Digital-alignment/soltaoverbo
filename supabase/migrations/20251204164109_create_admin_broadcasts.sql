/*
  # Create Admin Broadcast System

  1. New Tables
    - `admin_broadcasts`
      - `id` (uuid, primary key)
      - `title` (text, required) - Broadcast title
      - `message` (text, required) - Broadcast message content
      - `image_url` (text, optional) - URL to uploaded image
      - `target_audience` (text[], array) - Array of target roles: 'free', 'paid', 'admin'
      - `created_by` (uuid, foreign key) - Admin who created the broadcast
      - `created_at` (timestamptz) - Creation timestamp
      - `is_active` (boolean) - For soft delete functionality

  2. Changes to Existing Tables
    - Add `broadcast_id` column to `notifications` table (nullable, references admin_broadcasts)

  3. Security
    - Enable RLS on `admin_broadcasts` table
    - Only admins can create, update, and delete broadcasts
    - All authenticated users can read active broadcasts

  4. Indexes
    - Index on `target_audience` for filtering
    - Index on `created_at` for sorting
    - Index on `broadcast_id` in notifications table for joins
*/

-- Create admin_broadcasts table
CREATE TABLE IF NOT EXISTS admin_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  image_url text,
  target_audience text[] NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES users_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,

  CONSTRAINT title_length CHECK (char_length(title) <= 200),
  CONSTRAINT message_length CHECK (char_length(message) <= 2000),
  CONSTRAINT target_audience_valid CHECK (
    target_audience <@ ARRAY['free', 'paid', 'admin']::text[]
  )
);

-- Add broadcast_id to notifications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'broadcast_id'
  ) THEN
    ALTER TABLE notifications ADD COLUMN broadcast_id uuid REFERENCES admin_broadcasts(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_created_at ON admin_broadcasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_is_active ON admin_broadcasts(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_target_audience ON admin_broadcasts USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_notifications_broadcast_id ON notifications(broadcast_id);

-- Enable RLS
ALTER TABLE admin_broadcasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_broadcasts

-- Admins can view all broadcasts (active and inactive)
CREATE POLICY "Admins can view all broadcasts"
  ON admin_broadcasts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Authenticated users can view active broadcasts
CREATE POLICY "Users can view active broadcasts"
  ON admin_broadcasts
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Only admins can create broadcasts
CREATE POLICY "Admins can create broadcasts"
  ON admin_broadcasts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Only admins can update broadcasts
CREATE POLICY "Admins can update broadcasts"
  ON admin_broadcasts
  FOR UPDATE
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

-- Only admins can delete broadcasts (soft delete via update)
CREATE POLICY "Admins can delete broadcasts"
  ON admin_broadcasts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE users_profiles.id = auth.uid()
      AND users_profiles.role = 'admin'
    )
  );

-- Function to create notifications for broadcast recipients
CREATE OR REPLACE FUNCTION create_broadcast_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notifications for all users matching the target audience
  INSERT INTO notifications (user_id, type, title, message, link, broadcast_id, is_read, created_at)
  SELECT
    up.id,
    'announcement'::notification_type,
    NEW.title,
    NEW.message,
    NULL,
    NEW.id,
    false,
    NEW.created_at
  FROM users_profiles up
  WHERE up.role = ANY(NEW.target_audience);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create notifications when broadcast is created
DROP TRIGGER IF EXISTS trigger_create_broadcast_notifications ON admin_broadcasts;
CREATE TRIGGER trigger_create_broadcast_notifications
  AFTER INSERT ON admin_broadcasts
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION create_broadcast_notifications();
