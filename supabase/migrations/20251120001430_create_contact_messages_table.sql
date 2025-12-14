/*
  # Create contact messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text) - Name of the person sending the message
      - `email` (text) - Email address of the sender
      - `message` (text) - The actual message content
      - `status` (text) - Status of the message (new, read, replied, archived)
      - `created_at` (timestamptz) - When the message was sent
      - `updated_at` (timestamptz) - When the status was last updated

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for anyone to insert messages (public contact form)
    - Add policy for authenticated users to read all messages (admin access)
    - Add policy for authenticated users to update message status

  3. Indexes
    - Index on status for efficient filtering
    - Index on created_at for sorting

  ## Important Notes
  - The insert policy allows unauthenticated users to submit contact forms
  - Only authenticated users (admins) can view and manage messages
  - Status field uses check constraint to ensure valid values
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update message status"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);