-- 1. Ensure RLS is active
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

-- 2. Clean up the old permissive read policy
DROP POLICY IF EXISTS "Allow all authenticated users to read routines" ON public.routines;
DROP POLICY IF EXISTS "Allow admins full access to routines" ON public.routines;
DROP POLICY IF EXISTS "Users can read own routines or admins manage all" ON public.routines;

-- ==========================================
-- POLICY 1: Restricted Read Access (SELECT)
-- ==========================================
-- Allows users to see their own records, AND allows admins to see everything.
CREATE POLICY "View routines"
ON public.routines
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id) -- Condition A: Is this my own routine row?
  OR 
  EXISTS (               -- Condition B: Am I an admin user?
    SELECT 1 
    FROM public.profiles
    WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
  )
);

-- ==========================================
-- POLICY 2: Administrative Mutation Access (INSERT, UPDATE, DELETE)
-- ==========================================
-- Restricts data modification privileges strictly to global admins.
CREATE POLICY "Manage routines"
ON public.routines
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
  )
);