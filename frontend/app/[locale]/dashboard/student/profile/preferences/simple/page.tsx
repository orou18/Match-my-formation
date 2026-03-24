"use client";

import { useState, useEffect } from "react";
import { Bell, Globe, Moon, Sun, Mail, Smartphone } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/components/providers/TranslationProvider";

export default function SimplePreferencesPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
    timezone: "Europe/Paris",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les préférences au démarrage
  useEffect(() => {
    // Charger les autres préférences
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({
          emailNotifications: parsed.emailNotifications ?? true,
          pushNotifications: parsed.pushNotifications ?? false,
          newsletter: parsed.newsletter ?? true,
          timezone: parsed.timezone ?? "Europe/Paris",
        });
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      }
    }
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    showMessage(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} appliqué`);
  };

  const handleLanguageChange = (newLanguage: 'fr' | 'en' | 'es') => {
    setLanguage(newLanguage);
    const langNames = { fr: 'Français', en: 'English', es: 'Español' };
    showMessage(`Langue changée en ${langNames[newLanguage]}`);
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      
      // Préparer les préférences complètes
      const userPreferences = {
        ...preferences,
        language,
        theme,
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
      
      // Notifier les autres composants
      window.dispatchEvent(new CustomEvent('preferencesChanged', { 
        detail: userPreferences 
      }));
      
      console.log('Préférences sauvegardées:', userPreferences);
      showMessage('Préférences sauvegardées avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showMessage('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('nav.preferences', 'Préférences')}</h1>
          {message && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              {message}
            </div>
          )}
        </div>

        {/* Thème */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              {theme === "light" ? <Sun className="w-5 h-5 text-blue-600" /> : <Moon className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thème</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choisissez l'apparence de l'interface</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === "light"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium text-gray-900 dark:text-white">Clair</p>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === "dark"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="font-medium text-gray-900 dark:text-white">Sombre</p>
            </button>
          </div>
        </div>

        {/* Langue */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Langue</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choisissez votre langue préférée</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === "fr"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <p className="text-2xl mb-1">🇫🇷</p>
              <p className="font-medium text-gray-900 dark:text-white">Français</p>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === "en"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <p className="text-2xl mb-1">🇬🇧</p>
              <p className="font-medium text-gray-900 dark:text-white">English</p>
            </button>
            <button
              onClick={() => handleLanguageChange('es')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === "es"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <p className="text-2xl mb-1">🇪🇸</p>
              <p className="font-medium text-gray-900 dark:text-white">Español</p>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('nav.notifications', 'Notifications')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gérez vos préférences de notification</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir les mises à jour par email</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.emailNotifications ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.emailNotifications ? "right-1" : "left-1"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notifications sur votre appareil</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.pushNotifications ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.pushNotifications ? "right-1" : "left-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button 
            onClick={handleSavePreferences}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : 'Enregistrer les préférences'}
          </button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Info :</strong> Les changements de thème et de langue sont appliqués immédiatement sur toute la plateforme. 
            Les autres préférences sont sauvegardées pour une utilisation future.
          </p>
        </div>
      </div>
    </div>
  );
}
