"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light"); // 'light' par défaut
  const [isInitialized, setIsInitialized] = useState(false);

  // Fonction pour appliquer le thème
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    // Appliquer ou retirer la classe 'dark'
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Mettre à jour le meta theme-color pour les mobiles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        newTheme === "dark" ? "#1f2937" : "#ffffff"
      );
    }

    // Forcer le rechargement des styles pour éviter les problèmes de cache
    root.style.colorScheme = newTheme;
  };

  useEffect(() => {
    // Éviter l'application multiple du thème
    if (isInitialized) return;

    // Charger le thème depuis localStorage au montage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    let initialTheme: Theme = "light"; // PAR DÉFUT : thème clair

    // Seulement utiliser le thème sauvegardé s'il est valide et explicitement 'dark'
    if (savedTheme === "dark") {
      initialTheme = "dark";
    } else {
      // Sinon, toujours utiliser 'light' par défaut
      initialTheme = "light";
      // S'assurer que localStorage est cohérent
      localStorage.setItem("theme", "light");
    }

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsInitialized(true);
  }, [isInitialized]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);

    // Notifier les autres composants
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: newTheme },
      })
    );
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    handleSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleSetTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
