import { api } from "@lib/axios";

export const transactionsService = {
  getAll: async (params?: Record<string, string>) => {
    const res = await api.get("/transactions", { params });
    return res.data;
  },
};