import { Text, View } from "react-native";
import { formatCurrency } from "@utils/formatters";

interface Props {
  name: string;
  totalAmount: number;
  paidAmount: number;
  dueDate?: string | Date;
}

export function DebtCard({ name, totalAmount, paidAmount, dueDate }: Props) {
  const progress = totalAmount > 0 ? Math.min((paidAmount / totalAmount) * 100, 100) : 0;
  const remaining = totalAmount - paidAmount;

  let daysLeftText = "Sin vencimiento cercano";
  if (dueDate) {
    const diffTime = new Date(dueDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysLeftText = diffDays >= 0 ? `Vence en ${diffDays} días` : `Vencida hace ${Math.abs(diffDays)} días`;
  }

  return (
    <View style={{ 
      backgroundColor: "#f2ede5", // <-- Cambiado a #f2ede5 para resaltar
      borderRadius: 16, 
      padding: 20, 
      marginBottom: 16, 
      borderLeftWidth: 4, 
      borderLeftColor: "#ba1a1a50" 
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17", marginBottom: 4 }}>{name}</Text>
          <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: "#80756b" }}>Progreso de pago</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#ba1a1a" }}>
            {formatCurrency(totalAmount, "COP")}
          </Text>
          <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: "#80756b", marginTop: 2 }}>
            {daysLeftText}
          </Text>
        </View>
      </View>

      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: "#80756b" }}>Pagado: {formatCurrency(paidAmount, "COP")}</Text>
          <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: "#80756b" }}>Resta: {formatCurrency(remaining, "COP")}</Text>
        </View>
        <View style={{ height: 6, width: "100%", backgroundColor: "#e7e2da", borderRadius: 3, overflow: "hidden" }}>
          <View style={{ height: "100%", backgroundColor: "#ba1a1a80", width: `${progress}%`, borderRadius: 3 }} />
        </View>
      </View>
    </View>
  );
}