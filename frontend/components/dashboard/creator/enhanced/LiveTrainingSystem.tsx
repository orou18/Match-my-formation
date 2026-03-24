"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Users,
  Calendar,
  Clock,
  MapPin,
  Star,
  Play,
  X,
  Globe,
  Wifi,
  Plus,
  Edit,
  Trash2,
  Mic,
  MicOff,
  Settings,
  MessageSquare,
  Save,
} from "lucide-react";

interface Webinar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: "live" | "upcoming" | "completed";
  maxParticipants: number;
  currentParticipants: number;
  creatorId: number;
  creatorName: string;
  location: "online" | "onsite";
  address?: string;
  meetingLink?: string;
  status: "scheduled" | "live" | "ended";
}

interface ChatMessage {
  id: number;
  userId: number;
  userName: string;
  message: string;
  timestamp: string;
  isCreator: boolean;
}

export default function LiveTrainingSystem() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    type: "online" as "online" | "onsite",
    maxParticipants: 100,
    location: "",
  });

  useEffect(() => {
    // Données mockées
    const mockWebinars: Webinar[] = [
      {
        id: 1,
        title: "Introduction au Revenue Management",
        description: "Apprenez les bases du revenue management hôtelier",
        date: "2024-03-25",
        time: "14:00",
        duration: "2 heures",
        type: "live",
        maxParticipants: 100,
        currentParticipants: 67,
        creatorId: 1,
        creatorName: "Marie Dubois",
        location: "online",
        meetingLink: "https://meet.jit.si/revenue-management-101",
        status: "live",
      },
      {
        id: 2,
        title: "Techniques de Service Haut de Gamme",
        description: "Maîtrisez les techniques de service dans l'hôtellerie de luxe",
        date: "2024-03-28",
        time: "16:00",
        duration: "1.5 heures",
        type: "upcoming",
        maxParticipants: 50,
        currentParticipants: 23,
        creatorId: 2,
        creatorName: "Thomas Bernard",
        location: "onsite",
        address: "Hôtel Plaza Athénée, Paris",
        status: "scheduled",
      },
      {
        id: 3,
        title: "Marketing Digital pour l'Hôtellerie",
        description: "Stratégies marketing digitales appliquées au secteur hôtelier",
        date: "2024-03-22",
        time: "10:00",
        duration: "3 heures",
        type: "completed",
        maxParticipants: 200,
        currentParticipants: 145,
        creatorId: 3,
        creatorName: "Sophie Laurent",
        location: "online",
        status: "ended",
      },
    ];

    const mockChatMessages: ChatMessage[] = [
      {
        id: 1,
        userId: 1,
        userName: "Marie Dubois",
        message: "Bonjour à tous ! Bienvenue dans ce webinaire sur le revenue management.",
        timestamp: "14:00",
        isCreator: true,
      },
      {
        id: 2,
        userId: 2,
        userName: "Alexandre Martin",
        message: "Bonjour ! Très intéressant ce sujet.",
        timestamp: "14:02",
        isCreator: false,
      },
      {
        id: 3,
        userId: 3,
        userName: "Sophie Laurent",
        message: "Pouvez-vous expliquer les indicateurs clés du RevPAR ?",
        timestamp: "14:05",
        isCreator: false,
      },
      {
        id: 4,
        userId: 1,
        userName: "Marie Dubois",
        message: "Excellente question ! Le RevPAR (Revenue Per Available Room) est calculé comme suit : (Total Room Revenue / Available Rooms) x Occupancy Rate. C'est l'un des KPI les plus importants en hôtellerie.",
        timestamp: "14:08",
        isCreator: true,
      },
      {
        id: 5,
        userId: 4,
        userName: "Thomas Bernard",
        message: "Merci pour l'explication détaillée !",
        timestamp: "14:10",
        isCreator: false,
      },
    ];

    setTimeout(() => {
      setWebinars(mockWebinars);
      setChatMessages(mockChatMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateWebinar = () => {
    const newWebinar: Webinar = {
      id: webinars.length + 1,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      type: "upcoming",
      maxParticipants: formData.maxParticipants,
      currentParticipants: 0,
      creatorId: 1,
      creatorName: "Current User",
      location: formData.type,
      address: formData.location,
      status: "scheduled",
    };

    setWebinars([...webinars, newWebinar]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleJoinWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    if (webinar.status === "live") {
      setIsLive(true);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      userId: 999, // Current user ID
      userName: "Vous",
      message: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isCreator: false,
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      type: "online",
      maxParticipants: 100,
      location: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            EN DIRECT
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <Calendar className="w-3 h-3" />
            Programmé
          </span>
        );
      case "ended":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <Video className="w-3 h-3" />
            Terminé
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
        type === "online"
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-700"
      }`}>
        {type === "online" ? (
          <>
            <Wifi className="w-3 h-3" />
            En ligne
          </>
        ) : (
          <>
            <MapPin className="w-3 h-3" />
            Sur place
          </>
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Formation en Direct</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Formation en Direct et Webinaires
          </h1>
          <p className="text-gray-600">
            Organisez des sessions live et interagissez avec vos apprenants
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Créer un webinaire
        </button>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {webinars.map((webinar, index) => (
          <motion.div
            key={webinar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(webinar.status)}
                  {getTypeBadge(webinar.location)}
                </div>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2">{webinar.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{webinar.description}</p>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(webinar.date).toLocaleDateString()} à {webinar.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Durée: {webinar.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Users className="w-4 h-4 text-gray-400" />
                  {webinar.currentParticipants}/{webinar.maxParticipants} participants
                </div>
                {webinar.location === "onsite" && webinar.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {webinar.address}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Inscriptions</span>
                  <span className="text-xs font-medium text-gray-900">
                    {Math.round((webinar.currentParticipants / webinar.maxParticipants) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(webinar.currentParticipants / webinar.maxParticipants) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleJoinWebinar(webinar)}
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {webinar.status === "live" ? "Rejoindre en direct" : "Voir les détails"}
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Webinar Interface */}
      {selectedWebinar && isLive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex"
            layoutId="live-webinar"
          >
            {/* Main Video Area */}
            <div className="flex-1 bg-black rounded-l-2xl flex flex-col">
              {/* Video Header */}
              <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-semibold">{selectedWebinar.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      EN DIRECT
                    </span>
                    <span className="text-sm">{selectedWebinar.currentParticipants} participants</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsLive(false);
                      setSelectedWebinar(null);
                    }}
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Placeholder */}
              <div className="flex-1 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Webinar en cours</p>
                  <p className="text-sm text-gray-500 mt-2">{selectedWebinar.description}</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="h-80 bg-gray-900 border-t border-gray-700 flex flex-col">
                <div className="bg-gray-800 p-3 border-b border-gray-700">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat en direct
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.isCreator ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isCreator ? "bg-primary text-white" : "bg-gray-600 text-white"
                      }`}>
                        <span className="text-sm font-medium">
                          {message.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className={`max-w-xs ${
                        message.isCreator ? "text-left" : "text-right"
                      }`}>
                        <div className={`text-xs text-gray-400 mb-1 ${
                          message.isCreator ? "text-left" : "text-right"
                        }`}>
                          {message.userName} • {message.timestamp}
                        </div>
                        <div className={`text-sm ${
                          message.isCreator ? "text-white" : "text-gray-200"
                        } bg-gray-700 rounded-lg px-3 py-2`}>
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Webinar Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Créer un webinaire
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du webinaire
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Entrez un titre attrayant..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de webinaire
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "online" | "onsite" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="online">En ligne</option>
                    <option value="onsite">Sur place</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Décrivez le contenu du webinaire..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ex: 2 heures"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participants maximum
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {formData.type === "onsite" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Adresse complète..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateWebinar}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Créer le webinaire
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
