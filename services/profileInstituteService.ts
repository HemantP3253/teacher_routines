import { database } from "@/db";
import { LocalProfileInstitutesData } from "@/types/localDbTypes";
import { Q } from "@nozbe/watermelondb";

/**
 * Fetches the current user membership from the database
 *
 * Uses the provided institute and profile to fetch the
 * current membership
 *
 * @param instituteId - the id (uuid) of the related institute
 * @param profileId - the id (uuid) of the related user
 * @returns an array of the user's membership to the institutes if it exists
 */
export const getUserInstituteMemberships = async (
  instituteId: string,
  profileId: string,
): Promise<LocalProfileInstitutesData | null> => {
  try {
    const profileInstitutesCollection =
      database.get<LocalProfileInstitutesData>("profile_institutes");

    const profileInstitutes = await profileInstitutesCollection
      .query(
        Q.where("institute_id", instituteId),
        Q.where("profile_id", profileId),
      )
      .fetch();

    return profileInstitutes[0] ?? null;
  } catch (error) {
    console.error(
      "[getUserInstituteMemberships] Failed to fetch current user institute memberships",
      error,
    );
    return null;
  }
};

/**
 * Fetches all memberships related to the provided institute
 *
 * Uses the institute id to get all the memberships of users
 * related to the institute
 *
 * @param id - unique identifier
 * @param type - the type of the id provided (use "institute" for filtering by institute id)
 * @returns an array of all the memberships related to the
 * given institute if it exists
 */
export function getAllMemberships(
  id: string,
  type: "institute",
): Promise<LocalProfileInstitutesData[]>;

/**
 * Fetches all memberships related to the provided user profile
 *
 * Uses the profile id to get all the memberships of the given user
 *
 * @param id - unique identifier
 * @param type - the type of the id provided (use "profile" for filtering by profile id)
 * @returns an array of all the memberships related to the
 * given user if it exists or null
 */
export function getAllMemberships(
  id: string,
  type: "profile",
): Promise<LocalProfileInstitutesData[]>;

export async function getAllMemberships(
  id: string,
  type: "institute" | "profile",
): Promise<LocalProfileInstitutesData[]> {
  try {
    const query =
      type === "institute"
        ? Q.where("institute_id", id)
        : Q.where("profile_id", id);

    const profileInstitutesCollection =
      database.get<LocalProfileInstitutesData>("profile_institutes");

    const profileInstitutes = await profileInstitutesCollection
      .query(query)
      .fetch();

    return profileInstitutes;
  } catch (error) {
    console.error(
      `[getAllMemberships] Failed to fetch current ${type} institute memberships`,
      error,
    );
    return [];
  }
}
