-- PROFILE_INSTITUTES

create index profile_institutes_institute_id_idx
on public.profile_institutes(institute_id);

create index profile_institutes_approved_profile_idx
on public.profile_institutes(
  profile_id,
  institute_id,
  role
)
where status = 'approved'
  and deleted_at is null;

create index profile_institutes_approved_institute_idx
on public.profile_institutes(
  institute_id,
  role,
  profile_id
)
where status = 'approved'
  and deleted_at is null;

-- ROUTINES

create index routines_institute_unit_idx
on public.routines(
  institute_id,
  unit_id
);

create index routines_teacher_schedule_idx
on public.routines(
  teacher_id,
  start_time,
  end_time
)
where deleted_at is null;