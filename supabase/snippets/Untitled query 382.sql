-- 1. Create a helper function to safely check if the logged-in user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
SECURITY DEFINER -- Runs with system privileges, bypassing RLS loops
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

-- 2. Enable Row Level Security on your profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. DROP old policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admin full access policy" ON public.profiles;
DROP POLICY IF EXISTS "User self management policy" ON public.profiles;

-- 4. POLICY A: Rule for Administrators
-- Admins can do ALL operations (SELECT, UPDATE, DELETE), but ONLY on non-admin profiles
CREATE POLICY "Admins can only manage non-admins"
ON public.profiles
FOR ALL -- Applies to SELECT, INSERT, UPDATE, and DELETE
TO authenticated
USING (
  public.is_admin() AND is_admin = false
)
WITH CHECK (
  public.is_admin() AND is_admin = false
);

-- 5. POLICY B: Rule for Regular Users / Self Access
-- Regular users must still be able to see and modify their own personal profile row
CREATE POLICY "Users can manage their own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);