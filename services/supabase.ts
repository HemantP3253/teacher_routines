import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const hostUri =
  Constants.expoConfig?.hostUri ||
  (Constants as any).manifest2?.extra?.expoGoQuickstartUri ||
  "";
const pcIPAddress = hostUri ? hostUri.split(":")[0] : "localhost";

const supabaseUrl = `http://${pcIPAddress}:54321`;

const supabaseAnonKey = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
