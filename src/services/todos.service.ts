import { api } from "@lib/axios";

export const todosService = {
  getByDate: async (date: string) => {
    const res = await api.get("/todos", { params: { date } });
    return res.data;
  },

  toggle: async (id: string, done: boolean) => {
    const res = await api.put(`/todos/${id}`, { done });
    return res.data;
  },
};