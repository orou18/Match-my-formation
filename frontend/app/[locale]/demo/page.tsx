"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-provider";
import { useTranslation } from "@/lib/i18n-provider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { Moon, Sun, Globe, Palette, Bell, User, Shield } from "lucide-react";

export default function DemoPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            {t('demo.title', 'Démonstration Thème & Traductions')}
          </h1>
          <p className="text-secondary text-lg">
            {t('demo.subtitle', 'Testez le changement de thème et de langue en temps réel')}
          </p>
        </div>

        {/* Contrôles */}
        <div className="card p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Palette className="w-6 h-6" />
            {t('demo.controls', 'Contrôles')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            {/* Toggle Thème */}
            <div className="flex items-center gap-3 p-4 bg-tertiary rounded-lg">
              <span className="text-sm font-medium">{t('preferences.theme', 'Thème')}:</span>
              <ThemeToggle />
              <span className="text-sm text-tertiary">({theme})</span>
            </div>

            {/* Toggle Langue */}
            <div className="flex items-center gap-3 p-4 bg-tertiary rounded-lg">
              <span className="text-sm font-medium">{t('preferences.language', 'Langue')}:</span>
              <LanguageToggle />
              <span className="text-sm text-tertiary">({language})</span>
            </div>
          </div>
        </div>

        {/* Test des traductions */}
        <div className="card p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Globe className="w-6 h-6" />
            {t('demo.translations', 'Traductions')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-primary">Navigation</h3>
              <ul className="space-y-1 text-sm">
                <li>• {t('nav.dashboard', 'Dashboard')}</li>
                <li>• {t('nav.profile', 'Mon profil')}</li>
                <li>• {t('nav.security', 'Sécurité')}</li>
                <li>• {t('nav.preferences', 'Préférences')}</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-primary">Actions</h3>
              <ul className="space-y-1 text-sm">
                <li>• {t('common.save', 'Enregistrer')}</li>
                <li>• {t('common.cancel', 'Annuler')}</li>
                <li>• {t('common.edit', 'Modifier')}</li>
                <li>• {t('common.delete', 'Supprimer')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test des couleurs de thème */}
        <div className="card p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Palette className="w-6 h-6" />
            {t('demo.theme_colors', 'Couleurs du thème')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary text-white rounded-lg text-center">
              <p className="font-medium">Primary</p>
              <p className="text-sm opacity-90">var(--accent-primary)</p>
            </div>
            
            <div className="p-4 bg-secondary text-primary rounded-lg text-center border">
              <p className="font-medium">Secondary</p>
              <p className="text-sm opacity-90">var(--bg-secondary)</p>
            </div>
            
            <div className="p-4 bg-tertiary text-primary rounded-lg text-center border">
              <p className="font-medium">Tertiary</p>
              <p className="text-sm opacity-90">var(--bg-tertiary)</p>
            </div>
          </div>
        </div>

        {/* Test interactif */}
        <div className="card p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Bell className="w-6 h-6" />
            {t('demo.interactive', 'Test Interactif')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCount(count + 1)}
                className="btn-primary px-4 py-2 rounded-lg"
              >
                {t('demo.increment', 'Incrémenter')} ({count})
              </button>
              
              <button 
                onClick={() => setCount(0)}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                {t('demo.reset', 'Réinitialiser')}
              </button>
            </div>
            
            <div className="p-4 bg-tertiary rounded-lg">
              <p className="text-sm">
                {t('demo.count_message', 'Compteur actuel')}: <span className="font-bold text-primary">{count}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Test des icônes */}
        <div className="card p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <User className="w-6 h-6" />
            {t('demo.icons', 'Icônes du thème')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 p-3 bg-tertiary rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm">{t('nav.profile', 'Profil')}</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-tertiary rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">{t('nav.security', 'Sécurité')}</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-tertiary rounded-lg">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              <span className="text-sm">{theme === 'dark' ? t('preferences.dark_theme', 'Sombre') : t('preferences.light_theme', 'Clair')}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card p-6 border-l-4 border-primary">
          <h3 className="font-semibold text-primary mb-2">
            {t('demo.instructions', 'Instructions')}
          </h3>
          <ul className="text-sm text-secondary space-y-1">
            <li>• {t('demo.instruction_theme', 'Cliquez sur l\'icône lune/soleil pour changer le thème')}</li>
            <li>• {t('demo.instruction_language', 'Cliquez sur le drapeau pour changer la langue')}</li>
            <li>• {t('demo.instruction_persistence', 'Les préférences sont sauvegardées automatiquement')}</li>
            <li>• {t('demo.instruction_refresh', 'Rafraîchissez la page pour voir la persistance')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
