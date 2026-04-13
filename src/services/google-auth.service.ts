import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { createClient } from "@supabase/supabase-js";

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  const redirectUrl = AuthSession.makeRedirectUri({
    scheme: "ora",
    path: "auth/callback",
  });

  console.log("Redirect URL:", redirectUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
      queryParams: {
        response_type: "token", // fuerza implicit flow
      },
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("No OAuth URL");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
  
  // El manejo real ocurre en app/auth/callback.tsx
  // Solo retornamos si fue cancelado
  if (result.type === "cancel" || result.type === "dismiss") {
    return null;
  }
  
  return result;
};