import { Text, View } from "react-native";
import { formatCurrency } from "@utils/formatters";

interface Props {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  currency?: string;
}

export function BalanceCard({ totalIncome, totalExpense, balance, currency = "COP" }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#EDE8DF",
        borderRadius: 20,
        padding: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Text
        style={{
          fontFamily: "DMSans_600SemiBold",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#71573b",
          opacity: 0.8,
          marginBottom: 8,
        }}
      >
        Balance del mes
      </Text>
      <Text
        style={{
          fontFamily: "DMSans_700Bold",
          fontSize: 44,
          color: "#71573b",
          letterSpacing: -1,
          marginBottom: 24,
        }}
      >
        {formatCurrency(balance, currency)}
      </Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#6A9E7F18",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Text
            style={{
              fontFamily: "DMSans_700Bold",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#33664a",
              marginBottom: 4,
            }}
          >
            Ingresos
          </Text>
          <Text
            style={{
              fontFamily: "DMSans_700Bold",
              fontSize: 18,
              color: "#33664a",
            }}
          >
            +{formatCurrency(totalIncome, currency)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#C4766A18",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Text
            style={{
              fontFamily: "DMSans_700Bold",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#ba1a1a",
              marginBottom: 4,
            }}
          >
            Egresos
          </Text>
          <Text
            style={{
              fontFamily: "DMSans_700Bold",
              fontSize: 18,
              color: "#ba1a1a",
            }}
          >
            -{formatCurrency(totalExpense, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}