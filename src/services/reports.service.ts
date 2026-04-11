import { api } from "@lib/axios";

export const reportsService = {
  getSummary: async (startDate: string, endDate: string) => {
    const res = await api.get("/reports/summary", {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getUpcomingPayments: async () => {
    const res = await api.get("/reports/upcoming-payments");
    return res.data;
  },
};