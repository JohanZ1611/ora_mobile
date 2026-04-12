import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { createClient } from "@supabase/supabase-js";

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  // En Expo Go esto genera exp://TU_IP:8081 — ese es el redirect correcto
  const redirectUrl = AuthSession.makeRedirectUri({
    scheme: "ora",
    path: "auth/callback",
  });

  console.log("Redirect URL:", redirectUrl); // Verifica que sea exp://... en Expo Go

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("No OAuth URL returned");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type !== "success") return null;

  // Parsear tanto hash (#) como query (?) — Supabase puede usar cualquiera
  const url = result.url;
  const hashPart = url.split("#")[1] ?? "";
  const queryPart = url.split("?")[1]?.split("#")[0] ?? "";
  const params = new URLSearchParams(hashPart || queryPart);

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token") ?? "";

  if (!accessToken) {
    // A veces Supabase devuelve un code en vez de token (PKCE flow)
    const code = params.get("code");
    if (code) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) throw sessionError;
      return sessionData;
    }
    throw new Error("No access_token ni code en el callback");
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

  if (sessionError) throw sessionError;
  return sessionData;
};