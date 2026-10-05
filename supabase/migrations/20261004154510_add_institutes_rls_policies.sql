-- RLS for institutes table

alter table public.institutes enable row level security;

-- SELECT
--
-- Anyone can read institutes, including unauthenticated users.
-- Soft-deleted institutes are hidden.

create policy "Anyone can read institutes"
on public.institutes
for select
to public
using (
  deleted_at is null
);

-- INSERT
--
-- No INSERT policy.
-- Therefore no API client can insert institutes.

-- UPDATE
--
-- No UPDATE policy.
-- Therefore no API client can update institutes.

-- DELETE
--
-- No DELETE policy.
-- Therefore no API client can delete institutes.