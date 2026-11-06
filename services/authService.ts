import { LogInProps } from "@/types/common";
import { Tables } from "@/types/database";
import { ProfilesData } from "@/types/supabaseTypes";
import { storage } from "@/utils/storage";
import { supabase } from "./supabase";

const USER_ID_KEY = "userId";
const USER_PROFILE_KEY = "userProfile";

/**
 * Get the stored auth key for the user
 *
 * Uses the MMKV storage to get the saved auth key for the user.
 *
 * @returns the auth key saved in mmkv storage or null value
 */
export const getStoredUserId = (): string | null =>
  storage.getString(USER_ID_KEY) ?? null;

/**
 * Save the user ID into MMKV storage
 *
 * @param userId - the user ID to save into MMKV storge
 */
export const setStoredUserId = (userId: string): void =>
  storage.setString(USER_ID_KEY, userId);

/**
 * Clear the user ID from MMKV storage on logout
 */
export const clearStoredUserId = (): void => storage.delete(USER_ID_KEY);

export const getStoredUserProfile = (): ProfilesData | null => {
  try {
    const value = storage.getString(USER_PROFILE_KEY);

    if (!value) return null;

    return JSON.parse(value) as ProfilesData;
  } catch (error) {
    console.error("Failed to read cached user profile: ", error);

    storage.delete(USER_PROFILE_KEY);

    return null;
  }
};

/**
 * Save the user profile into MMKV storage
 *
 * @param profile - the user profile to store into MMKV storage
 */
export const setStoredUserProfile = (profile: ProfilesData | null): void =>
  storage.setString(USER_PROFILE_KEY, JSON.stringify(profile));

export const clearStoredUserProfile = () => storage.delete(USER_PROFILE_KEY);

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

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out: ", error.message);
    }
  } catch (error) {
    console.error("Unexpected error while logging out: ", error);
  }
};

export async function handleLogin(
  loginData: LogInProps,
  type: "password",
): Promise<{ success: boolean; message?: string }>;

export async function handleLogin(loginData: LogInProps, type: "password") {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.usernameOrEmail,
      password: loginData.password,
    });

    if (error) {
      // Supabase errors have a .message property directly on the error object
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.log(
      `Error while logging in. Type of login: [${type}]`,
      error?.message ?? error,
    );
    return { success: false, message: "An unexpected error occurred." };
  }
}
