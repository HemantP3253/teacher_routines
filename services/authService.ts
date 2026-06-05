import { supabase } from "./supabase";

export const getCurrentUserId = async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error while fetching user information: ", authError.message);
    return;
  }

  if (authData?.user?.id) {
    return authData.user.id;
  } else {
    console.error("User doesn't exist");
    return;
  }
};

export const getUserProfileById = async (userId: string) => {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    return;
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
};
