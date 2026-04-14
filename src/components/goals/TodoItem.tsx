import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";

interface Todo {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

interface Props {
  todo: Todo;
  onToggle: (id: string, done: boolean) => void;
}

export function TodoItem({ todo, onToggle }: Props) {
  const isDone = todo.done;

  const formattedDate = new Date(todo.date).toLocaleDateString("es-CO", {
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={() => onToggle(todo.id, !isDone)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: isDone ? "#f8f3eb" : "#f2ede5",
        // Borde sutil agregado para diferenciar del fondo
        borderWidth: 1,
        borderColor: "#d2c4b950", 
      }}>
        
        <View style={{ marginTop: 2 }}>
          <View style={{
            width: 24, height: 24, borderRadius: 12,
            borderWidth: 2, borderColor: "#71573b",
            backgroundColor: isDone ? "#71573b" : "transparent",
            justifyContent: "center", alignItems: "center",
          }}>
            {isDone && <Check size={14} color="#ffffff" strokeWidth={3} />}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: "DMSans_600SemiBold", fontSize: 15,
            color: "#1C1917",
            textDecorationLine: isDone ? "line-through" : "none",
            opacity: isDone ? 0.5 : 1,
          }}>
            {todo.title}
          </Text>
          <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 12, color: "#78716C", marginTop: 4 }}>
            {isDone ? "Finalizado" : "Pendiente"} • {formattedDate}
          </Text>
        </View>

      </View>
    </Pressable>
  );
}