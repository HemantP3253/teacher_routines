-- ============================================================
-- INSTITUTIONS
-- ============================================================

create table public.institutions (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  type text not null
    check (
      type in (
        'school',
        'college',
        'university'
      )
    ),

  -- Short institution code
  code text not null unique,

  address text,

  -- Manually entered affiliated university.
  affiliated_university text,

  -- Sync metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);


-- ============================================================
-- RLS
-- ============================================================

alter table public.institutions enable row level security;


-- ============================================================
-- READ
--
-- Authenticated users can read active institutions.
-- ============================================================

create policy "Authenticated users can read institutions"
on public.institutions
for select
to authenticated
using (
  deleted_at is null
);


-- ============================================================
-- UPDATED_AT
-- ============================================================

create trigger institutions_updated_at
before update on public.institutions
for each row
execute function public.update_updated_at();