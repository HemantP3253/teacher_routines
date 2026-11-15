import { database } from "@/db";
import { useAuthStore } from "@/store/useAuthStore";
import { LocalProfilesData } from "@/types/localDbTypes";
import { Q } from "@nozbe/watermelondb";

const profilesCollection = database.get<LocalProfilesData>("profiles");

interface GetProfilesOptions {
  preFetchedProfiles?: LocalProfilesData[];
  userStatus?: "pending" | "rejected" | "approved";
  limitCount?: number;
}

export const getAllProfiles = async (): Promise<LocalProfilesData[]> => {
  try {
    const { userId } = useAuthStore.getState();

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

export const getProfileById = async (
  userId: string,
): Promise<LocalProfilesData | null> => {
  try {
    const profile = await profilesCollection.find(userId);

    return profile;
  } catch (error) {
    console.error("[getProfileById] Error getting profile: ", error);
    return null;
  }
};
