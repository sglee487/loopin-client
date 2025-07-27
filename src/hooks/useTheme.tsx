import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Helper to read the user's saved preference (if any)
const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "system";
};

const applyThemeClass = (theme: Theme) => {
  const root = document.documentElement;
  const enableDark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", enableDark);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply the theme class whenever it changes
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // Respond to system theme changes when the user preference is "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mql = matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyThemeClass("system");
    mql.addEventListener
      ? mql.addEventListener("change", listener)
      : mql.addListener(listener);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", listener)
        : mql.removeListener(listener);
    };
  }, [theme]);

  const setTheme = (value: Theme) => {
    if (value === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", value);
    }
    setThemeState(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
