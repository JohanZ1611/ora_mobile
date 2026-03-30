import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mmkvStorage } from "@lib/mmkv";

interface ThemeState {
  accentColor: string;
  backgroundColor: string;
  isDark: boolean;
  setAccentColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  toggleDark: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accentColor: "#A8896A",
      backgroundColor: "#F5F0E8",
      isDark: false,

      setAccentColor: (color) => set({ accentColor: color }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);