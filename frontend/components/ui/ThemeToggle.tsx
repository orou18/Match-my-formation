"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { useTranslation } from "@/lib/i18n-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle p-2 rounded-lg transition-all duration-200 hover:scale-105"
      title={
        theme === "dark"
          ? t("preferences.switch_to_light", "Passer au mode clair")
          : t("preferences.switch_to_dark", "Passer au mode sombre")
      }
      aria-label={
        theme === "dark"
          ? t("preferences.switch_to_light", "Passer au mode clair")
          : t("preferences.switch_to_dark", "Passer au mode sombre")
      }
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
}
