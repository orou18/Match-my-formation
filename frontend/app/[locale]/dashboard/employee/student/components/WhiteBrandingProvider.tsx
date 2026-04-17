"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  companyName: string;
  customCSS?: string;
}

interface BrandingContextType {
  branding: BrandingConfig | null;
  isLoading: boolean;
  updateBranding: (branding: BrandingConfig) => void;
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
  children: React.ReactNode;
  creatorId: number;
}

export function BrandingProvider({ children, creatorId }: BrandingProviderProps) {
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const token = localStorage.getItem('employee_token');
        if (!token) return;

        const response = await fetch(`/api/creator/branding/${creatorId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setBranding(data.data);
          }
        }
      } catch (error) {
        console.error("Error loading branding:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();
  }, [creatorId]);

  useEffect(() => {
    if (branding) {
      // Appliquer les couleurs CSS personnalisées
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', branding.primaryColor);
      root.style.setProperty('--brand-secondary', branding.secondaryColor);
      root.style.setProperty('--brand-accent', branding.accentColor);
      
      // Appliquer le CSS personnalisé si présent
      if (branding.customCSS) {
        const styleElement = document.createElement('style');
        styleElement.textContent = branding.customCSS;
        styleElement.id = 'branding-custom-css';
        
        // Remplacer le style existant s'il y en a un
        const existing = document.getElementById('branding-custom-css');
        if (existing) {
          existing.replaceWith(styleElement);
        } else {
          document.head.appendChild(styleElement);
        }
      }
    }
  }, [branding]);

  const updateBranding = (newBranding: BrandingConfig) => {
    setBranding(newBranding);
  };

  return (
    <BrandingContext.Provider value={{ branding, isLoading, updateBranding }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-primary font-medium">Chargement du branding...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </BrandingContext.Provider>
  );
}
