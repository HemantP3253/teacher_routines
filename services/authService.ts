import { database } from "@/db";
import { useAuthStore } from "@/store/useAuthStore";
import { LogInProps, UserType } from "@/types/common";
import {
  LocalInstituteData,
  LocalProfileInstitutesData,
  LocalProfilesData,
} from "@/types/localDbTypes";
import { mapInstituteData } from "@/utils/mappers/instituteMapper";
import { mapProfileInstituteData } from "@/utils/mappers/profileInstitutesMapper";
import { mapProfileData } from "@/utils/mappers/profileMapper";
import { getProfileInstituteId } from "@/utils/profileInstituteUtils";
import { supabase } from "./supabase";

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

      // 1. Sync the Profile (take it from the first profileInstitute since it's the same user)
      const supabaseProfile = memberData[0].profile;
      if (supabaseProfile) {
        try {
          const existingProfile = await profilesCollection.find(authUser.id);
          await existingProfile.update((localProfile) => {
            mapProfileData(supabaseProfile, localProfile);
          });
        } catch {
          await profilesCollection.create((localProfile) => {
            localProfile._raw.id = supabaseProfile.id;
            mapProfileData(supabaseProfile, localProfile);
          });
        }
      }

      // 2. Loop through every institute and sync them locally
      for (const profileInstitute of memberData) {
        const supabaseInstitute = profileInstitute.institute;

        // Upsert Institute
        if (supabaseInstitute) {
          try {
            const existingInst = await institutesCollection.find(
              supabaseInstitute.id,
            );
            await existingInst.update((localInstitute) => {
              mapInstituteData(supabaseInstitute, localInstitute);
            });
          } catch {
            await institutesCollection.create((localInstitute) => {
              localInstitute._raw.id = supabaseInstitute.id;
              mapInstituteData(supabaseInstitute, localInstitute);
            });
          }
        }

        // Upsert ProfileInstitute Relation
        try {
          const existingProfileInstitute =
            await profileInstitutesCollection.find(
              getProfileInstituteId(
                profileInstitute.profile_id,
                profileInstitute.institute_id,
              ),
            );

          await existingProfileInstitute.update((localProfileInstitute) => {
            mapProfileInstituteData(profileInstitute, localProfileInstitute);
          });
        } catch {
          await profileInstitutesCollection.create((localProfileInstitute) => {
            localProfileInstitute._raw.id = getProfileInstituteId(
              profileInstitute.profile_id,
              profileInstitute.institute_id,
            );
            mapProfileInstituteData(profileInstitute, localProfileInstitute);
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
