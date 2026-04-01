import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@stores/auth.store";
import { COLORS } from "@constants/colors";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const lineWidth = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(app)");
        } else {
          router.replace("/(auth)/login");
        }
      }, 500);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.cream[100],
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 60,
      }}
    >
      <View />

      <Animated.View style={{ opacity, alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "DMSans_700Bold",
            fontSize: 64,
            color: COLORS.sand[300],
            letterSpacing: -1,
          }}
        >
          Ora
        </Text>
        <Text
          style={{
            fontFamily: "DMSans_300Light",
            fontSize: 16,
            color: COLORS.warm.muted,
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          tus finanzas, tu ritmo
        </Text>
      </Animated.View>

      <View style={{ alignItems: "center", width: "100%" }}>
        <Animated.View
          style={{
            height: 1,
            backgroundColor: COLORS.sand[300],
            width: lineWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "85%"],
            }),
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            fontFamily: "DMSans_500Medium",
            fontSize: 11,
            letterSpacing: 3,
            color: COLORS.warm.muted,
            textTransform: "uppercase",
          }}
        >
          Iniciando tu santuario
        </Text>
      </View>
    </View>
  );
}