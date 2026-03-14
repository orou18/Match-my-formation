"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Filter,
  Download,
  ThumbsUp,
  ThumbsDown,
  Star,
  Bookmark,
  Repeat,
  Activity,
} from "lucide-react";
import { useParams } from "next/navigation";

interface EngagementData {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  averageEngagementRate: number;
  engagementGrowth: number;
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    thumbnail: string;
  }>;
  engagementByTime: Array<{
    hour: string;
    likes: number;
    comments: number;
    shares: number;
  }>;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentInteractions: Array<{
    id: string;
    type: 'like' | 'comment' | 'share' | 'bookmark';
    user: string;
    video: string;
    content?: string;
    timestamp: string;
  }>;
}

export default function EngagementPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'likes' | 'comments' | 'shares' | 'all'>('all');

  useEffect(() => {
    // Simuler le chargement des données d'engagement
    const mockData: EngagementData = {
      totalLikes: 12450,
      totalComments: 2340,
      totalShares: 890,
      totalViews: 45600,
      averageEngagementRate: 8.9,
      engagementGrowth: 15.3,
      topVideos: [
        {
          id: '1',
          title: 'Tourisme Durable et Écotourisme',
          views: 8900,
          likes: 2340,
          comments: 456,
          shares: 123,
          engagementRate: 12.5,
          thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop'
        },
        {
          id: '2',
          title: 'Marketing Digital Touristique',
          views: 6700,
          likes: 1890,
          comments: 234,
          shares: 89,
          engagementRate: 11.2,
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
        },
        {
          id: '3',
          title: 'Gestion Hôtelière Avancée',
          views: 5400,
          likes: 1567,
          comments: 189,
          shares: 67,
          engagementRate: 9.8,
          thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop'
        },
        {
          id: '4',
          title: 'Service Client Excellence',
          views: 4300,
          likes: 1234,
          comments: 156,
          shares: 45,
          engagementRate: 8.9,
          thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop'
        },
        {
          id: '5',
          title: 'Leadership Transformationnel',
          views: 3200,
          likes: 890,
          comments: 123,
          shares: 34,
          engagementRate: 7.6,
          thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop'
        },
      ],
      engagementByTime: [
        { hour: '00:00', likes: 45, comments: 12, shares: 5 },
        { hour: '06:00', likes: 89, comments: 23, shares: 8 },
        { hour: '12:00', likes: 234, comments: 67, shares: 23 },
        { hour: '18:00', likes: 456, comments: 123, shares: 45 },
        { hour: '21:00', likes: 234, comments: 56, shares: 19 },
      ],
      sentimentAnalysis: {
        positive: 78,
        neutral: 18,
        negative: 4,
      },
      recentInteractions: [
        {
          id: '1',
          type: 'like',
          user: 'Alice Martin',
          video: 'Tourisme Durable',
          timestamp: '2024-03-14T10:30:00Z'
        },
        {
          id: '2',
          type: 'comment',
          user: 'Bob Dubois',
          video: 'Marketing Digital',
          content: 'Excellent contenu ! Très utile pour mon projet.',
          timestamp: '2024-03-14T09:15:00Z'
        },
        {
          id: '3',
          type: 'share',
          user: 'Claire Rousseau',
          video: 'Gestion Hôtelière',
          timestamp: '2024-03-14T08:45:00Z'
        },
        {
          id: '4',
          type: 'bookmark',
          user: 'David Bernard',
          video: 'Service Client',
          timestamp: '2024-03-13T18:20:00Z'
        },
        {
          id: '5',
          type: 'comment',
          user: 'Emma Petit',
          video: 'Leadership',
          content: 'Les exemples pratiques sont vraiment pertinents.',
          timestamp: '2024-03-13T14:10:00Z'
        },
      ]
    };

    setTimeout(() => {
      setEngagementData(mockData);
      setLoading(false);
    }, 1200);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-green-500" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
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

  if (!engagementData) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-600" />
            Engagement
          </h1>
          <p className="text-gray-600 mt-1">
            Analysez l'engagement de votre audience
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sélecteur de métrique */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tout' },
              { value: 'likes', label: 'Likes' },
              { value: 'comments', label: 'Commentaires' },
              { value: 'shares', label: 'Partages' },
            ].map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMetric === metric.value
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
          
          {/* Sélecteur de période */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
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
            <div className="p-3 bg-red-50 rounded-xl">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(engagementData.totalLikes)}
              </h3>
              <p className="text-sm text-gray-600">Likes totaux</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+{engagementData.engagementGrowth}%</span>
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
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(engagementData.totalComments)}
              </h3>
              <p className="text-sm text-gray-600">Commentaires</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+23%</span>
            <span className="text-gray-500">vs période précédente</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(engagementData.totalShares)}
              </h3>
              <p className="text-sm text-gray-600">Partages</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+18%</span>
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
            <div className="p-3 bg-purple-50 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{engagementData.averageEngagementRate}%</h3>
              <p className="text-sm text-gray-600">Taux d'engagement</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+2.3%</span>
            <span className="text-gray-500">vs période précédente</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vidéos les plus engageantes</h2>
          <div className="space-y-4">
            {engagementData.topVideos.map((video, index) => (
              <div key={video.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-lg font-bold text-gray-600 w-6">{index + 1}</span>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-20 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{video.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(video.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {formatNumber(video.comments)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {formatNumber(video.shares)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">{video.engagementRate}%</p>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sentiment Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gray-600" />
            Analyse de sentiment
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Positif</span>
                <span className="text-sm font-bold text-green-600">{engagementData.sentimentAnalysis.positive}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${engagementData.sentimentAnalysis.positive}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Neutre</span>
                <span className="text-sm font-bold text-gray-600">{engagementData.sentimentAnalysis.neutral}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-600 h-3 rounded-full"
                  style={{ width: `${engagementData.sentimentAnalysis.neutral}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Négatif</span>
                <span className="text-sm font-bold text-red-600">{engagementData.sentimentAnalysis.negative}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full"
                  style={{ width: `${engagementData.sentimentAnalysis.negative}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              Excellent sentiment positif ! 🎉
            </p>
          </div>
        </motion.div>
      </div>

      {/* Engagement par heure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Engagement par heure
        </h2>
        <div className="space-y-3">
          {engagementData.engagementByTime.map((time) => (
            <div key={time.hour} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 w-12">{time.hour}</span>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="text-xs text-red-600">❤️ {time.likes}</span>
                    <span className="text-xs text-blue-600">💬 {time.comments}</span>
                    <span className="text-xs text-green-600">🔄 {time.shares}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 via-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${((time.likes + time.comments + time.shares) / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Interactions récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-600" />
          Interactions récentes
        </h2>
        <div className="space-y-3">
          {engagementData.recentInteractions.map((interaction) => (
            <div key={interaction.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              {getInteractionIcon(interaction.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{interaction.user}</p>
                {interaction.content && (
                  <p className="text-xs text-gray-600 mt-1">{interaction.content}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {interaction.type === 'like' && 'a aimé'} 
                  {interaction.type === 'comment' && 'a commenté sur'} 
                  {interaction.type === 'share' && 'a partagé'} 
                  {interaction.type === 'bookmark' && 'a enregistré'} 
                  {' '}
                  "{interaction.video}"
                </p>
              </div>
              <span className="text-xs text-gray-500">{formatDate(interaction.timestamp)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
