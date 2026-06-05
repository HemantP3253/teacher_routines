-- 1. Ensure Row Level Security is enabled on your routines table
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies on this table to prevent conflicts
DROP POLICY IF EXISTS "Allow all authenticated users to read routines" ON public.routines;
DROP POLICY IF EXISTS "Allow admins full access to routines" ON public.routines;

-- POLICY 1: Global Read Access for Authenticated Users
-- This allows students/teachers to instantly view schedules without complex checks.
CREATE POLICY "Allow all authenticated users to read routines"
ON public.routines
FOR SELECT
TO authenticated
USING (true);

-- POLICY 2: Full administrative power for Admins
-- This checks the profiles table using an optimized subquery for write operations.
CREATE POLICY "Allow admins full access to routines"
ON public.routines
FOR ALL -- Covers INSERT, UPDATE, and DELETE (and handles admin SELECT)
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