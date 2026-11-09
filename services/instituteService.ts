import { database } from "@/db";
import { useAuthStore } from "@/store/useAuthStore";
import { LocalInstituteData } from "@/types/localDbTypes";
import { Q } from "@nozbe/watermelondb";

export const fetchAllInstitutes = async (): Promise<LocalInstituteData[]> => {
  try {
    const institutesCollection = database.get<LocalInstituteData>("institutes");

    const localInstitutes = await institutesCollection.query().fetch();

    return localInstitutes;
  } catch (error: any) {
    console.error(
      "[fetchAllInstitutes] Failed to fetch all institutes: ",
      error,
    );
    return [];
  }
};

export const getCurrentUserInstitutes = async (): Promise<
  LocalInstituteData[]
> => {
  try {
    const { userId } = useAuthStore.getState();

    if (!userId) {
      console.warn(
        "[getCurrentUserInstitutes] No active user ID found in store.",
      );
      return [];
    }

    const institutesCollection = database.get<LocalInstituteData>("institutes");
    const userInstitutes = await institutesCollection
      .query(Q.where("profile_id", userId))
      .fetch();

    return userInstitutes;
  } catch (error) {
    console.error(
      "[getCurrentUserInstitutes] Failed to fetch current user institutes",
      error,
    );
    return [];
  }
};
