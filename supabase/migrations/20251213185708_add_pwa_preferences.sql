/*
  # Add PWA Install Preferences to User Profiles

  1. Changes
    - Add `pwa_install_dismissed` boolean column to track if user dismissed PWA install prompt
    - Add `pwa_install_dismissed_at` timestamp column to track when dismissed
    - Both columns allow null for backward compatibility
    - Set default value for pwa_install_dismissed to false for new records

  2. Security
    - Existing RLS policies on users_profiles table will apply
    - Users can only update their own PWA preferences
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users_profiles' AND column_name = 'pwa_install_dismissed'
  ) THEN
    ALTER TABLE users_profiles ADD COLUMN pwa_install_dismissed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users_profiles' AND column_name = 'pwa_install_dismissed_at'
  ) THEN
    ALTER TABLE users_profiles ADD COLUMN pwa_install_dismissed_at timestamptz;
  END IF;
END $$;