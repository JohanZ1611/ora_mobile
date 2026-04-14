import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Mailbox } from "lucide-react-native"; // Usando un ícono de buzón de Lucide para mantener consistencia

import { TransactionsHeader } from "@components/transactions/TransactionsHeader";
import { FilterChips, type FilterType } from "@components/transactions/FilterChips";
import { TransactionGroup } from "@components/transactions/TransactionGroup";
import { transactionsService } from "@services/transactions.service";
import type { Transaction } from "@mytypes/index";

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["transactions-all"],
    queryFn: () => transactionsService.getAll({ limit: "100" }),
  });

  // ¡AQUÍ ESTABA EL ERROR! Tu backend devuelve el array en data.data directamente
  const transactions: Transaction[] = data?.data ?? [];

  // Filtrar
  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    if (filter === "group") return transactions.filter((t) => t.groupId);
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  // Agrupar por fecha
  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    filtered.forEach((t) => {
      const key = new Date(t.date).toISOString().split("T")[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    // Ordenar por fecha descendente
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const handlePress = useCallback((t: Transaction) => {
    // TODO: abrir detalle/editar
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
      <TransactionsHeader />
      
      {/* Contenedor para los filtros con altura fija para evitar que se estiren */}
      <View style={{ height: 70, justifyContent: "center" }}>
        <FilterChips active={filter} onChange={setFilter} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#A8896A" />
        </View>
      ) : grouped.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <Mailbox size={48} color="#71573b" style={{ marginBottom: 16 }} />
          <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 18, color: "#1d1c17", textAlign: "center", marginBottom: 6 }}>
            Sin movimientos
          </Text>
          <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: "#80756b", textAlign: "center" }}>
            {filter === "all"
              ? "Aún no tienes transacciones.\n¡Agrega tu primer movimiento!"
              : "No hay movimientos con este filtro."}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 20, 
            gap: 24,
            paddingBottom: insets.bottom + 80, // Espacio para el Bottom Nav
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#A8896A" />
          }
        >
          {grouped.map(([date, txs]) => (
            <TransactionGroup
              key={date}
              date={date}
              transactions={txs}
              onPress={handlePress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}