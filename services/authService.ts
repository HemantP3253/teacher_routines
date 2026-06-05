import { supabase } from "./supabase";

export const getCurrentUserId = async (): Promise<string | undefined> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return undefined;
    }

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.warn(
        "Auth token validation pending or failed: ",
        authError.message,
      );
      return session.user.id;
    }

    return authData?.user?.id || session.user.id;
  } catch (err: any) {
    console.error(
      "Exception thrown inside getCurrentUserId helper:",
      err.message,
    );
    return undefined;
  }
};

export const getUserProfileById = async (userId: string) => {
  if (!userId) return undefined;

  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error(
        `Database error fetching profile for ${userId}:`,
        profileError.message,
      );
      return undefined;
    }

    if (profileData) {
      return {
        id: userId,
        username: profileData.username,
        full_name: profileData.full_name,
        date_of_birth: profileData.date_of_birth,
        colleges: profileData.colleges,
        address: profileData.address,
        gender: profileData.gender,
        phone: profileData.phone,
        avatar_url: profileData.avatar_url,
        is_admin: profileData.is_admin,
        approved_by: profileData.approved_by,
        rejected_by: profileData.rejected_by,
      };
    }

    return undefined;
  } catch (err: any) {
    console.error("Unexpected error in getUserProfileById:", err.message);
    return undefined;
  }
};
