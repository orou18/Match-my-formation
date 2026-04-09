"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { BrandingSettings } from "@/types/branding";

interface BrandingContextType {
  settings: BrandingSettings | null;
  isLoading: boolean;
  applyBranding: (settings: BrandingSettings) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | null>(null);

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return context;
}

interface BrandingProviderProps {
  children: ReactNode;
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyBranding = (brandingSettings: BrandingSettings) => {
    if (!brandingSettings.show_branding) return;

    // Appliquer les variables CSS personnalisées
    const root = document.documentElement;

    // Variables de couleurs
    root.style.setProperty("--brand-primary", brandingSettings.primary_color);
    root.style.setProperty(
      "--brand-secondary",
      brandingSettings.secondary_color
    );
    root.style.setProperty("--brand-accent", brandingSettings.accent_color);
    root.style.setProperty(
      "--brand-background",
      brandingSettings.background_color
    );
    root.style.setProperty("--brand-surface", brandingSettings.surface_color);
    root.style.setProperty("--brand-text", brandingSettings.text_color);
    root.style.setProperty(
      "--brand-text-secondary",
      brandingSettings.text_secondary
    );
    root.style.setProperty("--brand-border", brandingSettings.border_color);

    // Variables de polices
    root.style.setProperty(
      "--brand-title-font",
      brandingSettings.font_settings.title_font
    );
    root.style.setProperty(
      "--brand-subtitle-font",
      brandingSettings.font_settings.subtitle_font
    );
    root.style.setProperty(
      "--brand-body-font",
      brandingSettings.font_settings.body_font
    );

    root.style.setProperty(
      "--brand-title-size",
      brandingSettings.font_settings.title_font_size
    );
    root.style.setProperty(
      "--brand-subtitle-size",
      brandingSettings.font_settings.subtitle_font_size
    );
    root.style.setProperty(
      "--brand-body-size",
      brandingSettings.font_settings.body_font_size
    );

    root.style.setProperty(
      "--brand-title-weight",
      brandingSettings.font_settings.title_font_weight
    );
    root.style.setProperty(
      "--brand-subtitle-weight",
      brandingSettings.font_settings.subtitle_font_weight
    );
    root.style.setProperty(
      "--brand-body-weight",
      brandingSettings.font_settings.body_font_weight
    );

    root.style.setProperty(
      "--brand-title-color",
      brandingSettings.font_settings.title_color
    );
    root.style.setProperty(
      "--brand-subtitle-color",
      brandingSettings.font_settings.subtitle_color
    );
    root.style.setProperty(
      "--brand-body-color",
      brandingSettings.font_settings.body_color
    );

    root.style.setProperty(
      "--brand-title-spacing",
      brandingSettings.font_settings.title_letter_spacing
    );
    root.style.setProperty(
      "--brand-subtitle-spacing",
      brandingSettings.font_settings.subtitle_letter_spacing
    );
    root.style.setProperty(
      "--brand-body-spacing",
      brandingSettings.font_settings.body_letter_spacing
    );

    root.style.setProperty(
      "--brand-title-height",
      brandingSettings.font_settings.title_line_height
    );
    root.style.setProperty(
      "--brand-subtitle-height",
      brandingSettings.font_settings.subtitle_line_height
    );
    root.style.setProperty(
      "--brand-body-height",
      brandingSettings.font_settings.body_line_height
    );

    // Appliquer les polices Google Fonts
    const fonts = [
      brandingSettings.font_settings.title_font,
      brandingSettings.font_settings.subtitle_font,
      brandingSettings.font_settings.body_font,
    ];

    const uniqueFonts = [...new Set(fonts)];

    uniqueFonts.forEach((font) => {
      if (!document.querySelector(`link[href*="family=${font}"]`)) {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(" ", "+")}:wght@300;400;500;600;700&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });

    // Appliquer le CSS personnalisé
    let customCSS = "";

    if (brandingSettings.custom_css) {
      customCSS = brandingSettings.custom_css;
    }

    // Mettre à jour ou créer la balise style
    let styleElement = document.getElementById("branding-custom-css");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "branding-custom-css";
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      :root {
        --brand-primary: ${brandingSettings.primary_color};
        --brand-secondary: ${brandingSettings.secondary_color};
        --brand-accent: ${brandingSettings.accent_color};
        --brand-background: ${brandingSettings.background_color};
        --brand-surface: ${brandingSettings.surface_color};
        --brand-text: ${brandingSettings.text_color};
        --brand-text-secondary: ${brandingSettings.text_secondary};
        --brand-border: ${brandingSettings.border_color};
        --brand-title-font: '${brandingSettings.font_settings.title_font}', sans-serif;
        --brand-subtitle-font: '${brandingSettings.font_settings.subtitle_font}', sans-serif;
        --brand-body-font: '${brandingSettings.font_settings.body_font}', sans-serif;
        --brand-title-size: ${brandingSettings.font_settings.title_font_size};
        --brand-subtitle-size: ${brandingSettings.font_settings.subtitle_font_size};
        --brand-body-size: ${brandingSettings.font_settings.body_font_size};
        --brand-title-weight: ${brandingSettings.font_settings.title_font_weight};
        --brand-subtitle-weight: ${brandingSettings.font_settings.subtitle_font_weight};
        --brand-body-weight: ${brandingSettings.font_settings.body_font_weight};
        --brand-title-color: ${brandingSettings.font_settings.title_color};
        --brand-subtitle-color: ${brandingSettings.font_settings.subtitle_color};
        --brand-body-color: ${brandingSettings.font_settings.body_color};
        --brand-title-spacing: ${brandingSettings.font_settings.title_letter_spacing};
        --brand-subtitle-spacing: ${brandingSettings.font_settings.subtitle_letter_spacing};
        --brand-body-spacing: ${brandingSettings.font_settings.body_letter_spacing};
        --brand-title-height: ${brandingSettings.font_settings.title_line_height};
        --brand-subtitle-height: ${brandingSettings.font_settings.subtitle_line_height};
        --brand-body-height: ${brandingSettings.font_settings.body_line_height};
      }
      
      body {
        background-color: var(--brand-background);
        color: var(--brand-text);
        font-family: var(--brand-body-font);
        font-size: var(--brand-body-size);
        font-weight: var(--brand-body-weight);
        line-height: var(--brand-body-height);
        letter-spacing: var(--brand-body-spacing);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--brand-title-font);
        font-size: var(--brand-title-size);
        font-weight: var(--brand-title-weight);
        color: var(--brand-title-color);
        line-height: var(--brand-title-height);
        letter-spacing: var(--brand-title-spacing);
      }
      
