/*
  # Add Admin User Management Policy

  ## Description
  This migration adds a policy that allows administrators to update any user's profile,
  including their role. This is necessary for the admin dashboard to manage user roles.

  ## Changes
  1. Add UPDATE policy for admins
    - Allows users with 'admin' role to update any user's profile
    - Grants full control over role changes (free, paid, admin)
    - Uses restrictive check to ensure only admins can use this policy

  ## Security Notes
  - Policy checks that the authenticated user has admin role
  - Admins can change any field in users_profiles for any user
  - This is intentional and necessary for user management functionality
  - Original "Users can update own profile" policy remains for non-admin users
*/

-- Add policy for admins to update any user profile
CREATE POLICY "Admins can update any user profile"
  ON users_profiles FOR UPDATE
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
