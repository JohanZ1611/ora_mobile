import { Text, View } from "react-native";
import { TransactionItem } from "./TransactionItem";
import type { Transaction } from "@mytypes/index";

interface Props {
  date: string;
  transactions: Transaction[];
  onPress?: (t: Transaction) => void;
}

function formatGroupDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(date, today)) return "Hoy";
  if (isSameDay(date, yesterday)) return "Ayer";

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export function TransactionGroup({ date, transactions, onPress }: Props) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{
        fontFamily: "DMSans_600SemiBold",
        fontSize: 11,
        color: "#80756b",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginBottom: 4,
      }}>
        {formatGroupDate(date)}
      </Text>
      {transactions.map((t) => (
        <TransactionItem key={t.id} transaction={t} onPress={onPress} />
      ))}
    </View>
  );
}