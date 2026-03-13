"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Image,
  Settings,
  Download,
  Upload,
} from "lucide-react";

interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  status: "active" | "unsubscribed" | "bounced";
  subscribedAt: string;
  lastOpen?: string;
  lastClick?: string;
  opens: number;
  clicks: number;
  location?: string;
  source: "website" | "import" | "manual";
}

interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent" | "sending";
  sentAt?: string;
  scheduledAt?: string;
  recipients: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bounced: number;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  preview: string;
  category: string;
  createdAt: string;
  usageCount: number;
}

export default function AdminNewsletterPage() {
  const [activeTab, setActiveTab] = useState<"subscribers" | "campaigns" | "templates" | "analytics">("subscribers");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed" | "bounced">("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<NewsletterCampaign | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données newsletter
    const mockSubscribers: NewsletterSubscriber[] = [
      {
        id: "1",
        email: "alice@example.com",
        name: "Alice Martin",
        status: "active",
        subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        lastOpen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        lastClick: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        opens: 12,
        clicks: 3,
        location: "Paris, France",
        source: "website"
      },
      {
        id: "2",
        email: "bob@example.com",
        name: "Bob Dupont",
        status: "active",
        subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        lastOpen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        opens: 8,
        clicks: 2,
        location: "Lyon, France",
        source: "import"
      },
      {
        id: "3",
        email: "charlie@example.com",
        name: "Charlie Durand",
        status: "unsubscribed",
        subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        opens: 15,
        clicks: 4,
        source: "website"
      },
      {
        id: "4",
        email: "diana@example.com",
        name: "Diana Lefebvre",
        status: "bounced",
        subscribedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
        opens: 0,
        clicks: 0,
        source: "manual"
      }
    ];

    const mockCampaigns: NewsletterCampaign[] = [
      {
        id: "1",
        title: "Nouveaux Cours de Tourisme",
        subject: "Découvrez nos dernières formations en tourisme durable",
        content: "Bonjour, nous sommes ravis de vous annoncer...",
        status: "sent",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        recipients: 1250,
        opened: 890,
        clicked: 234,
        unsubscribed: 12,
        bounced: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
      },
      {
        id: "2",
        title: "Offre Spéciale Été",
        subject: "Profitez de -20% sur toutes nos formations",
        content: "Cette été, profitez d'une offre exceptionnelle...",
        status: "scheduled",
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        recipients: 1500,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: "3",
        title: "Mise à jour Platforme",
        subject: "Nouvelles fonctionnalités disponibles",
        content: "Nous avons le plaisir de vous annoncer...",
        status: "draft",
        recipients: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
      }
    ];

    const mockTemplates: NewsletterTemplate[] = [
      {
        id: "1",
        name: "Template Bienvenue",
        subject: "Bienvenue chez Match My Formation",
        content: "Bonjour {{name}}, bienvenue dans notre communauté...",
        preview: "Template pour les nouveaux inscrits",
        category: "Bienvenue",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        usageCount: 45
      },
      {
        id: "2",
        name: "Template Promotion",
        subject: "Offre Spéciale - {{discount}}% de réduction",
        content: "Profitez de notre offre spéciale...",
        preview: "Template pour les promotions",
        category: "Promotion",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        usageCount: 23
      },
      {
        id: "3",
        name: "Template Newsletter",
        subject: "Newsletter Mensuelle - {{month}}",
        content: "Voici les actualités du mois...",
        preview: "Template pour la newsletter mensuelle",
        category: "Newsletter",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        usageCount: 12
      }
    ];

    setTimeout(() => {
      setSubscribers(mockSubscribers);
      setCampaigns(mockCampaigns);
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1200);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "sent":
        return "bg-green-50 border-green-200 text-green-800";
      case "unsubscribed":
      case "bounced":
        return "bg-red-50 border-red-200 text-red-800";
      case "draft":
        return "bg-gray-50 border-gray-200 text-gray-800";
      case "scheduled":
      case "sending":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "sent":
        return <CheckCircle className="w-4 h-4" />;
      case "unsubscribed":
      case "bounced":
        return <AlertCircle className="w-4 h-4" />;
      case "draft":
        return <FileText className="w-4 h-4" />;
      case "scheduled":
      case "sending":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "unsubscribed":
        return "Désinscrit";
      case "bounced":
        return "Rejeté";
      case "draft":
        return "Brouillon";
      case "scheduled":
        return "Programmé";
      case "sent":
        return "Envoyé";
      case "sending":
        return "Envoi en cours";
      default:
        return status;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getOpenRate = (opens: number, recipients: number) => {
    return recipients > 0 ? ((opens / recipients) * 100).toFixed(1) : "0";
  };

  const getClickRate = (clicks: number, recipients: number) => {
    return recipients > 0 ? ((clicks / recipients) * 100).toFixed(1) : "0";
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesFilter = 
      filter === "all" || subscriber.status === filter;
    
    const matchesSearch = 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === "active").length;
  const totalCampaigns = campaigns.length;
  const avgOpenRate = campaigns.length > 0 
    ? (campaigns.reduce((sum, c) => sum + parseFloat(getOpenRate(c.opened, c.recipients)), 0) / campaigns.length).toFixed(1)
    : "0";

  const handleSelectSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const handleBulkAction = (action: "export" | "delete" | "unsubscribe") => {
    if (action === "export") {
      // Simuler l'export CSV
      alert(`Export de ${selectedSubscribers.length} abonnés en cours...`);
    } else if (action === "delete") {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedSubscribers.length} abonné(s) ?`)) {
        setSubscribers(prev => prev.filter(s => !selectedSubscribers.includes(s.id)));
        setSelectedSubscribers([]);
      }
    } else if (action === "unsubscribe") {
      if (confirm(`Êtes-vous sûr de vouloir désinscrire ${selectedSubscribers.length} abonné(s) ?`)) {
        setSubscribers(prev => prev.map(s => 
          selectedSubscribers.includes(s.id) 
            ? { ...s, status: "unsubscribed" as const }
            : s
        ));
        setSelectedSubscribers([]);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Mail className="w-8 h-8 text-primary" />
            Newsletter & Email Marketing
          </h1>
          <p className="text-gray-600">
            Gérez vos campagnes email et vos abonnés
          </p>
        </div>
        
        <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium">
          <Plus className="w-5 h-5" />
          Nouvelle Campagne
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(totalSubscribers)}
              </h3>
              <p className="text-sm text-gray-600">Total abonnés</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(activeSubscribers)}
              </h3>
              <p className="text-sm text-gray-600">Abonnés actifs</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(totalCampaigns)}
              </h3>
              <p className="text-sm text-gray-600">Campagnes envoyées</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {avgOpenRate}%
              </h3>
              <p className="text-sm text-gray-600">Taux d'ouverture moyen</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "subscribers", label: "Abonnés", icon: Users },
              { id: "campaigns", label: "Campagnes", icon: Send },
              { id: "templates", label: "Templates", icon: FileText },
              { id: "analytics", label: "Analytiques", icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Subscribers Tab */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un abonné..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "Tous" },
                    { value: "active", label: "Actifs" },
                    { value: "unsubscribed", label: "Désinscrits" },
                    { value: "bounced", label: "Rejetés" }
                  ].map((filterType) => (
                    <button
                      key={filterType.value}
                      onClick={() => setFilter(filterType.value as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === filterType.value
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filterType.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedSubscribers.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedSubscribers.length} abonné(s) sélectionné(s)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("export")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      Exporter
                    </button>
                    <button
                      onClick={() => handleBulkAction("unsubscribe")}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
                    >
                      Désinscrire
                    </button>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}

              {/* Subscribers List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.length === filteredSubscribers.length}
                          onChange={handleSelectAll}
                          className="rounded text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nom</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Inscription</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ouvertures</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Clics</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber, index) => (
                      <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(subscriber.id)}
                            onChange={() => handleSelectSubscriber(subscriber.id)}
                            className="rounded text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium">{subscriber.name}</td>
                        <td className="py-3 px-4">{subscriber.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(subscriber.status)}`}>
                            {getStatusIcon(subscriber.status)}
                            {getStatusLabel(subscriber.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(subscriber.subscribedAt)}
                        </td>
                        <td className="py-3 px-4 text-sm">{subscriber.opens}</td>
                        <td className="py-3 px-4 text-sm">{subscriber.clicks}</td>
                        <td className="py-3 px-4 text-sm">{subscriber.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{campaign.subject}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Destinataires:</span>
                        <span className="font-medium">{formatNumber(campaign.recipients)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ouvertures:</span>
                        <span className="font-medium">{formatNumber(campaign.opened)} ({getOpenRate(campaign.opened, campaign.recipients)}%)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Clics:</span>
                        <span className="font-medium">{formatNumber(campaign.clicked)} ({getClickRate(campaign.clicked, campaign.recipients)}%)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Désinscrits:</span>
                        <span className="font-medium text-red-600">{formatNumber(campaign.unsubscribed)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Voir
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium">
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{template.preview}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Utilisé {template.usageCount} fois</span>
                    <span>{formatDate(template.createdAt)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
                      Utiliser
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Taux d'ouverture moyen</h4>
                  <p className="text-2xl font-bold text-gray-900">{avgOpenRate}%</p>
                  <p className="text-sm text-green-600">+2.3% vs mois dernier</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Taux de clic moyen</h4>
                  <p className="text-2xl font-bold text-gray-900">3.2%</p>
                  <p className="text-sm text-green-600">+0.8% vs mois dernier</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Taux de désinscription</h4>
                  <p className="text-2xl font-bold text-gray-900">1.2%</p>
                  <p className="text-sm text-red-600">+0.3% vs mois dernier</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Croissance abonnés</h4>
                  <p className="text-2xl font-bold text-gray-900">+156</p>
                  <p className="text-sm text-green-600">Ce mois</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des campagnes</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="w-16 h-16 mb-4" />
                  <p>Graphiques de performance à implémenter</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
