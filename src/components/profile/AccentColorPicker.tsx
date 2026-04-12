import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { useThemeStore } from "@stores/theme.store";

const ACCENT_COLORS = [
  "#71573b", "#A8896A", "#D2B48C", "#33664a",
  "#8c6f52", "#5a4228", "#93633e", "#4e453d",
];

export function AccentColorPicker() {
  const { accentColor, setAccentColor } = useThemeStore();

  return (
    <View>
      <Text style={{
        fontFamily: "DMSans_600SemiBold",
        fontSize: 14,
        color: "#4e453d",
        marginBottom: 14,
      }}>
        Color de acento
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {ACCENT_COLORS.map((color) => {
          const isSelected = accentColor === color;
          return (
            <Pressable
              key={color}
              onPress={() => setAccentColor(color)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: color,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: isSelected ? 2.5 : 0,
                borderColor: "#fff",
                shadowColor: isSelected ? color : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: isSelected ? 4 : 0,
              }}
            >
              {isSelected && <Check size={16} color="#fff" strokeWidth={3} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}