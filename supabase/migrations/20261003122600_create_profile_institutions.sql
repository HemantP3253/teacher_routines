-- ============================================================
-- PROFILE INSTITUTIONS
--
-- Associates a profile with one or more institutions.
--
-- A profile can have a different role at each institution.
--
-- Examples:
--
-- Teacher A → College A → teacher
-- Teacher A → College B → teacher
-- Teacher B → College A → department_admin
-- Admin A   → School A  → institution_admin
--
-- super_admin is a global role and therefore does not need
-- an entry in this table.
-- ============================================================

create table public.profile_institutions (
  profile_id uuid not null
    references public.profiles(id)
    on delete cascade,

  institution_id uuid not null
    references public.institutions(id)
    on delete cascade,

  role text not null
    check (
      role in (
        'student',
        'teacher',
        'department_admin',
        'institution_admin'
      )
    ),

  created_at timestamptz not null default now(),

  primary key (profile_id, institution_id)
);


-- ============================================================
-- RLS
-- ============================================================

alter table public.profile_institutions enable row level security;


-- ============================================================
-- USERS CAN READ THEIR OWN INSTITUTION MEMBERSHIPS
-- ============================================================

create policy "Users can read their own institution memberships"
on public.profile_institutions
for select
to authenticated
using (
  auth.uid() = profile_id
);


-- ============================================================
-- SUPER ADMINS CAN READ ALL INSTITUTION MEMBERSHIPS
-- ============================================================

create policy "Super admins can read institution memberships"
on public.profile_institutions
for select
to authenticated
using (
  public.is_super_admin()
);


-- ============================================================
-- SUPER ADMINS CAN CREATE INSTITUTION MEMBERSHIPS
-- ============================================================

create policy "Super admins can create institution memberships"
on public.profile_institutions
for insert
to authenticated
with check (
  public.is_super_admin()
);


-- ============================================================
-- SUPER ADMINS CAN UPDATE INSTITUTION MEMBERSHIPS
-- ============================================================

create policy "Super admins can update institution memberships"
on public.profile_institutions
for update
to authenticated
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);


-- ============================================================
-- SUPER ADMINS CAN DELETE INSTITUTION MEMBERSHIPS
-- ============================================================

create policy "Super admins can delete institution memberships"
on public.profile_institutions
for delete
to authenticated
using (
  public.is_super_admin()
);