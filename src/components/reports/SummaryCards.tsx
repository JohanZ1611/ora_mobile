import { Text, View } from "react-native";
import { Wallet } from "lucide-react-native";
import { formatCurrency } from "@utils/formatters";

interface Props {
  income?: number;
  expense?: number;
  balance?: number;
}

export function SummaryCards({ income = 0, expense = 0, balance = 0 }: Props) {
  // Evitamos el NaN forzando a número o fallback a 0
  const safeIncome = Number(income) || 0;
  const safeExpense = Number(expense) || 0;
  const safeBalance = Number(balance) || 0;

  return (
    <View style={{ gap: 16 }}>
      {/* Ingresos */}
      <View style={{ backgroundColor: "#FFFFFF", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#d2c4b930" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 11, color: "#33664a", textTransform: "uppercase", letterSpacing: 1 }}>
            Total Ingresos
          </Text>
          <View style={{ backgroundColor: "#6A9E7F20", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 50 }}>
            <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 10, color: "#33664a" }}>+12%</Text>
          </View>
        </View>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 28, color: "#1d1c17" }}>
          {formatCurrency(safeIncome, "COP")}
        </Text>
      </View>

      {/* Egresos */}
      <View style={{ backgroundColor: "#FFFFFF", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#d2c4b930" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 11, color: "#ba1a1a", textTransform: "uppercase", letterSpacing: 1 }}>
            Total Egresos
          </Text>
          <View style={{ backgroundColor: "#C4766A20", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 50 }}>
            <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 10, color: "#ba1a1a" }}>-5%</Text>
          </View>
        </View>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 28, color: "#1d1c17" }}>
          {formatCurrency(safeExpense, "COP")}
        </Text>
      </View>

      {/* Balance */}
      <View style={{ backgroundColor: "#f2ede5", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#d2c4b950" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 11, color: "#71573b", textTransform: "uppercase", letterSpacing: 1 }}>
            Balance Neto
          </Text>
          <Wallet size={20} color="#71573b" />
        </View>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 28, color: "#71573b" }}>
          {formatCurrency(safeBalance, "COP")}
        </Text>
      </View>
    </View>
  );
}