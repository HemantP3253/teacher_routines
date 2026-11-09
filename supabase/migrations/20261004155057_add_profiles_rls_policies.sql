-- 1. Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can manage their own profiles

-- Insert own profile
create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);

-- Update own profile
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

-- READ POLICIES (Select rules)

-- Rule 1: Anyone can read their own profile
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

-- Rule 2: Institute admins can see all users belonging to their own institute
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
  )
);

-- Rule 3: Department admins can see all users within their institute who are not department admins and not institute admins
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

      and target_membership.role not in (
        'institute_admin',
        'department_admin'
      )
  )
);