import { database } from "@/db";
import { useAuthStore } from "@/store/useAuthStore";
import { LogInProps, UserType } from "@/types/common";
import { supabase } from "./supabase";

import {
  LocalInstituteData,
  LocalProfileInstitutesData,
  LocalProfilesData,
} from "@/types/localDbTypes";
import { getProfileInstituteId } from "@/utils/profileInstituteUtils";

export const getCurrentUserId = async (): Promise<string | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user.id;
};

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out: ", error.message);
    }

    const { setUserId, setCurrentInstituteId, setUserRole } =
      useAuthStore.getState();

    setUserId(null);
    setCurrentInstituteId(null);
    setUserRole(null);

    // TODO: Remove watermelon DB records later on
  } catch (error) {
    console.error("Unexpected error while logging out: ", error);
  }
};

export async function handleLogin(
  loginData: LogInProps,
  type: "password",
): Promise<{ success: boolean; message?: string }>;

export async function handleLogin(loginData: LogInProps, type: "password") {
  try {
    const { setUserId, setCurrentInstituteId, setUserRole } =
      useAuthStore.getState();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.usernameOrEmail,
      password: loginData.password,
    });

    if (error || !data.user) {
      setUserId(null);
      return { success: false, message: error?.message || "Login failed." };
    }

    const authUser = data.user;
    setUserId(authUser.id);

    const { data: memberData, error: memberError } = await supabase
      .from("profile_institutes")
      .select(
        "*, profile:profiles!profile_id(*), institute:institutes!institute_id(*)",
      )
      .eq("profile_id", authUser.id);

    if (memberError) {
      console.error(
        "Failed to fetch user memberships from server:",
        memberError,
      );
    }

    if (!memberData || memberData.length === 0) {
      setUserRole(null);
      setCurrentInstituteId(null);
      return { success: true };
    }

    const adminMembership = memberData?.find(
      (membership) =>
        membership.role === "institute_admin" ||
        membership.role === "department_admin",
    );
    const targetMembership = adminMembership || memberData[0];

    // 2. Perform local WatermelonDB writes atomically
    await database.write(async () => {
      const profilesCollection = database.get<LocalProfilesData>("profiles");
      const institutesCollection =
        database.get<LocalInstituteData>("institutes");
      const profileInstitutesCollection =
        database.get<LocalProfileInstitutesData>("profile_institutes");

      if (!memberData || memberData.length === 0) return;

      // 1. Sync the Profile (take it from the first row since it's the same user)
      const supabaseProfile = memberData[0].profile;
      if (supabaseProfile) {
        try {
          const existingProfile = await profilesCollection.find(authUser.id);
          await existingProfile.update((profile) => {
            profile.username = supabaseProfile.username;
            profile.avatarUrl = supabaseProfile.avatar_url;
            profile.dateOfBirth = supabaseProfile.date_of_birth;
            profile.fullName = supabaseProfile.full_name;
            profile.gender = supabaseProfile.gender;
            profile.phone = supabaseProfile.phone;
            profile.address = supabaseProfile.address;

            profile.createdAt = new Date(supabaseProfile.created_at);
            profile.updatedAt = new Date(supabaseProfile.updated_at);
            profile.deletedAt = supabaseProfile.deleted_at
              ? new Date(supabaseProfile.deleted_at)
              : null;
          });
        } catch {
          await profilesCollection.create((profile) => {
            profile._raw.id = supabaseProfile.id;
            profile.username = supabaseProfile.username;
            profile.avatarUrl = supabaseProfile.avatar_url;
            profile.dateOfBirth = supabaseProfile.date_of_birth;
            profile.fullName = supabaseProfile.full_name;
            profile.gender = supabaseProfile.gender;
            profile.phone = supabaseProfile.phone;
            profile.address = supabaseProfile.address;

            profile.createdAt = new Date(supabaseProfile.created_at);
            profile.updatedAt = new Date(supabaseProfile.updated_at);
            profile.deletedAt = supabaseProfile.deleted_at
              ? new Date(supabaseProfile.deleted_at)
              : null;
          });
        }
      }

      // 2. Loop through every institute and sync them locally
      for (const row of memberData) {
        const supabaseInstitute = row.institute;

        // Upsert Institute
        if (supabaseInstitute) {
          try {
            const existingInst = await institutesCollection.find(
              supabaseInstitute.id,
            );
            await existingInst.update((inst) => {
              inst.name = supabaseInstitute.name;
              inst.affiliatedUniversity =
                supabaseInstitute.affiliated_university;
              inst.code = supabaseInstitute.code;
              inst.type = supabaseInstitute.type;
              inst.address = supabaseInstitute.address;

              inst.createdAt = new Date(supabaseInstitute.created_at);
              inst.updatedAt = new Date(supabaseInstitute.updated_at);
              inst.deletedAt = supabaseInstitute.deleted_at
                ? new Date(supabaseInstitute.deleted_at)
                : null;
            });
          } catch {
            await institutesCollection.create((inst) => {
              inst._raw.id = supabaseInstitute.id;
              inst.name = supabaseInstitute.name;
              inst.code = supabaseInstitute.code;
              inst.type = supabaseInstitute.type;
              inst.address = supabaseInstitute.address;

              inst.createdAt = new Date(supabaseInstitute.created_at);
              inst.updatedAt = new Date(supabaseInstitute.updated_at);
              inst.deletedAt = supabaseInstitute.deleted_at
                ? new Date(supabaseInstitute.deleted_at)
                : null;
            });
          }
        }

        // Upsert ProfileInstitute Relation
        try {
          const existingRel = await profileInstitutesCollection.find(
            getProfileInstituteId(row.profile_id, row.institute_id),
          );

          await existingRel.update((rel) => {
            rel.profileId = row.profile_id;
            rel.allowedUnits = row.allowed_units;
            rel.reviewedAt = row.reviewed_at ? new Date(row.reviewed_at) : null;
            rel.reviewedBy = row.reviewed_by;
            rel.instituteId = row.institute_id;
            rel.role = row.role;
            rel.status = row.status;

            rel.createdAt = new Date(row.created_at);
            rel.updatedAt = new Date(row.updated_at);
            rel.deletedAt = row.deleted_at ? new Date(row.deleted_at) : null;
          });
        } catch {
          await profileInstitutesCollection.create((rel) => {
            rel._raw.id = getProfileInstituteId(
              row.profile_id,
              row.institute_id,
            );
            rel.profileId = row.profile_id;
            rel.allowedUnits = row.allowed_units;
            rel.reviewedAt = row.reviewed_at ? new Date(row.reviewed_at) : null;
            rel.reviewedBy = row.reviewed_by;
            rel.instituteId = row.institute_id;
            rel.role = row.role;
            rel.status = row.status;

            rel.createdAt = new Date(row.created_at);
            rel.updatedAt = new Date(row.updated_at);
            rel.deletedAt = row.deleted_at ? new Date(row.deleted_at) : null;
          });
        }
      }
    });

    // 3. Set store states: userId and default active institute if available
    setUserRole((targetMembership?.role as UserType) || null);
    setCurrentInstituteId(targetMembership?.institute_id || null);

    return { success: true };
  } catch (error: any) {
    console.log(
      `Error while logging in. Type of login: [${type}]`,
      error?.message ?? error,
    );
    return { success: false, message: "An unexpected error occurred." };
  }
}
