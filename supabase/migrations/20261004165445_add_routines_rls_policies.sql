-- Enable RLS on routines
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- A. SELECT (READ) POLICIES
-- ==========================================

-- 1. Students & Teachers can view routines belonging to their approved institutes
CREATE POLICY "Students and teachers can view institute routines"
ON public.routines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = routines.institute_id
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
      AND pi.role IN ('student', 'teacher')
  )
);

-- 2. Institute Admins can view all routines in their own institute
CREATE POLICY "Institute admins can view institute routines"
ON public.routines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = routines.institute_id
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
      AND pi.role = 'institute_admin'
  )
);

-- 3. Department Admins can view routines of their own institute, 
-- PLUS full routines of cross-institute teachers who also belong to their institute
CREATE POLICY "Department admins can view routines"
ON public.routines
FOR SELECT
TO authenticated
USING (
  -- Rule A: Routines belonging to the department admin's own institute
  EXISTS (
    SELECT 1 FROM public.profile_institutes admin_pi
    WHERE admin_pi.profile_id = auth.uid()
      AND admin_pi.institute_id = routines.institute_id
      AND admin_pi.status = 'approved'
      AND admin_pi.deleted_at IS NULL
      AND admin_pi.role = 'department_admin'
  )
  OR
  -- Rule B: Cross-institute routines where the teacher belongs to BOTH 
  -- the department admin's institute and the routine's institute
  EXISTS (
    SELECT 1 FROM public.profile_institutes admin_pi
    JOIN public.profile_institutes teacher_pi 
      ON teacher_pi.profile_id = routines.teacher_id
    WHERE admin_pi.profile_id = auth.uid()
      AND admin_pi.role = 'department_admin'
      AND admin_pi.status = 'approved'
      AND admin_pi.deleted_at IS NULL
      -- The teacher is active in the admin's institute
      AND teacher_pi.institute_id = admin_pi.institute_id
      AND teacher_pi.status = 'approved'
      AND teacher_pi.deleted_at IS NULL
  )
);


-- ==========================================
-- B. WRITE POLICIES (INSERT, UPDATE, DELETE)
-- ==========================================

-- 1. INSERT: Only Admins can create routines for their own institute
CREATE POLICY "Admins can create routines for their institute"
ON public.routines
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = routines.institute_id
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
      AND pi.role IN ('institute_admin', 'department_admin')
  )
);

-- 2. UPDATE: Admins can only change routines belonging strictly to their own institute
CREATE POLICY "Admins can update routines for their institute"
ON public.routines
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = routines.institute_id
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
      AND pi.role IN ('institute_admin', 'department_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = routines.institute_id
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
      AND pi.role IN ('institute_admin', 'department_admin')
  )
);

-- 3. DELETE: Admins can delete routines for their own institute
CREATE POLICY "Admins can delete routines for their institute"
ON public.routines
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profile_institutes pi
    WHERE pi.profile_id = auth.uid()
      AND pi.institute_id = routines.institute_id
      AND pi.status = 'approved'
      AND pi.deleted_at IS NULL
      AND pi.role IN ('institute_admin', 'department_admin')
  )
);