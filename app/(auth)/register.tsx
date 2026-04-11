import { useState } from "react";
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
import { Eye, EyeOff, Mail, User } from "lucide-react-native";

import { COLORS } from "@constants/colors";
import { authService } from "@services/auth.service";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name || name.length < 2) e.name = "Mínimo 2 caracteres";
    if (!email) e.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Correo inválido";
    if (!password || password.length < 8) e.password = "Mínimo 8 caracteres, una mayúscula y un número";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password });
      if (res.ok) {
        toast.success("¡Cuenta creada!", { description: "Ahora puedes iniciar sesión" });
        setTimeout(() => router.replace("/(auth)/login"), 1500);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Error al crear la cuenta";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    color: "#1d1c17",
    paddingVertical: 16,
  };

  const labelStyle = {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
    color: "#4e453d",
    marginBottom: 8,
    marginLeft: 4,
  };

  const inputContainerStyle = (hasError?: string) => ({
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#e7e2da",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: hasError ? 1.5 : 0,
    borderColor: hasError ? COLORS.expense : "transparent",
  });

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
            <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 44, color: "#A8896A", letterSpacing: -1.5 }}>
              Ora
            </Text>
            <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: "#4e453d", marginTop: 4, letterSpacing: 0.3 }}>
              Crea tu cuenta para empezar
            </Text>
          </View>

          {/* Card */}
          <View style={{
            width: "100%",
            backgroundColor: "#EDE8DF",
            borderRadius: 32,
            padding: 32,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.04,
            shadowRadius: 30,
            elevation: 2,
          }}>

            {/* Nombre */}
            <View style={{ marginBottom: 20 }}>
              <Text style={labelStyle}>Nombre completo</Text>
              <View style={inputContainerStyle(errors.name)}>
                <User size={18} color="#80756b" style={{ marginRight: 10 }} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  placeholderTextColor="#80756b99"
                  autoCapitalize="words"
                  style={inputStyle}
                />
              </View>
              {errors.name && (
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: COLORS.expense, marginTop: 4, marginLeft: 4 }}>
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={{ marginBottom: 20 }}>
              <Text style={labelStyle}>Correo electrónico</Text>
              <View style={inputContainerStyle(errors.email)}>
                <Mail size={18} color="#80756b" style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="nombre@ejemplo.com"
                  placeholderTextColor="#80756b99"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={inputStyle}
                />
              </View>
              {errors.email && (
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: COLORS.expense, marginTop: 4, marginLeft: 4 }}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={{ marginBottom: 28 }}>
              <Text style={labelStyle}>Contraseña</Text>
              <View style={inputContainerStyle(errors.password)}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#80756b99"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={inputStyle}
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

            {/* Crear cuenta button */}
            <Pressable onPress={handleRegister} disabled={loading}>
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
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ marginTop: 36, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: "#4e453d" }}>
              ¿Ya tienes cuenta?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 14, color: "#71573b" }}>
                Entrar
              </Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}