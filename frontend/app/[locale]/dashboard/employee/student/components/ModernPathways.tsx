"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Users,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Calendar,
  Star,
  Zap,
  ArrowRight,
  Lock,
  Unlock,
} from "lucide-react";

interface Pathway {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  videos_count: number;
  completed_videos: number;
  is_locked: boolean;
  progress_percentage: number;
  created_at: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  rating: number;
}

interface ModernPathwaysProps {
  pathways: Pathway[];
  onPathwaySelect: (pathwayId: number) => void;
}

export default function ModernPathways({ pathways, onPathwaySelect }: ModernPathwaysProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("progress");

  // Filtrer les parcours
  const filteredPathways = pathways.filter((pathway) => {
    const matchesSearch = pathway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pathway.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pathway.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || pathway.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Trier les parcours
  const sortedPathways = [...filteredPathways].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return b.progress_percentage - a.progress_percentage;
      case "duration":
        return a.duration - b.duration;
      case "rating":
        return b.rating - a.rating;
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-50";
      case "intermediate": return "text-yellow-600 bg-yellow-50";
      case "advanced": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Débutant";
      case "intermediate": return "Intermédiaire";
      case "advanced": return "Avancé";
      default: return difficulty;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header avec filtres */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Parcours de formation</h2>
            <p className="text-gray-600">Explorez vos parcours et progressez à votre rythme</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{pathways.length}</div>
              <div className="text-sm text-gray-600">Parcours disponibles</div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un parcours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filtre catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              <option value="marketing">Marketing</option>
              <option value="development">Développement</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>

            {/* Filtre difficulté */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="progress">Progression</option>
              <option value="duration">Durée</option>
              <option value="rating">Note</option>
              <option value="recent">Récents</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grille de parcours */}
      <AnimatePresence mode="wait">
        {sortedPathways.length > 0 ? (
          <motion.div
            key="pathways"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedPathways.map((pathway, index) => (
              <motion.div
                key={pathway.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPathwaySelect(pathway.id)}
                className="cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
                  {/* Overlay de progression */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  
                  {/* Image de couverture */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pathway.thumbnail || "/placeholder-pathway.jpg"}
                      alt={pathway.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge de difficulté */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pathway.difficulty)}`}>
                        {getDifficultyLabel(pathway.difficulty)}
                      </span>
                    </div>

                    {/* Badge de verrouillage */}
                    {pathway.is_locked && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Progression */}
                    {!pathway.is_locked && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white mb-2">
                          <span className="text-sm font-medium">Progression</span>
                          <span className="text-sm">{pathway.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pathway.progress_percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {pathway.title}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{pathway.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pathway.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          <span>{pathway.videos_count} vidéos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(pathway.duration / 60)}h</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {pathway.is_locked ? (
                          <span className="text-xs text-gray-500">Verrouillé</span>
                        ) : (
                          <span className="text-xs text-green-600 font-medium">
                            {pathway.completed_videos}/{pathway.videos_count} terminées
                          </span>
                        )}
                      </div>
                      
                      <motion.div
                        whileHover={{ x: 2 }}
                        className="text-primary"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun parcours trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres ou votre recherche
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setSortBy("progress");
              }}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium"
            >
              Réinitialiser les filtres
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
