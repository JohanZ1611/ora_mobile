import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export interface BarChartData {
  value: number;
  frontColor: string;
  spacing?: number;
  label?: string;
}

interface Props {
  data: BarChartData[];
}

export function IncomeExpenseBarChart({ data }: Props) {
  return (
    <View style={{
      backgroundColor: "#f2ede5", padding: 24, borderRadius: 24,
      borderWidth: 1, borderColor: "#d2c4b950", gap: 20
    }}>
      <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}>
        Ingresos vs Egresos
      </Text>
      <BarChart
        data={data}
        barWidth={28}
        spacing={24}
        roundedTop
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: '#80756b', fontFamily: "DMSans_500Medium", fontSize: 10 }}
        noOfSections={3}
      />
    </View>
  );
}