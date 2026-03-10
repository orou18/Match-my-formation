"use client";

import { useState } from "react";
import { Bell, Globe, Moon, Sun, Mail, Smartphone } from "lucide-react";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
    language: "fr",
    theme: "light",
    timezone: "Europe/Paris",
  });

  const cardStyle = "bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all";

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof preferences] }));
  };

  const handleChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-[#002B24]">Préférences</h1>

      {/* Notifications */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Bell size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#002B24]">Notifications</h3>
            <p className="text-sm text-gray-400">Gérez vos préférences de notification</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-[#002B24]">Notifications par email</p>
                <p className="text-sm text-gray-400">Recevez les mises à jour par email</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("emailNotifications")}
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
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-[#002B24]">Notifications push</p>
                <p className="text-sm text-gray-400">Notifications sur votre appareil</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("pushNotifications")}
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
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-[#002B24]">Newsletter</p>
                <p className="text-sm text-gray-400">Actualités et nouveautés</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("newsletter")}
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
            {preferences.theme === "light" ? <Sun size={24} /> : <Moon size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#002B24]">Apparence</h3>
            <p className="text-sm text-gray-400">Personnalisez l'interface</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Thème</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChange("theme", "light")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  preferences.theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="font-medium">Clair</p>
              </button>
              <button
                onClick={() => handleChange("theme", "dark")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  preferences.theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="font-medium">Sombre</p>
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
            <h3 className="font-bold text-lg text-[#002B24]">Langue et région</h3>
            <p className="text-sm text-gray-400">Configurez vos préférences linguistiques</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
            <select
              value={preferences.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
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
        <button className="px-8 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors">
          Enregistrer les préférences
        </button>
      </div>
    </div>
  );
}