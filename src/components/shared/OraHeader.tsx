import { Pressable, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { useAuthStore } from "@stores/auth.store";

export function OraHeader() {
  const router = useRouter();
  const { user } = useAuthStore();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const firstName = user?.name?.split(" ")[0] ?? "Johan";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#EDE8DF",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#d2c4b920",
      }}
    >
      <Text
        style={{
          fontFamily: "DMSans_700Bold",
          fontSize: 18,
          color: "#1d1c17",
        }}
      >
        {greeting}, {firstName} 👋
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bell size={22} color="#71573b" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(app)/profile" as any)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#A8896A30",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 16, color: "#A8896A" }}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}