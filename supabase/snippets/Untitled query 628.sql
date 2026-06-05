-- 1. Ensure RLS is active on the target table
ALTER TABLE "public"."user_configs" ENABLE ROW LEVEL SECURITY;

-- 2. Drop it if it already exists to prevent duplicate naming conflicts
DROP POLICY IF EXISTS "Enable users to manage their own data only" ON "public"."user_configs";

-- 3. Create the hyper-optimized CRUD policy
CREATE POLICY "Enable users to manage their own data only"
ON "public"."user_configs"
FOR ALL -- Covers SELECT, INSERT, UPDATE, and DELETE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);