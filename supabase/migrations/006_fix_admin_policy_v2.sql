-- Fix admin RLS policy - remove recursive query
-- Simple policy: users can only check if THEY are admin

DROP POLICY IF EXISTS "Users can check their own admin status" ON admins;
DROP POLICY IF EXISTS "Admins can view admin list" ON admins;

-- Simple non-recursive policy: users can see their own row only
CREATE POLICY "Users can check own admin status" ON admins
    FOR SELECT USING (auth.uid() = user_id);
