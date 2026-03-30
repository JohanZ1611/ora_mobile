import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

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

import { queryClient } from "@lib/queryClient";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" backgroundColor="#F5F0E8" />
      </View>
    </QueryClientProvider>
  );
}