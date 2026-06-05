import { CollegeData } from "@/interfaces/interfaces";
import { getUserProfileById } from "./authService";
import { supabase } from "./supabase";

export const fetchColleges = async (): Promise<CollegeData[]> => {
  try {
    const { data, error } = await supabase
      .from("colleges")
      .select("id, university, college_code, college_name, address");

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error("Unexpected error while fetching colleges: ", error.message);
    throw error;
  }
};

export const getCurrentAdminCollege = async (): Promise<CollegeData[]> => {
  try {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) return [];

    const currentUser = await getUserProfileById(currentUserId);
    if (!currentUser) return [];

    if (!currentUser.is_admin) return [];

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("authorized_users", currentUserId);

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error(
      "Unexpected error while fetching current user college: ",
      error.message,
    );
    throw error;
  }
};
