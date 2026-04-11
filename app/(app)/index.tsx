// import { View, Text } from "react-native";

// export default function HomeScreen() {
//   return (
//     <View className="flex-1 justify-center items-center bg-cream-100">
//       <Text className="font-sans-bold text-2xl text-warm-text">Inicio 🏠</Text>
//     </View>
//   );
// }

import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { useAuthStore } from "@stores/auth.store";

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F0E8" }}>
      <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 24, color: "#1d1c17", marginBottom: 40 }}>
        Inicio 🏠
      </Text>
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: pressed ? "#e7e2da" : "#EDE8DF",
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 50,
          borderWidth: 1.5,
          borderColor: "#d2c4b9",
        })}
      >
        <LogOut size={18} color="#A8896A" />
        <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#A8896A" }}>
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}