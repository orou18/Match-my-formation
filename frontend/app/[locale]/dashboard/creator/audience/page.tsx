"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Calendar,
  MapPin,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Mail,
  Bell,
  Shield,
} from "lucide-react";
import { useParams } from "next/navigation";

interface AudienceData {
  totalSubscribers: number;
  newSubscribers: number;
  activeSubscribers: number;
  averageWatchTime: number;
  topCountries: Array<{ country: string; count: number; percentage: number }>;
  devices: Array<{ device: string; count: number; percentage: number }>;
  demographics: Array<{ age: string; gender: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: 'subscribe' | 'unsubscribe' | 'watch' | 'like';
    user: string;
    timestamp: string;
    details: string;
  }>;
}

export default function AudiencePage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuler le chargement des données d'audience
    const mockData: AudienceData = {
      totalSubscribers: 3420,
      newSubscribers: 156,
      activeSubscribers: 2890,
      averageWatchTime: 1250, // en secondes
      topCountries: [
        { country: 'France', count: 2156, percentage: 63.1 },
        { country: 'Belgique', count: 456, percentage: 13.3 },
        { country: 'Suisse', count: 342, percentage: 10.0 },
        { country: 'Canada', count: 234, percentage: 6.8 },
        { country: 'Maroc', count: 123, percentage: 3.6 },
        { country: 'Autres', count: 109, percentage: 3.2 },
      ],
      devices: [
        { device: 'Desktop', count: 1890, percentage: 55.3 },
        { device: 'Mobile', count: 1234, percentage: 36.1 },
        { device: 'Tablet', count: 296, percentage: 8.6 },
      ],
      demographics: [
        { age: '18-24', gender: 'Homme', count: 456 },
        { age: '18-24', gender: 'Femme', count: 623 },
        { age: '25-34', gender: 'Homme', count: 789 },
        { age: '25-34', gender: 'Femme', count: 890 },
        { age: '35-44', gender: 'Homme', count: 234 },
        { age: '35-44', gender: 'Femme', count: 312 },
        { age: '45+', gender: 'Homme', count: 67 },
        { age: '45+', gender: 'Femme', count: 49 },
      ],
      recentActivity: [
        {
          id: '1',
          type: 'subscribe',
          user: 'Alice Martin',
          timestamp: '2024-03-14T10:30:00Z',
          details: 'Nouvel abonné via la vidéo "Tourisme Durable"'
        },
        {
          id: '2',
          type: 'watch',
          user: 'Bob Dubois',
          timestamp: '2024-03-14T09:15:00Z',
          details: 'A regardé "Marketing Digital Touristique"'
        },
        {
          id: '3',
          type: 'like',
          user: 'Claire Rousseau',
          timestamp: '2024-03-14T08:45:00Z',
          details: 'A aimé "Gestion Hôtelière"'
        },
        {
          id: '4',
          type: 'subscribe',
          user: 'David Bernard',
          timestamp: '2024-03-13T18:20:00Z',
          details: 'Nouvel abonné via la playlist "Formation Complète"'
        },
        {
          id: '5',
          type: 'unsubscribe',
          user: 'Emma Petit',
          timestamp: '2024-03-13T14:10:00Z',
          details: 'Désabonné'
        },
      ]
    };

    setTimeout(() => {
      setAudienceData(mockData);
      setLoading(false);
    }, 1200);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscribe':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'unsubscribe':
        return <Users className="w-4 h-4 text-red-600" />;
      case 'watch':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'like':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(hours / 24);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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

  if (!audienceData) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Audience
          </h1>
          <p className="text-gray-600 mt-1">
            Analysez votre audience et leur engagement
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sélecteur de période */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
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
                {formatNumber(audienceData.totalSubscribers)}
              </h3>
              <p className="text-sm text-gray-600">Total abonnés</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+{formatNumber(audienceData.newSubscribers)}</span>
            <span className="text-gray-500">cette période</span>
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
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(audienceData.activeSubscribers)}
              </h3>
              <p className="text-sm text-gray-600">Abonnés actifs</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {Math.round((audienceData.activeSubscribers / audienceData.totalSubscribers) * 100)}% du total
            </span>
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
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatDuration(audienceData.averageWatchTime)}
              </h3>
              <p className="text-sm text-gray-600">Temps moyen</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500">vs période précédente</span>
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
              <h3 className="text-2xl font-bold text-gray-900">84.5%</h3>
              <p className="text-sm text-gray-600">Taux de rétention</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+3.2%</span>
            <span className="text-gray-500">vs période précédente</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pays */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            Top Pays
          </h2>
          <div className="space-y-3">
            {audienceData.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-6">{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{country.country}</p>
                    <p className="text-xs text-gray-500">{formatNumber(country.count)} abonnés</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{country.percentage}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appareils */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-gray-600" />
            Appareils
          </h2>
          <div className="space-y-4">
            {audienceData.devices.map((device) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {device.device === 'Desktop' && <Monitor className="w-5 h-5 text-gray-600" />}
                    {device.device === 'Mobile' && <Smartphone className="w-5 h-5 text-gray-600" />}
                    {device.device === 'Tablet' && <Tablet className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{device.device}</p>
                    <p className="text-xs text-gray-500">{formatNumber(device.count)} utilisateurs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{device.percentage}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Démographie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Démographie
          </h2>
          <div className="space-y-3">
            {audienceData.demographics.slice(0, 6).map((demo, index) => (
              <div key={`${demo.age}-${demo.gender}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-600">
                    {demo.age === '18-24' && '18-24'}
                    {demo.age === '25-34' && '25-34'}
                    {demo.age === '35-44' && '35-44'}
                    {demo.age === '45+' && '45+'}
                    {' '}
                    {demo.gender === 'Homme' ? '👨' : '👩'}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatNumber(demo.count)}</p>
                  <div className="w-12 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(demo.count / audienceData.totalSubscribers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activité récente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-600" />
          Activité récente
        </h2>
        <div className="space-y-3">
          {audienceData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-xs text-gray-600">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Icons manquants
const Monitor = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Smartphone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const Tablet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
