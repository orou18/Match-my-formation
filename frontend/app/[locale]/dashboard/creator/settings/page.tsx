"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  CreditCard,
  Download,
  Upload,
  Save,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit2,
  Trash2,
  Plus,
  Copy,
  ExternalLink,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Languages,
  Volume2,
  Wifi,
  Database,
  Key,
  Fingerprint,
  HelpCircle,
  FileText,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [profile, setProfile] = useState({
    firstName: "Jean",
    lastName: "Formateur",
    email: "creator@match.com",
    phone: "+33 6 12 34 56 78",
    bio: "Expert en tourisme et hôtellerie avec plus de 10 ans d'expérience. Passionné par la formation et le partage de connaissances.",
    location: "Paris, France",
    website: "www.jeanformateur.com",
    language: "fr",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowComments: true,
    twoFactor: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "fr",
    timezone: "Europe/Paris",
    dateFormat: "DD/MM/YYYY",
    currency: "EUR",
  });

  const [notificationsSettings, setNotificationsSettings] = useState({
    newFollowers: true,
    newComments: true,
    newLikes: false,
    newShares: false,
    mentions: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const tabs = [
    { id: "profile", name: "Profil", icon: User },
    { id: "privacy", name: "Confidentialité", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Apparence", icon: Palette },
    { id: "billing", name: "Facturation", icon: CreditCard },
    { id: "advanced", name: "Avancé", icon: Zap },
    { id: "help", name: "Aide", icon: HelpCircle },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et votre compte</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <nav className="space-y-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 w-full"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-[800px]">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profil</h2>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? "Enregistré !" : "Enregistrer"}
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {profile.firstName.charAt(0)}
                        {profile.lastName.charAt(0)}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-gray-600">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        PRO
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Vérifié
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        handleProfileChange("location", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site web
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) =>
                        handleProfileChange("website", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Confidentialité
                  </h2>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? "Enregistré !" : "Enregistrer"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Visibilité du profil
                      </h3>
                      <p className="text-sm text-gray-600">
                        Choisissez qui peut voir votre profil
                      </p>
                    </div>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) =>
                        handlePrivacyChange("profileVisibility", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="public">Public</option>
                      <option value="private">Privé</option>
                      <option value="followers">Abonnés uniquement</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Afficher l'email
                      </h3>
                      <p className="text-sm text-gray-600">
                        Rendre votre email visible sur votre profil
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyChange("showEmail", !privacy.showEmail)
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.showEmail ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          privacy.showEmail
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Afficher le téléphone
                      </h3>
                      <p className="text-sm text-gray-600">
                        Rendre votre téléphone visible sur votre profil
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyChange("showPhone", !privacy.showPhone)
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.showPhone ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          privacy.showPhone
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Autoriser les messages
                      </h3>
                      <p className="text-sm text-gray-600">
                        Permettre aux autres de vous envoyer des messages
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyChange(
                          "allowMessages",
                          !privacy.allowMessages
                        )
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.allowMessages ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          privacy.allowMessages
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Autoriser les commentaires
                      </h3>
                      <p className="text-sm text-gray-600">
                        Permettre aux autres de commenter votre contenu
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyChange(
                          "allowComments",
                          !privacy.allowComments
                        )
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.allowComments ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          privacy.allowComments
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Authentification à deux facteurs
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ajoutez une couche de sécurité supplémentaire
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handlePrivacyChange("twoFactor", !privacy.twoFactor)
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.twoFactor ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          privacy.twoFactor
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Notifications
                  </h2>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? "Enregistré !" : "Enregistrer"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Nouveaux abonnés
                      </h3>
                      <p className="text-sm text-gray-600">
                        Soyez notifié quand quelqu'un s'abonne
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          newFollowers: !prev.newFollowers,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.newFollowers
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.newFollowers
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Nouveaux commentaires
                      </h3>
                      <p className="text-sm text-gray-600">
                        Soyez notifié des nouveaux commentaires
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          newComments: !prev.newComments,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.newComments
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.newComments
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Nouveaux likes
                      </h3>
                      <p className="text-sm text-gray-600">
                        Soyez notifié des nouveaux likes
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          newLikes: !prev.newLikes,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.newLikes
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.newLikes
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Mentions</h3>
                      <p className="text-sm text-gray-600">
                        Soyez notifié quand vous êtes mentionné
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          mentions: !prev.mentions,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.mentions
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.mentions
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Mises à jour système
                      </h3>
                      <p className="text-sm text-gray-600">
                        Soyez notifié des mises à jour importantes
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          systemUpdates: !prev.systemUpdates,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.systemUpdates
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.systemUpdates
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Emails marketing
                      </h3>
                      <p className="text-sm text-gray-600">
                        Recevoir des emails promotionnels
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          marketingEmails: !prev.marketingEmails,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.marketingEmails
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.marketingEmails
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Digest hebdomadaire
                      </h3>
                      <p className="text-sm text-gray-600">
                        Recevoir un résumé hebdomadaire
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsSettings((prev) => ({
                          ...prev,
                          weeklyDigest: !prev.weeklyDigest,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsSettings.weeklyDigest
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationsSettings.weeklyDigest
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Apparence</h2>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? "Enregistré !" : "Enregistrer"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Thème</h3>
                      <p className="text-sm text-gray-600">
                        Choisissez votre thème préféré
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setAppearance((prev) => ({ ...prev, theme: "light" }))
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          appearance.theme === "light"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setAppearance((prev) => ({ ...prev, theme: "dark" }))
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          appearance.theme === "dark"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Langue</h3>
                      <p className="text-sm text-gray-600">
                        Choisissez votre langue
                      </p>
                    </div>
                    <select
                      value={appearance.language}
                      onChange={(e) =>
                        setAppearance((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Fuseau horaire
                      </h3>
                      <p className="text-sm text-gray-600">
                        Définissez votre fuseau horaire
                      </p>
                    </div>
                    <select
                      value={appearance.timezone}
                      onChange={(e) =>
                        setAppearance((prev) => ({
                          ...prev,
                          timezone: e.target.value,
                        }))
                      }
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="Australia/Sydney">Australia/Sydney</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Format de date
                      </h3>
                      <p className="text-sm text-gray-600">
                        Choisissez le format de date
                      </p>
                    </div>
                    <select
                      value={appearance.dateFormat}
                      onChange={(e) =>
                        setAppearance((prev) => ({
                          ...prev,
                          dateFormat: e.target.value,
                        }))
                      }
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Devise</h3>
                      <p className="text-sm text-gray-600">
                        Choisissez votre devise
                      </p>
                    </div>
                    <select
                      value={appearance.currency}
                      onChange={(e) =>
                        setAppearance((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholders */}
            {activeTab === "billing" && (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Facturation
                </h3>
                <p className="text-gray-600">
                  Gérez votre abonnement et vos paiements
                </p>
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Paramètres avancés
                </h3>
                <p className="text-gray-600">
                  Options techniques et développeur
                </p>
              </div>
            )}

            {activeTab === "help" && (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aide
                </h3>
                <p className="text-gray-600">Centre d'aide et support</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
