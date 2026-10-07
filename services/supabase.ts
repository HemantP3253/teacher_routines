import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { storage } from "../utils/storage";

const mmkvSupabaseStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.setString(key, value),
  removeItem: (key: string) => storage.delete(key),
};
const host = Constants.expoConfig?.hostUri?.split(":")[0];

if (!host) {
  throw new Error("Could not determine Expo development server host.");
}

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseUrl = `http://${host}:${54321}`;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvSupabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
