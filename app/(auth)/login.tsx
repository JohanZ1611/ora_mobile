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
import { useAuthStore } from "@stores/auth.store";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";
    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.ok) {
        setAuth(res.data.token, {
          id: res.data.user.id,
          email: res.data.user.email ?? email,
          name: res.data.user.name ?? null,
          avatarUrl: res.data.user.avatarUrl ?? null,
          currency: res.data.user.currency ?? "COP",
        });
        router.replace("/(app)");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Credenciales inválidas";
      toast.error(message, {
        description: "Verifica tu correo y contraseña",
      });
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
              Tu santuario financiero
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
            <Text
              style={{
                fontFamily: "DMSans_700Bold",
                fontSize: 24,
                color: COLORS.warm.text,
                marginBottom: 4,
              }}
            >
              Bienvenido
            </Text>
            <Text
              style={{
                fontFamily: "DMSans_400Regular",
                fontSize: 14,
                color: COLORS.warm.muted,
                marginBottom: 24,
              }}
            >
              Ingresa tus credenciales para continuar.
            </Text>

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

            <Pressable
              style={{ alignSelf: "flex-end", marginBottom: 20, marginTop: -4 }}
            >
              <Text
                style={{
                  fontFamily: "DMSans_400Regular",
                  fontSize: 13,
                  color: COLORS.sand[300],
                }}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            <OraButton label="Entrar" onPress={handleLogin} loading={loading} />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.cream[300] }} />
              <Text
                style={{
                  fontFamily: "DMSans_400Regular",
                  fontSize: 13,
                  color: COLORS.warm.muted,
                  marginHorizontal: 12,
                }}
              >
                O
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.cream[300] }} />
            </View>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor: COLORS.cream[300],
              }}
            >
              <Text
                style={{
                  fontFamily: "DMSans_500Medium",
                  fontSize: 15,
                  color: COLORS.warm.text,
                }}
              >
                Continuar con Google
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                fontFamily: "DMSans_400Regular",
                fontSize: 14,
                color: COLORS.warm.muted,
              }}
            >
              ¿Aún no tienes cuenta?{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text
                style={{
                  fontFamily: "DMSans_600SemiBold",
                  fontSize: 14,
                  color: COLORS.sand[300],
                }}
              >
                Crear cuenta
              </Text>
            </Pressable>
          </View>

          {/* Trust badges */}
          <View style={{ gap: 12, marginBottom: insets.bottom + 24 }}>
            {[
              { title: "SEGURIDAD", desc: "Cifrado de grado bancario" },
              { title: "PROPÓSITO", desc: "Finanzas conscientes" },
            ].map((badge) => (
              <View
                key={badge.title}
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: COLORS.cream[200],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "DMSans_600SemiBold",
                      fontSize: 11,
                      letterSpacing: 1,
                      color: COLORS.warm.muted,
                      textTransform: "uppercase",
                    }}
                  >
                    {badge.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "DMSans_400Regular",
                      fontSize: 13,
                      color: COLORS.warm.text,
                    }}
                  >
                    {badge.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}