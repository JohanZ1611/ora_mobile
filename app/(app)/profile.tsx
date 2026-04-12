import { useState, useEffect } from "react";
import {
  Pressable, ScrollView,
  Switch, Text, TextInput, View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  Bell, Calendar, Camera, ChevronLeft,
  ChevronRight, CreditCard, LogOut, Moon, Trash2,
} from "lucide-react-native";
import { toast } from "sonner-native";
import { useMutation } from "@tanstack/react-query";
import { Image } from "react-native";

import { AccentColorPicker } from "@components/profile/AccentColorPicker";
import { useAuthStore } from "@stores/auth.store";
import { useThemeStore } from "@stores/theme.store";
import { userService } from "@services/user.service";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuthStore();
  const { isDark, toggleDark } = useThemeStore();

  const [name, setName] = useState(user?.name ?? "");
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl ?? null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const updateMutation = useMutation({
    mutationFn: () => userService.updateProfile({ name }),
    onSuccess: (data) => {
      updateUser({ name: data.data.name });
      setEditing(false);
      toast.success("Perfil actualizado");
    },
    onError: () => toast.error("Error al actualizar el perfil"),
  });

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.error("Se necesita permiso para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
      updateUser({ avatarUrl: result.assets[0].uri });
      toast.success("Foto actualizada");
    }
  };

  const handleLogout = () => {
    toast("¿Cerrar sesión?", {
      description: "Tu sesión se cerrará en este dispositivo.",
      action: {
        label: "Cerrar sesión",
        onClick: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
      cancel: { 
        label: "Cancelar",
        onClick: () => {} // <-- Solución
      },
      duration: 6000,
    });
  };

  const handleDeleteAccount = () => {
    toast("¿Eliminar cuenta?", {
      description: "Esta acción es irreversible y no se puede deshacer.",
      action: {
        label: "Eliminar",
        onClick: () => {
          // implementar lógica de eliminación
          toast.error("Cuenta eliminada");
        },
      },
      cancel: { 
        label: "Cancelar",
        onClick: () => {} // <-- Solución
      },
      duration: 8000,
    });
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const labelStyle = {
    fontFamily: "DMSans_600SemiBold" as const,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
    color: "#80756b",
    marginBottom: 8,
    marginLeft: 4,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
      {/* Header */}
      <View style={{
        backgroundColor: "#EDE8DF",
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#d2c4b920",
      }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color="#71573b" />
        </Pressable>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}>
          Mi perfil
        </Text>
        <Pressable
          onPress={() => editing ? updateMutation.mutate() : setEditing(true)}
          hitSlop={8}
        >
          <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#A8896A" }}>
            {editing ? "Guardar" : "Editar"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          gap: 24,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <View style={{ position: "relative" }}>
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: "#A8896A20",
              justifyContent: "center", alignItems: "center",
              borderWidth: 3, borderColor: "#EDE8DF",
              overflow: "hidden",
            }}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 38, color: "#A8896A" }}>
                  {initial}
                </Text>
              )}
            </View>
            <Pressable
              onPress={handlePickImage}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 30, height: 30, borderRadius: 15,
                backgroundColor: "#A8896A",
                justifyContent: "center", alignItems: "center",
                elevation: 4,
              }}
            >
              <Camera size={14} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Campos */}
        <View style={{ backgroundColor: "#EDE8DF", borderRadius: 20, padding: 20, gap: 16 }}>
          <View>
            <Text style={labelStyle}>Nombre completo</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              editable={editing}
              placeholder="Tu nombre"
              placeholderTextColor="#80756b80"
              style={{
                backgroundColor: editing ? "#fff" : "#f2ede5",
                borderRadius: 14,
                paddingHorizontal: 16, paddingVertical: 14,
                fontFamily: "DMSans_400Regular", fontSize: 16, color: "#1d1c17",
                borderWidth: editing ? 1.5 : 0, borderColor: "#A8896A",
              }}
            />
          </View>
          <View>
            <Text style={labelStyle}>Correo electrónico</Text>
            <TextInput
              value={user?.email ?? ""}
              editable={false}
              style={{
                backgroundColor: "#f2ede5", borderRadius: 14,
                paddingHorizontal: 16, paddingVertical: 14,
                fontFamily: "DMSans_400Regular", fontSize: 16, color: "#80756b",
              }}
            />
          </View>
        </View>

        {/* Apariencia */}
        <View style={{ backgroundColor: "#f8f3eb", borderRadius: 20, padding: 20, gap: 20 }}>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}>
            Apariencia
          </Text>
          <AccentColorPicker />
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingTop: 16, borderTopWidth: 1, borderTopColor: "#d2c4b925",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: "#A8896A15",
                justifyContent: "center", alignItems: "center",
              }}>
                <Moon size={18} color="#A8896A" />
              </View>
              <View>
                <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#1d1c17" }}>
                  Modo oscuro
                </Text>
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: "#80756b" }}>
                  Reduce el cansancio visual
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDark}
              trackColor={{ false: "#d2c4b9", true: "#A8896A" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Preferencias — FIXED */}
        <View>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17", marginBottom: 12 }}>
            Preferencias
          </Text>
          <View style={{ backgroundColor: "#f8f3eb", borderRadius: 20, overflow: "hidden" }}>
            {[
              { icon: CreditCard, title: "Moneda principal", sub: `${user?.currency ?? "COP"} - Peso colombiano` },
              { icon: Bell, title: "Notificaciones", sub: "Alertas de gastos y movimientos" },
              { icon: Calendar, title: "Recordatorios", sub: "Pagos programados y metas", isLast: true },
            ].map((item, index, arr) => (
              <Pressable
                key={item.title}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: pressed ? "#ece8e0" : "transparent",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                  borderBottomColor: "#d2c4b925",
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14, flex: 1 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: "#A8896A15",
                    justifyContent: "center", alignItems: "center",
                  }}>
                    <item.icon size={20} color="#A8896A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#1d1c17" }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: "#80756b", marginTop: 2 }}>
                      {item.sub}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#80756b" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Cuenta — FIXED */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17", marginBottom: 12 }}>
            Cuenta
          </Text>
          <View style={{ gap: 10 }}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                backgroundColor: pressed ? "#ece8e0" : "#f8f3eb",
                borderRadius: 16,
                padding: 18,
              })}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: "#A8896A15",
                justifyContent: "center", alignItems: "center",
              }}>
                <LogOut size={20} color="#A8896A" />
              </View>
              <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#1d1c17" }}>
                Cerrar sesión
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDeleteAccount}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                backgroundColor: pressed ? "#ffdad615" : "#fff5f5",
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: "#ba1a1a20",
              })}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: "#ba1a1a10",
                justifyContent: "center", alignItems: "center",
              }}>
                <Trash2 size={20} color="#ba1a1a" />
              </View>
              <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#ba1a1a" }}>
                Eliminar cuenta
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}