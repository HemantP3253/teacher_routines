-- 1. Ensure Row Level Security is enabled on your colleges table
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- 2. Drop the policy if it already exists to avoid duplication errors
DROP POLICY IF EXISTS "Admins can view college data" ON public.colleges;

-- 3. Create the cross-table admin access policy
CREATE POLICY "Admins can view college data" 
ON public.colleges
FOR SELECT -- Applies to viewing/reading data
TO authenticated -- Only logged-in users can execute this check
USING (
  -- Highly optimized subquery lookup on your 1:1 profiles table
  EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
  )
);