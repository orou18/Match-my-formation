"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  ThumbsUp,
  Award,
  Zap,
  Target,
  BarChart3,
  Filter,
  Calendar,
  Star,
  Flame
} from "lucide-react";

export default function EngagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("all");

  const engagementMetrics = [
    {
      metric: "Likes",
      value: 12450,
      change: 12.5,
      icon: Heart,
      color: "from-red-500 to-red-600"
    },
    {
      metric: "Commentaires",
      value: 3420,
      change: 8.3,
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600"
    },
    {
      metric: "Partages",
      value: 890,
      change: -2.1,
      icon: Share2,
      color: "from-green-500 to-green-600"
    },
    {
      metric: "Durée moyenne",
      value: "4:32",
      change: 15.7,
      icon: Clock,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const topVideos = [
    {
      id: 1,
      title: "Introduction au Tourisme Durable",
      thumbnail: "/videos/video1-thumb.jpg",
      views: 15420,
      likes: 892,
      comments: 45,
      shares: 78,
      engagement: 6.4,
      duration: "12:34"
    },
    {
      id: 2,
      title: "Marketing Digital pour le Tourisme",
      thumbnail: "/videos/video2-thumb.jpg",
      views: 12300,
      likes: 756,
      comments: 34,
      shares: 56,
      engagement: 6.8,
      duration: "15:45"
    },
    {
      id: 3,
      title: "Service Client d'Excellence",
      thumbnail: "/videos/video3-thumb.jpg",
      views: 9870,
      likes: 623,
      comments: 28,
      shares: 45,
      engagement: 7.1,
      duration: "22:10"
    },
    {
      id: 4,
      title: "Gestion Hôtelière Avancée",
      thumbnail: "/videos/video4-thumb.jpg",
      views: 8650,
      likes: 545,
      comments: 23,
      shares: 34,
      engagement: 6.9,
      duration: "18:22"
    }
  ];

  const engagementTimeline = [
    { date: "Lun", likes: 120, comments: 45, shares: 12, engagement: 5.8 },
    { date: "Mar", likes: 145, comments: 52, shares: 18, engagement: 6.2 },
    { date: "Mer", likes: 168, comments: 48, shares: 15, engagement: 6.5 },
    { date: "Jeu", likes: 189, comments: 61, shares: 22, engagement: 7.1 },
    { date: "Ven", likes: 234, comments: 72, shares: 28, engagement: 7.8 },
    { date: "Sam", likes: 198, comments: 58, shares: 20, engagement: 6.9 },
    { date: "Dim", likes: 156, comments: 43, shares: 16, engagement: 6.1 }
  ];

  const audienceSegments = [
    { segment: "18-24 ans", percentage: 35, engagement: 8.2, color: "from-purple-500 to-purple-600" },
    { segment: "25-34 ans", percentage: 42, engagement: 7.5, color: "from-blue-500 to-blue-600" },
    { segment: "35-44 ans", percentage: 18, engagement: 6.8, color: "from-green-500 to-green-600" },
    { segment: "45+ ans", percentage: 5, engagement: 5.9, color: "from-orange-500 to-orange-600" }
  ];

  const recentComments = [
    {
      id: 1,
      user: "Marie Dubois",
      avatar: "/avatars/user1.jpg",
      comment: "Excellent contenu ! Très bien expliqué et facile à suivre.",
      video: "Introduction au Tourisme Durable",
      timestamp: "Il y a 2 heures",
      likes: 12,
      sentiment: "positive"
    },
    {
      id: 2,
      user: "Jean Martin",
      avatar: "/avatars/user2.jpg",
      comment: "Pourriez-vous faire un tutoriel sur la réservation en ligne ?",
      video: "Marketing Digital pour le Tourisme",
      timestamp: "Il y a 4 heures",
      likes: 8,
      sentiment: "neutral"
    },
    {
      id: 3,
      user: "Sophie Laurent",
      avatar: "/avatars/user3.jpg",
      comment: "Merci beaucoup pour ces précieux conseils ! J'ai pu améliorer mon service.",
      video: "Service Client d'Excellence",
      timestamp: "Il y a 6 heures",
      likes: 24,
      sentiment: "positive"
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Engagement</h1>
            <p className="text-gray-600">Analysez l'engagement de votre audience et optimisez votre contenu</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            
            <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Engagement Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {engagementMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 ${
                metric.change > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {metric.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {metric.change > 0 ? "+" : ""}{metric.change}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
            </h3>
            <p className="text-sm text-gray-600">{metric.metric}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Évolution de l'engagement
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric("likes")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === "likes" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Likes
              </button>
              <button
                onClick={() => setSelectedMetric("comments")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === "comments" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Commentaires
              </button>
              <button
                onClick={() => setSelectedMetric("shares")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === "shares" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Partages
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {engagementTimeline.map((data, index) => {
              const maxValue = Math.max(...engagementTimeline.map(d => 
                selectedMetric === "likes" ? d.likes : 
                selectedMetric === "comments" ? d.comments : d.shares
              ));
              const value = selectedMetric === "likes" ? data.likes : 
                           selectedMetric === "comments" ? data.comments : data.shares;
              const height = (value / maxValue) * 100;

              return (
                <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs font-medium text-gray-700 mb-1">{value}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg"
                    />
                  </div>
                  <span className="text-xs text-gray-600">{data.date}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Audience Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Segments d'audience
          </h2>

          <div className="space-y-4">
            {audienceSegments.map((segment, index) => (
              <motion.div
                key={segment.segment}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{segment.percentage}%</span>
                    <span className="text-xs text-primary">{segment.engagement}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${segment.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Videos by Engagement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            Vidéos les plus engageantes
          </h2>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            Voir tout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="relative mb-3">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-32 object-cover rounded-xl"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
                <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.engagement}%
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{(video.views / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{video.likes}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>#{index + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Comments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Commentaires récents
          </h2>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            Voir tout
          </button>
        </div>

        <div className="space-y-4">
          {recentComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{comment.user.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{comment.user}</span>
                    <span className="text-sm text-gray-500 ml-2">{comment.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      comment.sentiment === "positive" 
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {comment.sentiment === "positive" ? "😊 Positif" : "😐 Neutre"}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-2">{comment.comment}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{comment.video}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
