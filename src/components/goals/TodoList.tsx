import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";

import { TodoItem } from "./TodoItem";
import { todosService } from "@services/todos.service";

export function TodoList() {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: todosService.getAll,
  });

  const todos = data?.data ?? data ?? [];

  const toggleMutation = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => todosService.toggle(id, done),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const addMutation = useMutation({
    mutationFn: (title: string) => {
      const today = new Date().toISOString();
      return todosService.create(title, today);
    },
    onSuccess: () => {
      setNewTaskTitle("");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAdd = () => {
    if (newTaskTitle.trim().length > 0) {
      addMutation.mutate(newTaskTitle.trim());
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#A8896A" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 12, color: "#80756b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
        Tus Tareas
      </Text>

      {/* Lista de Tareas */}
      <View style={{ marginBottom: 24, gap: 10 }}>
        {todos.length === 0 ? (
          <Text style={{ fontFamily: "DMSans_500Medium", color: "#80756b", textAlign: "center", marginVertical: 20 }}>
            No tienes tareas pendientes. ¡Todo al día!
          </Text>
        ) : (
          todos.map((todo: any) => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={(id, done) => toggleMutation.mutate({ id, done })} 
            />
          ))
        )}
      </View>

      {/* Caja para agregar nueva tarea */}
      <View style={{ backgroundColor: "#ece8e0", borderRadius: 20, padding: 20, gap: 16 }}>
        <Text style={{ fontFamily: "DMSans_700Bold", fontSize: 16, color: "#1d1c17" }}>
          Nueva Tarea
        </Text>
        
        <TextInput
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="Ej: Pagar factura de internet..."
          placeholderTextColor="#80756b"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontFamily: "DMSans_500Medium",
            fontSize: 15,
            color: "#1d1c17",
          }}
        />

        {/* Botón corregido */}
        <Pressable
          onPress={handleAdd}
          disabled={addMutation.isPending || newTaskTitle.trim().length === 0}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
          })}
        >
          {/* View interno para el layout y color */}
          <View style={{
            backgroundColor: newTaskTitle.trim().length === 0 ? "#d2c4b9" : "#71573b",
            paddingVertical: 14,
            borderRadius: 12,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}>
            {addMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Plus size={20} color="#fff" />
                <Text style={{ fontFamily: "DMSans_700Bold", color: "#fff", fontSize: 15 }}>
                  Agregar Tarea
                </Text>
              </>
            )}
          </View>
        </Pressable>
        
      </View>
    </View>
  );
}