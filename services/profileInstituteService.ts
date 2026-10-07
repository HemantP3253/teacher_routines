import { Tables } from "@/types/database";
import { supabase } from "./supabase";

/**
 * Fetches the current user membership from the database
 *
 * Uses the provided institute and profile to fetch the
 * current membership
 *
 * @param instituteId - the id (uuid) of the related institute
 * @param profileId - the id (uuid) of the related user
 * @returns a single object of the user's membership to an institute if it exists, or null
 */
export const getUserInstituteMembership = async (
  instituteId: string,
  profileId: string,
): Promise<Tables<"profile_institutes"> | null> => {
  const { data, error } = await supabase
    .from("profile_institutes")
    .select("*")
    .eq("institute_id", instituteId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    console.error(
      "[getUserInstituteMembership] Failed to fetch membership: ",
      error,
    );
    throw error;
  }

  return data;
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
 * given institute if it exists or null
 */
export function getAllMemberships(
  id: string,
  type: "institute",
): Promise<Tables<"profile_institutes">[] | null>;

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
): Promise<Tables<"profile_institutes">[] | null>;

export async function getAllMemberships(
  id: string,
  type: "institute" | "profile",
): Promise<Tables<"profile_institutes">[] | null> {
  let baseQuery = supabase.from("profile_institutes").select("*");
  baseQuery =
    type === "institute"
      ? baseQuery.eq("institute_id", id)
      : baseQuery.eq("profile_id", id);

  const { data, error } = await baseQuery;

  if (error) {
    console.error(
      "[getAllMembershipsByInstitute] Failed to fetch membership: ",
      error,
    );
    throw error;
  }

  return data;
}
