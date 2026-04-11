import { useState } from "react";
import { Image } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";

import { COLORS } from "@constants/colors";
import { authService } from "@services/auth.service";
import { useAuthStore } from "@stores/auth.store";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Correo inválido";
    if (!password) e.password = "La contraseña es requerida";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
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
      toast.error(message, { description: "Verifica tu correo y contraseña" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5F0E8" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}>

          {/* Header */}
          <View style={{ alignItems: "center", marginTop: 48, marginBottom: 40 }}>
            <Text style={{
              fontFamily: "DMSans_700Bold",
              fontSize: 44,
              color: "#A8896A",
              letterSpacing: -1.5,
            }}>
              Ora
            </Text>
            <Text style={{
              fontFamily: "DMSans_500Medium",
              fontSize: 14,
              color: "#4e453d",
              marginTop: 4,
              letterSpacing: 0.3,
            }}>
              Tu santuario financiero
            </Text>
          </View>

          {/* Card */}
          <View style={{
            width: "100%",
            backgroundColor: "#EDE8DF",
            borderRadius: 32,
            padding: 32,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.04,
            shadowRadius: 20,
            elevation: 2,
          }}>

            <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 26, color: "#1d1c17", marginBottom: 4 }}>
              Bienvenido
            </Text>
            <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: "#4e453d", marginBottom: 28 }}>
              Ingresa tus credenciales para continuar.
            </Text>

            {/* Email */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontFamily: "DMSans_600SemiBold",
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#4e453d",
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Correo Electrónico
              </Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e7e2da",
                borderRadius: 14,
                paddingHorizontal: 16,
                borderWidth: errors.email ? 1.5 : 0,
                borderColor: errors.email ? COLORS.expense : "transparent",
              }}>
                <Mail size={18} color="#80756b" style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="nombre@ejemplo.com"
                  placeholderTextColor="#80756b99"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    fontFamily: "DMSans_400Regular",
                    fontSize: 16,
                    color: "#1d1c17",
                    paddingVertical: 16,
                  }}
                />
              </View>
              {errors.email && (
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: COLORS.expense, marginTop: 4, marginLeft: 4 }}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{
                fontFamily: "DMSans_600SemiBold",
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#4e453d",
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Contraseña
              </Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e7e2da",
                borderRadius: 14,
                paddingHorizontal: 16,
                borderWidth: errors.password ? 1.5 : 0,
                borderColor: errors.password ? COLORS.expense : "transparent",
              }}>
                <Lock size={18} color="#80756b" style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#80756b99"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    fontFamily: "DMSans_400Regular",
                    fontSize: 16,
                    color: "#1d1c17",
                    paddingVertical: 16,
                  }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  {showPassword
                    ? <EyeOff size={18} color="#80756b" />
                    : <Eye size={18} color="#80756b" />
                  }
                </Pressable>
              </View>
              {errors.password && (
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: COLORS.expense, marginTop: 4, marginLeft: 4 }}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Forgot password */}
            <Pressable style={{ alignSelf: "flex-end", marginBottom: 24 }}>
              <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: "#71573b" }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            {/* Entrar button */}
            <Pressable onPress={handleLogin} disabled={loading}>
              {({ pressed }) => (
                <View style={{
                  backgroundColor: pressed ? "#8B6E52" : "#A8896A",
                  borderRadius: 50,
                  paddingVertical: 18,
                  alignItems: "center",
                  shadowColor: "#A8896A",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                  opacity: loading ? 0.7 : 1,
                }}>
                  <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 17, color: "#FFFFFF", letterSpacing: 0.3 }}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "#d2c4b9" }} />
              <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 11, color: "#80756b", marginHorizontal: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
                O
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#d2c4b9" }} />
            </View>

            {/* Google */}
            <Pressable onPress={() => {}}>
              {({ pressed }) => (
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  borderRadius: 50,
                  borderWidth: 1.5,
                  borderColor: "#d2c4b9",
                  backgroundColor: pressed ? "#e7e2da" : "transparent",
                  gap: 10,
                }}>
                  <Image
                    source={require("../../assets/images/google-logo.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                  <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#1d1c17" }}>
                    Continuar con Google
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ marginTop: 32, alignItems: "center", gap: 24, width: "100%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: "#4e453d" }}>
                ¿Aún no tienes cuenta?{" "}
              </Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 14, color: "#71573b" }}>
                  Crear cuenta
                </Text>
              </Pressable>
            </View>

            {/* Badges */}
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              {[
                { icon: "🛡️", title: "Seguridad", desc: "Cifrado de grado bancario" },
                { icon: "🌿", title: "Propósito", desc: "Finanzas conscientes" },
              ].map((b) => (
                <View key={b.title} style={{
                  flex: 1,
                  backgroundColor: "#f8f3eb",
                  borderRadius: 20,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  opacity: 0.8,
                }}>
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#A8896A18",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ fontSize: 16 }}>{b.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase", color: "#4e453d" }}>
                      {b.title}
                    </Text>
                    <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 11, color: "#4e453d", marginTop: 1 }}>
                      {b.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}