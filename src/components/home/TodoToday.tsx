import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todosService } from "@services/todos.service";

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

interface Props {
  todos: Todo[];
}

export function TodoToday({ todos }: Props) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      todosService.toggle(id, done),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos-today"] });
    },
  });

  if (!todos.length) return null;

  return (
    <View
      style={{
        backgroundColor: "#f8f3eb",
        borderRadius: 20,
        padding: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text
          style={{ fontFamily: "DMSans_700Bold", fontSize: 18, color: "#1d1c17" }}
        >
          Por hacer hoy
        </Text>
        <Pressable
          style={{
            backgroundColor: "#A8896A12",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text
            style={{ fontFamily: "DMSans_600SemiBold", fontSize: 12, color: "#A8896A" }}
          >
            Ver todas
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        {todos.slice(0, 3).map((todo) => (
          <Pressable
            key={todo.id}
            onPress={() => toggleMutation.mutate({ id: todo.id, done: !todo.done })}
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: todo.done ? "#A8896A" : "#d2c4b9",
                backgroundColor: todo.done ? "#A8896A" : "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {todo.done && <Check size={12} color="#fff" strokeWidth={3} />}
            </View>
            <Text
              style={{
                fontFamily: "DMSans_500Medium",
                fontSize: 14,
                color: todo.done ? "#80756b" : "#1d1c17",
                textDecorationLine: todo.done ? "line-through" : "none",
                flex: 1,
              }}
            >
              {todo.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}