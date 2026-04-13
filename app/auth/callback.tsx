import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@services/google-auth.service";
import { useAuthStore } from "@stores/auth.store";
import { authService } from "@services/auth.service";
import { toast } from "sonner-native";

export default function AuthCallback() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // Intentar con la URL inicial primero
    Linking.getInitialURL().then((url) => {
      console.log("getInitialURL:", url);
      if (url) processUrl(url);
    });

    // Escuchar deep links en tiempo real
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("addEventListener url:", url);
      processUrl(url);
    });

    return () => subscription.remove();
  }, []);

  const processUrl = async (url: string) => {
    console.log("Procesando URL:", url);

    const hashPart = url.split("#")[1] ?? "";
    const queryPart = url.split("?")[1]?.split("#")[0] ?? "";

    const hashParams = new URLSearchParams(hashPart);
    const queryParams = new URLSearchParams(queryPart);

    const error = queryParams.get("error") || hashParams.get("error");
    if (error) {
      console.error("OAuth error:", queryParams.get("error_description"));
      toast.error("Error al iniciar sesión con Google");
      router.replace("/(auth)/login");
      return;
    }

    const accessToken = hashParams.get("access_token") || queryParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token") || queryParams.get("refresh_token") || "";
    const code = queryParams.get("code");

    console.log("accessToken:", !!accessToken, "refreshToken:", !!refreshToken, "code:", !!code);

    if (!accessToken && !code) {
      console.log("Sin token ni code — ignorando");
      return;
    }

    try {
      let session = null;

      if (accessToken) {
        const { data, error: sessError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessError) throw sessError;
        session = data.session;
      } else if (code) {
        const { data, error: exchError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchError) throw exchError;
        session = data.session;
      }

      console.log("Session user:", session?.user?.email);

      if (!session?.user) throw new Error("Sin sesión");

      const googleUser = session.user;

      try {
        const res = await authService.login({
          email: googleUser.email!,
          password: "google-oauth",
        });
        if (res.ok) {
          setAuth(res.data.token, {
            id: res.data.user.id,
            email: res.data.user.email ?? googleUser.email!,
            name: res.data.user.name ?? googleUser.user_metadata?.full_name ?? null,
            avatarUrl: googleUser.user_metadata?.avatar_url ?? null,
            currency: "COP",
          });
          router.replace("/(app)");
        }
      } catch {
        const name = googleUser.user_metadata?.full_name ?? "Usuario";
        await authService.register({
          email: googleUser.email!,
          password: `google_${googleUser.id}`,
          name,
        });
        const loginRes = await authService.login({
          email: googleUser.email!,
          password: `google_${googleUser.id}`,
        });
        if (loginRes.ok) {
          setAuth(loginRes.data.token, {
            id: loginRes.data.user.id,
            email: loginRes.data.user.email ?? googleUser.email!,
            name,
            avatarUrl: googleUser.user_metadata?.avatar_url ?? null,
            currency: "COP",
          });
          router.replace("/(app)");
        }
      }
    } catch (err: any) {
      console.error("Auth callback error:", err?.message ?? JSON.stringify(err));
      toast.error("Error al completar el inicio de sesión");
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F0E8" }}>
      <ActivityIndicator size="large" color="#A8896A" />
    </View>
  );
}