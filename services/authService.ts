import { Tables } from "@/types/database";
import { supabase } from "./supabase";

export const getCurrentUserId = async (): Promise<string | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user.id;
};

export const getUserProfileById = async (
  userId: string,
): Promise<Tables<"profiles"> | null> => {
  if (!userId) return null;

  const { data: userProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      `[getUserProfileById] Failed to fetch profile for ${userId}: `,
      error,
    );
    return null;
  }

  return userProfile;
};
