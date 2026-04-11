import { Pressable, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";

interface Props {
  tip: string;
}

export function AiTipCard({ tip }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#71573b",
        borderRadius: 20,
        padding: 24,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}
      >
        <Sparkles size={18} color="#fff" fill="#fff" />
        <Text
          style={{
            fontFamily: "DMSans_700Bold",
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          IA Financiera
        </Text>
      </View>

      <Text
        style={{
          fontFamily: "DMSans_500Medium",
          fontSize: 15,
          color: "#fff",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        "{tip}"
      </Text>

      <Pressable
        style={({ pressed }) => ({
          alignSelf: "flex-start",
          backgroundColor: pressed ? "#ffffff30" : "#ffffff20",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        })}
      >
        <Text
          style={{
            fontFamily: "DMSans_700Bold",
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          Analizar mis gastos
        </Text>
      </Pressable>
    </View>
  );
}