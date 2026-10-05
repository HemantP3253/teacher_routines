-- UPDATED_AT TRIGGERS

create trigger institutes_updated_at
before update on public.institutes
for each row
execute function public.update_updated_at();

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at();

create trigger profile_institutes_updated_at
before update on public.profile_institutes
for each row
execute function public.update_updated_at();

create trigger routines_updated_at
before update on public.routines
for each row
execute function public.update_updated_at();
