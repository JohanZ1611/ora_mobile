import { useState, useMemo } from "react";
import { ScrollView, Text, View, Pressable, ActivityIndicator, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrainCircuit, FileText, Calendar, X, CheckCircle } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import DateTimePicker from '@react-native-community/datetimepicker';

import { ReportsHeader } from "@components/reports/ReportsHeader";
import { SummaryCards } from "@components/reports/SummaryCards";
import { ExpensesPieChart } from "@components/reports/ExpensesPieChart";
import { IncomeExpenseBarChart } from "@components/reports/IncomeExpenseBarChart";
import { reportsService } from "@services/reports.service";
import { formatCurrency } from "@utils/formatters";

const RANGES = ["Día", "Semana", "Mes", "Año"];
const PIE_COLORS = ["#71573b", "#f9dbb7", "#33664a", "#d2c4b9", "#A8896A", "#C4766A", "#6A9E7F"];

const getDateRange = (range: string, customStart?: Date, customEnd?: Date) => {
  if (range === "Personalizado" && customStart && customEnd) {
    return { startDate: customStart.toISOString(), endDate: customEnd.toISOString() };
  }

  const end = new Date();
  const start = new Date();
  switch (range) {
    case "Día": start.setHours(0, 0, 0, 0); break;
    case "Semana": start.setDate(end.getDate() - 7); break;
    case "Mes": start.setMonth(end.getMonth() - 1); break;
    case "Año": start.setFullYear(end.getFullYear() - 1); break;
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState("Mes");

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [pickerMode, setPickerMode] = useState<'start' | 'end' | null>(null);
  const [customDates, setCustomDates] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Mes pasado por defecto
    end: new Date()
  });

  const dateRange = useMemo(
    () => getDateRange(range, customDates.start, customDates.end),
    [range, customDates]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["reports-summary", range, customDates],
    queryFn: () => reportsService.getSummary(dateRange.startDate, dateRange.endDate),
  });

  const summary = data?.data ?? {};
  const expensesByCategory = (summary.byCategory || []).filter((c: any) => c.type === "EXPENSE");
  const totalPieExpense = summary.totalExpense || 0;

  const pieData = expensesByCategory.map((item: any, index: number) => ({
    value: totalPieExpense > 0 ? Math.round((item.amount / totalPieExpense) * 100) : 0,
    color: PIE_COLORS[index % PIE_COLORS.length],
    label: item.category,
  }));

  const barData = (summary.byMonth || []).flatMap((monthData: any) => [
    { value: monthData.income, frontColor: '#6A9E7F', spacing: 2, label: monthData.month.split("-")[1] },
    { value: monthData.expense, frontColor: '#C4766A' },
  ]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentMode = pickerMode;
    setPickerMode(null); // Cierra el picker nativo
    if (selectedDate && currentMode) {
      setCustomDates(prev => ({ ...prev, [currentMode]: selectedDate }));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F0E8" }}>
      <ReportsHeader />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: insets.bottom + 120 }} showsVerticalScrollIndicator={false}>
        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {RANGES.map((r) => (
            <Pressable key={r} onPress={() => setRange(r)}>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50, backgroundColor: range === r ? "#71573b" : "#EDE8DF" }}>
                <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 13, color: range === r ? "#fff" : "#4e453d" }}>{r}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable onPress={() => setShowCustomModal(true)}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50, backgroundColor: range === "Personalizado" ? "#71573b" : "#EDE8DF" }}>
              <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 13, color: range === "Personalizado" ? "#fff" : "#4e453d" }}>
                {range === "Personalizado" ? `${customDates.start.toLocaleDateString('es-CO', {day:'2-digit', month:'short'})} - ${customDates.end.toLocaleDateString('es-CO', {day:'2-digit', month:'short'})}` : "Personalizado"}
              </Text>
              <Calendar size={14} color={range === "Personalizado" ? "#fff" : "#4e453d"} />
            </View>
          </Pressable>
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator size="large" color="#A8896A" style={{ marginTop: 40 }} />
        ) : (
          <>
            <SummaryCards income={summary.totalIncome} expense={summary.totalExpense} balance={summary.balance} />
            {pieData.length > 0 && <ExpensesPieChart data={pieData} totalAmountText={formatCurrency(totalPieExpense, "COP")} />}
            {barData.length > 0 && <IncomeExpenseBarChart data={barData} />}

            {/* Botones */}
            <View style={{ gap: 12, marginTop: 8 }}>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                <View style={{ backgroundColor: "#A8896A", padding: 18, borderRadius: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, elevation: 4, shadowColor: "#A8896A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                  <BrainCircuit color="#fff" size={24} />
                  <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 16, color: "#fff" }}>Resumen con IA</Text>
                </View>
              </Pressable>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <View style={{ padding: 16, borderRadius: 16, borderWidth: 2, borderColor: "#d2c4b9", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                  <FileText color="#71573b" size={20} />
                  <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 16, color: "#71573b" }}>Exportar PDF</Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal Selector de Fechas */}
      <Modal visible={showCustomModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(29,28,23,0.6)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#F5F0E8', padding: 24, borderRadius: 24, gap: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: '#1d1c17' }}>Elige el rango</Text>
              <Pressable onPress={() => setShowCustomModal(false)}><X size={24} color="#80756b" /></Pressable>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <Pressable onPress={() => setPickerMode('start')} style={{ flex: 1, backgroundColor: "#EDE8DF", padding: 16, borderRadius: 12 }}>
                <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: "#80756b", marginBottom: 4 }}>Desde</Text>
                <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 15, color: "#1d1c17" }}>{customDates.start.toLocaleDateString()}</Text>
              </Pressable>
              
              <Pressable onPress={() => setPickerMode('end')} style={{ flex: 1, backgroundColor: "#EDE8DF", padding: 16, borderRadius: 12 }}>
                <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: "#80756b", marginBottom: 4 }}>Hasta</Text>
                <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 15, color: "#1d1c17" }}>{customDates.end.toLocaleDateString()}</Text>
              </Pressable>
            </View>

            {/* Botón Aplicar Rango (Estilos en el View interno) */}
            <Pressable
              onPress={() => { setRange("Personalizado"); setShowCustomModal(false); }}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View style={{ 
                backgroundColor: '#71573b', 
                paddingVertical: 16, 
                borderRadius: 16, 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ fontFamily: "DMSans_700Bold", color: '#fff', fontSize: 16 }}>
                  Aplicar Rango
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Selector Nativo Oculto */}
      {pickerMode && (
        <DateTimePicker
          value={pickerMode === 'start' ? customDates.start : customDates.end}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}