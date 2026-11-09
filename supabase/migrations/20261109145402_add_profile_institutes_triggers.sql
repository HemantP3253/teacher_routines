create or replace function public.enforce_profile_institute_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_updating_self boolean;
  is_inst_admin boolean;
  is_dept_admin boolean;
begin
  is_updating_self := (NEW.profile_id = auth.uid());
  is_inst_admin := public.is_institute_admin(NEW.institute_id);
  is_dept_admin := public.is_department_admin(NEW.institute_id);

  -- ADMINS CANNOT UPDATE THEIR OWN ENTRY
  if (is_inst_admin or is_dept_admin) and is_updating_self then
    raise exception 'Unauthorized: Admins cannot modify their own profile institute entry.';
  end if;

  -- REGULAR USERS UPDATING THEIR OWN ENTRY
  if is_updating_self and not (is_inst_admin or is_dept_admin) then
    if NEW.status is distinct from OLD.status 
       or NEW.role is distinct from OLD.role 
       or NEW.allowed_units is distinct from OLD.allowed_units 
       or NEW.reviewed_at is distinct from OLD.reviewed_at 
       or NEW.reviewed_by is distinct from OLD.reviewed_by then
      raise exception 'Unauthorized: You cannot modify your own status, role, or review fields.';
    end if;
    return NEW;
  end if;

  -- 3. DEPARTMENT ADMIN RULES
  if is_dept_admin and not is_inst_admin then
    -- Can only update students and teachers (cannot update other admins)
    if OLD.role not in ('student', 'teacher') then
      raise exception 'Unauthorized: Department admins can only manage students and teachers.';
    end if;
    -- Cannot change a user's role to an admin status (only student <-> teacher)
    if NEW.role not in ('student', 'teacher') then
      raise exception 'Unauthorized: Department admins cannot assign admin roles.';
    end if;
    return NEW;
  end if;

  -- 4. INSTITUTE ADMIN RULES
  if is_inst_admin then
    -- Can manage students, teachers, and department admins, but CANNOT assign institute_admin role
    if NEW.role = 'institute_admin' and OLD.role is distinct from 'institute_admin' then
      raise exception 'Unauthorized: Institute admins cannot promote users to institute admin.';
    end if;
    return NEW;
  end if;

  return NEW;
end;
$$;

-- Attach trigger to table
drop trigger if exists tr_enforce_profile_institute_update_rules on public.profile_institutes;

create trigger tr_enforce_profile_institute_update_rules
before update on public.profile_institutes
for each row
execute function public.enforce_profile_institute_update_rules();