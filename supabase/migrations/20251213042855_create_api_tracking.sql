/*
  # API Tracking System

  1. New Tables
    - `api_logs`
      - `id` (uuid, primary key) - Unique identifier for each API call
      - `user_id` (uuid, nullable) - Reference to auth.users for authenticated requests
      - `endpoint` (text) - The API endpoint that was called
      - `method` (text) - HTTP method (GET, POST, PUT, DELETE, etc.)
      - `request_body` (jsonb, nullable) - Request payload
      - `response_status` (integer) - HTTP response status code
      - `response_data` (jsonb, nullable) - Response data
      - `response_time` (integer) - Response time in milliseconds
      - `cache_hit` (boolean) - Whether the response was served from cache
      - `error_message` (text, nullable) - Error message if request failed
      - `created_at` (timestamptz) - Timestamp of the API call

    - `api_preferences`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, unique) - Reference to auth.users
      - `preferences` (jsonb) - User-specific API preferences and settings
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Users can view their own API logs
    - Users can manage their own preferences
    - Service role can access all logs for monitoring

  3. Indexes
    - Index on user_id for faster queries
    - Index on endpoint for analytics
    - Index on created_at for time-based queries
*/

-- Create api_logs table
CREATE TABLE IF NOT EXISTS api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  request_body jsonb,
  response_status integer,
  response_data jsonb,
  response_time integer,
  cache_hit boolean DEFAULT false,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Create api_preferences table
CREATE TABLE IF NOT EXISTS api_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_logs
CREATE POLICY "Users can view own API logs"
  ON api_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert API logs"
  ON api_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role has full access to API logs"
  ON api_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for api_preferences
CREATE POLICY "Users can view own preferences"
  ON api_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON api_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON api_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON api_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_cache_hit ON api_logs(cache_hit);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for api_preferences
DROP TRIGGER IF EXISTS update_api_preferences_timestamp ON api_preferences;
CREATE TRIGGER update_api_preferences_timestamp
  BEFORE UPDATE ON api_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_api_preferences_updated_at();
