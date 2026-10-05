-- RLS policies for profiles table

alter table public.profiles enable row level security;

-- Select own profile: Every authenticated user can read their own profile.

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

-- Select other's profiles:
--
-- Department admins can read student, teacher, and other
-- department admin profiles belonging to the same institute.
--
-- The target membership status is intentionally NOT checked.
-- This allows admins to see users who are:
-- pending, approved, rejected, neutralized
--
-- Their own membership must still be approved in order to
-- exercise department-admin privileges.

create policy "Department admins can read institute profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.profile_institutes admin_membership
    join public.profile_institutes target_membership
      on target_membership.institute_id = admin_membership.institute_id
    where admin_membership.profile_id = auth.uid()
      and admin_membership.role = 'department_admin'
      and admin_membership.status = 'approved'
      and admin_membership.deleted_at is null

      and target_membership.profile_id = profiles.id
      and target_membership.deleted_at is null

      and target_membership.role in (
        'student',
        'teacher',
        'department_admin'
      )
  )
);

-- Select other's profiles:
--
-- Institute admins can read student, teacher, and department
-- admin profiles belonging to their institute.
--
-- The target membership status is intentionally NOT checked.
-- This allows institute admins to see users regardless of
-- their current approval state.

create policy "Institute admins can read institute profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.profile_institutes admin_membership
    join public.profile_institutes target_membership
      on target_membership.institute_id = admin_membership.institute_id
    where admin_membership.profile_id = auth.uid()
      and admin_membership.role = 'institute_admin'
      and admin_membership.status = 'approved'
      and admin_membership.deleted_at is null

      and target_membership.profile_id = profiles.id
      and target_membership.deleted_at is null

      and target_membership.role in (
        'student',
        'teacher',
        'department_admin'
      )
  )
);

-- Insert own Profile: A user can create only their own profile.

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);


-- Update own profile: A user can update only their own profile.

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);


-- Delete: No delete policy.
--
-- Physical deletion is not permitted through the client.