-- Enable RLS
alter table public.profile_institutes enable row level security;

-- SELECT: Users can read their own, admins can read their institute members
create policy "Users and admins can read profile institutes"
on public.profile_institutes
for select
to authenticated
using (
  profile_id = auth.uid()
  or public.is_institute_admin_or_department_admin(institute_id)
);

-- INSERT: Users can create their own pending student/teacher entry
create policy "Users can create their own profile institute entry"
on public.profile_institutes
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and role in ('student', 'teacher')
  and status = 'pending'
  and allowed_units is null
);

-- UPDATE: Allowed for users (their own) and admins (institute members)
create policy "Users and admins can update profile institutes"
on public.profile_institutes
for update
to authenticated
using (
  profile_id = auth.uid()
  or public.is_institute_admin_or_department_admin(institute_id)
)
with check (
  profile_id = auth.uid()
  or public.is_institute_admin_or_department_admin(institute_id)
);

-- DELETE: No delete policy. Client-side deletion is completely disabled.