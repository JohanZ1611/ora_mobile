import { Text, View } from "react-native";
import { MoreVertical } from "lucide-react-native";
import { PieChart } from "react-native-gifted-charts";

export interface PieChartData {
  value: number;
  color: string;
  label: string;
}

interface Props {
  data: PieChartData[];
  totalAmountText: string;
}

export function ExpensesPieChart({ data, totalAmountText }: Props) {
  return (
    <View style={{
      backgroundColor: "#f2ede5", padding: 24, borderRadius: 24,
      borderWidth: 1, borderColor: "#d2c4b950", gap: 20
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}>
          Distribución de Gastos
        </Text>
        <MoreVertical size={20} color="#80756b" />
      </View>
      
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        <PieChart
          data={data}
          donut
          radius={90}
          innerRadius={60}
          centerLabelComponent={() => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: '#80756b' }}>Gastos</Text>
              <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 20, color: '#1d1c17' }}>{totalAmountText}</Text>
            </View>
          )}
        />
      </View>

      <View style={{ gap: 12, marginTop: 10 }}>
        {data.map((item, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color }} />
              <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 14, color: "#4e453d" }}>
                {item.label}
              </Text>
            </View>
            <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 14, color: "#1d1c17" }}>
              {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}