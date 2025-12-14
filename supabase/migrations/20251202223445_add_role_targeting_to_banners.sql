/*
  # Add Role Targeting to Banners

  ## Changes Made

  ### 1. Add visible_to_roles Column
  - Add `visible_to_roles` column to store which user roles can see each banner
  - Type: text array to support multiple roles
  - Default to all roles ['free', 'paid', 'admin'] for backward compatibility
  - Allows targeting banners to specific user types

  ### 2. Update Existing Banners
  - Set all existing banners to be visible to all user types
  - Ensures no breaking changes for current banners

  ### 3. Add Index
  - Create GIN index on visible_to_roles for efficient filtering
  - Improves query performance when filtering by user role

  ## Usage Examples
  - Show to free users only: ['free']
  - Show to premium users only: ['paid']
  - Show to admins only: ['admin']
  - Show to free and premium: ['free', 'paid']
  - Show to everyone: ['free', 'paid', 'admin']

  ## Security Notes
  - No changes to RLS policies needed
  - Filtering happens at application level based on user role
  - Admin users can still manage all banners regardless of targeting
*/

-- =====================================================
-- 1. ADD visible_to_roles COLUMN
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'banners' AND column_name = 'visible_to_roles'
  ) THEN
    ALTER TABLE banners ADD COLUMN visible_to_roles text[] DEFAULT ARRAY['free', 'paid', 'admin'];
  END IF;
END $$;

-- =====================================================
-- 2. UPDATE EXISTING BANNERS
-- =====================================================

-- Set all existing banners with NULL visible_to_roles to show for all users
UPDATE banners
SET visible_to_roles = ARRAY['free', 'paid', 'admin']
WHERE visible_to_roles IS NULL;

-- =====================================================
-- 3. ADD INDEX FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_banners_visible_to_roles ON banners USING GIN (visible_to_roles);
