-- ==========================================
-- 1. SEED AUTH USERS (15 Users with Unique UUIDs)
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
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin.mmc@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 2. Department Admin 1 (BCA)
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'deptadmin.bca@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 3. Department Admin 2 (BBS)
  (
    '33333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'deptadmin.bbs@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 4. Teacher 1
  (
    '44444444-4444-4444-8444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.ram@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 5. Teacher 2
  (
    '55555555-5555-4555-8555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.shyam@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 6. Teacher 3
  (
    '66666666-6666-4666-8666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.gita@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 7. Teacher 4
  (
    '77777777-7777-4777-8777-777777777777',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.hari@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 8. Teacher 5
  (
    '88888888-8888-4888-8888-888888888888',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.rita@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 9. Teacher 6
  (
    '99999999-9999-4999-8999-999999999999',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.madan@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 10. Teacher 7
  (
    'a1a1a1a1-a1a1-4a1a-8a1a-a1a1a1a1a1a1',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.sita@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 11. Teacher 8
  (
    'b2b2b2b2-b2b2-4b2b-8b2b-b2b2b2b2b2b2',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.laxmi@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 12. Teacher 9
  (
    'c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.bibek@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 13. Teacher 10
  (
    'd4d4d4d4-d4d4-4d4d-8d4d-d4d4d4d4d4d4',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher.puja@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 14. Student 1
  (
    'e5e5e5e5-e5e5-4e5e-8e5e-e5e5e5e5e5e5',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'student.niraj@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ),
  -- 15. Student 2
  (
    'f6f6f6f6-f6f6-4f6f-8f6f-f6f6f6f6f6f6',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'student.anisha@nepalgunj.edu.np',
    crypt('Password123@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  )
on conflict (id) do update set
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = now();


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
  ('11111111-1111-4111-8111-111111111111', 'admin_mmc', 'Bikash Adhikari', '1980-05-12', 'Male', '+9779800000001', 'Surkhet Road, Nepalgunj', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
  ('22222222-2222-4222-8222-222222222222', 'deptadmin_bca', 'Suman Karki', '1985-08-20', 'Male', '+9779800000002', 'Dhapani, Nepalgunj', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
  ('33333333-3333-4333-8333-333333333333', 'deptadmin_bbs', 'Anita Shrestha', '1988-02-14', 'Female', '+9779800000003', 'Sadashivapur, Nepalgunj', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
  ('44444444-4444-4444-8444-444444444444', 'teacher_ram', 'Ram Prasad Sharma', '1990-11-05', 'Male', '+9779800000004', 'Banke Road, Nepalgunj', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  ('55555555-5555-4555-8555-555555555555', 'teacher_shyam', 'Shyam Kumar Verma', '1991-03-12', 'Male', '+9779800000005', 'Rani Talau, Nepalgunj', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'),
  ('66666666-6666-4666-8666-666666666666', 'teacher_gita', 'Gita Devi Upadhyay', '1992-07-25', 'Female', '+9779800000006', 'Buspark Line, Nepalgunj', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'),
  ('77777777-7777-4777-8777-777777777777', 'teacher_hari', 'Hari Bahadur Khatri', '1989-09-30', 'Male', '+9779800000007', 'Ganeshpur, Nepalgunj', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'),
  ('88888888-8888-4888-8888-888888888888', 'teacher_rita', 'Rita Chaudhary', '1993-12-04', 'Female', '+9779800000008', 'Jumli Galli, Nepalgunj', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
  ('99999999-9999-4999-8999-999999999999', 'teacher_madan', 'Madan Bhandari', '1987-04-18', 'Male', '+9779800000009', 'Birendranagar Marg, Nepalgunj', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'),
  ('a1a1a1a1-a1a1-4a1a-8a1a-a1a1a1a1a1a1', 'teacher_sita', 'Sita Poudel', '1994-06-15', 'Female', '+9779800000010', 'Sharada Nagar, Nepalgunj', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'),
  ('b2b2b2b2-b2b2-4b2b-8b2b-b2b2b2b2b2b2', 'teacher_laxmi', 'Laxmi Prasad Devkota', '1986-10-10', 'Male', '+9779800000011', 'Dhapani, Nepalgunj', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61'),
  ('c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3', 'teacher_bibek', 'Bibek Thapa', '1995-01-22', 'Male', '+9779800000012', 'Surkhet Road, Nepalgunj', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91'),
  ('d4d4d4d4-d4d4-4d4d-8d4d-d4d4d4d4d4d4', 'teacher_puja', 'Puja Koirala', '1996-08-09', 'Female', '+9779800000013', 'Khajura Road, Nepalgunj', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
  ('e5e5e5e5-e5e5-4e5e-8e5e-e5e5e5e5e5e5', 'student_niraj', 'Niraj Malla', '2004-02-11', 'Male', '+9779800000014', 'Rani Talau, Nepalgunj', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'),
  ('f6f6f6f6-f6f6-4f6f-8f6f-f6f6f6f6f6f6', 'student_anisha', 'Anisha KC', '2005-09-19', 'Female', '+9779800000015', 'Tribhuvan Chowk, Nepalgunj', 'https://images.unsplash.com/photo-1517841905240-472988babdf9')
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
  -- Main Admin (reviewed_by points to admin's new unique UUID)
  ('11111111-1111-4111-8111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'institute_admin', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  
  -- Department Admins
  ('22222222-2222-4222-8222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'department_admin', 'approved', ARRAY['BCA'], '11111111-1111-4111-8111-111111111111', now()),
  ('33333333-3333-4333-8333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'department_admin', 'approved', ARRAY['BBS'], '11111111-1111-4111-8111-111111111111', now()),

  -- 10 Teachers
  ('44444444-4444-4444-8444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('55555555-5555-4555-8555-555555555555', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('66666666-6666-4666-8666-666666666666', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('77777777-7777-4777-8777-777777777777', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('88888888-8888-4888-8888-888888888888', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('99999999-9999-4999-8999-999999999999', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('a1a1a1a1-a1a1-4a1a-8a1a-a1a1a1a1a1a1', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('b2b2b2b2-b2b2-4b2b-8b2b-b2b2b2b2b2b2', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('d4d4d4d4-d4d4-4d4d-8d4d-d4d4d4d4d4d4', 'd1111111-1111-1111-1111-111111111111', 'teacher', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),

  -- 2 Students
  ('e5e5e5e5-e5e5-4e5e-8e5e-e5e5e5e5e5e5', 'd1111111-1111-1111-1111-111111111111', 'student', 'approved', null, '11111111-1111-4111-8111-111111111111', now()),
  ('f6f6f6f6-f6f6-4f6f-8f6f-f6f6f6f6f6f6', 'd1111111-1111-1111-1111-111111111111', 'student', 'approved', null, '11111111-1111-4111-8111-111111111111', now())
on conflict (profile_id, institute_id) do nothing;