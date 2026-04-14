import { Pressable, Text, View } from "react-native";
import { formatCurrency } from "@utils/formatters";
import type { Transaction } from "@mytypes/index";
import { getCategoryIcon } from "@constants/categoryIcons";
import { ReceiptText } from "lucide-react-native";

interface Props {
  transaction: Transaction;
  onPress?: (t: Transaction) => void;
}

export function TransactionItem({ transaction, onPress }: Props) {
  const isIncome = transaction.type === "INCOME";
  const amountColor = isIncome ? "#6A9E7F" : "#C4766A";
  const amountPrefix = isIncome ? "+" : "-";
  
  const badgeBg = isIncome ? "#6A9E7F20" : "#A8896A20";
  const badgeText = isIncome ? "#33664a" : "#71573b";

  const CategoryIcon = getCategoryIcon(transaction.category);

  const time = new Date(transaction.date).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1, // Efecto visual al presionar
        marginBottom: 16, // Más espacio entre cada movimiento
      })}
    >
      {/* El fondo y padding se lo damos al View interno para asegurar que se pinte */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF", // Fondo blanco para que contraste con tu fondo crema
        borderRadius: 16,
        padding: 16,
        // Sombra sutil para despegar la tarjeta del fondo
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2, 
      }}>
        
        {/* Lado Izquierdo: Icono + Textos */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 14, paddingRight: 10 }}>
          
          <View style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: "#F5F0E8",
            justifyContent: "center", alignItems: "center",
          }}>
            <CategoryIcon size={24} color={isIncome ? "#33664a" : "#71573b"} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: "DMSans_600SemiBold", fontSize: 16, color: "#1d1c17", marginBottom: 4
            }} numberOfLines={1}>
              {transaction.description ?? transaction.category}
            </Text>
            
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{
                backgroundColor: badgeBg,
                paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
              }}>
                <Text style={{
                  fontFamily: "DMSans_700Bold", fontSize: 10,
                  color: badgeText, textTransform: "uppercase", letterSpacing: 0.5,
                }}>
                  {transaction.category}
                </Text>
              </View>
              <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: "#80756b" }}>
                {time}
              </Text>
            </View>
          </View>

        </View>

        {/* Lado Derecho: Monto + Icono de recibo */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{
            fontFamily: "DMSans_700Bold", fontSize: 18, color: amountColor,
          }}>
            {amountPrefix} {formatCurrency(transaction.amount, "COP")}
          </Text>
          
          <View style={{
            width: 36, height: 36, borderRadius: 8,
            backgroundColor: "#F5F0E8",
            justifyContent: "center", alignItems: "center"
          }}>
            <ReceiptText size={20} color="#1d1c17" />
          </View>
        </View>
        
      </View>
    </Pressable>
  );
}