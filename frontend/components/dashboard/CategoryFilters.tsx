"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Search,
  X,
  ChevronDown,
  Tag,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

interface CategoryFiltersProps {
  courses?: any[];
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  category: string;
  difficulty: string;
  duration: string;
  rating: string;
  sortBy: string;
}

// Hook de debounce pour optimiser la recherche
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const CATEGORIES: FilterOption[] = [
  { id: "all", label: "Toutes les catégories", value: "all" },
  { id: "marketing", label: "Marketing", value: "Marketing" },
  { id: "development", label: "Développement", value: "Développement" },
  { id: "design", label: "Design", value: "Design" },
  { id: "sales", label: "Ventes", value: "Ventes" },
  { id: "management", label: "Management", value: "Management" },
  { id: "finance", label: "Finance", value: "Finance" },
  { id: "communication", label: "Communication", value: "Communication" },
];

const DIFFICULTY_LEVELS: FilterOption[] = [
  { id: "all", label: "Tous les niveaux", value: "all" },
  { id: "beginner", label: "Débutant", value: "beginner" },
  { id: "intermediate", label: "Intermédiaire", value: "intermediate" },
  { id: "advanced", label: "Avancé", value: "advanced" },
];

const DURATION_OPTIONS: FilterOption[] = [
  { id: "all", label: "Toutes durées", value: "all" },
  { id: "short", label: "Moins de 30min", value: "short" },
  { id: "medium", label: "30min - 1h", value: "medium" },
  { id: "long", label: "Plus de 1h", value: "long" },
];

const RATING_OPTIONS: FilterOption[] = [
  { id: "all", label: "Toutes notes", value: "all" },
  { id: "4+", label: "4 étoiles et plus", value: "4+" },
  { id: "3+", label: "3 étoiles et plus", value: "3+" },
  { id: "2+", label: "2 étoiles et plus", value: "2+" },
];

const SORT_OPTIONS: FilterOption[] = [
  { id: "recent", label: "Plus récentes", value: "recent" },
  { id: "popular", label: "Plus populaires", value: "popular" },
  { id: "rating", label: "Mieux notées", value: "rating" },
  { id: "duration", label: "Durée croissante", value: "duration" },
  { id: "title", label: "Ordre alphabétique", value: "title" },
];

export default function CategoryFilters({
  courses = [],
  onFilterChange,
}: CategoryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    difficulty: "all",
    duration: "all",
    rating: "all",
    sortBy: "recent",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Appliquer le debounce à la recherche pour optimiser les performances
  const debouncedSearch = useDebounce(filters.search, 300);

  // Mettre à jour les filtres avec la recherche debounce
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [
    debouncedSearch,
    filters.category,
    filters.difficulty,
    filters.duration,
    filters.rating,
    filters.sortBy,
    onFilterChange,
  ]);

  // Calculer le nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (debouncedSearch) count++;
    if (filters.category !== "all") count++;
    if (filters.difficulty !== "all") count++;
    if (filters.duration !== "all") count++;
    if (filters.rating !== "all") count++;
    setActiveFiltersCount(count);
  }, [debouncedSearch, filters]);

  // Appliquer les filtres aux cours
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          course.category
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          course.tags?.some((tag: string) =>
            tag.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Filtre par catégorie
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (course) => course.category === filters.category
      );
    }

    // Filtre par difficulté
    if (filters.difficulty !== "all") {
      filtered = filtered.filter(
        (course) => course.difficulty_level === filters.difficulty
      );
    }

    // Filtre par durée
    if (filters.duration !== "all") {
      filtered = filtered.filter((course) => {
        const durationInMinutes = parseDuration(course.duration);
        switch (filters.duration) {
          case "short":
            return durationInMinutes < 30;
          case "medium":
            return durationInMinutes >= 30 && durationInMinutes <= 60;
          case "long":
            return durationInMinutes > 60;
          default:
            return true;
        }
      });
    }

    // Filtre par note
    if (filters.rating !== "all") {
      filtered = filtered.filter((course) => {
        const rating = course.rating || 0;
        switch (filters.rating) {
          case "4+":
            return rating >= 4;
          case "3+":
            return rating >= 3;
          case "2+":
            return rating >= 2;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "duration":
          return parseDuration(a.duration) - parseDuration(b.duration);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, filters]);

  // Helper pour parser la durée
  const parseDuration = (duration: string): number => {
    if (!duration) return 0;
    const parts = duration.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  // Gérer les changements de filtres
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      difficulty: "all",
      duration: "all",
      rating: "all",
      sortBy: "recent",
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Header des filtres */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {/* Barre de recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Filtres étendus */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 border-t border-gray-200 pt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Catégorie */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <Tag className="w-3 h-3 inline mr-1" />
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulté */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <Star className="w-3 h-3 inline mr-1" />
                Niveau
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.id} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Durée */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <Clock className="w-3 h-3 inline mr-1" />
                Durée
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Trier par
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags populaires */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-700">
              Tags populaires:
            </span>
            {[
              "marketing",
              "javascript",
              "design",
              "communication",
              "gestion",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => handleFilterChange("search", tag)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Résultats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1
              ? "formation trouvée"
              : "formations trouvées"}
          </span>

          {/* Tags actifs */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Recherche: {filters.search}
                  <button onClick={() => handleFilterChange("search", "")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.category !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {CATEGORIES.find((c) => c.value === filters.category)?.label}
                  <button onClick={() => handleFilterChange("category", "all")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
