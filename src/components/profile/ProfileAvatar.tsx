import { Pressable, Text, View } from "react-native";
import { Camera } from "lucide-react-native";
import { useAuthStore } from "@stores/auth.store";

export function ProfileAvatar() {
  const { user } = useAuthStore();
  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <View className="items-center">
      <View className="relative">
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#A8896A30",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 3,
            borderColor: "#EDE8DF",
          }}
        >
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 36, color: "#A8896A" }}>
            {initial}
          </Text>
        </View>
        <Pressable
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#A8896A",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Camera size={14} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}