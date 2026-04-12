import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

export function SettingsItem({ icon, title, subtitle, onPress, rightElement, destructive }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: pressed ? "#ece8e0" : "transparent",
        gap: 14,
      })}
    >
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: destructive ? "#ba1a1a12" : "#A8896A14",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: "DMSans_600SemiBold",
          fontSize: 15,
          color: destructive ? "#ba1a1a" : "#1d1c17",
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontFamily: "DMSans_400Regular",
            fontSize: 12,
            color: "#80756b",
            marginTop: 1,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement ?? (
        onPress && <ChevronRight size={16} color="#80756b" />
      )}
    </Pressable>
  );
}