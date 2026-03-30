import axios from "axios";

import { storage } from "./mmkv";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request — agrega el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = storage.getString("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response — maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("auth_token");
      storage.remove("auth_user");
    }
    return Promise.reject(error);
  }
);