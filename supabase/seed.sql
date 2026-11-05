-- ==========================================
-- 1. SEED AUTH USERS (15 Users)
-- ==========================================

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values
  -- 1. Main Admin (Institute Admin)
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin.mmc@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 2. Department Admin 1
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'deptadmin.bca@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 3. Department Admin 2
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'deptadmin.bbs@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 4. Teacher 1
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.ram@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 5. Teacher 2
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.shyam@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 6. Teacher 3
  (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.gita@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 7. Teacher 4
  (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.hari@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 8. Teacher 5
  (
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.rita@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 9. Teacher 6
  (
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.madan@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 10. Teacher 7
  (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.sita@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 11. Teacher 8
  (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.laxmi@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 12. Teacher 9
  (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.bibek@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 13. Teacher 10
  (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.puja@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 14. Student 1
  (
    '00000000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'student.niraj@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 15. Student 2
  (
    '00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'student.anisha@nepalgunj.edu.np',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  )
on conflict (id) do nothing;


-- ==========================================
-- 2. SEED INSTITUTE (1 College)
-- ==========================================

insert into public.institutes (id, name, type, code, address, affiliated_university) values
  (
    'd1111111-1111-1111-1111-111111111111',
    'Mahendra Multiple Campus, Nepalgunj',
    'college',
    'MMCNPJ',
    'Nepalgunj - 10',
    'Tribhuvan University'
  )
on conflict (id) do nothing;


-- ==========================================
-- 3. SEED PROFILES (15 Profiles)
-- ==========================================

insert into public.profiles (id, username, full_name, date_of_birth, gender, phone, address, avatar_url) values
  ('00000000-0000-0000-0000-000000000001', 'admin_mmc', 'Bikash Adhikari', '1980-05-12', 'Male', '+9779800000001', 'Surkhet Road, Nepalgunj', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
  ('00000000-0000-0000-0000-000000000002', 'deptadmin_bca', 'Suman Karki', '1985-08-20', 'Male', '+9779800000002', 'Dhapani, Nepalgunj', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
  ('00000000-0000-0000-0000-000000000003', 'deptadmin_bbs', 'Anita Shrestha', '1988-02-14', 'Female', '+9779800000003', 'Sadashivapur, Nepalgunj', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
  ('00000000-0000-0000-0000-000000000004', 'teacher_ram', 'Ram Prasad Sharma', '1990-11-05', 'Male', '+9779800000004', 'Banke Road, Nepalgunj', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  ('00000000-0000-0000-0000-000000000005', 'teacher_shyam', 'Shyam Kumar Verma', '1991-03-12', 'Male', '+9779800000005', 'Rani Talau, Nepalgunj', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'),
  ('00000000-0000-0000-0000-000000000006', 'teacher_gita', 'Gita Devi Upadhyay', '1992-07-25', 'Female', '+9779800000006', 'Buspark Line, Nepalgunj', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'),
  ('00000000-0000-0000-0000-000000000007', 'teacher_hari', 'Hari Bahadur Khatri', '1989-09-30', 'Male', '+9779800000007', 'Ganeshpur, Nepalgunj', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'),
  ('00000000-0000-0000-0000-000000000008', 'teacher_rita', 'Rita Chaudhary', '1993-12-04', 'Female', '+9779800000008', 'Jumli Galli, Nepalgunj', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
  ('00000000-0000-0000-0000-000000000009', 'teacher_madan', 'Madan Bhandari', '1987-04-18', 'Male', '+9779800000009', 'Birendranagar Marg, Nepalgunj', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'),
  ('00000000-0000-0000-0000-000000000010', 'teacher_sita', 'Sita Poudel', '1994-06-15', 'Female', '+9779800000010', 'Sharada Nagar, Nepalgunj', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'),
  ('00000000-0000-0000-0000-000000000011', 'teacher_laxmi', 'Laxmi Prasad Devkota', '1986-10-10', 'Male', '+9779800000011', 'Dhapani, Nepalgunj', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61'),
  ('00000000-0000-0000-0000-000000000012', 'teacher_bibek', 'Bibek Thapa', '1995-01-22', 'Male', '+9779800000012', 'Surkhet Road, Nepalgunj', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91'),
  ('00000000-0000-0000-0000-000000000013', 'teacher_puja', 'Puja Koirala', '1996-08-09', 'Female', '+9779800000013', 'Khajura Road, Nepalgunj', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
  ('00000000-0000-0000-0000-000000000014', 'student_niraj', 'Niraj Malla', '2004-02-11', 'Male', '+9779800000014', 'Rani Talau, Nepalgunj', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'),
  ('00000000-0000-0000-0000-000000000015', 'student_anisha', 'Anisha KC', '2005-09-19', 'Female', '+9779800000015', 'Tribhuvan Chowk, Nepalgunj', 'https://images.unsplash.com/photo-1517841905240-472988babdf9')
on conflict (id) do nothing;


-- ==========================================
-- 4. SEED PROFILE_INSTITUTES (Roles & Mappings)
-- ==========================================

insert into public.profile_institutes (
  profile_id, 
  institute_id, 
  role, 
  status, 
  allowed_units, 
  reviewed_by, 
  reviewed_at
) values
  -- Main Admin (allowed_units must be null)
  ('00000000-0000-0000-0000-000000000001', 'd1111111-1111-1111-1111-111111111111', 'institute_admin', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  
  -- Department Admins (allowed_units must be non-null and have items)
  ('00000000-0000-0000-0000-000000000002', 'd1111111-1111-1111-1111-111111111111', 'department_admin', 'approved', ARRAY['BCA'], '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000003', 'd1111111-1111-1111-1111-111111111111', 'department_admin', 'approved', ARRAY['BBS'], '00000000-0000-0000-0000-000000000001', now()),

  -- 10 Teachers (allowed_units must be null)
  ('00000000-0000-0000-0000-000000000004', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000005', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000006', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000007', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000008', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000009', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000010', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000011', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000012', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000013', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),

  -- 2 Students (allowed_units must be null)
  ('00000000-0000-0000-0000-000000000014', 'd1111111-1111-1111-1111-111111111111', 'student', 'approved', null, '00000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000015', 'd1111111-1111-1111-1111-111111111111', 'student', 'approved', null, '00000000-0000-0000-0000-000000000001', now())
on conflict (profile_id, institute_id) do nothing;