import { Tables } from "@/types/database";
import { supabase } from "./supabase";

type ProfileData = Tables<"profiles">;

export const getProfilesByStatus = async (
  userStatus: "pending" | "rejected" | "approved" | "all" = "pending",
  instituteId: string,
  limitCount: number = 3,
): Promise<ProfileData[]> => {
  let query = supabase
    .from("profile_institutes")
    .select(
      `
      profile:profiles!profile_institutes_profile_id_fkey (*)
    `,
    )
    .eq("institute_id", instituteId);

  if (userStatus !== "all") {
    query = query.eq("status", userStatus);
  }

  const { data, error } = await query
    .order("created_at", { ascending: true })
    .limit(limitCount);

  if (error) {
    console.error(
      "[getProfilesByStatus] Failed to fetch user profiles:",
      error,
    );
    throw error;
  }

  return data
    .map(({ profile }) => profile)
    .filter((profile) => profile !== null);
};

export const updateUserStatus = async (
  profileId: string,
  instituteId: string,
  newStatus: "approved" | "rejected" | "pending",
) => {
  if (!instituteId || !profileId) return;

  const { error } = await supabase
    .from("profile_institutes")
    .update({ status: newStatus })
    .eq("profile_id", profileId)
    .eq("institute_id", instituteId);

  if (error) {
    console.error(`[userAction] Error updating user profile: `, error);
    throw error;
  }
};
