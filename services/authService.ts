import { LogInProps } from "@/types/common";
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
): Promise<any>;

export async function handleLogin(loginData: LogInProps, type: "password") {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.usernameOrEmail,
      password: loginData.password,
    });

    if (error instanceof Error) return error.message;
    else if (error) return "Something went wrong. Please try again later.";
  } catch (error: any) {
    console.log(
      `Error while logging in. Type of login: [${type}]`,
      error.message,
    );
  }
}
