/*
  # Add link_url field to banners table

  1. Changes
    - Add `link_url` (text, nullable) - Optional URL that the entire banner will link to
    - This is in addition to the existing button_link field
    - If link_url is present, the entire banner becomes clickable
    - If only button_link is present, only the button is clickable

  2. Notes
    - Allows banners to be fully clickable images with optional buttons
    - link_url takes precedence for the entire banner wrapper
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'banners' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE banners ADD COLUMN link_url text;
  END IF;
END $$;