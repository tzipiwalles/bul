-- Add community field to profiles table
-- This allows professionals to specify their community/hasidut affiliation

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS community TEXT DEFAULT 'general';

-- Create index for community filtering
CREATE INDEX IF NOT EXISTS idx_profiles_community ON profiles(community);

-- Comment for documentation
COMMENT ON COLUMN profiles.community IS 'Community/Hasidut affiliation (e.g., chabad, gur, belz, general)';
