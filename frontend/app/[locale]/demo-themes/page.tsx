"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { AppProviders } from "@/components/providers/AppProviders";
import { Sun, Moon, Globe, Bell, Palette } from "lucide-react";

function DemoThemesPageContent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎨 Démonstration du Système de Thème
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Testez le thème et la langue en temps réel sur toute la plateforme
          </p>
        </div>

        {/* Carte d'état actuel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            État Actuel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  Thème
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {theme === "light" ? "Clair ☀️" : "Sombre 🌙"}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Langue
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {language === "fr"
                  ? "Français 🇫🇷"
                  : language === "en"
                    ? "English 🇬🇧"
                    : "Español 🇪🇸"}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Mode
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {document.documentElement.classList.contains("dark")
                  ? "Dark 🌃"
                  : "Light 🌅"}
              </p>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🎮 Contrôles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thème */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Changer le thème
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === "light"
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  ☀️ Clair
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === "dark"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  🌙 Sombre
                </button>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors shadow-lg"
                >
                  🔄 Toggle
                </button>
              </div>
            </div>

            {/* Langue */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Changer la langue
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setLanguage("fr")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    language === "fr"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  🇫🇷 FR
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    language === "en"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    language === "es"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  🇪🇸 ES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test de réactivité */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🧪 Test de Réactivité
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Compteur de test :
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {count}
                </span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  +1
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <span className="text-gray-600 dark:text-gray-400">
                  localStorage theme :
                </span>
                <span className="ml-2 font-mono text-gray-900 dark:text-white">
                  {typeof window !== "undefined"
                    ? localStorage.getItem("theme") || "null"
                    : "N/A"}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <span className="text-gray-600 dark:text-gray-400">
                  localStorage language :
                </span>
                <span className="ml-2 font-mono text-gray-900 dark:text-white">
                  {typeof window !== "undefined"
                    ? localStorage.getItem("language") || "null"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Traductions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🌍 Traductions Actives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Dashboard :
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("nav.dashboard", "Tableau de bord")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Profile :
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("nav.profile", "Mon profil")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Preferences :
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("nav.preferences", "Préférences")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Courses :
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("nav.courses", "Cours")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Help :</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("nav.help", "Aide")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Logout :
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("nav.logout", "Déconnexion")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Instructions de Test
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>
              • Changez le thème avec les boutons ☀️ Clair / 🌙 Sombre / 🔄
              Toggle
            </li>
            <li>• Changez la langue avec les boutons 🇫🇷 FR / 🇬🇧 EN / 🇪🇸 ES</li>
            <li>
              • Les changements s'appliquent immédiatement sur toute la page
            </li>
            <li>• Les préférences sont sauvegardées dans localStorage</li>
            <li>• Testez la persistance en actualisant la page (F5)</li>
            <li>• Le thème et la langue sont synchronisés avec le dashboard</li>
          </ul>
        </div>

        {/* Liens rapides */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🔗 Liens Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/fr/dashboard/student"
              className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center"
            >
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                📊 Dashboard Student
              </span>
            </a>
            <a
              href="/fr/dashboard/student/profile/preferences/simple"
              className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-center"
            >
              <span className="text-green-600 dark:text-green-400 font-medium">
                ⚙️ Préférences
              </span>
            </a>
            <a
              href="/fr"
              className="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center"
            >
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                🏠 Accueil
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoThemesPage() {
  return (
    <AppProviders>
      <DemoThemesPageContent />
    </AppProviders>
  );
}
