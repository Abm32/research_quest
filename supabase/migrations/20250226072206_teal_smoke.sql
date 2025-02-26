/*
  # Add Bookmarks and Admin Features

  1. New Tables
    - `saved_resources`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `resource_id` (uuid, references resources)
      - `notes` (text, optional)
      - `created_at` (timestamptz)

  2. Changes to Resources Table
    - Add `status` column for admin approval workflow
    - Add `user_id` column to track resource owners

  3. Security
    - Enable RLS on new tables
    - Add policies for saved resources
    - Update resource policies for admin features
*/

-- Add status and user_id to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE resources ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create saved_resources table
CREATE TABLE IF NOT EXISTS saved_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;

-- Policies for saved_resources
CREATE POLICY "Users can read their own saved resources"
  ON saved_resources
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save resources"
  ON saved_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their saved resources"
  ON saved_resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved resources"
  ON saved_resources
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update resource policies for admin features
CREATE POLICY "Admins can update any resource"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'Administrator'
    )
  );

CREATE POLICY "Admins can delete any resource"
  ON resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'Administrator'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS saved_resources_user_id_idx ON saved_resources(user_id);
CREATE INDEX IF NOT EXISTS saved_resources_resource_id_idx ON saved_resources(resource_id);
CREATE INDEX IF NOT EXISTS resources_status_idx ON resources(status);
CREATE INDEX IF NOT EXISTS resources_user_id_idx ON resources(user_id);