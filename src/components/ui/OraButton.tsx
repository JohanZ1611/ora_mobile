import { ActivityIndicator, Pressable, Text } from "react-native";
import { COLORS } from "@constants/colors";

interface OraButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost";
  disabled?: boolean;
}

export function OraButton({
  label,
  onPress,
  loading = false,
  variant = "primary",
  disabled = false,
}: OraButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: isPrimary
          ? pressed
            ? COLORS.sand[400]
            : COLORS.sand[300]
          : "transparent",
        borderWidth: isOutline ? 1.5 : 0,
        borderColor: isOutline ? COLORS.sand[300] : "transparent",
        borderRadius: 50,
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
        width: "100%",
        shadowColor: isPrimary ? COLORS.sand[300] : "transparent",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: isPrimary ? 4 : 0,
      })}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? "#fff" : COLORS.sand[300]}
          size="small"
        />
      ) : (
        <Text
          style={{
            fontFamily: "DMSans_600SemiBold",
            fontSize: 16,
            color: isPrimary ? "#FFFFFF" : COLORS.sand[300],
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}