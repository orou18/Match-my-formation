"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Shield,
  Database,
  Bell,
  Palette,
  CreditCard,
  Users,
  FileText,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface SystemSettings {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  defaultLanguage: string;
  theme: "light" | "dark" | "auto";
  maxUploadSize: number;
  sessionTimeout: number;
}

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
}

/**
 * Helper pour gérer les réponses 401 (session expirée)
 */
const handleAuthError = (response: Response, router: ReturnType<typeof useRouter>, locale: string) => {
  if (response.status === 401) {
    console.error("[Auth] Session expirée - redirection vers login");
    router.push(`/${locale}/login`);
    return true;
  }
  return false;
};

/**
 * Configuration commune pour les requêtes fetch
 */
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };
};

export default function AdminSettings() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Récupérer le locale depuis les params
  const [locale, setLocale] = useState("fr");
  useEffect(() => {
    // Le locale est géré par le layout
  }, []);

  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  // Ajouter une notification
  const addNotification = (type: Notification["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // DEBUG: Session NextAuth
  useEffect(() => {
    console.log("[SETTINGS DEBUG] === Début debug session ===");
    console.log("[SETTINGS DEBUG] status:", status);
    console.log("[SETTINGS DEBUG] hasSession:", !!session);
    console.log("[SETTINGS DEBUG] userId:", session?.user?.id);
    console.log("[SETTINGS DEBUG] role:", session?.user?.role);
    console.log("[SETTINGS DEBUG] === Fin debug session ===");
  }, [session, status]);

  // Charger les settings depuis l'API
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const loadSettings = async () => {
      console.log("[SETTINGS DEBUG] === Début appel API settings ===");
      console.log("[SETTINGS DEBUG] endpoint:", "/api/admin/settings");

      try {
        setIsLoading(true);

        const response = await fetch("/api/admin/settings", getFetchOptions());
        
        // Gestion erreur 401
        if (handleAuthError(response, router, locale)) {
          return;
        }

        console.log("[SETTINGS DEBUG] Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings || data);
          console.log("[SETTINGS DEBUG] Settings chargés:", data);
        } else {
          const error = await response.json().catch(() => ({}));
          console.error("[SETTINGS DEBUG] Erreur:", error);
          addNotification("warning", "Paramètres par défaut utilisés");
          // Initialiser avec valeurs par défaut
          setSettings(getDefaultSettings());
        }
      } catch (err) {
        console.error("[SETTINGS DEBUG] Erreur réseau:", err);
        addNotification("error", "Impossible de charger les paramètres");
        setSettings(getDefaultSettings());
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [status, router, locale]);

  const getDefaultSettings = (): SystemSettings => ({
    siteName: "Match My Formation",
    siteUrl: "https://matchmyformation.com",
    adminEmail: "admin@matchmyformation.com",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    defaultLanguage: "fr",
    theme: "light",
    maxUploadSize: 10,
    sessionTimeout: 30,
  });

  // Safe normalization
  const safeSettings = settings ?? getDefaultSettings();

  const handleSave = async () => {
    if (!safeSettings) return;

    setSaving(true);
    try {
      console.log("[SETTINGS DEBUG] === Début sauvegarde ===");
      console.log("[SETTINGS DEBUG] Payload:", safeSettings);

      const response = await fetch("/api/admin/settings", getFetchOptions({
        method: "POST",
        body: JSON.stringify(safeSettings),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        console.log("[SETTINGS DEBUG] Sauvegarde réussie");
        addNotification("success", "Paramètres sauvegardés avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("[SETTINGS DEBUG] Erreur sauvegarde:", error);
        addNotification("error", error.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      console.error("[SETTINGS DEBUG] Erreur réseau:", err);
      addNotification("error", "Erreur de connexion lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(getDefaultSettings());
    addNotification("info", "Paramètres réinitialisés");
  };

  // Loading state - Skeleton cards
  if (status === "loading" || isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Settings cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notifications Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : notification.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : notification.type === "warning"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={18} />
              ) : notification.type === "error" ? (
                <AlertCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Paramètres Système
          </h1>
          <p className="text-gray-600 mt-1">
            Configurez les paramètres globaux de la plateforme
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={18} />
            )}
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paramètres Généraux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Globe size={20} />
              Paramètres Généraux
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={safeSettings.siteName}
                onChange={(e) =>
                  setSettings({ ...safeSettings, siteName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du site
              </label>
              <input
                type="url"
                value={safeSettings.siteUrl}
                onChange={(e) =>
                  setSettings({ ...safeSettings, siteUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email administrateur
              </label>
              <input
                type="email"
                value={safeSettings.adminEmail}
                onChange={(e) =>
                  setSettings({ ...safeSettings, adminEmail: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue par défaut
              </label>
              <select
                value={safeSettings.defaultLanguage}
                onChange={(e) =>
                  setSettings({ ...safeSettings, defaultLanguage: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Paramètres Système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings size={20} />
              Système
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille max upload (MB)
              </label>
              <input
                type="number"
                value={safeSettings.maxUploadSize}
                onChange={(e) =>
                  setSettings({
                    ...safeSettings,
                    maxUploadSize: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout session (minutes)
              </label>
              <input
                type="number"
                value={safeSettings.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...safeSettings,
                    sessionTimeout: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thème
              </label>
              <select
                value={safeSettings.theme}
                onChange={(e) =>
                  setSettings({
                    ...safeSettings,
                    theme: e.target.value as "light" | "dark" | "auto",
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Paramètres Utilisateurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} />
              Utilisateurs
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Mode maintenance</p>
                <p className="text-sm text-gray-500">
                  Désactive temporairement le site
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...safeSettings,
                    maintenanceMode: !safeSettings.maintenanceMode,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  safeSettings.maintenanceMode ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    safeSettings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Autoriser inscription
                </p>
                <p className="text-sm text-gray-500">
                  Permet aux nouveaux utilisateurs de s'inscrire
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...safeSettings,
                    allowRegistration: !safeSettings.allowRegistration,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  safeSettings.allowRegistration ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    safeSettings.allowRegistration
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifications email</p>
                <p className="text-sm text-gray-500">
                  Envoie les notifications par email
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...safeSettings,
                    emailNotifications: !safeSettings.emailNotifications,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  safeSettings.emailNotifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    safeSettings.emailNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Informations Système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database size={20} />
              Informations Système
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-medium text-gray-900">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">PHP</span>
              <span className="text-sm font-medium text-gray-900">8.2.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Base de données</span>
              <span className="text-sm font-medium text-gray-900">
                MySQL 8.0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Espace disque</span>
              <span className="text-sm font-medium text-gray-900">
                45.2 GB / 100 GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mémoire</span>
              <span className="text-sm font-medium text-gray-900">
                2.1 GB / 4 GB
              </span>
            </div>
          </div>
        </motion.div>

        {/* Sauvegarde */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database size={20} />
              Sauvegarde
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Dernière sauvegarde
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    15 mars 2024 à 14:30
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Database size={18} />
              Créer une sauvegarde
            </button>

            <button className="w-full bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <FileText size={18} />
              Voir les sauvegardes
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}