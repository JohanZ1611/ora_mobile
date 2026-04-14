import { api } from "@lib/axios";

export const goalsService = {
  getAll: async () => {
    const res = await api.get("/goals");
    return res.data;
  },
};