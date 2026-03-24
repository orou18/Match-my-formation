"use client";

import { useState, useEffect } from "react";
import { Bell, Globe, Moon, Sun, Mail, Smartphone } from "lucide-react";
import UserIdManager from "@/lib/user-id-manager";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/components/providers/TranslationProvider";

export default function PreferencesPage() {
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

  const cardStyle = "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all";

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Notifier les autres composants
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  };

  const handleLanguageChange = (newLanguage: 'fr' | 'en' | 'es') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
    
    // Notifier les autres composants
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage } 
    }));
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
      
      if (response.ok) {
        console.log('Préférences sauvegardées avec succès');
        showMessage('Préférences sauvegardées avec succès', 'success');
      } else {
        console.error('Erreur lors de la sauvegarde:', response.statusText);
        showMessage('Erreur lors de la sauvegarde', 'error');
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showMessage('Préférences sauvegardées localement', 'success');
    } finally {
      setLoading(false);
    }
  };

  const localT = (key: string, fallback: string) => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'preferences.title': 'Préférences',
        'preferences.notifications': 'Notifications',
        'preferences.notifications_desc': 'Gérez vos préférences de notification',
        'preferences.email_notifications': 'Notifications par email',
        'preferences.email_notifications_desc': 'Recevez les mises à jour par email',
        'preferences.push_notifications': 'Notifications push',
        'preferences.push_notifications_desc': 'Notifications sur votre appareil',
        'preferences.newsletter': 'Newsletter',
        'preferences.newsletter_desc': 'Actualités et nouveautés',
        'preferences.appearance': 'Apparence',
        'preferences.appearance_desc': 'Personnalisez l\'interface',
        'preferences.theme': 'Thème',
        'preferences.light_theme': 'Clair',
        'preferences.dark_theme': 'Sombre',
        'preferences.language_region': 'Langue et région',
        'preferences.language_region_desc': 'Configurez vos préférences linguistiques',
        'preferences.language': 'Langue',
        'preferences.timezone': 'Fuseau horaire',
        'preferences.save_preferences': 'Enregistrer les préférences',
        'common.saving': 'Sauvegarde...',
        'common.error': 'Erreur',
      },
      en: {
        'preferences.title': 'Preferences',
        'preferences.notifications': 'Notifications',
        'preferences.notifications_desc': 'Manage your notification preferences',
        'preferences.email_notifications': 'Email Notifications',
        'preferences.email_notifications_desc': 'Receive updates via email',
        'preferences.push_notifications': 'Push Notifications',
        'preferences.push_notifications_desc': 'Notifications on your device',
        'preferences.newsletter': 'Newsletter',
        'preferences.newsletter_desc': 'News and updates',
        'preferences.appearance': 'Appearance',
        'preferences.appearance_desc': 'Customize the interface',
        'preferences.theme': 'Theme',
        'preferences.light_theme': 'Light',
        'preferences.dark_theme': 'Dark',
        'preferences.language_region': 'Language and Region',
        'preferences.language_region_desc': 'Configure your language preferences',
        'preferences.language': 'Language',
        'preferences.timezone': 'Timezone',
        'preferences.save_preferences': 'Save Preferences',
        'common.saving': 'Saving...',
        'common.error': 'Error',
      },
      es: {
        'preferences.title': 'Preferencias',
        'preferences.notifications': 'Notificaciones',
        'preferences.notifications_desc': 'Gestiona tus preferencias de notificación',
        'preferences.email_notifications': 'Notificaciones por email',
        'preferences.email_notifications_desc': 'Recibe actualizaciones por email',
        'preferences.push_notifications': 'Notificaciones push',
        'preferences.push_notifications_desc': 'Notificaciones en tu dispositivo',
        'preferences.newsletter': 'Boletín',
        'preferences.newsletter_desc': 'Noticias y novedades',
        'preferences.appearance': 'Apariencia',
        'preferences.appearance_desc': 'Personaliza la interfaz',
        'preferences.theme': 'Tema',
        'preferences.light_theme': 'Claro',
        'preferences.dark_theme': 'Oscuro',
        'preferences.language_region': 'Idioma y región',
        'preferences.language_region_desc': 'Configura tus preferencias de idioma',
        'preferences.language': 'Idioma',
        'preferences.timezone': 'Zona horaria',
        'preferences.save_preferences': 'Guardar Preferencias',
        'common.saving': 'Guardando...',
        'common.error': 'Error',
      }
    };

    return translations[language]?.[key] || translations.fr[key] || fallback;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary dark:text-primary">{localT('preferences.title', 'Préférences')}</h1>
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
            <h3 className="font-bold text-lg text-primary dark:text-primary">{localT('preferences.notifications', 'Notifications')}</h3>
            <p className="text-sm text-secondary dark:text-secondary">{localT('preferences.notifications_desc', 'Gérez vos préférences de notification')}</p>
          </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary dark:text-secondary" />
                <div>
                  <p className="font-medium text-primary dark:text-primary">{localT('preferences.email_notifications', 'Notifications par email')}</p>
                  <p className="text-sm text-secondary dark:text-secondary">{localT('preferences.email_notifications_desc', 'Recevez les mises à jour par email')}</p>
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
                <Smartphone className="w-5 h-5 text-secondary dark:text-secondary" />
                <div>
                  <p className="font-medium text-primary dark:text-primary">{localT('preferences.push_notifications', 'Notifications push')}</p>
                  <p className="text-sm text-secondary dark:text-secondary">{localT('preferences.push_notifications_desc', 'Notifications sur votre appareil')}</p>
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
                <Mail className="w-5 h-5 text-secondary dark:text-secondary" />
                <div>
                  <p className="font-medium text-primary dark:text-primary">{localT('preferences.newsletter', 'Newsletter')}</p>
                  <p className="text-sm text-secondary dark:text-secondary">{localT('preferences.newsletter_desc', 'Actualités et nouveautés')}</p>
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
            <h3 className="font-bold text-lg text-primary dark:text-primary">{localT('preferences.appearance', 'Apparence')}</h3>
            <p className="text-sm text-secondary dark:text-secondary">{localT('preferences.appearance_desc', 'Personnalisez l\'interface')}</p>
          </div>
        </div>

        <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{localT('preferences.theme', 'Thème')}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">{localT('preferences.light_theme', 'Clair')}</p>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">{localT('preferences.dark_theme', 'Sombre')}</p>
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
            <h3 className="font-bold text-lg text-primary dark:text-primary">{localT('preferences.language_region', 'Langue et région')}</h3>
            <p className="text-sm text-secondary dark:text-secondary">{localT('preferences.language_region_desc', 'Configurez vos préférences linguistiques')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{localT('preferences.language', 'Langue')}</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as 'fr' | 'en' | 'es')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{localT('preferences.timezone', 'Fuseau horaire')}</label>
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
          {loading ? localT('common.saving', 'Sauvegarde...') : localT('preferences.save_preferences', 'Enregistrer les préférences')}
        </button>
      </div>
    </div>
  );
}