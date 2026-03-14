"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Upload,
  Download,
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  FileText,
  Key,
  Zap,
  Database,
  Users as UsersIcon,
  Video,
  MessageSquare,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useParams } from "next/navigation";

interface CreatorSettings {
  profile: {
    name: string;
    email: string;
    bio: string;
    avatar: string;
    banner: string;
    location: string;
    website: string;
    socialLinks: {
      youtube: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
  notifications: {
    email: boolean;
    push: boolean;
    newComments: boolean;
    newSubscribers: boolean;
    videoUploads: boolean;
    revenueUpdates: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'unlisted';
    showEmail: boolean;
    showLocation: boolean;
    showStats: boolean;
    allowComments: boolean;
    allowMessages: boolean;
    dataSharing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  billing: {
    plan: string;
    status: string;
    nextBilling: string;
    paymentMethod: string;
    invoices: Array<{
      id: string;
      date: string;
      amount: number;
      status: 'paid' | 'pending' | 'failed';
    }>;
  };
  integrations: {
    connectedServices: Array<{
      name: string;
      status: 'connected' | 'disconnected';
      lastSync: string;
    }>;
    apiKeys: Array<{
      name: string;
      key: string;
      createdAt: string;
      lastUsed: string;
    }>;
  };
  advanced: {
    dataExport: boolean;
    autoBackup: boolean;
    cacheEnabled: boolean;
    debugMode: boolean;
    betaFeatures: boolean;
  };
}

export default function CreatorSettingsPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [settings, setSettings] = useState<CreatorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'billing' | 'integrations' | 'advanced'>('profile');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    // Simuler le chargement des paramètres
    const mockSettings: CreatorSettings = {
      profile: {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        bio: 'Expert en tourisme durable et marketing digital. Je partage mes connaissances pour aider les professionnels du secteur.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        banner: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=300&fit=crop',
        location: 'Paris, France',
        website: 'https://jeandupont.fr',
        socialLinks: {
          youtube: 'https://youtube.com/@jeandupont',
          twitter: 'https://twitter.com/@jeandupont',
          instagram: 'https://instagram.com/@jeandupont',
          linkedin: 'https://linkedin.com/in/jeandupont',
        },
      },
      notifications: {
        email: true,
        push: true,
        newComments: true,
        newSubscribers: true,
        videoUploads: true,
        revenueUpdates: true,
        systemUpdates: false,
        marketingEmails: false,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showLocation: true,
        showStats: true,
        allowComments: true,
        allowMessages: true,
        dataSharing: false,
      },
      appearance: {
        theme: 'light',
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        currency: 'EUR',
      },
      billing: {
        plan: 'Professional',
        status: 'Active',
        nextBilling: '2024-04-15',
        paymentMethod: 'Visa ****4242',
        invoices: [
          {
            id: 'INV-001',
            date: '2024-03-15',
            amount: 49.99,
            status: 'paid',
          },
          {
            id: 'INV-002',
            date: '2024-02-15',
            amount: 49.99,
            status: 'paid',
          },
          {
            id: 'INV-003',
            date: '2024-01-15',
            amount: 49.99,
            status: 'paid',
          },
        ],
      },
      integrations: {
        connectedServices: [
          {
            name: 'YouTube',
            status: 'connected',
            lastSync: '2024-03-14T10:30:00Z',
          },
          {
            name: 'Google Analytics',
            status: 'connected',
            lastSync: '2024-03-14T09:15:00Z',
          },
          {
            name: 'Mailchimp',
            status: 'disconnected',
            lastSync: '2024-03-10T14:20:00Z',
          },
        ],
        apiKeys: [
          {
            name: 'Application Mobile',
            key: 'ak_test_1234567890abcdef',
            createdAt: '2024-01-15T10:30:00Z',
            lastUsed: '2024-03-14T15:20:00Z',
          },
          {
            name: 'API Web',
            key: 'ak_test_fedcba0987654321',
            createdAt: '2024-02-20T14:20:00Z',
            lastUsed: '2024-03-13T09:45:00Z',
          },
        ],
      },
      advanced: {
        dataExport: false,
        autoBackup: true,
        cacheEnabled: true,
        debugMode: false,
        betaFeatures: false,
      },
    };

    setTimeout(() => {
      setSettings(mockSettings);
      setLoading(false);
    }, 1200);
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const handleGenerateApiKey = () => {
    const newKey = 'ak_test_' + Math.random().toString(36).substring(2, 15);
    setNewApiKey(newKey);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'profile':
        return <User className="w-5 h-5" />;
      case 'notifications':
        return <Bell className="w-5 h-5" />;
      case 'privacy':
        return <Shield className="w-5 h-5" />;
      case 'appearance':
        return <Palette className="w-5 h-5" />;
      case 'billing':
        return <CreditCard className="w-5 h-5" />;
      case 'integrations':
        return <Zap className="w-5 h-5" />;
      case 'advanced':
        return <Settings className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-8 h-8 text-gray-600" />
            Paramètres
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos paramètres et préférences
          </p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profil' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'privacy', label: 'Confidentialité' },
                { id: 'appearance', label: 'Apparence' },
                { id: 'billing', label: 'Facturation' },
                { id: 'integrations', label: 'Intégrations' },
                { id: 'advanced', label: 'Avancé' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getTabIcon(tab.id)}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil</h2>
                
                {/* Avatar and Banner */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bannière</label>
                    <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={settings.profile.banner}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Changer
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-4">
                    <div className="relative">
                      <img
                        src={settings.profile.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                    <input
                      type="text"
                      value={settings.profile.location}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        profile: { ...prev.profile, location: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <input
                      type="url"
                      value={settings.profile.website}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        profile: { ...prev.profile, website: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      profile: { ...prev.profile, bio: e.target.value }
                    } : null)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                      <input
                        type="url"
                        value={settings.profile.socialLinks.youtube}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          profile: {
                            ...prev.profile,
                            socialLinks: { ...prev.profile.socialLinks, youtube: e.target.value }
                          }
                        } : null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="url"
                        value={settings.profile.socialLinks.twitter}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          profile: {
                            ...prev.profile,
                            socialLinks: { ...prev.profile.socialLinks, twitter: e.target.value }
                          }
                        } : null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                      <input
                        type="url"
                        value={settings.profile.socialLinks.instagram}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          profile: {
                            ...prev.profile,
                            socialLinks: { ...prev.profile.socialLinks, instagram: e.target.value }
                          }
                        } : null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={settings.profile.socialLinks.linkedin}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          profile: {
                            ...prev.profile,
                            socialLinks: { ...prev.profile.socialLinks, linkedin: e.target.value }
                          }
                        } : null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications push</h3>
                      <p className="text-sm text-gray-600">Recevoir des notifications push sur votre appareil</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          notifications: { ...prev.notifications, push: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Nouveaux commentaires</h3>
                      <p className="text-sm text-gray-600">Être notifié des nouveaux commentaires sur vos vidéos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newComments}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          notifications: { ...prev.notifications, newComments: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Nouveaux abonnés</h3>
                      <p className="text-sm text-gray-600">Être notifié des nouveaux abonnés</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newSubscribers}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          notifications: { ...prev.notifications, newSubscribers: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Mises à jour de revenus</h3>
                      <p className="text-sm text-gray-600">Recevoir des alertes sur vos revenus</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.revenueUpdates}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          notifications: { ...prev.notifications, revenueUpdates: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Emails marketing</h3>
                      <p className="text-sm text-gray-600">Recevoir des emails marketing et promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.marketingEmails}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          notifications: { ...prev.notifications, marketingEmails: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Confidentialité</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibilité du profil</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        privacy: { ...prev.privacy, profileVisibility: e.target.value as any }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Privé</option>
                      <option value="unlisted">Non listé</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-900">Afficher l'email</h3>
                        <p className="text-sm text-gray-600">Rendre votre email visible publiquement</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showEmail}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, showEmail: e.target.checked }
                        } : null)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-900">Afficher la localisation</h3>
                        <p className="text-sm text-gray-600">Rendre votre localisation visible publiquement</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showLocation}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, showLocation: e.target.checked }
                        } : null)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-900">Afficher les statistiques</h3>
                        <p className="text-sm text-gray-600">Rendre vos statistiques publiques</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showStats}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, showStats: e.target.checked }
                        } : null)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-900">Autoriser les commentaires</h3>
                        <p className="text-sm text-gray-600">Permettre aux utilisateurs de commenter</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowComments}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, allowComments: e.target.checked }
                        } : null)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-900">Autoriser les messages</h3>
                        <p className="text-sm text-gray-600">Permettre aux utilisateurs de vous envoyer des messages</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowMessages}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, allowMessages: e.target.checked }
                        } : null)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-900">Partage de données</h3>
                        <p className="text-sm text-gray-600">Partager des données anonymes pour améliorer le service</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.dataSharing}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, dataSharing: e.target.checked }
                        } : null)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Apparence</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        appearance: { ...prev.appearance, theme: e.target.value as any }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        appearance: { ...prev.appearance, language: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        appearance: { ...prev.appearance, timezone: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="Australia/Sydney">Australia/Sydney</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
                    <select
                      value={settings.appearance.dateFormat}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        appearance: { ...prev.appearance, dateFormat: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                    <select
                      value={settings.appearance.currency}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        appearance: { ...prev.appearance, currency: e.target.value }
                      } : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Facturation</h2>
                
                {/* Current Plan */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Plan {settings.billing.plan}</h3>
                      <p className="text-gray-600">Statut: <span className="text-green-600 font-medium">{settings.billing.status}</span></p>
                      <p className="text-sm text-gray-500 mt-1">Prochaine facturation: {formatDate(settings.billing.nextBilling)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">€49.99</p>
                      <p className="text-sm text-gray-500">/ mois</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Méthode de paiement</h3>
                  <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{settings.billing.paymentMethod}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Modifier
                    </button>
                  </div>
                </div>

                {/* Invoices */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Factures</h3>
                  <div className="space-y-3">
                    {settings.billing.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-sm text-gray-600">{formatDate(invoice.date)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">€{invoice.amount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status === 'paid' ? 'Payée' :
                             invoice.status === 'pending' ? 'En attente' : 'Échouée'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Intégrations</h2>
                
                {/* Connected Services */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Services connectés</h3>
                  <div className="space-y-3">
                    {settings.integrations.connectedServices.map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600">
                            Dernière synchronisation: {formatDate(service.lastSync)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700">
                            {service.status === 'connected' ? 'Déconnecter' : 'Connecter'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Keys */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Clés API</h3>
                    <button
                      onClick={handleGenerateApiKey}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Générer une clé
                    </button>
                  </div>
                  
                  {newApiKey && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-yellow-800">Nouvelle clé API générée</p>
                          <p className="text-sm text-yellow-700 font-mono">{newApiKey}</p>
                          <p className="text-xs text-yellow-600 mt-1">Copiez cette clé maintenant, elle ne sera plus affichée</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(newApiKey);
                            setNewApiKey('');
                          }}
                          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          Copier
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {settings.integrations.apiKeys.map((apiKey) => (
                      <div key={apiKey.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{apiKey.name}</p>
                          <p className="text-sm text-gray-600 font-mono">{apiKey.key.substring(0, 20)}...</p>
                          <p className="text-xs text-gray-500">
                            Créée: {formatDate(apiKey.createdAt)} | 
                            Dernière utilisation: {formatDate(apiKey.lastUsed)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres avancés</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Exportation de données</h3>
                      <p className="text-sm text-gray-600">Permettre l'exportation de vos données</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.advanced.dataExport}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          advanced: { ...prev.advanced, dataExport: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Sauvegarde automatique</h3>
                      <p className="text-sm text-gray-600">Activer les sauvegardes automatiques</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.advanced.autoBackup}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          advanced: { ...prev.advanced, autoBackup: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Cache activé</h3>
                      <p className="text-sm text-gray-600">Améliorer les performances avec le cache</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.advanced.cacheEnabled}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          advanced: { ...prev.advanced, cacheEnabled: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Mode debug</h3>
                      <p className="text-sm text-gray-600">Activer le mode debug pour le développement</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.advanced.debugMode}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          advanced: { ...prev.advanced, debugMode: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Fonctionnalités bêta</h3>
                      <p className="text-sm text-gray-600">Accéder aux fonctionnalités expérimentales</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.advanced.betaFeatures}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          advanced: { ...prev.advanced, betaFeatures: e.target.checked }
                        } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Zone de danger</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">Supprimer le compte</p>
                        <p className="text-sm text-red-600">Cette action est irréversible</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
