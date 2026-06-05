-- Enable RLS on your profiles table (if it isn't already)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy allowing authenticated users to read their own profile row
CREATE POLICY "Allow users to read their own profile" 
ON public.profiles
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);