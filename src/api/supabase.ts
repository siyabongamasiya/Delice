import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = process.env
  .EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // It's okay to throw here; developer setup must provide env vars
  console.warn(
    "Supabase env vars missing: EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    // Only web uses URL redirects. On native we use openAuthSessionAsync + exchangeCodeForSession.
    detectSessionInUrl: Platform.OS === "web",
  },
});

export default supabase;
