import Institutes from "@/db/models/Institutes";
import ProfileInstitutes from "@/db/models/ProfileInstitutes";
import Profiles from "@/db/models/Profiles";
import Routines from "@/db/models/Routines";

export type LocalInstituteData = Institutes;

export type LocalProfileInstitutesData = ProfileInstitutes;

export type LocalProfilesData = Profiles;

export type LocalRoutinesData = Routines;

export interface RawProfileSyncRecord {
  id: string;
  address: string | null;
  avatar_url: string | null;
  created_at: number;
  date_of_birth: string;
  deleted_at: number | null;
  full_name: string;
  gender: string;
  phone: string;
  username: string;
  updated_at: number;
}

export interface RawProfileInstituteSyncRecord {
  id: string;
  allowed_units: string | null;
  created_at: number;
  deleted_at: number | null;
  institute_id: string;
  profile_id: string;
  reviewed_at: number | null;
  reviewed_by: string | null;
  role: string;
  status: string;
  updated_at: number;
}

export interface RawInstituteSyncRecord {
  id: string;
  address: string | null;
  affiliated_university: string;
  code: string;
  created_at: number;
  deleted_at: number | null;
  name: string;
  type: string;
  updated_at: number;
}

export interface RawRoutineSyncRecord {
  id: string;
  batch_and_section: string;
  created_at: number;
  days: string;
  deleted_at: number | null;
  end_time: string;
  grade_id: string | null;
  institute_id: string;
  program_id: string | null;
  semester_id: string | null;
  start_time: string;
  stream_id: string | null;
  subject_id: string;
  teacher_id: string;
  unit_id: string;
  updated_at: number;
}
