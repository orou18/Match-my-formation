"use client";

import { useEffect, useState } from "react";

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletter: boolean;
  timezone: string;
  language: string;
  theme: string;
}

export function usePreferencesSync() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    // Charger les préférences au démarrage
    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem("userPreferences");
        if (saved) {
          const parsed = JSON.parse(saved);
          setPreferences(parsed);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des préférences:", error);
      }
    };

    loadPreferences();

    // Écouter les changements de préférences
    const handlePreferencesChange = (event: CustomEvent<UserPreferences>) => {
      setPreferences(event.detail);
    };

    window.addEventListener(
      "preferencesChanged",
      handlePreferencesChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "preferencesChanged",
        handlePreferencesChange as EventListener
      );
    };
  }, []);

  return preferences;
}
