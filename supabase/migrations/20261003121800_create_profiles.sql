-- Create the profiles table

create table public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  username text not null unique,
  full_name text not null,
  date_of_birth date not null,
  gender text not null,
  phone text not null,
  address text,
  avatar_url text,

  -- Sync metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
