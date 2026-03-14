"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Share2,
  TrendingUp,
  Users,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Link,
  QrCode,
  Download,
  Calendar,
  Eye,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Copy,
  CheckCircle,
  ExternalLink,
  Globe,
  Mail,
  Smartphone,
} from "lucide-react";
import { useParams } from "next/navigation";

interface ShareData {
  totalShares: number;
  sharesGrowth: number;
  topVideos: Array<{
    id: string;
    title: string;
    thumbnail: string;
    shares: number;
    views: number;
    shareRate: number;
  }>;
  sharesByPlatform: Array<{
    platform: string;
    shares: number;
    percentage: number;
    icon: string;
    color: string;
  }>;
  sharesByTime: Array<{
    date: string;
    shares: number;
    platform: string;
  }>;
  recentShares: Array<{
    id: string;
    platform: string;
    user: string;
    video: string;
    timestamp: string;
    type: 'share' | 'copy_link' | 'qr_code';
  }>;
  topSharers: Array<{
    user: string;
    avatar: string;
    shares: number;
    followers: number;
    influence: 'high' | 'medium' | 'low';
  }>;
}

export default function SharesPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'other'>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des données de partage
    const mockData: ShareData = {
      totalShares: 890,
      sharesGrowth: 23.5,
      topVideos: [
        {
          id: '1',
          title: 'Tourisme Durable et Écotourisme',
          thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
          shares: 234,
          views: 8900,
          shareRate: 2.6,
        },
        {
          id: '2',
          title: 'Marketing Digital Touristique',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
          shares: 189,
          views: 6700,
          shareRate: 2.8,
        },
        {
          id: '3',
          title: 'Gestion Hôtelière Avancée',
          thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
          shares: 156,
          views: 5400,
          shareRate: 2.9,
        },
        {
          id: '4',
          title: 'Service Client Excellence',
          thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop',
          shares: 123,
          views: 4300,
          shareRate: 2.9,
        },
        {
          id: '5',
          title: 'Leadership Transformationnel',
          thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
          shares: 89,
          views: 3200,
          shareRate: 2.8,
        },
      ],
      sharesByPlatform: [
        { platform: 'Facebook', shares: 345, percentage: 38.8, icon: 'facebook', color: '#1877f2' },
        { platform: 'Twitter', shares: 234, percentage: 26.3, icon: 'twitter', color: '#1da1f2' },
        { platform: 'LinkedIn', shares: 189, percentage: 21.2, icon: 'linkedin', color: '#0077b5' },
        { platform: 'WhatsApp', shares: 89, percentage: 10.0, icon: 'whatsapp', color: '#25d366' },
        { platform: 'Autres', shares: 33, percentage: 3.7, icon: 'other', color: '#6b7280' },
      ],
      sharesByTime: [
        { date: '2024-03-10', shares: 45, platform: 'Facebook' },
        { date: '2024-03-11', shares: 67, platform: 'Twitter' },
        { date: '2024-03-12', shares: 89, platform: 'LinkedIn' },
        { date: '2024-03-13', shares: 123, platform: 'Facebook' },
        { date: '2024-03-14', shares: 156, platform: 'Twitter' },
      ],
      recentShares: [
        {
          id: '1',
          platform: 'Facebook',
          user: 'Alice Martin',
          video: 'Tourisme Durable',
          timestamp: '2024-03-14T10:30:00Z',
          type: 'share',
        },
        {
          id: '2',
          platform: 'Twitter',
          user: 'Bob Dubois',
          video: 'Marketing Digital',
          timestamp: '2024-03-14T09:15:00Z',
          type: 'share',
        },
        {
          id: '3',
          platform: 'LinkedIn',
          user: 'Claire Rousseau',
          video: 'Gestion Hôtelière',
          timestamp: '2024-03-14T08:45:00Z',
          type: 'share',
        },
        {
          id: '4',
          platform: 'WhatsApp',
          user: 'David Bernard',
          video: 'Service Client',
          timestamp: '2024-03-13T18:20:00Z',
          type: 'share',
        },
        {
          id: '5',
          platform: 'Copy Link',
          user: 'Emma Petit',
          video: 'Leadership',
          timestamp: '2024-03-13T14:10:00Z',
          type: 'copy_link',
        },
      ],
      topSharers: [
        {
          user: 'Alice Martin',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
          shares: 45,
          followers: 12000,
          influence: 'high',
        },
        {
          user: 'Bob Dubois',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          shares: 34,
          followers: 5600,
          influence: 'medium',
        },
        {
          user: 'Claire Rousseau',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          shares: 28,
          followers: 3400,
          influence: 'medium',
        },
        {
          user: 'David Bernard',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
          shares: 23,
          followers: 1200,
          influence: 'low',
        },
        {
          user: 'Emma Petit',
          avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face',
          shares: 19,
          followers: 890,
          influence: 'low',
        },
      ],
    };

    setTimeout(() => {
      setShareData(mockData);
      setLoading(false);
    }, 1200);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5" />;
      case 'copy_link':
        return <Link className="w-5 h-5" />;
      case 'qr_code':
        return <QrCode className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'high':
        return 'bg-purple-100 text-purple-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!shareData) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-8 h-8 text-green-600" />
            Partages
          </h1>
          <p className="text-gray-600 mt-1">
            Analysez les partages de vos vidéos sur les réseaux sociaux
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sélecteur de plateforme */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Toutes les plateformes</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="other">Autres</option>
          </select>
          
          {/* Sélecteur de période */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
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
            <div className="p-3 bg-green-50 rounded-xl">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(shareData.totalShares)}
              </h3>
              <p className="text-sm text-gray-600">Partages totaux</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+{shareData.sharesGrowth}%</span>
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
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(shareData.topSharers.reduce((sum, sharer) => sum + sharer.followers, 0))}
              </h3>
              <p className="text-sm text-gray-600">Portée totale</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Moyenne: {formatNumber(Math.round(shareData.topSharers.reduce((sum, sharer) => sum + sharer.followers, 0) / shareData.topSharers.length))}
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
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {(shareData.totalShares / shareData.topVideos.reduce((sum, video) => sum + video.views, 0) * 100).toFixed(1)}%
              </h3>
              <p className="text-sm text-gray-600">Taux de partage</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+3.2%</span>
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
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(shareData.topVideos.reduce((sum, video) => sum + video.views, 0) / shareData.topVideos.length))}
              </h3>
              <p className="text-sm text-gray-600">Vues moyennes</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Par vidéo partagée
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partages par plateforme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Partages par plateforme</h2>
          <div className="space-y-4">
            {shareData.sharesByPlatform.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: platform.color + '20' }}
                  >
                    {getPlatformIcon(platform.icon)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{platform.platform}</p>
                    <p className="text-xs text-gray-500">{formatNumber(platform.shares)} partages</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{platform.percentage}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${platform.percentage}%`,
                        backgroundColor: platform.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vidéos les plus partagées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vidéos les plus partagées</h2>
          <div className="space-y-3">
            {shareData.topVideos.map((video, index) => (
              <div key={video.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg font-bold text-gray-600 w-6">{index + 1}</span>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">{video.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {formatNumber(video.shares)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="text-green-600 font-medium">
                      {video.shareRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top partageurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top partageurs</h2>
          <div className="space-y-3">
            {shareData.topSharers.map((sharer, index) => (
              <div key={sharer.user} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg font-bold text-gray-600 w-6">{index + 1}</span>
                <img
                  src={sharer.avatar}
                  alt={sharer.user}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{sharer.user}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{formatNumber(sharer.followers)} abonnés</span>
                    <span className={`px-2 py-0.5 rounded-full ${getInfluenceColor(sharer.influence)}`}>
                      {sharer.influence === 'high' ? 'Haute' :
                       sharer.influence === 'medium' ? 'Moyenne' : 'Faible'} influence
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{sharer.shares}</p>
                  <p className="text-xs text-gray-500">partages</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Partages récents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          Partages récents
        </h2>
        <div className="space-y-3">
          {shareData.recentShares.map((share) => (
            <div key={share.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                {getPlatformIcon(share.platform.toLowerCase().replace(' ', '_'))}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{share.user}</p>
                <p className="text-xs text-gray-600">
                  a partagé "{share.video}" sur {share.platform}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatDate(share.timestamp)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {share.type === 'share' && <Share2 className="w-3 h-3 text-gray-400" />}
                  {share.type === 'copy_link' && <Link className="w-3 h-3 text-gray-400" />}
                  {share.type === 'qr_code' && <QrCode className="w-3 h-3 text-gray-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Outils de partage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Outils de partage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Facebook className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium">Partager sur Facebook</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Twitter className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-sm font-medium">Partager sur Twitter</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Linkedin className="w-6 h-6 text-blue-700 mb-2" />
            <p className="text-sm font-medium">Partager sur LinkedIn</p>
          </button>
          <button 
            onClick={() => copyToClipboard('https://matchmyformation.com/video/123')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
          >
            <Link className="w-6 h-6 text-gray-600 mb-2" />
            <p className="text-sm font-medium">Copier le lien</p>
            {copiedLink && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
