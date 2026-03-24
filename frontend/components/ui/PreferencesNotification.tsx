"use client";

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { usePreferencesSync } from '@/lib/use-preferences-sync';
import { useTranslation } from '@/lib/i18n-provider';

export default function PreferencesNotification() {
  const { t } = useTranslation();
  const preferences = usePreferencesSync();
  const [showNotification, setShowNotification] = useState(false);
  const [lastChange, setLastChange] = useState<string>('');

  useEffect(() => {
    if (preferences) {
      // Afficher une notification quand les préférences changent
      setShowNotification(true);
      setLastChange(new Date().toLocaleTimeString());
      
      // Cacher automatiquement après 3 secondes
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [preferences]);

  if (!showNotification || !preferences) {
    return null;
  }

  const getChangeMessage = () => {
    const changes = [];
    
    if (preferences.theme) {
      changes.push(preferences.theme === 'dark' ? t('preferences.dark_theme', 'Thème sombre') : t('preferences.light_theme', 'Thème clair'));
    }
    
    if (preferences.language) {
      const langNames = {
        fr: 'Français',
        en: 'English',
        es: 'Español'
      };
      changes.push(langNames[preferences.language as keyof typeof langNames] || preferences.language);
    }
    
    return changes.join(' • ');
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('preferences.updated', 'Préférences mises à jour')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getChangeMessage()}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {lastChange}
          </p>
        </div>
        
        <button
          onClick={() => setShowNotification(false)}
          className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
