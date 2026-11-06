import Institutes from "@/db/models/Institutes";
import ProfileInstitutes from "@/db/models/ProfileInstitutes";
import Profiles from "@/db/models/Profiles";
import Routines from "@/db/models/Routines";

export type LocalInstituteData = Institutes;

export type LocalInstituteMember = LocalProfileInstitutesData & {
  profile: LocalProfilesData;
};

export type LocalProfileInstitutesData = ProfileInstitutes;

export type LocalProfilesData = Profiles;

export type LocalRoutinesData = Routines;
