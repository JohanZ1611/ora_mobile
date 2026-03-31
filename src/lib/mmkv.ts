import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage síncrono simulado para Zustand persist
export const mmkvStorage = {
  getItem: (key: string): string | null => {
    // Zustand necesita sync, usamos una solución híbrida
    return null;
  },
  setItem: (key: string, value: string): void => {
    AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    AsyncStorage.removeItem(key);
  },
};

// Helper para guardar/leer token directamente
export const storage = {
  getString: (key: string): string | undefined => undefined,
  set: (key: string, value: string): void => {
    AsyncStorage.setItem(key, value);
  },
  remove: (key: string): void => {
    AsyncStorage.removeItem(key);
  },
};