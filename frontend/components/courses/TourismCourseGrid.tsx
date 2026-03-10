"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { tourismCourses, Course } from "@/data/courses/tourism-hospitality";
import CourseCard from "./CourseCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  Clock,
  Users,
} from "lucide-react";

interface TourismCourseGridProps {
  variant?: "default" | "featured";
  maxCourses?: number;
  showFilters?: boolean;
}

export default function TourismCourseGrid({ 
  variant = "default", 
  maxCourses,
  showFilters = true 
}: TourismCourseGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCourses = tourismCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration);
        case "popular":
        default:
          return b.students - a.students;
      }
    })
    .slice(0, maxCourses || tourismCourses.length);

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Management Hôtelier", label: "Management Hôtelier" },
    { value: "Écotourisme", label: "Écotourisme" },
    { value: "Digital & Tech", label: "Digital & Tech" },
    { value: "Revenue Management", label: "Revenue Management" },
  ];

  const levels = [
    { value: "all", label: "Tous les niveaux" },
    { value: "Débutant", label: "Débutant" },
    { value: "Intermédiaire", label: "Intermédiaire" },
    { value: "Avancé", label: "Avancé" },
    { value: "Expert", label: "Expert" },
  ];

  const sortOptions = [
    { value: "popular", label: "Plus populaires" },
    { value: "rating", label: "Mieux notés" },
    { value: "price-low", label: "Prix croissant" },
    { value: "price-high", label: "Prix décroissant" },
    { value: "duration", label: "Durée" },
  ];

  const handleEnroll = (courseId: string) => {
    console.log("Enroll to course:", courseId);
    // TODO: Implement enrollment logic
  };

  const handleContinue = (courseId: string) => {
    console.log("Continue course:", courseId);
    // TODO: Implement continue logic
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {filteredCourses.reduce((sum, course) => sum + course.students, 0).toLocaleString()} étudiants
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {(filteredCourses.reduce((sum, course) => sum + course.rating, 0) / filteredCourses.length).toFixed(1)} moyenne
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard
              course={course}
              index={index}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-12 text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucun cours trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedLevel("all");
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      )}

      {/* Load More Button */}
      {maxCourses && filteredCourses.length === maxCourses && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button className="px-8 py-3 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
            Voir plus de cours
          </button>
        </motion.div>
      )}
    </div>
  );
}
