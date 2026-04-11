import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  ShoppingBag, Utensils, Car, Briefcase, Home,
  Shirt, Zap, Heart, Package,
} from "lucide-react-native";
import { formatCurrency, formatRelativeDate } from "@utils/formatters";
import type { Transaction } from "@mytypes/index";

const categoryIcons: Record<string, any> = {
  comida: Utensils,
  transporte: Car,
  salario: Briefcase,
  freelance: Briefcase,
  hogar: Home,
  ropa: Shirt,
  servicios: Zap,
  salud: Heart,
  mercado: ShoppingBag,
};

function TransactionIcon({ category }: { category: string }) {
  const key = Object.keys(categoryIcons).find((k) =>
    category.toLowerCase().includes(k)
  );
  const Icon = key ? categoryIcons[key] : Package;
  return <Icon size={20} color="#71573b" />;
}

interface Props {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: Props) {
  const router = useRouter();

  if (!transactions.length) return null;

  return (
    <View style={{ marginBottom: 100 }}>
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
          Últimos movimientos
        </Text>
        <Pressable onPress={() => router.push("/(app)/transactions")}>
          <Text
            style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: "#A8896A" }}
          >
            Ver todo
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        {transactions.slice(0, 5).map((t) => (
          <View
            key={t.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14, flex: 1 }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: "#f2ede5",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TransactionIcon category={t.category} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "DMSans_600SemiBold",
                    fontSize: 14,
                    color: "#1d1c17",
                  }}
                  numberOfLines={1}
                >
                  {t.description ?? t.category}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSans_400Regular",
                    fontSize: 12,
                    color: "#80756b",
                    marginTop: 2,
                  }}
                >
                  {t.category} • {formatRelativeDate(t.date)}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "DMSans_700Bold",
                fontSize: 15,
                color: t.type === "INCOME" ? "#33664a" : "#ba1a1a",
                marginLeft: 8,
              }}
            >
              {t.type === "INCOME" ? "+" : "-"}
              {formatCurrency(t.amount, "COP")}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}