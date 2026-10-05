-- create a joined table of profile and institutes for 

create table public.profile_institutes (
  profile_id uuid not null
    references public.profiles(id)
    on delete cascade,

  institute_id uuid not null
    references public.institutes(id)
    on delete cascade,

  -- User role within an institute
  role text not null
    check (
      role in (
        'student',
        'teacher',
        'department_admin',
        'institute_admin'
      )
    ),

  -- User approval status within an institute
  status text not null default 'pending'
    check (
      status in (
        'pending',
        'approved',
        'rejected'
      )
    ),
    
  -- Allowed department/ faculty/ stream for department_admins
  allowed_units text[],
  
  -- Reviewer admin's id
  reviewed_by uuid
    references public.profiles(id)
    on delete set null,

  -- Reviewed timestamp
  reviewed_at timestamptz,

  -- Sync metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  -- Set metadata
  primary key (profile_id, institute_id),

  -- Only allow more than 1 units for department_admin
  check (
    (
      role = 'department_admin'
      and allowed_units is not null
      and cardinality(allowed_units) > 0
    )
    or
    (
      role <> 'department_admin'
      and allowed_units is null
    )
  )
);
