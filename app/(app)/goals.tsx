import { useState } from "react";
import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { GoalsHeader } from "@components/goals/GoalsHeader";
import { GoalCard } from "@components/goals/GoalCard";
import { DebtCard } from "@components/goals/DebtCard";
import { TodoList } from "@components/goals/TodoList"; // <-- Importamos la lista
import { goalsService } from "@services/goals.service";
import { debtsService } from "@services/debts.service";

type TabType = "goals" | "todo";

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("goals");

  // Fetch Goals
  const { data: goalsData, isLoading: loadingGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: goalsService.getAll,
  });

  // Fetch Debts
  const { data: debtsData, isLoading: loadingDebts } = useQuery({
    queryKey: ["debts"],
    queryFn: debtsService.getAll,
  });

  const goals = goalsData?.data ?? goalsData ?? [];
  const debts = debtsData?.data ?? debtsData ?? [];
  const isLoading = loadingGoals || loadingDebts;

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
      <GoalsHeader />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pestañas */}
        <View style={{ flexDirection: "row", gap: 24, marginBottom: 32, alignItems: "flex-end" }}>
          <Pressable onPress={() => setActiveTab("goals")} style={{ alignItems: "center" }}>
            <Text style={{ 
              fontFamily: activeTab === "goals" ? "DMSans_700Bold" : "DMSans_600SemiBold", 
              fontSize: activeTab === "goals" ? 22 : 18, 
              color: activeTab === "goals" ? "#71573b" : "#80756b",
              marginBottom: 8 
            }}>
              Metas y Deudas
            </Text>
            {activeTab === "goals" && <View style={{ height: 4, width: 32, backgroundColor: "#71573b", borderRadius: 2 }} />}
          </Pressable>

          <Pressable onPress={() => setActiveTab("todo")} style={{ alignItems: "center" }}>
            <Text style={{ 
              fontFamily: activeTab === "todo" ? "DMSans_700Bold" : "DMSans_600SemiBold", 
              fontSize: activeTab === "todo" ? 22 : 18, 
              color: activeTab === "todo" ? "#71573b" : "#80756b",
              marginBottom: 8 
            }}>
              To-do
            </Text>
            {activeTab === "todo" && <View style={{ height: 4, width: 32, backgroundColor: "#71573b", borderRadius: 2 }} />}
          </Pressable>
        </View>

        {/* Contenido Condicional */}
        {activeTab === "goals" ? (
          isLoading ? (
            <ActivityIndicator size="large" color="#A8896A" style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Sección: Ahorros */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 20, color: "#1d1c17" }}>Tus ahorros</Text>
                </View>
                {goals.length === 0 ? (
                  <Text style={{ fontFamily: "DMSans_500Medium", color: "#80756b" }}>No tienes metas creadas aún.</Text>
                ) : (
                  goals.map((goal: any) => (
                    <GoalCard 
                      key={goal.id} name={goal.name} targetAmount={goal.targetAmount}
                      savedAmount={goal.savedAmount} deadline={goal.deadline}
                    />
                  ))
                )}
              </View>

              {/* Sección: Deudas */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 20, color: "#1d1c17" }}>Pendientes por pagar</Text>
                  <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#ba1a1a" }}>Prioridad alta</Text>
                </View>
                {debts.length === 0 ? (
                  <Text style={{ fontFamily: "DMSans_500Medium", color: "#80756b" }}>No tienes deudas registradas.</Text>
                ) : (
                  debts.map((debt: any) => (
                    <DebtCard 
                      key={debt.id} name={debt.name} totalAmount={debt.totalAmount}
                      paidAmount={debt.paidAmount} dueDate={debt.dueDate}
                    />
                  ))
                )}
              </View>
            </>
          )
        ) : (
          // Renderizamos el nuevo componente TodoList
          <TodoList />
        )}
      </ScrollView>
    </View>
  );
}