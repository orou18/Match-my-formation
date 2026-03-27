"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  Repeat,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  MoreHorizontal,
  Copy,
  Share2,
  Download,
  Upload,
  Mic,
  Camera,
  Film,
  Globe,
  Lock,
} from "lucide-react";

interface ScheduledContent {
  id: string;
  title: string;
  type: "video" | "live" | "premiere";
  thumbnail?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration?: string;
  platform: string[];
  status: "scheduled" | "live" | "completed" | "cancelled";
  visibility: "public" | "private" | "unlisted";
  expectedViews?: number;
  actualViews?: number;
  description?: string;
  tags: string[];
  isRecurring?: boolean;
  recurrencePattern?: string;
  reminders: {
    type: string;
    time: string;
    enabled: boolean;
  }[];
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>(
    []
  );

  useEffect(() => {
    const loadItems = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;
      const response = await fetch("/api/creator/schedule", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = await response.json();
      if (response.ok) {
        setScheduledContent(payload.items || []);
      }
    };

    loadItems();
  }, []);

  const filteredContent = scheduledContent.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || content.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return Clock;
      case "live":
        return Play;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100";
      case "live":
        return "text-red-600 bg-red-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "live":
        return Mic;
      case "premiere":
        return Film;
      default:
        return Video;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "from-red-500 to-pink-500";
      case "live":
        return "from-red-600 to-orange-600";
      case "premiere":
        return "from-purple-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getContentForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredContent.filter(
      (content) => content.scheduledDate === dateStr
    );
  };

  const stats = {
    total: scheduledContent.length,
    scheduled: scheduledContent.filter((c) => c.status === "scheduled").length,
    live: scheduledContent.filter((c) => c.status === "live").length,
    completed: scheduledContent.filter((c) => c.status === "completed").length,
    cancelled: scheduledContent.filter((c) => c.status === "cancelled").length,
    recurring: scheduledContent.filter((c) => c.isRecurring).length,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning</h1>
            <p className="text-gray-600">
              Planifiez et organisez votre contenu
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher du contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.total}</span>
          <p className="text-xs text-gray-600">Total</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.scheduled}
          </span>
          <p className="text-xs text-gray-600">Planifié</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Play className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.live}</span>
          <p className="text-xs text-gray-600">En direct</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.completed}
          </span>
          <p className="text-xs text-gray-600">Terminé</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Repeat className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.recurring}
          </span>
          <p className="text-xs text-gray-600">Récurrent</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.cancelled}
          </span>
          <p className="text-xs text-gray-600">Annulé</p>
        </div>
      </motion.div>

      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  )
                )
              }
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900">
              {currentDate.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  )
                )
              }
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "month"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "day"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Jour
            </button>
          </div>
        </div>

        {viewMode === "month" && (
          <div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-700 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((day, index) => {
                const content = day ? getContentForDate(day) : [];
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`aspect-square border rounded-xl p-2 ${
                      day
                        ? "border-gray-200 hover:border-primary cursor-pointer"
                        : "border-transparent"
                    } ${isToday ? "bg-primary/10 border-primary" : ""}`}
                    onClick={() =>
                      day &&
                      setSelectedDate(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                      )
                    }
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div
                          className={`text-sm font-medium mb-1 ${
                            isToday ? "text-primary" : "text-gray-900"
                          }`}
                        >
                          {day}
                        </div>

                        <div className="flex-1 space-y-1">
                          {content.slice(0, 3).map((item, itemIndex) => {
                            const TypeIcon = getTypeIcon(item.type);
                            return (
                              <div
                                key={itemIndex}
                                className={`w-full h-1 rounded-full bg-gradient-to-r ${getTypeColor(item.type)}`}
                                title={item.title}
                              />
                            );
                          })}
                          {content.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{content.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Upcoming Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Contenu à venir
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifié</option>
              <option value="live">En direct</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredContent.map((content, index) => {
            const StatusIcon = getStatusIcon(content.status);
            const TypeIcon = getTypeIcon(content.type);

            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {content.thumbnail ? (
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                  ) : (
                    <div
                      className={`w-20 h-14 bg-gradient-to-br ${getTypeColor(content.type)} rounded-lg flex items-center justify-center`}
                    >
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {content.title}
                        </h3>
                        {content.isRecurring && (
                          <Repeat className="w-4 h-4 text-purple-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{content.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{content.scheduledTime}</span>
                        </div>
                        {content.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{content.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(content.status)}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {content.status === "scheduled" && "Planifié"}
                          {content.status === "live" && "En direct"}
                          {content.status === "completed" && "Terminé"}
                          {content.status === "cancelled" && "Annulé"}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            content.visibility === "public"
                              ? "bg-green-100 text-green-700"
                              : content.visibility === "private"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {content.visibility === "public" && (
                            <Globe className="w-3 h-3 inline" />
                          )}
                          {content.visibility === "private" && (
                            <Lock className="w-3 h-3 inline" />
                          )}
                          {content.visibility === "unlisted" && (
                            <Lock className="w-3 h-3 inline" />
                          )}
                          {content.visibility === "public" && "Public"}
                          {content.visibility === "private" && "Privé"}
                          {content.visibility === "unlisted" && "Non listé"}
                        </span>
                      </div>

                      {content.platform.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Plateformes:</span>
                          {content.platform.map((platform, platformIndex) => (
                            <span
                              key={platformIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {content.expectedViews && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {content.actualViews || content.expectedViews}
                          </div>
                          <div className="text-xs text-gray-500">vues</div>
                        </div>
                      )}

                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun contenu trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par planifier votre premier contenu"}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Planifier du contenu
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
