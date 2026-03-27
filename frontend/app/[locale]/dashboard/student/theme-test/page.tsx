"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { Sun, Moon, RefreshCw, Trash2 } from "lucide-react";

export default function ThemeTestPage() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  const forceLightTheme = () => {
    addLog("🔄 Forçage du thème clair...");
    setTheme("light");
    localStorage.removeItem("theme");
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: "light" },
      })
    );
    addLog("✅ Thème clair forcé avec succès");
  };

  const forceDarkTheme = () => {
    addLog("🌙 Forçage du thème sombre...");
    setTheme("dark");
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: "dark" },
      })
    );
    addLog("✅ Thème sombre forcé avec succès");
  };

  const clearThemeData = () => {
    addLog("🗑️ Nettoyage complet des données de thème...");
    localStorage.removeItem("theme");
    sessionStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    addLog("✅ Données de thème nettoyées");
    // Recharger la page pour réinitialiser complètement
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    addLog(`🚀 Initialisation - Thème actuel: ${theme}`);
    addLog(`💾 localStorage theme: ${localStorage.getItem("theme") || "null"}`);
    addLog(
      `🎨 document.documentElement.classList: ${document.documentElement.classList.toString()}`
    );
    addLog(
      `🌈 document.documentElement.style.colorScheme: ${document.documentElement.style.colorScheme || "non défini"}`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧪 Test du Thème - Debug Complet
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Page de diagnostic pour résoudre les problèmes de thème
          </p>
        </div>

        {/* État actuel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            État Actuel du Système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  Thème React
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {theme === "light" ? "LIGHT ☀️" : "DARK 🌙"}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  localStorage
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {localStorage.getItem("theme") || "NULL"} 💾
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  HTML Class
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {document.documentElement.classList.contains("dark")
                  ? "DARK"
                  : "LIGHT"}{" "}
                🎨
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  Color Scheme
                </span>
              </div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {document.documentElement.style.colorScheme || "DEFAULT"} 🌈
              </p>
            </div>
          </div>
        </div>

        {/* Contrôles de forçage */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Contrôles de Forçage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Forcer le thème
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={forceLightTheme}
                  className="px-4 py-2 rounded-lg font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors shadow-lg"
                >
                  ☀️ Forcer LIGHT
                </button>
                <button
                  onClick={forceDarkTheme}
                  className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  🌙 Forcer DARK
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Nettoyage
              </h3>
              <button
                onClick={clearThemeData}
                className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                🗑️ Tout nettoyer + Reload
              </button>
            </div>
          </div>
        </div>

        {/* Logs de diagnostic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            📋 Logs de Diagnostic
          </h2>
          <div className="bg-gray-900 dark:bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-600">
                Aucun log pour le moment...
              </p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="text-green-400 dark:text-green-600 mb-1"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Instructions de Débogage
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>
              • <strong>Forcer LIGHT</strong> : Applique immédiatement le thème
              clair et nettoie le localStorage
            </li>
            <li>
              • <strong>Forcer DARK</strong> : Applique immédiatement le thème
              sombre
            </li>
            <li>
              • <strong>Tout nettoyer</strong> : Supprime toutes les données de
              thème et recharge la page
            </li>
            <li>• Les logs montrent l'état réel du système en temps réel</li>
            <li>• Testez les changements et vérifiez qu'ils persistent</li>
          </ul>
        </div>

        {/* Liens rapides */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🔗 Liens de Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/fr/dashboard/student"
              className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center"
            >
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                📊 Dashboard
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
              href="/fr/dashboard/student/test-theme"
              className="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center"
            >
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                🎨 Test Theme
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
