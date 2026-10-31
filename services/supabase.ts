import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";
// import Constants from "expo-constants";
import { storage } from "../utils/storage";

const mmkvSupabaseStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.setString(key, value),
  removeItem: (key: string) => storage.delete(key),
};
// const host = Constants.expoConfig?.hostUri?.split(":")[0];

// if (!host) {
//   throw new Error("Could not determine Expo development server host.");
// }

// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
// const supabaseUrl =
//   process.env.EXPO_PUBLIC_SUPABASE_URL || `http://${host}:54321`;

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: mmkvSupabaseStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// 2. Clear explicit warning configurations to prevent silent runtime failure states
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "MISCONFIGURATION: Supabase credentials are missing inside the phone's environment map.",
    {
      urlFound: !!supabaseUrl,
      keyFound: !!supabaseAnonKey,
    },
  );
}

// 3. Export the client securely using your verified environment mappings
export const supabase = createClient<Database>(
  supabaseUrl ?? "http://192.168.1.136:54321",
  supabaseAnonKey ?? "",
  {
    auth: {
      storage: mmkvSupabaseStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
