-- Institutes
-- Represents an educational institution.

-- Representation example:
-- School       -> Nursery to 10
-- College      -> +2
-- University   -> Bachelor's, Master's, etc.

create table public.institutes (
  id uuid primary key default gen_random_uuid(),

  -- Name of the institute
  name text not null,

  -- Type of institute:
  type text not null
    check (
      type in (
        'school',
        'college',
        'university'
      )
    ),

  -- Short institution code (unique identifier)
  code text not null unique,

  -- Address of the institute
  address text,

  -- Manually entered affiliated university.
  affiliated_university text,

  -- Sync metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);