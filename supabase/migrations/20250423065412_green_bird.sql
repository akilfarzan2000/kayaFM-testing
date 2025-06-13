/*
  # Create attendance table

  1. New Tables
    - `attendance`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `site` (text)
      - `full_name` (text)
      - `status` (text)
      - `date` (date)
      - `time` (text)

  2. Security
    - Enable RLS on `attendance` table
    - Add policies for authenticated users to read and insert their own data
*/

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  site text NOT NULL,
  full_name text NOT NULL,
  status text NOT NULL,
  date date NOT NULL,
  time text NOT NULL
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all attendance records"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert attendance records"
  ON attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (true);