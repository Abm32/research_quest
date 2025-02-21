/*
  # Create Resources Table

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `author` (text)
      - `source` (text)
      - `url` (text, optional)
      - `download_count` (integer)
      - `rating` (float)
      - `review_count` (integer)
      - `tags` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `resources` table
    - Add policies for:
      - Anyone can read resources
      - Authenticated users can create resources
      - Resource owners can update their resources
      - Resource owners can delete their resources

  3. Functions
    - `increment_download_count`: Safely increment download count
    - `add_resource_rating`: Add and update resource ratings
*/

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('paper', 'dataset', 'tool', 'template', 'guide', 'external')),
  author text NOT NULL,
  source text NOT NULL,
  url text,
  download_count integer DEFAULT 0,
  rating float DEFAULT 0,
  review_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read resources"
  ON resources
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Resource owners can update their resources"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Resource owners can delete their resources"
  ON resources
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(resource_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE resources
  SET 
    download_count = download_count + 1,
    updated_at = now()
  WHERE id = resource_id;
END;
$$;

-- Create function to add/update resource rating
CREATE OR REPLACE FUNCTION add_resource_rating(resource_id uuid, new_rating float)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE resources
  SET 
    rating = CASE 
      WHEN review_count = 0 THEN new_rating
      ELSE ((rating * review_count) + new_rating) / (review_count + 1)
    END,
    review_count = review_count + 1,
    updated_at = now()
  WHERE id = resource_id;
END;
$$;

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS resources_search_idx ON resources 
USING GIN (to_tsvector('english', title || ' ' || description));

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS resources_type_idx ON resources(type);

-- Create index for tags array
CREATE INDEX IF NOT EXISTS resources_tags_idx ON resources USING GIN (tags);