"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  Image as ImageIcon,
  Play,
  BarChart3,
  Target,
  Clock,
  Check,
  X,
  MoreVertical
} from "lucide-react";

interface Ad {
  id: string;
  title: string;
  type: 'banner' | 'card' | 'popup';
  status: 'active' | 'paused' | 'scheduled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  image?: string;
  targetAudience: string;
}

export default function AdminAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockAds: Ad[] = [
    {
      id: '1',
      title: "Formation Premium - 50% de réduction",
      type: "banner",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      budget: 5000,
      spent: 2340,
      impressions: 125000,
      clicks: 3420,
      ctr: 2.74,
      targetAudience: "Étudiants actifs",
      image: "/temoignage.png"
    },
    {
      id: '2',
      title: "Devenez Créateur",
      type: "card",
      status: "active",
      startDate: "2024-02-15",
      endDate: "2024-04-15",
      budget: 3000,
      spent: 1890,
      impressions: 89000,
      clicks: 1234,
      ctr: 1.39,
      targetAudience: "Utilisateurs gratuits",
      image: "/temoignage.png"
    },
    {
      id: '3',
      title: "Webinaire Marketing Digital",
      type: "popup",
      status: "scheduled",
      startDate: "2024-03-25",
      endDate: "2024-03-25",
      budget: 1000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      targetAudience: "Tous utilisateurs",
      image: "/temoignage.png"
    },
    {
      id: '4',
      title: "Nouveaux Cours Design",
      type: "banner",
      status: "paused",
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      budget: 2000,
      spent: 2000,
      impressions: 67000,
      clicks: 890,
      ctr: 1.33,
      targetAudience: "Créateurs",
      image: "/temoignage.png"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setAds(mockAds);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ad.type === filterType;
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'banner':
        return 'bg-purple-100 text-purple-700';
      case 'card':
        return 'bg-orange-100 text-orange-700';
      case 'popup':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return ImageIcon;
      case 'card':
        return Target;
      case 'popup':
        return Play;
      default:
        return ImageIcon;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion Publicités</h1>
          <p className="text-gray-600 mt-1">{filteredAds.length} campagnes publicitaires</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <BarChart3 size={18} />
            Rapports
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nouvelle Campagne
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { 
            label: "Budget Total", 
            value: formatCurrency(ads.reduce((sum, ad) => sum + ad.budget, 0)), 
            icon: DollarSign, 
            color: "green" 
          },
          { 
            label: "Dépensé", 
            value: formatCurrency(ads.reduce((sum, ad) => sum + ad.spent, 0)), 
            icon: TrendingUp, 
            color: "blue" 
          },
          { 
            label: "Impressions", 
            value: ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString(), 
            icon: Eye, 
            color: "purple" 
          },
          { 
            label: "Clics", 
            value: ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString(), 
            icon: Target, 
            color: "orange" 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une campagne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous types</option>
              <option value="banner">Bannière</option>
              <option value="card">Carte</option>
              <option value="popup">Popup</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="active">Actif</option>
              <option value="paused">En pause</option>
              <option value="scheduled">Programmé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad, index) => {
          const TypeIcon = getTypeIcon(ad.type);
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Ad Preview */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <TypeIcon size={32} className="text-white" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeBadge(ad.type)}`}>
                    {ad.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(ad.status)}`}>
                    {ad.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{ad.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Cible: {ad.targetAudience}</p>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Eye size={14} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-lg font-bold text-gray-900">{ad.impressions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Impressions</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Target size={14} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-lg font-bold text-gray-900">{ad.clicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Clics</p>
                  </div>
                </div>

                {/* Budget Info */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Budget utilisé</span>
                    <span className="font-bold">{formatCurrency(ad.spent)}/{formatCurrency(ad.budget)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(ad.spent / ad.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(ad.startDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(ad.endDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* CTR */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">CTR</span>
                  <span className="text-lg font-bold text-gray-900">{ad.ctr}%</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Modifier
                  </button>
                  <button className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Stats
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Nouvelle Campagne Publicitaire</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre de la campagne"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="banner">Bannière</option>
                  <option value="card">Carte promotionnelle</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Budget (€)"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Audience cible"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <textarea
                placeholder="Description de la campagne"
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Créer la Campagne
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
