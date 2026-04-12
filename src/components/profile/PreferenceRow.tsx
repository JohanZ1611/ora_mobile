import { Pressable, Text, View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress?: () => void;
  isLast?: boolean;
}

export function PreferenceRow({ icon: Icon, title, subtitle, onPress, isLast }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: pressed ? "#ece8e0" : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#d2c4b920",
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: "#A8896A15",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Icon size={18} color="#A8896A" />
        </View>
        <View>
          <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#1d1c17" }}>
            {title}
          </Text>
          <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: "#80756b", marginTop: 1 }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <ChevronRight size={18} color="#80756b" />
    </Pressable>
  );
}