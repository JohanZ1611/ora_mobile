import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import { COLORS } from "@constants/colors";

type IconType = "email" | "password" | "user" | "none";

interface OraInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words";
  error?: string;
  icon?: IconType;
}

function InputIcon({ type }: { type: IconType }) {
  const color = COLORS.warm.muted;
  const size = 18;
  if (type === "email") return <Mail size={size} color={color} />;
  if (type === "password") return <Lock size={size} color={color} />;
  if (type === "user") return <User size={size} color={color} />;
  return null;
}

export function OraInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
  icon = "none",
}: OraInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: 16, width: "100%" }}>
      <Text
        style={{
          fontFamily: "DMSans_600SemiBold",
          fontSize: 11,
          letterSpacing: 1.2,
          color: COLORS.warm.muted,
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.cream[100],
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: focused
            ? COLORS.sand[300]
            : error
            ? COLORS.expense
            : COLORS.cream[300],
          paddingHorizontal: 14,
          paddingVertical: 2,
        }}
      >
        {icon !== "none" && (
          <View style={{ marginRight: 10 }}>
            <InputIcon type={icon} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.warm.muted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            fontFamily: "DMSans_400Regular",
            fontSize: 16,
            color: COLORS.warm.text,
            paddingVertical: 14,
          }}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={18} color={COLORS.warm.muted} />
            ) : (
              <Eye size={18} color={COLORS.warm.muted} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontFamily: "DMSans_400Regular",
            fontSize: 12,
            color: COLORS.expense,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}