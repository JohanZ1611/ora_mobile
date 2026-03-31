import { api } from "@lib/axios";
import type { ApiResponse, User } from "@mytypes/index";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  login: async (data: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterInput): Promise<ApiResponse<{ id: string; email: string; name: string }>> => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  me: async (): Promise<ApiResponse<User>> => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};