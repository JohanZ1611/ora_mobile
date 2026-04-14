import { Text, View } from "react-native";
import { Target, Calendar as CalendarIcon } from "lucide-react-native";
import { formatCurrency } from "@utils/formatters";

interface Props {
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string | Date;
}

export function GoalCard({ name, targetAmount, savedAmount, deadline }: Props) {
  const progress = targetAmount > 0 ? Math.min((savedAmount / targetAmount) * 100, 100) : 0;
  
  let daysLeftText = "Sin fecha límite";
  if (deadline) {
    const diffTime = Math.abs(new Date(deadline).getTime() - new Date().getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysLeftText = `Faltan ${diffDays} días`;
  }

  return (
    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 10, color: "#80756b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Ahorro
          </Text>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}>
            {name}
          </Text>
        </View>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#f9dbb740", justifyContent: "center", alignItems: "center" }}>
          <Target size={24} color="#71573b" />
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 15, color: "#1d1c17" }}>
            {formatCurrency(savedAmount, "COP")} <Text style={{ fontFamily: "DMSans_500Medium", color: "#80756b", fontSize: 13 }}>/ {formatCurrency(targetAmount, "COP")}</Text>
          </Text>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 14, color: "#71573b" }}>
            {Math.round(progress)}%
          </Text>
        </View>
        {/* Barra de progreso */}
        <View style={{ height: 8, width: "100%", backgroundColor: "#e7e2da", borderRadius: 4, overflow: "hidden" }}>
          <View style={{ height: "100%", backgroundColor: "#71573b", width: `${progress}%`, borderRadius: 4 }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <CalendarIcon size={14} color="#80756b" />
        <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: "#80756b" }}>{daysLeftText}</Text>
      </View>
    </View>
  );
}