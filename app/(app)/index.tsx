import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OraHeader } from "@components/shared/OraHeader";
import { BalanceCard } from "@components/home/BalanceCard";
import { UpcomingPayments } from "@components/home/UpcomingPayments";
import { TodoToday } from "@components/home/TodoToday";
import { AiTipCard } from "@components/home/AiTipCard";
import { RecentTransactions } from "@components/home/RecentTransactions";
import { reportsService } from "@services/reports.service";
import { transactionsService } from "@services/transactions.service";
import { todosService } from "@services/todos.service";
import { aiService } from "@services/ai.service";
import { useAuthStore } from "@stores/auth.store";

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { start, end };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { start, end } = getMonthRange();

  const summary = useQuery({
    queryKey: ["summary", start, end],
    queryFn: () => reportsService.getSummary(start, end),
  });

  const upcoming = useQuery({
    queryKey: ["upcoming-payments"],
    queryFn: () => reportsService.getUpcomingPayments(),
  });

  const transactions = useQuery({
    queryKey: ["transactions-recent"],
    queryFn: () => transactionsService.getAll({ limit: "5" }),
  });

  const todayStr = new Date().toISOString();
  const todos = useQuery({
    queryKey: ["todos-today"],
    queryFn: () => todosService.getByDate(todayStr),
  });

  const tip = useQuery({
    queryKey: ["daily-tip"],
    queryFn: () => aiService.getDailyTip(),
    staleTime: 1000 * 60 * 60,
  });

  const isLoading = summary.isLoading;
  const summaryData = summary.data?.data;

  const refetchAll = () => {
    summary.refetch();
    upcoming.refetch();
    transactions.refetch();
    todos.refetch();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
      <OraHeader />
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: insets.bottom + 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetchAll}
            tintColor="#A8896A"
          />
        }
      >
        <BalanceCard
          totalIncome={summaryData?.totalIncome ?? 0}
          totalExpense={summaryData?.totalExpense ?? 0}
          balance={summaryData?.balance ?? 0}
          currency={user?.currency ?? "COP"}
        />

        {upcoming.data?.data?.length > 0 && (
          <UpcomingPayments payments={upcoming.data.data} />
        )}

        {todos.data?.data?.length > 0 && (
          <TodoToday todos={todos.data.data} />
        )}

        {tip.data?.data?.tip && (
          <AiTipCard tip={tip.data.data.tip} />
        )}

        {transactions.data?.data?.length > 0 && (
          <RecentTransactions transactions={transactions.data.data} />
        )}

        {!isLoading && !summaryData && (
          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 15, color: "#80756b", textAlign: "center" }}>
              Aún no tienes movimientos este mes.{"\n"}¡Agrega tu primer ingreso o gasto!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}