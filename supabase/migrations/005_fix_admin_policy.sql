-- Fix admin RLS policy to allow users to check if THEY are admin
-- But only admins can see the full list

DROP POLICY IF EXISTS "Admins can view admin list" ON admins;

-- Allow users to check if they themselves are admin
CREATE POLICY "Users can check their own admin status" ON admins
    FOR SELECT USING (
        auth.uid() = user_id  -- Can see your own row
        OR auth.uid() IN (SELECT user_id FROM admins)  -- Or if you're already known as admin
    );
