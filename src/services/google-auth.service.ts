import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabaseClient } from "./supabase-client";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectUrl = AuthSession.makeRedirectUri({ scheme: "ora" });

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type !== "success") return null;

  const url = new URL(result.url);
  const accessToken = url.searchParams.get("access_token") ??
    url.hash.split("access_token=")[1]?.split("&")[0];

  return accessToken ?? null;
}