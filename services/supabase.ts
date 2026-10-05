import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";
import { storage } from "../utils/storage";

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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvSupabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
