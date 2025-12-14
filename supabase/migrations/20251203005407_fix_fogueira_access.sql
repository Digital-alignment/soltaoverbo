/*
  # Fix Fogueira Access - Allow Viewing Published Exercises
  
  This migration fixes the issue where users cannot see other people's exercises
  in the Fogueira (community) space.

  1. Changes to writing_exercises Policies
    - Keep existing policy for users to view their own exercises
    - Add new policy to allow viewing exercises that have been published to community
    - This allows the join in community_posts to work correctly
  
  2. Security
    - Users can still only edit/delete their own exercises
    - Users can view their own exercises (all states)
    - Users can view OTHER users' exercises ONLY if they are published to community
    - This maintains privacy while enabling the community feature
  
  3. Important Notes
    - The new policy checks if the exercise exists in community_posts table
    - This ensures only published exercises are visible to others
    - Private exercises remain private
*/

-- Add a new policy to allow viewing exercises that are published in community_posts
CREATE POLICY "Users can view published exercises in community"
  ON writing_exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.writing_exercise_id = writing_exercises.id
    )
  );
