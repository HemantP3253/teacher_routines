-- ============================================================
-- PROFILE TABLE
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  username text not null unique,
  full_name text not null,
  date_of_birth date not null,
  gender text not null,
  phone text not null,
  address text,
  avatar_url text,

  -- Global role.
  -- Institution-specific roles are stored in
  -- public.profile_institutions.
  role text not null
    check (
      role in (
        'student',
        'teacher',
        'department_admin',
        'institution_admin',
        'super_admin'
      )
    ),

  -- User IDs of admins who approved/rejected this profile.
  approved_by uuid[],
  rejected_by uuid[],

  -- Sync metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);


-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles enable row level security;


-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Returns the current user's global role.

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and deleted_at is null
  limit 1;
$$;


-- Returns true when the current user is a global super admin.

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'super_admin';
$$;


-- ============================================================
-- SELECT
--
-- Users and admins can read their own profile.
-- ============================================================

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
);


-- ============================================================
-- INSERT
--
-- Users can create their own profile.
--
-- The client should not be trusted to assign privileged roles
-- or approval information. Those should be handled by trusted
-- server-side operations.
-- ============================================================

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = id
);


-- ============================================================
-- UPDATE OWN PROFILE
--
-- Users and admins can update their own profile.
--
-- IMPORTANT:
-- RLS controls rows, not individual columns. Therefore,
-- approved_by, rejected_by, role, etc. should not be exposed
-- through unrestricted client-side UPDATE privileges.
--
-- Use dedicated RPC functions for privileged fields.
-- ============================================================

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);


-- ============================================================
-- SUPER ADMIN UPDATE
--
-- Super admins can update profiles globally.
-- They cannot modify another super admin through this policy.
-- ============================================================

create policy "Super admins can update profiles"
on public.profiles
for update
to authenticated
using (
  public.is_super_admin()
  and id <> auth.uid()
  and role <> 'super_admin'
  and deleted_at is null
)
with check (
  public.is_super_admin()
  and role <> 'super_admin'
);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at();