"use client";

import { useEffect, useState } from "react";

interface BrandingSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  company_name: string;
  logo_url?: string;
  favicon_url?: string;
  font_settings: {
    title_font: string;
    body_font: string;
  };
  custom_css?: string;
}

export const BrandingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 122, 122";
  };

  const applyBrandingStyles = (settings: BrandingSettings) => {
    const root = document.documentElement;
    
    // Appliquer les couleurs aux variables CSS utilisées par Tailwind
    root.style.setProperty('--color-primary', settings.primary_color);
    root.style.setProperty('--color-primary-hover', settings.primary_color);
    root.style.setProperty('--color-secondary', settings.secondary_color);
    root.style.setProperty('--color-accent', settings.accent_color);
    
    // Variables supplémentaires pour compatibilité
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--accent', settings.accent_color);
    root.style.setProperty('--primary-rgb', hexToRgb(settings.primary_color));
    
    // Polices avec vérification de sécurité
    if (settings.font_settings) {
      const titleFont = settings.font_settings.title_font || 'Inter';
      const bodyFont = settings.font_settings.body_font || 'Inter';
      
      root.style.setProperty('--font-primary', `"${titleFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`);
      root.style.setProperty('--font-title', titleFont);
      root.style.setProperty('--font-body', bodyFont);
    } else {
      // Valeurs par défaut
      root.style.setProperty('--font-title', 'Inter');
      root.style.setProperty('--font-body', 'Inter');
    }
    
    // CRÉER DES STYLES DYNAMIQUES avec haute spécificité
    let dynamicStyles = document.getElementById('branding-dynamic-styles');
    if (!dynamicStyles) {
      dynamicStyles = document.createElement('style');
      dynamicStyles.id = 'branding-dynamic-styles';
      document.head.appendChild(dynamicStyles);
    }
    
    // Générer les CSS dynamiques avec haute spécificité
    dynamicStyles.textContent = `
      /* Styles de branding avec haute spécificité */
      body .text-primary, 
      [class*="text-primary"], 
      *.text-primary,
      div.text-primary,
      span.text-primary,
      button.text-primary,
      a.text-primary,
      h1.text-primary,
      h2.text-primary,
      h3.text-primary,
      h4.text-primary,
      h5.text-primary,
      h6.text-primary,
      p.text-primary,
      svg.text-primary {
        color: ${settings.primary_color} !important;
      }
      
      body .bg-primary,
      [class*="bg-primary"],
      *.bg-primary,
      div.bg-primary,
      span.bg-primary,
      button.bg-primary,
      a.bg-primary {
        background-color: ${settings.primary_color} !important;
      }
      
      body .text-primary\\/60,
      [class*="text-primary/60"],
      *.text-primary\\/60 {
        color: ${settings.primary_color}99 !important;
      }
      
      body .text-primary\\/80,
      [class*="text-primary/80"],
      *.text-primary\\/80 {
        color: ${settings.primary_color}CC !important;
      }
      
      body .text-primary\\/10,
      [class*="text-primary/10"],
      *.text-primary\\/10 {
        color: ${settings.primary_color}1A !important;
      }
      
      body .text-primary\\/20,
      [class*="text-primary/20"],
      *.text-primary\\/20 {
        color: ${settings.primary_color}33 !important;
      }
      
      body .bg-primary\\/10,
      [class*="bg-primary/10"],
      *.bg-primary\\/10 {
        background-color: ${settings.primary_color}1A !important;
      }
      
      body .bg-primary\\/20,
      [class*="bg-primary/20"],
      *.bg-primary\\/20 {
        background-color: ${settings.primary_color}33 !important;
      }
      
      body .hover\\:text-primary:hover,
      [class*="hover:text-primary"]:hover,
      *.hover\\:text-primary:hover {
        color: ${settings.primary_color} !important;
      }
      
      body .hover\\:bg-primary:hover,
      [class*="hover:bg-primary"]:hover,
      *.hover\\:bg-primary:hover {
        background-color: ${settings.primary_color} !important;
      }
      
      body .hover\\:bg-primary\\/10:hover,
      [class*="hover:bg-primary/10"]:hover,
      *.hover\\:bg-primary\\/10:hover {
        background-color: ${settings.primary_color}1A !important;
      }
      
      body .hover\\:text-primary\\/60:hover,
      [class*="hover:text-primary/60"]:hover,
      *.hover\\:text-primary\\/60:hover {
        color: ${settings.primary_color}99 !important;
      }
      
      body .hover\\:text-primary\\/80:hover,
      [class*="hover:text-primary/80"]:hover,
      *.hover\\:text-primary\\/80:hover {
        color: ${settings.primary_color}CC !important;
      }
      
      body .border-primary,
      [class*="border-primary"],
      *.border-primary {
        border-color: ${settings.primary_color} !important;
      }
      
      body .ring-primary,
      [class*="ring-primary"],
      *.ring-primary {
        --tw-ring-color: ${settings.primary_color} !important;
      }
      
      body .ring-offset-primary,
      [class*="ring-offset-primary"],
      *.ring-offset-primary {
        --tw-ring-offset-color: ${settings.primary_color} !important;
      }
      
      body .focus\\:ring-primary:focus,
      [class*="focus:ring-primary"]:focus,
      *.focus\\:ring-primary:focus {
        --tw-ring-color: ${settings.primary_color} !important;
      }
      
      /* Styles pour secondary */
      body .text-secondary,
      [class*="text-secondary"],
      *.text-secondary {
        color: ${settings.secondary_color} !important;
      }
      
      body .bg-secondary,
      [class*="bg-secondary"],
      *.bg-secondary {
        background-color: ${settings.secondary_color} !important;
      }
      
      body .hover\\:text-secondary:hover,
      [class*="hover:text-secondary"]:hover,
      *.hover\\:text-secondary:hover {
        color: ${settings.secondary_color} !important;
      }
      
      body .hover\\:bg-secondary:hover,
      [class*="hover:bg-secondary"]:hover,
      *.hover\\:bg-secondary:hover {
        background-color: ${settings.secondary_color} !important;
      }
      
      /* Styles pour accent */
      body .text-accent,
      [class*="text-accent"],
      *.text-accent {
        color: ${settings.accent_color} !important;
      }
      
      body .bg-accent,
      [class*="bg-accent"],
      *.bg-accent {
        background-color: ${settings.accent_color} !important;
      }
      
      body .hover\\:text-accent:hover,
      [class*="hover:text-accent"]:hover,
      *.hover\\:text-accent:hover {
        color: ${settings.accent_color} !important;
      }
      
      body .hover\\:bg-accent:hover,
      [class*="hover:bg-accent"]:hover,
      *.hover\\:bg-accent:hover {
        background-color: ${settings.accent_color} !important;
      }
      
      /* Appliquer les polices avec haute spécificité */
      body,
      html,
      div,
      span,
      p,
      button,
      input,
      textarea,
      select {
        font-family: "${settings.font_settings?.body_font || 'Inter'}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
      }
      
      h1, h2, h3, h4, h5, h6,
      h1 *, h2 *, h3 *, h4 *, h5 *, h6 * {
        font-family: "${settings.font_settings?.title_font || 'Inter'}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
      }
    `;
    
    // Forcer le reflow pour s'assurer que les styles sont appliqués
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
    }, 100);
    
    // Appliquer le logo et favicon
    const logoElements = document.querySelectorAll('.branding-logo');
    logoElements.forEach(el => {
      if (el instanceof HTMLImageElement && settings.logo_url) {
        el.src = settings.logo_url;
      }
    });
    
    // Mettre à jour le favicon
    if (settings.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = settings.favicon_url;
      }
    }
    
    // Appliquer le CSS personnalisé
    if (settings.custom_css) {
      let customStyleElement = document.getElementById('branding-custom-css');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'branding-custom-css';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = settings.custom_css;
    }
    
    console.log("Branding styles applied:", settings);
    console.log("CSS Variables updated:", {
      '--color-primary': settings.primary_color,
      '--color-secondary': settings.secondary_color,
      '--color-accent': settings.accent_color,
      '--font-title': settings.font_settings?.title_font || 'Inter'
    });
  };

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch("/api/branding");
        if (response.ok) {
          const settings = await response.json();
          applyBrandingStyles(settings);
          console.log("Branding loaded and applied:", settings.company_name);
        }
      } catch (error) {
        console.error("Failed to load branding:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();
  }, []);

  // Écouter les mises à jour de branding
  useEffect(() => {
    const handleBrandingUpdate = (event: CustomEvent<BrandingSettings>) => {
      console.log("Branding update received, applying styles...");
      applyBrandingStyles(event.detail);
    };

    window.addEventListener("brandingUpdated", handleBrandingUpdate as EventListener);
    
    return () => {
      window.removeEventListener("brandingUpdated", handleBrandingUpdate as EventListener);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du branding...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
