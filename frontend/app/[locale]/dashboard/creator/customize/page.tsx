"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  Palette,
  Layout,
  Eye,
  Save,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Grid3X3,
  List,
  BarChart3,
  Users,
  Video,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";
import { creatorDashboardApi } from "@/lib/services/creator-dashboard-api";

interface DashboardSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    cardStyle: "modern" | "classic" | "minimal";
  };
  layout: {
    sidebarPosition: "left" | "right";
    showStats: boolean;
    showQuickActions: boolean;
    defaultView: "grid" | "list";
  };
  widgets: {
    showRecentVideos: boolean;
    showTopEmployees: boolean;
    showActivity: boolean;
    showRevenue: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
  };
}

export default function CustomizeDashboard() {
  useParams();

  const [settings, setSettings] = useState<DashboardSettings>({
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#F9FAFB",
      cardStyle: "modern",
    },
    layout: {
      sidebarPosition: "left",
      showStats: true,
      showQuickActions: true,
      defaultView: "grid",
    },
    widgets: {
      showRecentVideos: true,
      showTopEmployees: true,
      showActivity: true,
      showRevenue: true,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("theme");

  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  const colorPresets = [
    { name: "Bleu Professionnel", primary: "#3B82F6", secondary: "#8B5CF6" },
    { name: "Vert Nature", primary: "#10B981", secondary: "#34D399" },
    { name: "Rouge Passion", primary: "#EF4444", secondary: "#F87171" },
    { name: "Violet Royal", primary: "#8B5CF6", secondary: "#A855F7" },
    { name: "Orange Energie", primary: "#F59E0B", secondary: "#F97316" },
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);

    try {
      await creatorDashboardApi.updateCustomizeSettings(settings);

      success(
        "Parametres importes",
        "Vos parametres ont ete appliques avec succes"
      );
      setPreviewMode(false);
    } catch {
      error(
        "Erreur de sauvegarde",
        "Une erreur est survenue lors de la sauvegarde"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = async () => {
    const defaultSettings: DashboardSettings = {
      theme: {
        primaryColor: "#3B82F6",
        secondaryColor: "#8B5CF6",
        backgroundColor: "#F9FAFB",
        cardStyle: "modern",
      },
      layout: {
        sidebarPosition: "left",
        showStats: true,
        showQuickActions: true,
        defaultView: "grid",
      },
      widgets: {
        showRecentVideos: true,
        showTopEmployees: true,
        showActivity: true,
        showRevenue: true,
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        weeklyReport: true,
      },
    };

    setSettings(defaultSettings);
    try {
      await creatorDashboardApi.updateCustomizeSettings(defaultSettings);
    } catch (resetError) {
      console.error(
        "Erreur lors de la reinitialisation des parametres:",
        resetError
      );
    }
    success(
      "Parametres reinitialises",
      "Les parametres par defaut ont ete appliques"
    );
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "dashboard-settings.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    success("Parametres exportes", "Vos parametres ont ete telecharges");
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        success(
          "Parametres importes",
          "Vos parametres ont ete appliques avec succes"
        );
      } catch {
        error("Erreur d'import", "Le fichier de parametres est invalide");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data =
          await creatorDashboardApi.getCustomizeSettings<DashboardSettings>();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des parametres:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span>Personnaliser le Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Configurez l&apos;apparence et les fonctionnalités de votre
                espace
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  previewMode
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? "Mode Preview" : "Mode Edition"}
              </button>

              <button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation par onglets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <nav className="space-y-2">
                {[
                  { id: "theme", label: "Theme et Couleurs", icon: Palette },
                  { id: "layout", label: "Mise en Page", icon: Layout },
                  { id: "widgets", label: "Widgets", icon: Grid3X3 },
                  {
                    id: "notifications",
                    label: "Notifications",
                    icon: BarChart3,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu de l'onglet actif */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* Onglet Theme */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-blue-600" />
                      Theme et Couleurs
                    </h3>

                    {/* Presets de couleurs */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Couleurs predefinies
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() =>
                              setSettings({
                                ...settings,
                                theme: {
                                  ...settings.theme,
                                  primaryColor: preset.primary,
                                  secondaryColor: preset.secondary,
                                },
                              })
                            }
                            className="p-3 rounded-lg border-2 transition-all hover:scale-105"
                            style={{
                              borderColor:
                                settings.theme.primaryColor === preset.primary
                                  ? preset.primary
                                  : "transparent",
                              background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                            }}
                          >
                            <div className="text-white text-xs font-medium text-center">
                              {preset.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Style des cartes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Style des cartes
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          {
                            value: "modern",
                            label: "Moderne",
                            description: "Design epure avec ombres",
                          },
                          {
                            value: "classic",
                            label: "Classique",
                            description: "Style traditionnel",
                          },
                          {
                            value: "minimal",
                            label: "Minimal",
                            description: "Design epure",
                          },
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() =>
                              setSettings({
                                ...settings,
                                theme: {
                                  ...settings.theme,
                                  cardStyle: style.value as
                                    | "modern"
                                    | "classic"
                                    | "minimal",
                                },
                              })
                            }
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              settings.theme.cardStyle === style.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {style.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {style.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Mise en Page */}
              {activeTab === "layout" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-600" />
                    Mise en Page
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Position de la barre laterale
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "left", label: "Gauche" },
                          { value: "right", label: "Droite" },
                        ].map((position) => (
                          <button
                            key={position.value}
                            onClick={() =>
                              setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  sidebarPosition: position.value as
                                    | "left"
                                    | "right",
                                },
                              })
                            }
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              settings.layout.sidebarPosition === position.value
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {position.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Vue par defaut
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "grid", label: "Grille", icon: Grid3X3 },
                          { value: "list", label: "Liste", icon: List },
                        ].map((view) => (
                          <button
                            key={view.value}
                            onClick={() =>
                              setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  defaultView: view.value as "grid" | "list",
                                },
                              })
                            }
                            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                              settings.layout.defaultView === view.value
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <view.icon className="w-3 h-3" />
                            {view.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options d'affichage */}
                    {[
                      {
                        key: "showStats",
                        label: "Afficher les statistiques",
                        icon: BarChart3,
                      },
                      {
                        key: "showQuickActions",
                        label: "Afficher les actions rapides",
                        icon: Target,
                      },
                    ].map((option) => (
                      <div
                        key={option.key}
                        className="flex items-center justify-between"
                      >
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <option.icon className="w-4 h-4 text-gray-500" />
                          {option.label}
                        </label>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              layout: {
                                ...settings.layout,
                                [option.key]:
                                  !settings.layout[
                                    option.key as keyof typeof settings.layout
                                  ],
                              },
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.layout[
                              option.key as keyof typeof settings.layout
                            ]
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.layout[
                                option.key as keyof typeof settings.layout
                              ]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Onglet Widgets */}
              {activeTab === "widgets" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-blue-600" />
                    Widgets du Dashboard
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        key: "showRecentVideos",
                        label: "Videos recentes",
                        icon: Video,
                        description: "Affiche vos dernieres videos",
                      },
                      {
                        key: "showTopEmployees",
                        label: "Meilleurs employes",
                        icon: Users,
                        description:
                          "Affiche les employes les plus performants",
                      },
                      {
                        key: "showActivity",
                        label: "Activite recente",
                        icon: TrendingUp,
                        description: "Affiche l'activite recente",
                      },
                      {
                        key: "showRevenue",
                        label: "Revenus",
                        icon: BarChart3,
                        description: "Affiche les statistiques de revenus",
                      },
                    ].map((widget) => (
                      <div
                        key={widget.key}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              settings.widgets[
                                widget.key as keyof typeof settings.widgets
                              ]
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <widget.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {widget.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {widget.description}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              widgets: {
                                ...settings.widgets,
                                [widget.key]:
                                  !settings.widgets[
                                    widget.key as keyof typeof settings.widgets
                                  ],
                              },
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.widgets[
                              widget.key as keyof typeof settings.widgets
                            ]
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.widgets[
                                widget.key as keyof typeof settings.widgets
                              ]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Onglet Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Preferences de Notification
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Notifications par email",
                        description:
                          "Recevoir les alertes importantes par email",
                      },
                      {
                        key: "pushNotifications",
                        label: "Notifications push",
                        description: "Notifications navigateur en temps reel",
                      },
                      {
                        key: "weeklyReport",
                        label: "Rapport hebdomadaire",
                        description: "Resume hebdomadaire de vos activites",
                      },
                    ].map((notification) => (
                      <div
                        key={notification.key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {notification.description}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [notification.key]:
                                  !settings.notifications[
                                    notification.key as keyof typeof settings.notifications
                                  ],
                              },
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications[
                              notification.key as keyof typeof settings.notifications
                            ]
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications[
                                notification.key as keyof typeof settings.notifications
                              ]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportSettings}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter les parametres
          </button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <label
              htmlFor="import-settings"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Importer des parametres
            </label>
          </div>

          <button
            onClick={handleResetSettings}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reinitialiser
          </button>
        </div>
      </div>

      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
