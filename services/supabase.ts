import { createClient } from "@supabase/supabase-js";
import { storage } from "../utils/storage";

// 2. Create the custom storage adapter required by Supabase Auth
const mmkvSupabaseStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.setString(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

const supabaseUrl = "http://127.0.0.1:54321";
const supabaseAnonKey = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

// 3. Pass MMKV adapter into Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvSupabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Critical for React Native / Expo
  },
});
