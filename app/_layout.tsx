import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Toaster } from "sonner-native";

import { queryClient } from "@lib/queryClient";
import { useAuthStore } from "@stores/auth.store";
import { supabase } from "@services/google-auth.service";
import { authService } from "@services/auth.service";

import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, setAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";
    if (!inAuthGroup && !inAppGroup) return;
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [isAuthenticated, segments]);

  // Google OAuth deep link handler
  useEffect(() => {
    const handleUrl = async (url: string) => {
      console.log("Deep link recibido:", url);
      if (!url.includes("auth/callback")) return;

      const hashPart = url.split("#")[1] ?? "";
      const queryPart = url.split("?")[1]?.split("#")[0] ?? "";
      const hashParams = new URLSearchParams(hashPart);
      const queryParams = new URLSearchParams(queryPart);

      const error = queryParams.get("error") || hashParams.get("error");
      if (error) {
        console.error("OAuth error:", queryParams.get("error_description"));
        return;
      }

      const accessToken =
        hashParams.get("access_token") || queryParams.get("access_token");
      const refreshToken =
        hashParams.get("refresh_token") ||
        queryParams.get("refresh_token") ||
        "";

      console.log("accessToken:", !!accessToken);
      if (!accessToken) return;

      try {
        const { data, error: sessError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessError) throw sessError;

        const googleUser = data.session?.user;
        if (!googleUser?.email) throw new Error("Sin usuario");

        console.log("Google user:", googleUser.email);

        try {
          const res = await authService.login({
            email: googleUser.email,
            password: "google-oauth",
          });
          if (res.ok) {
            setAuth(res.data.token, {
              id: res.data.user.id,
              email: res.data.user.email ?? googleUser.email,
              name: res.data.user.name ?? googleUser.user_metadata?.full_name ?? null,
              avatarUrl: googleUser.user_metadata?.avatar_url ?? null,
              currency: res.data.user.currency ?? "COP",
            });
            router.replace("/(app)");
          }
        } catch {
          // Usuario nuevo — registrar
          const name = googleUser.user_metadata?.full_name ?? "Usuario";
          await authService.register({
            email: googleUser.email,
            password: `google_${googleUser.id}`,
            name,
          });
          const loginRes = await authService.login({
            email: googleUser.email,
            password: `google_${googleUser.id}`,
          });
          if (loginRes.ok) {
            setAuth(loginRes.data.token, {
              id: loginRes.data.user.id,
              email: loginRes.data.user.email ?? googleUser.email,
              name,
              avatarUrl: googleUser.user_metadata?.avatar_url ?? null,
              currency: "COP",
            });
            router.replace("/(app)");
          }
        }
      } catch (err: any) {
        console.error("Google auth error:", err?.message ?? err);
      }
    };

    // Listener para cuando la app ya está abierta
    const sub = Linking.addEventListener("url", ({ url }) => handleUrl(url));

    // URL inicial por si la app se abrió desde el deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => sub.remove();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
            <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
              <RootLayoutNav />
              <StatusBar style="dark" backgroundColor="#F5F0E8" />
              <Toaster />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}