import { Tables } from "./database";

export type InstituteData = Tables<"institutes">;

export type InstituteMember = ProfileInstitutesData & {
  profile: ProfilesData;
};

export type ProfileInstitutesData = Tables<"profile_institutes">;

export type ProfilesData = Tables<"profiles">;

export type RoutinesData = Tables<"routines">;
