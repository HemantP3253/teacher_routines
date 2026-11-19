create table public.routines (
  -- Primary identifier (generated client-side when offline, with DB fallback).
  id uuid primary key default gen_random_uuid(),

  -- 1. Institute & Unit Scope
  institute_id uuid not null
    references public.institutes(id)
    on delete cascade,

  unit_id text not null,

  -- 2. Academic & Curriculum Scope
  program_id text,

  branch_id text,

  syllabus_id text,

  academic_level_id text not null,

  stream_id text,

  batch_and_section text not null,

  -- 3. Class & Teacher Assignment
  subject_id text not null,

  teacher_id uuid not null
    references public.profiles(id)
    on delete cascade,

  -- 4. Schedule Window
  start_time time not null,
  end_time time not null,
  days text[] not null,

  -- 5. Sync & Audit Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  -- Constraints
  check (end_time > start_time),
  check (cardinality(days) > 0),
  check (
    days <@ array[
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]::text[]
  )
);