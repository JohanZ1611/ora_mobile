import { api } from "@lib/axios";

export const aiService = {
  getDailyTip: async () => {
    const res = await api.get("/ai/daily-tip");
    return res.data;
  },
};