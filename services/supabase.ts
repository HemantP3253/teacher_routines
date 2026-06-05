import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { storage } from "./../utils/storage";

const hostUri =
  Constants.expoConfig?.hostUri ||
  (Constants as any).manifest2?.extra?.expoGoQuickstartUri ||
  "";
const pcIPAddress = hostUri ? hostUri.split(":")[0] : "localhost";

const supabaseUrl = `http://${pcIPAddress}:54321`;
const supabaseAnonKey = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

const supabaseStorage = {
  getItem: async (key: string) => {
    const value = storage.getString(key);

    return value ?? null;
  },

  setItem: async (key: string, value: string) => {
    storage.setString(key, value);
  },

  removeItem: async (key: string) => {
    storage.delete(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
