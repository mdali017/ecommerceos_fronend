"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme/constants";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return "dark";
    // Migrate legacy next-themes value if present.
    const legacy = localStorage.getItem("theme");
    if (legacy === "dark") return "dark";
    return "light";
  } catch {
    return "light";
  }
}

export function applyThemeMode(theme: ThemeMode) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    applyThemeMode(stored);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore storage failures
    }
    applyThemeMode(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: ThemeMode = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore storage failures
      }
      applyThemeMode(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: mounted ? theme : "light",
      setTheme,
      toggleTheme,
    }),
    [theme, mounted, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
}
