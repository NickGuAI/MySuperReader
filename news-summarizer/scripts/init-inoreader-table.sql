-- Create the inoreader table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS inoreader (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  
  -- Make sure each user only has one Inoreader connection
  CONSTRAINT unique_user_connection UNIQUE (user_id)
);

-- Set up RLS (Row Level Security) policies to restrict access
ALTER TABLE inoreader ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own tokens
CREATE POLICY "Users can view their own tokens" ON inoreader
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own tokens
CREATE POLICY "Users can update their own tokens" ON inoreader
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tokens
CREATE POLICY "Users can insert their own tokens" ON inoreader
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own tokens
CREATE POLICY "Users can delete their own tokens" ON inoreader
  FOR DELETE USING (auth.uid() = user_id); 