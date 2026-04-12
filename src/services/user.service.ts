import { api } from "@lib/axios";

export const userService = {
  updateProfile: async (data: { name?: string; currency?: string; themeConfig?: Record<string, unknown> }) => {
    const res = await api.put("/auth/me", data);
    return res.data;
  },
};