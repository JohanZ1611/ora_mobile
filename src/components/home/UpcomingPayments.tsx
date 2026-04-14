import { ScrollView, Text, View } from "react-native";
import { Wifi, Zap, Home, CreditCard, Calendar } from "lucide-react-native";
import { formatDateShort } from "@utils/formatters";

interface Payment {
  id: string;
  name: string;
  amount: number | null;
  dueDate: string;
  type: string;
}

interface Props {
  payments: Payment[];
}

const iconMap: Record<string, any> = {
  internet: Wifi,
  electricidad: Zap,
  hogar: Home,
  tarjeta: CreditCard,
};

function getIcon(name: string) {
  const key = Object.keys(iconMap).find((k) =>
    name.toLowerCase().includes(k)
  );
  const Icon = key ? iconMap[key] : Calendar;
  return <Icon size={20} color="#71573b" />;
}

export function UpcomingPayments({ payments }: Props) {
  if (!payments.length) return null;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text
          style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}
        >
          Próximos pagos
        </Text>
        <Text
          style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: "#A8896A" }}
        >
          Ver calendario
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }}>
        <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20 }}>
          {payments.map((p) => (
            <View
              key={p.id}
              style={{
                minWidth: 130,
                backgroundColor: "#EDE8DF",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#d2c4b915",
              }}
            >
              <View style={{ marginBottom: 10 }}>{getIcon(p.name)}</View>
              <Text
                style={{
                  fontFamily: "DMSans_700Bold",
                  fontSize: 13,
                  color: "#1d1c17",
                  marginBottom: 4,
                }}
              >
                {p.name}
              </Text>
              <Text
                style={{
                  fontFamily: "DMSans_400Regular",
                  fontSize: 11,
                  color: "#80756b",
                }}
              >
                {formatDateShort(p.dueDate)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}