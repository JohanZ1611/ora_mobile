import { useState } from "react";
import {
  Alert, Pressable, ScrollView,
  Switch, Text, TextInput, View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell, Calendar, ChevronLeft,
  CreditCard, LogOut, Moon, Trash2,
} from "lucide-react-native";
import { toast } from "sonner-native";
import { useMutation } from "@tanstack/react-query";

import { ProfileAvatar } from "@components/profile/ProfileAvatar";
import { AccentColorPicker } from "@components/profile/AccentColorPicker";
import { PreferenceRow } from "@components/profile/PreferenceRow";
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

  const updateMutation = useMutation({
    mutationFn: () => userService.updateProfile({ name }),
    onSuccess: (data) => {
      updateUser({ name: data.data.name });
      setEditing(false);
      toast.success("Perfil actualizado");
    },
    onError: () => toast.error("Error al actualizar el perfil"),
  });

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "Esta acción es irreversible. ¿Deseas eliminar tu cuenta definitivamente?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
      {/* Header */}
      <View style={{
        backgroundColor: "#EDE8DF",
        paddingTop: insets.top,
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#d2c4b920",
      }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <ChevronLeft size={24} color="#71573b" />
        </Pressable>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}>
          Mi perfil
        </Text>
        {editing ? (
          <Pressable onPress={() => updateMutation.mutate()}>
            <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#A8896A" }}>
              Guardar
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setEditing(true)}>
            <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#A8896A" }}>
              Editar
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 28, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <ProfileAvatar />

        {/* Campos editables */}
        <View style={{ gap: 16 }}>
          <View>
            <Text style={{
              fontFamily: "DMSans_600SemiBold",
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#80756b",
              marginBottom: 8,
              marginLeft: 4,
            }}>
              Nombre completo
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              editable={editing}
              style={{
                backgroundColor: editing ? "#EDE8DF" : "#f2ede5",
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontFamily: "DMSans_400Regular",
                fontSize: 16,
                color: "#1d1c17",
                borderWidth: editing ? 1.5 : 0,
                borderColor: "#A8896A",
              }}
            />
          </View>

          <View>
            <Text style={{
              fontFamily: "DMSans_600SemiBold",
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#80756b",
              marginBottom: 8,
              marginLeft: 4,
            }}>
              Correo electrónico
            </Text>
            <TextInput
              value={user?.email ?? ""}
              editable={false}
              style={{
                backgroundColor: "#f2ede5",
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontFamily: "DMSans_400Regular",
                fontSize: 16,
                color: "#80756b",
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: "#d2c4b920",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Moon size={20} color="#A8896A" />
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

        {/* Preferencias */}
        <View>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17", marginBottom: 12 }}>
            Preferencias
          </Text>
          <View style={{ backgroundColor: "#f2ede5", borderRadius: 20, overflow: "hidden" }}>
            <PreferenceRow
              icon={CreditCard}
              title="Moneda principal"
              subtitle={`${user?.currency ?? "COP"} - Peso colombiano`}
            />
            <PreferenceRow
              icon={Bell}
              title="Notificaciones"
              subtitle="Alertas de gastos y movimientos"
            />
            <PreferenceRow
              icon={Calendar}
              title="Recordatorios"
              subtitle="Pagos programados y metas"
              isLast
            />
          </View>
        </View>

        {/* Cuenta */}
        <View>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17", marginBottom: 12 }}>
            Cuenta
          </Text>
          <View style={{ gap: 10 }}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: pressed ? "#ece8e0" : "#f8f3eb",
                borderRadius: 16,
                padding: 18,
              })}
            >
              <LogOut size={20} color="#A8896A" />
              <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#1d1c17" }}>
                Cerrar sesión
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDeleteAccount}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: pressed ? "#ffdad620" : "transparent",
                borderRadius: 16,
                padding: 18,
                borderWidth: 1.5,
                borderColor: "#ba1a1a30",
              })}
            >
              <Trash2 size={20} color="#ba1a1a" />
              <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#ba1a1a" }}>
                Eliminar cuenta definitivamente
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}