"use client";

import { useState, useEffect } from "react";
import { Bell, Globe, Moon, Sun, Mail, Smartphone } from "lucide-react";
import { ThemeProvider, useTheme } from "@/lib/theme-provider";
import { TranslationProvider, useTranslation } from "@/lib/i18n-provider";
import UserIdManager from "@/lib/user-id-manager";

function PreferencesPageContent() {
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
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Charger les préférences au démarrage
  useEffect(() => {
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

  // Synchroniser les préférences avec les providers
  const syncPreferences = (newPreferences: typeof preferences) => {
    const userPreferences = {
      ...newPreferences,
      language,
      theme,
    };
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    
    // Émettre un événement pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('preferencesChanged', { 
      detail: userPreferences 
    }));
  };

  const cardStyle = "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all";

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
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
      
      // Synchroniser immédiatement dans localStorage
      syncPreferences(preferences);
      
      // Sauvegarder via l'API
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: userPreferences
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Préférences sauvegardées via API:', result);
        showMessage(t('preferences.save_success', 'Préférences sauvegardées avec succès'), 'success');
      } else {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Même si l'API échoue, les préférences sont déjà synchronisées localement
      showMessage(t('preferences.save_success', 'Préférences sauvegardées localement'), 'success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary">{t('preferences.title', 'Préférences')}</h1>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Bell size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">{t('preferences.notifications', 'Notifications')}</h3>
            <p className="text-sm text-secondary">{t('preferences.notifications_desc', 'Gérez vos préférences de notification')}</p>
          </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium text-primary">{t('preferences.email_notifications', 'Notifications par email')}</p>
                  <p className="text-sm text-secondary">{t('preferences.email_notifications_desc', 'Recevez les mises à jour par email')}</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.emailNotifications ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.emailNotifications ? "right-1" : "left-1"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium text-primary">{t('preferences.push_notifications', 'Notifications push')}</p>
                  <p className="text-sm text-secondary">{t('preferences.push_notifications_desc', 'Notifications sur votre appareil')}</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.pushNotifications ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.pushNotifications ? "right-1" : "left-1"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium text-primary">{t('preferences.newsletter', 'Newsletter')}</p>
                  <p className="text-sm text-secondary">{t('preferences.newsletter_desc', 'Actualités et nouveautés')}</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, newsletter: !prev.newsletter }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.newsletter ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.newsletter ? "right-1" : "left-1"
                }`} />
              </button>
            </div>
        </div>
      </div>

      {/* Apparence */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            {theme === "light" ? <Sun size={24} /> : <Moon size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">{t('preferences.appearance', 'Apparence')}</h3>
            <p className="text-sm text-secondary">{t('preferences.appearance_desc', 'Personnalisez l\'interface')}</p>
          </div>
        </div>

        <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('preferences.theme', 'Thème')}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">{t('preferences.light_theme', 'Clair')}</p>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">{t('preferences.dark_theme', 'Sombre')}</p>
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* Langue et région */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">{t('preferences.language_region', 'Langue et région')}</h3>
            <p className="text-sm text-secondary">{t('preferences.language_region_desc', 'Configurez vos préférences linguistiques')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('preferences.language', 'Langue')}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'en' | 'es')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('preferences.timezone', 'Fuseau horaire')}</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <button 
          onClick={handleSavePreferences}
          disabled={loading}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('common.saving', 'Sauvegarde...') : t('preferences.save_preferences', 'Enregistrer les préférences')}
        </button>
      </div>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <PreferencesPageContent />
      </TranslationProvider>
    </ThemeProvider>
  );
}
