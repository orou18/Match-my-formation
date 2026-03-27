"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  BarChart3,
  Filter,
  Eye,
  TrendingUp,
  Mic,
  Monitor,
  Download,
  MoreVertical,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

interface Webinar {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  registeredUsers: number;
  maxParticipants: number;
  category: string;
  thumbnail?: string;
  recordingUrl?: string;
  stats?: {
    views: number;
    engagement: number;
    satisfaction: number;
  };
}

export default function AdminWebinars() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockWebinars: Webinar[] = [
    {
      id: "1",
      title: "Marketing Digital pour Créateurs",
      description:
        "Apprenez les meilleures stratégies pour promouvoir vos cours",
      speaker: "Jean-Marc Dubois",
      date: "2024-03-25",
      time: "14:00",
      duration: 90,
      status: "upcoming",
      registeredUsers: 234,
      maxParticipants: 500,
      category: "Marketing",
      thumbnail: "/temoignage.png",
    },
    {
      id: "2",
      title: "Monétisation de Contenu",
      description: "Découvrez comment transformer votre expertise en revenus",
      speaker: "Sophie Laurent",
      date: "2024-03-28",
      time: "16:00",
      duration: 120,
      status: "upcoming",
      registeredUsers: 456,
      maxParticipants: 1000,
      category: "Business",
      thumbnail: "/temoignage.png",
    },
    {
      id: "3",
      title: "Design UX/UI pour Débutants",
      description:
        "Les fondamentaux du design pour créer des interfaces attractives",
      speaker: "Marc Bernard",
      date: "2024-03-20",
      time: "10:00",
      duration: 60,
      status: "completed",
      registeredUsers: 189,
      maxParticipants: 300,
      category: "Design",
      thumbnail: "/temoignage.png",
      recordingUrl: "https://example.com/recording1",
      stats: {
        views: 1250,
        engagement: 78,
        satisfaction: 4.5,
      },
    },
    {
      id: "4",
      title: "Introduction à l'Intelligence Artificielle",
      description: "Comprendre les bases de l'IA et ses applications",
      speaker: "Dr. Claire Martin",
      date: "2024-03-18",
      time: "15:30",
      duration: 90,
      status: "live",
      registeredUsers: 567,
      maxParticipants: 800,
      category: "Technologie",
      thumbnail: "/temoignage.png",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setWebinars(mockWebinars);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredWebinars = webinars.filter((webinar) => {
    const matchesSearch =
      webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webinar.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || webinar.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || webinar.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "live":
        return "bg-red-100 text-red-700 animate-pulse";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return Calendar;
      case "live":
        return Play;
      case "completed":
        return Check;
      case "cancelled":
        return X;
      default:
        return Calendar;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ""}` : `${mins}min`;
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion Webinaires
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredWebinars.length} webinaires
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <BarChart3 size={18} />
            Analytics
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nouveau Webinaire
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            label: "Total Webinaires",
            value: webinars.length,
            icon: Video,
            color: "blue",
            change: "+12%",
          },
          {
            label: "Participants Totaux",
            value: webinars
              .reduce((sum, w) => sum + w.registeredUsers, 0)
              .toLocaleString(),
            icon: Users,
            color: "green",
            change: "+23%",
          },
          {
            label: "Vues des Enregistrements",
            value: webinars
              .reduce((sum, w) => sum + (w.stats?.views || 0), 0)
              .toLocaleString(),
            icon: Eye,
            color: "purple",
            change: "+45%",
          },
          {
            label: "Taux de Satisfaction",
            value: "4.6/5",
            icon: TrendingUp,
            color: "orange",
            change: "+0.3",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <span className="text-green-600 text-sm font-bold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher un webinaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="upcoming">À venir</option>
              <option value="live">En direct</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Technologie">Technologie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar, index) => {
          const StatusIcon = getStatusIcon(webinar.status);
          return (
            <motion.div
              key={webinar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Video size={32} className="text-white" />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusBadge(webinar.status)}`}
                  >
                    <StatusIcon size={12} />
                    {webinar.status === "upcoming"
                      ? "À venir"
                      : webinar.status === "live"
                        ? "EN DIRECT"
                        : webinar.status === "completed"
                          ? "Terminé"
                          : "Annulé"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">
                  {webinar.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {webinar.description}
                </p>

                {/* Speaker Info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Mic size={14} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {webinar.speaker}
                    </p>
                    <p className="text-xs text-gray-500">{webinar.category}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(webinar.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{webinar.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Monitor size={14} />
                    <span>{formatDuration(webinar.duration)}</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-bold">
                      {webinar.registeredUsers}/{webinar.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(webinar.registeredUsers / webinar.maxParticipants) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Stats for completed webinars */}
                {webinar.status === "completed" && webinar.stats && (
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2 bg-gray-50 rounded">
                      <Eye size={12} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-bold">{webinar.stats.views}</p>
                      <p className="text-xs text-gray-500">Vues</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <TrendingUp
                        size={12}
                        className="mx-auto text-gray-600 mb-1"
                      />
                      <p className="text-xs font-bold">
                        {webinar.stats.engagement}%
                      </p>
                      <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <AlertCircle
                        size={12}
                        className="mx-auto text-gray-600 mb-1"
                      />
                      <p className="text-xs font-bold">
                        {webinar.stats.satisfaction}
                      </p>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Modifier
                  </button>
                  {webinar.status === "completed" && webinar.recordingUrl && (
                    <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1">
                      <Download size={14} />
                      Télécharger
                    </button>
                  )}
                  {webinar.status === "live" && (
                    <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-1">
                      <Play size={14} />
                      Rejoindre
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Webinar Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Nouveau Webinaire
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre du webinaire"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nom du conférencier"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <textarea
                placeholder="Description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Durée (minutes)"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="marketing">Marketing</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="technologie">Technologie</option>
                </select>
                <input
                  type="number"
                  placeholder="Participants maximum"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Créer le Webinaire
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
