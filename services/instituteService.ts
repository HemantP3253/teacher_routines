import { Tables } from "@/types/database";
import { getCurrentUserId } from "./authService";
import { supabase } from "./supabase";

type InstituteData = Tables<"institutes">;

export const fetchAllInstitutes = async (): Promise<InstituteData[]> => {
  try {
    const { data, error } = await supabase.from("institutes").select("*");

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error(
      "[fetchAllInstitutes] Failed to fetch all institutes: ",
      error,
    );
    throw error;
  }
};

export const getCurrentUserInstitutes = async (): Promise<InstituteData[]> => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return [];
  }

  const { data, error } = await supabase
    .from("profile_institutes")
    .select(`institute:institutes (*)`)
    .eq("profile_id", currentUserId);

  if (error) {
    console.error(
      "Unexpected error while fetching current user institutes:",
      error.message,
    );
    throw error;
  }

  return (
    data
      ?.map(({ institute }) => institute)
      .filter((institute) => institute !== null) ?? []
  );
};
