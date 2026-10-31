// UNUSED
interface ThemedClassCardProps {
  class: {
    degreeName: string;
    semester?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    section?: string;
    year?: 1 | 2 | 3 | 4;
    totalYears: 1 | 2 | 3 | 4 | 5;
  };
  durationInMinutes?: number;
  startTime: string;
  subject: string;
}

interface SignUpProps {
  name: string;
  dateOfBirth: string;
  gender: genderType;
  username: string;
  email: string;
  address: string | null;
  password: string;
  confirmPassword: string;
  phone: string;
  hasError: boolean;
}

interface SignUpErrorProps {
  name: string;
  dateOfBirth: string;
  gender: string;
  username: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface LogInProps {
  usernameOrEmail: string;
  password: string;
  is_admin: boolean;
  error?: boolean;
}

interface LogInErrorProps {
  usernameOrEmail: string;
  password: string;
}

// TODO: Unused interfaces, but keeping them for future use
interface degreeQuery {
  level: level;
  faculty?: string;
  degreeType?: string;
  degreeName?: string;
  branch?: string;
  term?: string;
  subjects?: string;
}

// TODO: Used in signupform, needs to be removed
interface InstituteData {
  id: string;
  name: string;
  type: string;
  code: string;
  address: string | null;
  affiliated_university: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
