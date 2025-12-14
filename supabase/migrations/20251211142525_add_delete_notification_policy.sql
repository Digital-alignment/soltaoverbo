/*
  # Add Delete Notification Policy

  ## Overview
  The notifications table was missing a DELETE policy, which prevented users from permanently deleting notifications.
  This caused deleted notifications to reappear after page reload because the deletion was silently failing due to RLS.

  ## Changes
  - Add DELETE policy allowing users to delete their own notifications
  - This enables permanent deletion of notifications from the database

  ## Security
  - Users can only delete notifications they own (user_id matches auth.uid())
  - Admins cannot bypass this restriction
*/

-- Add DELETE policy for notifications table
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
