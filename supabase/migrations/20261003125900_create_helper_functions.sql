-- updates the updated_at value of any rows that are changed

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==========================================
-- SECURITY HELPER FUNCTIONS
-- ==========================================

-- Helper function to check if the current user is an institute admin
CREATE OR REPLACE FUNCTION public.is_institute_admin(p_institute_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = p_institute_id
      AND pi.role = 'institute_admin'
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
  );
$$;

-- Helper function to check if the current user is a department admin
CREATE OR REPLACE FUNCTION public.is_department_admin(p_institute_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = p_institute_id
      AND pi.role = 'department_admin'
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
  );
$$;

-- Helper function to check if the current user is either an institute or department admin
CREATE OR REPLACE FUNCTION public.is_institute_admin_or_department_admin(p_institute_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = p_institute_id
      AND pi.role IN ('institute_admin', 'department_admin')
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
  );
$$;