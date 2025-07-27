import React from "react";
import { useTheme, Theme } from "@/hooks/useTheme";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const nextTheme: Record<Theme, Theme> = {
    light: "dark",
    dark: "system",
    system: "light",
  };

  const handleClick = () => {
    setTheme(nextTheme[theme]);
  };

  const icon =
    theme === "light" ? (
      <SunIcon className="h-6 w-6" />
    ) : theme === "dark" ? (
      <MoonIcon className="h-6 w-6" />
    ) : (
      <ComputerDesktopIcon className="h-6 w-6" />
    );

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
      title={`현재 테마: ${theme}`}
    >
      {icon}
    </button>
  );
};

export default ThemeToggle;
