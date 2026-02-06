-- Add website_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.website_url IS 'Business website URL';
