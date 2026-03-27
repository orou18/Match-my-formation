"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Language = "fr" | "en" | "es";

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>("fr");
  const [isInitialized, setIsInitialized] = useState(false);

  const translations: Record<Language, Record<string, string>> = {
    fr: {
      "nav.dashboard": "Tableau de bord",
      "nav.profile": "Mon profil",
      "nav.security": "Sécurité",
      "nav.preferences": "Préférences",
      "nav.billing": "Facturation",
      "nav.notifications": "Notifications",
      "nav.parcours": "Mes parcours",
      "nav.courses": "Cours",
      "nav.certificates": "Certificats",
      "nav.settings": "Paramètres",
      "nav.help": "Aide",
      "nav.logout": "Déconnexion",
      "sidebar.welcome": "Bienvenue",
      "sidebar.back_to_dashboard": "Retour au tableau de bord",
      "loading.profile": "Chargement du profil...",
      "error.profile": "Impossible de charger votre profil",
      "theme.light": "Clair",
      "theme.dark": "Sombre",
      "language.french": "Français",
      "language.english": "English",
      "language.spanish": "Español",
    },
    en: {
      "nav.dashboard": "Dashboard",
      "nav.profile": "My Profile",
      "nav.security": "Security",
      "nav.preferences": "Preferences",
      "nav.billing": "Billing",
      "nav.notifications": "Notifications",
      "nav.parcours": "My Courses",
      "nav.courses": "Courses",
      "nav.certificates": "Certificates",
      "nav.settings": "Settings",
      "nav.help": "Help",
      "nav.logout": "Logout",
      "sidebar.welcome": "Welcome",
      "sidebar.back_to_dashboard": "Back to Dashboard",
      "loading.profile": "Loading profile...",
      "error.profile": "Unable to load your profile",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "language.french": "Français",
      "language.english": "English",
      "language.spanish": "Español",
    },
    es: {
      "nav.dashboard": "Panel",
      "nav.profile": "Mi Perfil",
      "nav.security": "Seguridad",
      "nav.preferences": "Preferencias",
      "nav.billing": "Facturación",
      "nav.notifications": "Notificaciones",
      "nav.parcours": "Mis Cursos",
      "nav.courses": "Cursos",
      "nav.certificates": "Certificados",
      "nav.settings": "Configuración",
      "nav.help": "Ayuda",
      "nav.logout": "Cerrar sesión",
      "sidebar.welcome": "Bienvenido",
      "sidebar.back_to_dashboard": "Volver al Panel",
      "loading.profile": "Cargando perfil...",
      "error.profile": "No se puede cargar tu perfil",
      "theme.light": "Claro",
      "theme.dark": "Oscuro",
      "language.french": "Français",
      "language.english": "English",
      "language.spanish": "Español",
    },
  };

  // Fonction pour appliquer la langue
  const applyLanguage = (newLanguage: Language) => {
    document.documentElement.lang = newLanguage;

    // Mettre à jour les attributs pour l'accessibilité
    document.documentElement.setAttribute("data-language", newLanguage);
  };

  useEffect(() => {
    // Éviter l'application multiple de la langue
    if (isInitialized) return;

    // Charger la langue depuis localStorage au montage
    const savedLanguage = localStorage.getItem("language") as Language | null;
    let initialLanguage: Language;

    if (savedLanguage && ["fr", "en", "es"].includes(savedLanguage)) {
      initialLanguage = savedLanguage;
    } else {
      // Détecter la langue du navigateur
      const browserLang = navigator.language.split("-")[0] as Language;
      initialLanguage = ["fr", "en", "es"].includes(browserLang)
        ? browserLang
        : "fr";
    }

    setLanguage(initialLanguage);
    applyLanguage(initialLanguage);
    setIsInitialized(true);
  }, [isInitialized]);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    applyLanguage(newLanguage);

    // Notifier les autres composants
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: newLanguage },
      })
    );
  };

  const t = (key: string, fallback?: string) => {
    return translations[language]?.[key] || fallback || key;
  };

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </TranslationContext.Provider>
  );
}
