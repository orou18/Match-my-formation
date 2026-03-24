"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Award,
  BookOpen,
  Play,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Calendar,
  BarChart3,
  TrendingUp,
  Star,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Settings,
  Copy,
  Download,
  X
} from "lucide-react";
import { useSimpleNotification, NotificationContainer } from "@/components/ui/SimpleNotification";

interface Pathway {
  id: number;
  title: string;
  description: string;
  domain: string;
  duration_hours: number;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  is_active: boolean;
  videos_count: number;
  assigned_employees: number;
  created_at: string;
  videos?: Array<{
    id: number;
    title: string;
    description: string;
    duration: string;
    thumbnail: string;
  }>;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  domain: string;
  is_active: boolean;
}

export default function PathwaysPage() {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [expandedPathway, setExpandedPathway] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    duration_hours: 1,
    difficulty_level: "beginner" as "beginner" | "intermediate" | "advanced",
    video_ids: [] as number[],
  });

  const [assignData, setAssignData] = useState({
    pathway_id: "",
    employee_id: "",
  });

  const { notifications, success, error, removeNotification } = useSimpleNotification();

  useEffect(() => {
    loadPathways();
    loadEmployees();
  }, []);

  const loadPathways = async () => {
    try {
      const response = await fetch("/api/creator/pathways", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setPathways(data.data);
      } else {
        error("Erreur", "Impossible de charger les parcours");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch("/api/creator/employees", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (err) {
      console.error("Erreur chargement employés:", err);
    }
  };

  const createPathway = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/creator/pathways", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success) {
        success("Parcours créé", `${data.data.title} a été créé avec succès`);
        setShowCreateModal(false);
        setFormData({
          title: "",
          description: "",
          domain: "",
          duration_hours: 1,
          difficulty_level: "beginner",
          video_ids: [],
        });
        loadPathways();
      } else {
        error("Erreur", data.message || "Impossible de créer le parcours");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    }
  };

  const assignPathway = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/creator/pathways/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(assignData),
      });
      const data = await response.json();
      
      if (data.success) {
        success("Parcours assigné", `Le parcours a été assigné à l'employé avec succès`);
        setShowAssignModal(false);
        setAssignData({ pathway_id: "", employee_id: "" });
      } else {
        error("Erreur", data.message || "Impossible d'assigner le parcours");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    }
  };

  const deletePathway = async (pathway: Pathway) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le parcours "${pathway.title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/creator/pathways/${pathway.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        success("Parcours supprimé", `Le parcours a été supprimé avec succès`);
        loadPathways();
      } else {
        error("Erreur", "Impossible de supprimer le parcours");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-amber-100 text-amber-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case "beginner": return "Débutant";
      case "intermediate": return "Intermédiaire";
      case "advanced": return "Avancé";
      default: return level;
    }
  };

  const domains = [...new Set(pathways.map(p => p.domain))];
  const filteredPathways = pathways.filter(pathway => {
    const matchesSearch = pathway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pathway.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = filterDomain === "all" || pathway.domain === filterDomain;
    const matchesDifficulty = filterDifficulty === "all" || pathway.difficulty_level === filterDifficulty;
    
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-600" />
                Parcours de Formation
              </h1>
              <p className="text-gray-600 mt-2">
                Créez et gérez des parcours structurés pour vos employés
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nouveau parcours
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total parcours</p>
                <p className="text-2xl font-bold text-gray-900">{pathways.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Employés assignés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pathways.reduce((sum, p) => sum + p.assigned_employees, 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total vidéos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pathways.reduce((sum, p) => sum + (p.videos_count || 0), 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un parcours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">🏢 Tous les domaines</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">🎯 Toutes les difficultés</option>
              <option value="beginner">🟢 Débutant</option>
              <option value="intermediate">🟡 Intermédiaire</option>
              <option value="advanced">🔴 Avancé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des parcours */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredPathways.length} parcours trouvé{filteredPathways.length > 1 ? 's' : ''}
            </h2>
          </div>

          {filteredPathways.length === 0 ? (
            <div className="p-12 text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun parcours trouvé</h3>
              <p className="text-gray-600">
                {searchTerm || filterDomain !== "all" || filterDifficulty !== "all"
                  ? "Essayez de modifier vos filtres"
                  : "Commencez par créer votre premier parcours de formation"
                }
              </p>
              {!searchTerm && filterDomain === "all" && filterDifficulty === "all" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un parcours
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPathways.map((pathway, index) => (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{pathway.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pathway.difficulty_level)}`}>
                            {getDifficultyLabel(pathway.difficulty_level)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {pathway.domain}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-2">{pathway.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {pathway.duration_hours}h
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {pathway.videos_count || 0} vidéos
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {pathway.assigned_employees || 0} employés
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (expandedPathway === pathway.id) {
                              setExpandedPathway(null);
                            } else {
                              setExpandedPathway(pathway.id);
                              setSelectedPathway(pathway);
                            }
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setAssignData({ pathway_id: pathway.id.toString(), employee_id: "" });
                            setShowAssignModal(true);
                          }}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Assigner à un employé"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deletePathway(pathway)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Détails étendus */}
                  <AnimatePresence>
                    {expandedPathway === pathway.id && selectedPathway && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 p-6 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Vidéos du parcours</h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {selectedPathway.videos?.map((video, videoIndex) => (
                                <div key={video.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                                    <Play className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{video.title}</h5>
                                    <p className="text-sm text-gray-600 line-clamp-1">{video.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500">{video.duration}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Statistiques</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Employés assignés:</span>
                                <span className="font-medium">{selectedPathway.assigned_employees}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total vidéos:</span>
                                <span className="font-medium">{selectedPathway.videos_count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Durée totale:</span>
                                <span className="font-medium">{selectedPathway.duration_hours} heures</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Créé le:</span>
                                <span className="font-medium">
                                  {new Date(selectedPathway.created_at).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de création */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    Créer un parcours
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={createPathway} className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre du parcours *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Formation Hôtellerie Complète"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domaine *</label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un domaine</option>
                      <option value="Hôtellerie">🏨 Hôtellerie</option>
                      <option value="Restauration">🍽 Restauration</option>
                      <option value="Tourisme">✈️ Tourisme</option>
                      <option value="Commerce">🛍️ Commerce</option>
                      <option value="Santé">🏥 Santé</option>
                      <option value="Éducation">📚 Éducation</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Décrivez le contenu et les objectifs de ce parcours..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durée (heures) *</label>
                    <input
                      type="number"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de difficulté *</label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="beginner">🟢 Débutant</option>
                      <option value="intermediate">🟡 Intermédiaire</option>
                      <option value="advanced">🔴 Avancé</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg"
                  >
                    Créer le parcours
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'assignation */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    Assigner le parcours
                  </h2>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={assignPathway} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employé *</label>
                    <select
                      value={assignData.employee_id}
                      onChange={(e) => setAssignData({ ...assignData, employee_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un employé</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Assigner
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}
