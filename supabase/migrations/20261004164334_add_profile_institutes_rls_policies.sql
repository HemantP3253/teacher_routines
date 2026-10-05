-- RLS for profile_institutes table

alter table public.profile_institutes enable row level security;

-- Is the current user an approved institute admin of this institute?

create or replace function public.is_institute_admin(
  target_institute_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = target_institute_id
      and pi.role = 'institute_admin'
      and pi.status = 'approved'
  );
$$;


-- Is the current user an approved department admin
-- of this institute?

create or replace function public.is_department_admin(
  target_institute_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = target_institute_id
      and pi.role = 'department_admin'
      and pi.status = 'approved'
  );
$$;

-- Is the current user any approved admin of this institute?

create or replace function public.is_institute_admin_or_department_admin(
  target_institute_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = target_institute_id
      and pi.role in (
        'department_admin',
        'institute_admin'
      )
      and pi.status = 'approved'
  );
$$;

revoke all on function public.is_institute_admin(uuid)
from public;

revoke all on function public.is_department_admin(uuid)
from public;

revoke all on function public.is_institute_admin_or_department_admin(uuid)
from public;

grant execute on function public.is_institute_admin(uuid)
to authenticated;

grant execute on function public.is_department_admin(uuid)
to authenticated;

grant execute on function public.is_institute_admin_or_department_admin(uuid)
to authenticated;

-- RLS policies for select

create policy "Users can read their own memberships"
on public.profile_institutes
for select
to authenticated
using (
  profile_id = auth.uid()
);

create policy "Admins can read student and teacher memberships"
on public.profile_institutes
for select
to authenticated
using (
  role in (
    'student',
    'teacher'
  )
  and public.is_institute_admin_or_department_admin(institute_id)
);

-- Institute admins can additionally see department-admin
-- memberships belonging to their institute.
--
-- This includes allowed_units.
create policy "Institute admins can read department admin memberships"
on public.profile_institutes
for select
to authenticated
using (
  role = 'department_admin'
  and public.is_institute_admin(institute_id)
);

-- RLS policy for insert

create policy "Users can request to join an institute"
on public.profile_institutes
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and role in (
    'student',
    'teacher'
  )
  and status = 'pending'
  and allowed_units is null
);

-- UPDATE STATUS
--
-- Any approved admin can change the status of students
-- and teachers belonging to the same institute.

create policy "Admins can update student and teacher status"
on public.profile_institutes
for update
to authenticated
using (
  role in (
    'student',
    'teacher'
  )
  and public.is_institute_admin_or_department_admin(institute_id)
)
with check (
  role in (
    'student',
    'teacher'
  )
  and public.is_institute_admin_or_department_admin(institute_id)
);