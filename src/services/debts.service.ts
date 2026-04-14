import { api } from "@lib/axios";

export const debtsService = {
  getAll: async () => {
    const res = await api.get("/debts");
    return res.data;
  },
};