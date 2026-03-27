"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Mail,
  Link,
  Eye,
  Users,
  Calendar,
  Clock,
  BarChart3,
  Filter,
  Download,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  type LucideIcon,
} from "lucide-react";

interface ShareData {
  platform: string;
  icon: LucideIcon;
  shares: number;
  clicks: number;
  engagement: number;
  change?: number;
  color: string;
}

interface SharedVideo {
  id: string;
  title: string;
  thumbnail: string;
  totalShares: number;
  platforms: {
    facebook: number;
    twitter: number;
    linkedin: number;
    whatsapp: number;
    email: number;
    direct: number;
  };
  publishedAt: string;
  views: number;
  engagement: number;
}

interface DeviceStat {
  device: string;
  percentage: number;
  icon: LucideIcon;
  color: string;
}

interface TimelineStat {
  date: string;
  shares: number;
  clicks: number;
}

export default function SharesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const [shareData, setShareData] = useState<ShareData[]>([]);
  const [sharedVideos, setSharedVideos] = useState<SharedVideo[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStat[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineStat[]>([]);

  useEffect(() => {
    const iconMap: Record<string, LucideIcon> = {
      Facebook: MessageCircle,
      Twitter: MessageCircle,
      LinkedIn: Users,
      WhatsApp: MessageCircle,
      Email: Mail,
      Direct: Link,
    };
    const deviceIconMap: Record<string, LucideIcon> = {
      Mobile: Smartphone,
      Desktop: Monitor,
      Tablet: Tablet,
    };

    const loadData = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;
      const response = await fetch("/api/creator/shares", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = await response.json();
      if (response.ok && payload.data) {
        setShareData(
          (payload.data.shareData || []).map(
            (item: Omit<ShareData, "icon">) => ({
              ...item,
              icon: iconMap[item.platform] || Share2,
            })
          )
        );
        setSharedVideos(payload.data.sharedVideos || []);
        setDeviceStats(
          (payload.data.deviceStats || []).map(
            (item: Omit<DeviceStat, "icon">) => ({
              ...item,
              icon: deviceIconMap[item.device] || Smartphone,
            })
          )
        );
        setTimelineData(payload.data.timelineData || []);
      }
    };

    loadData();
  }, [selectedPeriod]);

  const totalShares = shareData.reduce((sum, data) => sum + data.shares, 0);
  const totalClicks = shareData.reduce((sum, data) => sum + data.clicks, 0);
  const avgEngagement =
    shareData.length > 0
      ? Math.round(
          shareData.reduce((sum, data) => sum + data.engagement, 0) /
            shareData.length
        )
      : 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partages</h1>
            <p className="text-gray-600">
              Analysez les performances de partage de votre contenu
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="day">Aujourd&apos;hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>

            <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+18%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalShares.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Total des partages</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+24%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalClicks.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Clics générés</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {avgEngagement}%
          </h3>
          <p className="text-sm text-gray-600">Taux d&apos;engagement</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Performance par plateforme
            </h2>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Toutes</option>
              {shareData.map((platform) => (
                <option key={platform.platform} value={platform.platform}>
                  {platform.platform}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {shareData.map((platform, index) => (
              <motion.div
                key={platform.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center`}
                  >
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {platform.platform}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {platform.shares.toLocaleString()} partages
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">
                      {platform.engagement}%
                    </span>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        (platform.change || 0) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(platform.change || 0) > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {(platform.change || 0) > 0 ? "+" : ""}
                        {platform.change || 0}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {platform.clicks.toLocaleString()} clics
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Device Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Répartition par appareil
          </h2>

          <div className="space-y-4">
            {deviceStats.map((device, index) => (
              <motion.div
                key={device.device}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <device.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      {device.device}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {device.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${device.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${device.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Évolution des partages
        </h2>

        <div className="h-64 flex items-end justify-between gap-2">
          {timelineData.map((data, index) => {
            const maxShares = Math.max(...timelineData.map((d) => d.shares));
            const maxClicks = Math.max(...timelineData.map((d) => d.clicks));
            const sharesHeight = (data.shares / maxShares) * 100;
            const clicksHeight = (data.clicks / maxClicks) * 100;

            return (
              <div
                key={data.date}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">
                    {data.clicks}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${clicksHeight}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {data.shares}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${sharesHeight}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                  />
                </div>
                <span className="text-xs text-gray-600">{data.date}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Partages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-xs text-gray-600">Clics</span>
          </div>
        </div>
      </motion.div>

      {/* Shared Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Vidéos les plus partagées
          </h2>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            Voir tout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sharedVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-24 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    <span>{video.totalShares}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{(video.views / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.publishedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {Object.entries(video.platforms).map(([platform, count]) => {
                    const platformData = shareData.find(
                      (p) => p.platform.toLowerCase() === platform
                    );
                    if (!platformData || count === 0) return null;

                    return (
                      <div
                        key={platform}
                        className="flex items-center gap-1 text-xs text-gray-500"
                      >
                        <platformData.icon className="w-3 h-3" />
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {video.engagement}%
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(`https://match.com/videos/${video.id}`)
                  }
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedLink === `https://match.com/videos/${video.id}` ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
