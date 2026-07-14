"use client";

import { useContext, useEffect, useState } from "react";
import { useThemeMode } from "@/components/providers/ThemeProvider";
import { LocaleContext } from "@/components/providers/LocaleProvider";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useThemeMode();
  const locale = useContext(LocaleContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-9 rounded-full border border-brand-border bg-brand-gray"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark
    ? (locale?.dictionary.dashboard.themeLight ?? "Switch to light mode")
    : (locale?.dictionary.dashboard.themeDark ?? "Switch to dark mode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-gray text-muted transition-colors hover:text-brand-orange"
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
