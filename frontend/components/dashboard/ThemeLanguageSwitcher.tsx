"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { Sun, Moon, Globe, Check, RefreshCw } from "lucide-react";

export default function ThemeLanguageSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'fr', name: t('language.french', 'Français'), flag: '🇫🇷' },
    { code: 'en', name: t('language.english', 'English'), flag: '🇬🇧' },
    { code: 'es', name: t('language.spanish', 'Español'), flag: '🇪🇸' },
  ];

  const handleLanguageChange = (langCode: 'fr' | 'en' | 'es') => {
    setLanguage(langCode);
    setShowLanguageMenu(false);
  };

  const forceLightTheme = () => {
    setTheme('light');
    // Forcer le nettoyage du localStorage
    localStorage.removeItem('theme');
    localStorage.setItem('theme', 'light');
    // Forcer l'application du thème clair
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    // Notifier les autres composants
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: 'light' } 
    }));
  };

  return (
    <div className="flex items-center gap-3">
      {/* Switcher de thème */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
        title={theme === 'light' ? t('theme.dark', 'Passer au mode sombre') : t('theme.light', 'Passer au mode clair')}
      >
        <div className="relative w-5 h-5">
          <Sun 
            className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
              theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`} 
          />
          <Moon 
            className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${
              theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`} 
          />
        </div>
      </button>

      {/* Switcher de langue */}
      <div className="relative">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          title={t('nav.preferences', 'Changer la langue')}
        >
          <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {languages.find(l => l.code === language)?.flag || '🇫🇷'}
          </span>
        </button>

        {/* Menu déroulant des langues */}
        {showLanguageMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as 'fr' | 'en' | 'es')}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bouton de reset forcé au thème clair */}
      <button
        onClick={forceLightTheme}
        className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all duration-200 group"
        title="Forcer le thème clair"
      >
        <RefreshCw className="w-4 h-4 text-yellow-600 dark:text-yellow-400 transition-transform group-hover:rotate-180" />
      </button>

      {/* Overlay pour fermer le menu */}
      {showLanguageMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </div>
  );
}
