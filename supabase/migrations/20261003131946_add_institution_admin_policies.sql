-- ============================================================
-- SUPER ADMIN INSTITUTION POLICIES
-- ============================================================

create policy "Super admins can create institutions"
on public.institutions
for insert
to authenticated
with check (
  public.is_super_admin()
);


create policy "Super admins can update institutions"
on public.institutions
for update
to authenticated
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);