      .brand-subtitle {
        font-family: var(--brand-subtitle-font);
        font-size: var(--brand-subtitle-size);
        font-weight: var(--brand-subtitle-weight);
        color: var(--brand-subtitle-color);
        line-height: var(--brand-subtitle-height);
        letter-spacing: var(--brand-subtitle-spacing);
      }
      
      .brand-primary-btn {
        background-color: var(--brand-primary) !important;
        color: white !important;
        border: none !important;
      }
      
      .brand-secondary-btn {
        background-color: var(--brand-surface) !important;
        color: var(--brand-text) !important;
        border: 1px solid var(--brand-border) !important;
      }
      
      .brand-card {
        background-color: var(--brand-surface) !important;
        border: 1px solid var(--brand-border) !important;
        color: var(--brand-text) !important;
      }
      
      .brand-input {
        background-color: var(--brand-surface) !important;
        border: 1px solid var(--brand-border) !important;
        color: var(--brand-text) !important;
      }
      
      ${customCSS}
    `;

    // Mettre à jour le favicon
    if (brandingSettings.favicon_url) {
      let favicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = brandingSettings.favicon_url;
    }

    // Mettre à jour le logo si nécessaire
    const logoElements = document.querySelectorAll(".brand-logo");
    logoElements.forEach((element) => {
      if (element instanceof HTMLImageElement) {
        element.src = brandingSettings.logo_url || "/logo.png";
      }
    });

  };

  const resetBranding = () => {
    // Supprimer les styles personnalisés
    const styleElement = document.getElementById("branding-custom-css");
    if (styleElement) {
      styleElement.remove();
    }

    // Réinitialiser les variables CSS
    const root = document.documentElement;
    const cssVariables = [
      "--brand-primary",
      "--brand-secondary",
      "--brand-accent",
      "--brand-background",
      "--brand-surface",
      "--brand-text",
      "--brand-text-secondary",
      "--brand-border",
      "--brand-title-font",
      "--brand-subtitle-font",
      "--brand-body-font",
      "--brand-title-size",
      "--brand-subtitle-size",
      "--brand-body-size",
      "--brand-title-weight",
      "--brand-subtitle-weight",
      "--brand-body-weight",
      "--brand-title-color",
      "--brand-subtitle-color",
      "--brand-body-color",
      "--brand-title-spacing",
      "--brand-subtitle-spacing",
      "--brand-body-spacing",
      "--brand-title-height",
      "--brand-subtitle-height",
      "--brand-body-height",
    ];

    cssVariables.forEach((variable) => {
      root.style.removeProperty(variable);
    });

  };

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch("/api/branding", { credentials: "include" });
        if (response.ok) {
          const payload = await response.json();
          const brandingSettings = payload.settings || payload;
          setSettings(brandingSettings);
          applyBranding(brandingSettings);
        }
      } catch (error) {
        console.error("Erreur chargement branding:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();

    const handleBrandingUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<BrandingSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
        applyBranding(customEvent.detail);
      }
    };

    window.addEventListener("brandingUpdated", handleBrandingUpdated);
    return () => {
      window.removeEventListener("brandingUpdated", handleBrandingUpdated);
    };
  }, []);

  return (
    <BrandingContext.Provider
      value={{
        settings,
        isLoading,
        applyBranding,
        resetBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}
