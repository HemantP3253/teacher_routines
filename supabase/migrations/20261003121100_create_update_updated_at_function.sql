-- ============================================================
-- UPDATED_AT HELPER FUNCTION
-- ============================================================

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;