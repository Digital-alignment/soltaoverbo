/*
  # Create banner slider table

  1. New Tables
    - `banners`
      - `id` (uuid, primary key) - Unique identifier for each banner
      - `image_url` (text) - URL of the banner image stored in Supabase storage
      - `button_text` (text, nullable) - Optional button text
      - `button_link` (text, nullable) - Optional button link/URL
      - `display_order` (integer) - Order in which banners appear (1, 2, 3)
      - `is_active` (boolean) - Whether the banner is currently active/visible
      - `created_at` (timestamptz) - When the banner was created
      - `updated_at` (timestamptz) - When the banner was last updated

  2. Security
    - Enable RLS on `banners` table
    - Add policy for anyone to read active banners (public view)
    - Add policy for authenticated users to manage all banners (admin access)

  3. Indexes
    - Index on display_order for efficient ordering
    - Index on is_active for filtering active banners

  4. Constraints
    - Check constraint to ensure display_order is between 1 and 3
    - Unique constraint on display_order to prevent duplicates

  ## Important Notes
  - Maximum of 3 banners allowed (enforced by display_order constraint)
  - Public users can only view active banners
  - Only authenticated admins can create, update, or delete banners
  - Images will be stored in Supabase storage bucket
*/

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  button_text text,
  button_link text,
  display_order integer NOT NULL CHECK (display_order >= 1 AND display_order <= 3),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(display_order)
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all banners"
  ON banners
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert banners"
  ON banners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update banners"
  ON banners
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete banners"
  ON banners
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);