-- RLS for routines table

alter table public.routines enable row level security;

-- Select section

-- TEACHERS:
--
-- Teachers can see every routine assigned to them, regardless
-- of which institute the routine belongs to.
--
-- This allows the application to detect schedule clashes when
-- the same teacher teaches at multiple institutes.

create policy "Teachers can read their own routines"
on public.routines
for select
to authenticated
using (
  teacher_id = auth.uid()
  and deleted_at is null
);

-- DEPARTMENT ADMINS
--
-- Department admins can see routines in their institute only
-- when the routine belongs to one of their allowed units.

create policy "Department admins can read allowed routines"
on public.routines
for select
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'department_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
      and routines.unit_id = any(pi.allowed_units)
  )
);

-- INSTITUTE ADMINS
--
-- Institute admins can see every routine in their institute.
-- This intentionally overrides department-admin restrictions.

create policy "Institute admins can read all institute routines"
on public.routines
for select
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'institute_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
  )
);

-- INSERT

-- DEPARTMENT ADMINS
--
-- Can create routines only inside their institute and
-- only within their allowed units.

create policy "Department admins can create allowed routines"
on public.routines
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'department_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
      and routines.unit_id = any(pi.allowed_units)
  )
);

-- INSTITUTE ADMINS
--
-- Can create routines anywhere within their institute.

create policy "Institute admins can create institute routines"
on public.routines
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'institute_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
  )
);

-- UPDATE

-- DEPARTMENT ADMINS
--
-- Can update routines within their allowed units.
--
-- The resulting routine must still remain within one of their
-- allowed units and within their institute.

create policy "Department admins can update allowed routines"
on public.routines
for update
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'department_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
      and routines.unit_id = any(pi.allowed_units)
  )
)
with check (
  deleted_at is null
  and exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'department_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
      and routines.unit_id = any(pi.allowed_units)
  )
);

-- INSTITUTE ADMINS
--
-- Can update every routine belonging to their institute,
-- including routines created by department admins.

create policy "Institute admins can update all institute routines"
on public.routines
for update
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'institute_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
  )
)
with check (
  deleted_at is null
  and exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = routines.institute_id
      and pi.role = 'institute_admin'
      and pi.status = 'approved'
      and pi.deleted_at is null
  )
);

-- DELETE
--
-- No DELETE policy.
--
-- Routines should be soft-deleted using deleted_at through
-- an appropriate controlled operation.
