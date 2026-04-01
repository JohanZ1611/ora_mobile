import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { OraButton } from "@components/ui/OraButton";
import { OraInput } from "@components/ui/OraInput";
import { COLORS } from "@constants/colors";
import { authService } from "@services/auth.service";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name || name.length < 2) newErrors.name = "Mínimo 2 caracteres";
    if (!email) newErrors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";
    if (!password || password.length < 8)
      newErrors.password = "Mínimo 8 caracteres, una mayúscula y un número";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password });
      if (res.ok) {
        toast.success("¡Cuenta creada exitosamente!", {
          description: "Ahora puedes iniciar sesión",
        });
        setTimeout(() => router.replace("/(auth)/login"), 1500);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Error al crear la cuenta";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.cream[100] }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <Text
              style={{
                fontFamily: "DMSans_700Bold",
                fontSize: 48,
                color: COLORS.sand[300],
                letterSpacing: -1,
              }}
            >
              Ora
            </Text>
            <Text
              style={{
                fontFamily: "DMSans_400Regular",
                fontSize: 15,
                color: COLORS.warm.muted,
                marginTop: 4,
              }}
            >
              Crea tu cuenta para empezar
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: COLORS.cream[200],
              borderRadius: 24,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <OraInput
              label="Nombre completo"
              placeholder="Tu nombre"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
              icon="user"
            />

            <OraInput
              label="Correo electrónico"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon="email"
            />

            <OraInput
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
              icon="password"
            />

            <View style={{ marginTop: 8 }}>
              <OraButton
                label="Crear cuenta"
                onPress={handleRegister}
                loading={loading}
              />
            </View>
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: insets.bottom + 24,
            }}
          >
            <Text
              style={{
                fontFamily: "DMSans_400Regular",
                fontSize: 14,
                color: COLORS.warm.muted,
              }}
            >
              ¿Ya tienes cuenta?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text
                style={{
                  fontFamily: "DMSans_600SemiBold",
                  fontSize: 14,
                  color: COLORS.sand[300],
                }}
              >
                Entrar
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}