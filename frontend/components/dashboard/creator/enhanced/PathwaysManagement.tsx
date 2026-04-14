"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Play,
  Clock,
  Users,
  Target,
  Save,
  X,
  Video,
  FileText,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface Pathway {
  id: number;
  title: string;
  description: string;
  courses: number[];
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  enrolledUsers: number;
  completionRate: number;
  created_at: string;
  status: "draft" | "published" | "archived";
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  enrolledUsers: number;
  status: string;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  videos: number[];
  totalDuration: number;
  created_at: string;
  isPublic: boolean;
}

export default function PathwaysManagement() {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"pathways" | "playlists">(
    "pathways"
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    selectedCourses: [] as number[],
  });

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchData = async () => {
      try {
        // Fetch pathways for creator
        const pRes = await fetch("http://127.0.0.1:8000/api/creator/pathways", {
          headers: token
            ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
            : { Accept: "application/json" },
        });
        if (pRes.ok) {
          const pJson = await pRes.json();
          setPathways((pJson.data ?? pJson) || []);
        }

        // Fetch videos to allow selection when creating pathway
        const vRes = await fetch("http://127.0.0.1:8000/api/creator/videos", {
          headers: token
            ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
            : { Accept: "application/json" },
        });
        if (vRes.ok) {
          const vJson = await vRes.json();
          // map videos into Course-like shape for selection
          const mapped = (vJson || []).map((v: any) => ({
            id: v.id,
            title: v.title,
            description: v.description ?? "",
            category: v.category ?? "General",
            level: "N/A",
            duration: v.duration ?? 0,
            enrolledUsers: 0,
            status: v.visibility ?? "published",
          }));
          setCourses(mapped);
        }

        // Playlists: not yet supported server-side, keep empty
        setPlaylists([]);
      } catch (err) {
        console.error("Error fetching pathways data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePathway = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      // duration_hours: approximate from selected videos
      const durationHours = Math.max(
        1,
        Math.round((formData.selectedCourses.length * 20) / 1)
      );

      const payload = {
        title: formData.title,
        description: formData.description,
        domain: "general",
        duration_hours: durationHours,
        difficulty_level: formData.difficulty,
        video_ids: formData.selectedCourses,
      };

      const res = await fetch("http://127.0.0.1:8000/api/creator/pathways", {
        method: "POST",
        headers: token
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          : { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const created = json.data ?? json;
        setPathways((prev) => [created, ...prev]);
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error("Failed to create pathway", await res.text());
      }
    } catch (err) {
      console.error("Error creating pathway", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "beginner",
      selectedCourses: [],
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-yellow-100 text-yellow-700",
      advanced: "bg-red-100 text-red-700",
    };
    const labels = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty as keyof typeof colors]}`}
      >
        {labels[difficulty as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Publié
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <FileText className="w-3 h-3" />
            Brouillon
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <X className="w-3 h-3" />
            Archivé
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Parcours et Playlists
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
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
            Parcours et Playlists
          </h1>
          <p className="text-gray-600">
            Créez des parcours d'apprentissage et des playlists vidéo
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Créer un parcours
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab("pathways")}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              selectedTab === "pathways"
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Parcours ({pathways.length})
          </button>
          <button
            onClick={() => setSelectedTab("playlists")}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              selectedTab === "playlists"
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Playlists ({playlists.length})
          </button>
        </div>
      </div>

      {/* Pathways */}
      {selectedTab === "pathways" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {pathways.map((pathway, index) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getDifficultyBadge(pathway.difficulty)}
                    {getStatusBadge(pathway.status)}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {pathway.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {pathway.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {pathway.courses.length}
                    </div>
                    <div className="text-xs text-gray-600">Cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {pathway.estimatedHours}h
                    </div>
                    <div className="text-xs text-gray-600">Durée</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">
                      Progression moyenne
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {pathway.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pathway.completionRate}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{pathway.enrolledUsers} inscrits</span>
                  <span>
                    Créé le {new Date(pathway.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Voir le parcours
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
      )}

      {/* Playlists */}
      {selectedTab === "playlists" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        playlist.isPublic
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {playlist.isPublic ? "Public" : "Privé"}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {playlist.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {playlist.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {playlist.videos.length}
                    </div>
                    <div className="text-xs text-gray-600">Vidéos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {Math.floor(playlist.totalDuration / 60)}h
                    </div>
                    <div className="text-xs text-gray-600">Durée totale</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-gray-600 mb-4">
                  Créée le {new Date(playlist.created_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Lire la playlist
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
      )}

      {/* Create Pathway Modal */}
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
                Créer un parcours d'apprentissage
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du parcours
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Entrez un titre attrayant..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau de difficulté
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as
                          | "beginner"
                          | "intermediate"
                          | "advanced",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
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
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Décrivez le parcours d'apprentissage..."
                />
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Sélectionnez les cours à inclure
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-xl">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedCourses.includes(course.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedCourses: [
                                ...formData.selectedCourses,
                                course.id,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedCourses: formData.selectedCourses.filter(
                                (id) => id !== course.id
                              ),
                            });
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {course.category} • {course.level}
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.duration} minutes
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected Courses Summary */}
              {formData.selectedCourses.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Cours sélectionnés ({formData.selectedCourses.length})
                  </div>
                  <div className="space-y-1">
                    {formData.selectedCourses.map((courseId) => {
                      const course = courses.find((c) => c.id === courseId);
                      return course ? (
                        <div
                          key={courseId}
                          className="text-sm text-blue-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {course.title}
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="text-sm text-blue-900 mt-2">
                    Durée estimée : {formData.selectedCourses.length * 20}{" "}
                    heures
                  </div>
                </div>
              )}
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
                onClick={handleCreatePathway}
                disabled={formData.selectedCourses.length === 0}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Créer le parcours
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
