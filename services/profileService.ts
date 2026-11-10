import { database } from "@/db";
import { useAuthStore } from "@/store/useAuthStore";
import {
  LocalProfileInstitutesData,
  LocalProfilesData,
} from "@/types/localDbTypes";
import { getProfileInstituteId } from "@/utils/profileInstituteUtils";
import { Q } from "@nozbe/watermelondb";

interface GetProfilesOptions {
  preFetchedProfiles?: LocalProfilesData[];
  userStatus?: "pending" | "rejected" | "approved";
  limitCount?: number;
}

export const getAllProfiles = async (): Promise<LocalProfilesData[]> => {
  try {
    const { userId } = useAuthStore.getState();
    const profilesCollection = database.get<LocalProfilesData>("profiles");

    const profiles = await profilesCollection
      .query(Q.where("id", Q.notEq(userId)), Q.sortBy("updated_at", "desc"))
      .fetch();

    return profiles;
  } catch (error) {
    console.error("[getAllProfiles] Error while getting profiles: ", error);
    return [];
  }
};

export const getProfilesByStatus = async ({
  userStatus = "pending",
  limitCount,
}: GetProfilesOptions): Promise<LocalProfilesData[]> => {
  try {
    const { currentInstituteId, userId } = useAuthStore.getState();
    if (!currentInstituteId) return [];

    const profilesCollection = database.get<LocalProfilesData>("profiles");

    const profiles = await profilesCollection
      .query(
        Q.on("profile_institutes", [
          Q.where("institute_id", currentInstituteId),
          Q.where("status", userStatus),
        ]),
        Q.where("profile_id", Q.notEq(userId)),
        Q.sortBy("updated_at", "desc"),
      )
      .fetch();

    const reducedProfiles = profiles.slice(0, limitCount);

    return reducedProfiles;
  } catch (error) {
    console.error(
      "[getProfilesByStatus] Error while getting profiles by status: ",
      error,
    );
    return [];
  }
};

export const getUserProfileById = async (
  userId: string,
): Promise<LocalProfilesData | null> => {
  try {
    const profilesCollection = database.get<LocalProfilesData>("profiles");

    const profile = await profilesCollection.find(userId);

    return profile;
  } catch (error) {
    console.error("[getUserProfileById] Error getting profile: ", error);
    return null;
  }
};

export const updateDbUserStatus = async (
  profileId: string,
  newStatus: "approved" | "rejected" | "pending",
): Promise<void> => {
  try {
    const { currentInstituteId } = useAuthStore.getState();
    if (!currentInstituteId || !profileId) return;

    const profileInstitutesCollection =
      database.get<LocalProfileInstitutesData>("profile_institutes");

    await database.write(async () => {
      const profileInstitutesRecord = await profileInstitutesCollection.find(
        getProfileInstituteId(profileId, currentInstituteId),
      );

      await profileInstitutesRecord.update((profileInstitutes) => {
        profileInstitutes.status = newStatus;
      });
    });
  } catch (error) {
    console.error(
      `[updateUserStatus] Error while setting status of ${profileId} to ${newStatus}: `,
      error,
    );
  }
};
