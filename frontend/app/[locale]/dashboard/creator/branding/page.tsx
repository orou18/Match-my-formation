"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Palette,
  Upload,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Globe,
  Lock,
  Zap,
  Star,
  Award,
  Target,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logo: File | null;
  logoPreview: string | null;
  companyName: string;
  tagline: string;
  customDomain: string;
  favicon: File | null;
  faviconPreview: string | null;
  customCSS: string;
  removeBranding: boolean;
}

export default function BrandingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [branding, setBranding] = useState<BrandingSettings>({
    primaryColor: "#007A7A",
    secondaryColor: "#004D40",
    accentColor: "#FFB800",
    fontFamily: "Inter",
    logo: null,
    logoPreview: null,
    companyName: "Jean Formateur",
    tagline: "Expert en tourisme",
    customDomain: "",
    favicon: null,
    faviconPreview: null,
    customCSS: "",
    removeBranding: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");

  const fontFamilies = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Poppins",
    "Playfair Display",
    "Raleway",
    "Lato",
  ];

  const presetThemes = [
    {
      name: "Professionnel",
      colors: { primary: "#007A7A", secondary: "#004D40", accent: "#FFB800" },
    },
    {
      name: "Moderne",
      colors: { primary: "#6366F1", secondary: "#4F46E5", accent: "#F59E0B" },
    },
    {
      name: "Élégant",
      colors: { primary: "#1F2937", secondary: "#111827", accent: "#D97706" },
    },
    {
      name: "Vibrant",
      colors: { primary: "#EC4899", secondary: "#DB2777", accent: "#10B981" },
    },
    {
      name: "Nature",
      colors: { primary: "#059669", secondary: "#047857", accent: "#F59E0B" },
    },
    {
      name: "Tech",
      colors: { primary: "#0EA5E9", secondary: "#0284C7", accent: "#F97316" },
    },
  ];

  const handleColorChange = (
    colorType: keyof BrandingSettings,
    value: string
  ) => {
    setBranding((prev) => ({ ...prev, [colorType]: value }));
  };

  const handleFileUpload = (file: File, type: "logo" | "favicon") => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding((prev) => ({
          ...prev,
          [type]: file,
          [`${type}Preview`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPresetTheme = (theme: (typeof presetThemes)[0]) => {
    setBranding((prev) => ({
      ...prev,
      primaryColor: theme.colors.primary,
      secondaryColor: theme.colors.secondary,
      accentColor: theme.colors.accent,
    }));
  };

  const saveBranding = async () => {
    setIsSaving(true);

    // Simuler la sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSaving(false);

    // Appliquer les changements au layout
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("brandingUpdated", { detail: branding })
      );
    }
  };

  const resetToDefault = () => {
    setBranding({
      primaryColor: "#007A7A",
      secondaryColor: "#004D40",
      accentColor: "#FFB800",
      fontFamily: "Inter",
      logo: null,
      logoPreview: null,
      companyName: "Jean Formateur",
      tagline: "Expert en tourisme",
      customDomain: "",
      favicon: null,
      faviconPreview: null,
      customCSS: "",
      removeBranding: false,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            Personnalisation marque blanche
          </h1>
          <p className="text-gray-600">
            Configurez l'apparence de votre dashboard creator
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showPreview ? "Masquer" : "Aperçu"}
          </button>

          <button
            onClick={resetToDefault}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>

          <button
            onClick={saveBranding}
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </motion.div>

      {/* Aperçu du dashboard */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aperçu du dashboard
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aperçu sidebar */}
            <div
              className="w-64 h-96 rounded-xl shadow-lg p-4"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <div className="text-white space-y-4">
                <div className="flex items-center gap-3">
                  {branding.logoPreview ? (
                    <img
                      src={branding.logoPreview}
                      alt="Logo"
                      className="w-8 h-8 rounded"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: branding.accentColor }}
                    >
                      {branding.companyName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: branding.fontFamily }}
                    >
                      {branding.companyName}
                    </p>
                    <p className="text-xs opacity-60">{branding.tagline}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {["Dashboard", "Vidéos", "Statistiques"].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-white/10 rounded-lg text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Aperçu contenu */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4
                  className="font-semibold mb-2"
                  style={{ color: branding.primaryColor }}
                >
                  Titre de l'exemple
                </h4>
                <p className="text-sm text-gray-600">
                  Ceci est un aperçu de l'apparence de votre contenu avec les
                  couleurs personnalisées.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-white rounded-lg text-sm"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Bouton principal
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm border"
                  style={{
                    borderColor: branding.accentColor,
                    color: branding.accentColor,
                  }}
                >
                  Bouton secondaire
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {["colors", "branding", "advanced"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "colors" && "Couleurs"}
                {tab === "branding" && "Logo & Texte"}
                {tab === "advanced" && "Avancé"}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Colors */}
          {activeTab === "colors" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Thèmes prédéfinis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thèmes prédéfinis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {presetThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => applyPresetTheme(theme)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors"
                    >
                      <div className="flex gap-1 mb-2">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>
                      <p className="text-xs font-medium">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Couleurs personnalisées */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Couleurs personnalisées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur principale
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={branding.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur secondaire
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={branding.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur d'accent
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={branding.accentColor}
                        onChange={(e) =>
                          handleColorChange("accentColor", e.target.value)
                        }
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={branding.accentColor}
                        onChange={(e) =>
                          handleColorChange("accentColor", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Police */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police de caractères
                </label>
                <select
                  value={branding.fontFamily}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      fontFamily: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Tab Branding */}
          {activeTab === "branding" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "logo")
                      }
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      {branding.logoPreview ? (
                        <img
                          src={branding.logoPreview}
                          alt="Logo"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </label>
                    {branding.logoPreview && (
                      <button
                        onClick={() =>
                          setBranding((prev) => ({
                            ...prev,
                            logo: null,
                            logoPreview: null,
                          }))
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Upload votre logo (PNG, JPG, SVG). Recommandé: 200x200px
                    </p>
                    {branding.logoPreview && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Logo uploadé avec succès
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations de l'entreprise */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={branding.tagline}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        tagline: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Domaine personnalisé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domaine personnalisé (Option PRO)
                </label>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={branding.customDomain}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        customDomain: e.target.value,
                      }))
                    }
                    placeholder="votre-domaine.com"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-medium rounded-full">
                    PRO
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Configurez votre propre domaine pour une marque blanche
                  complète
                </p>
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/x-icon,image/png"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "favicon")
                      }
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label
                      htmlFor="favicon-upload"
                      className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      {branding.faviconPreview ? (
                        <img
                          src={branding.faviconPreview}
                          alt="Favicon"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </label>
                    {branding.faviconPreview && (
                      <button
                        onClick={() =>
                          setBranding((prev) => ({
                            ...prev,
                            favicon: null,
                            faviconPreview: null,
                          }))
                        }
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Upload votre favicon (ICO, PNG). Recommandé: 32x32px
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab Advanced */}
          {activeTab === "advanced" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* CSS personnalisé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSS personnalisé
                </label>
                <textarea
                  rows={8}
                  value={branding.customCSS}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      customCSS: e.target.value,
                    }))
                  }
                  placeholder="/* Ajoutez votre CSS personnalisé ici */"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Ajoutez vos propres styles CSS pour personnaliser davantage
                  l'apparence
                </p>
              </div>

              {/* Options avancées */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Options avancées
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={branding.removeBranding}
                      onChange={(e) =>
                        setBranding((prev) => ({
                          ...prev,
                          removeBranding: e.target.checked,
                        }))
                      }
                      className="mr-3 rounded text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Retirer la marque Match My Formation
                      </span>
                      <p className="text-xs text-gray-600">
                        Option PRO uniquement
                      </p>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-medium rounded-full">
                      PRO
                    </span>
                  </label>
                </div>
              </div>

              {/* Export/Import */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Export/Import
                </h3>
                <div className="flex gap-4">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exporter la configuration
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Importer une configuration
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Features PRO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Star className="w-6 h-6" />
              Passez à la version PRO
            </h3>
            <p className="text-white/90 mb-4">
              Débloquez toutes les fonctionnalités de marque blanche : domaine
              personnalisé, retrait de branding, CSS avancé, et plus encore !
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="text-sm">Domaine personnalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">Sans branding</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">CSS illimité</span>
              </div>
            </div>
          </div>

          <button className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Passer en PRO
          </button>
        </div>
      </motion.div>
    </div>
  );
}
