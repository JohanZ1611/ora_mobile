import { api } from "@lib/axios";

export const todosService = {
  // Cambié getByDate a getAll para traer toda la lista
  getAll: async () => {
    const res = await api.get("/todos");
    return res.data;
  },

  toggle: async (id: string, done: boolean) => {
    const res = await api.put(`/todos/${id}`, { done });
    return res.data;
  },

  // Nuevo método para crear tareas
  create: async (title: string, date: string) => {
    const res = await api.post("/todos", { title, date, done: false });
    return res.data;
  }
};