-- Add country column to profiles table with default 'IL' for existing records
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'IL';

-- Set all existing records to Israel
UPDATE profiles SET country = 'IL' WHERE country IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.country IS 'ISO country code (IL, US, GB, CA, FR, BE, AR)';
