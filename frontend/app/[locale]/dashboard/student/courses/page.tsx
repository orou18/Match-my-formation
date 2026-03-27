"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  Clock,
  Star,
  Play,
  Filter,
  Search,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [courses] = useState([
    {
      id: 1,
      title: "Management de l'Hôtellerie de Luxe",
      description:
        "Maîtrisez les stratégies de gestion hôtelière haut de gamme",
      category: "Management",
      level: "Avancé",
      duration: "12h",
      students: 1234,
      rating: 4.8,
      price: 299,
      image: "/courses/luxury-hotel.jpg",
      progress: 75,
      instructor: "Marie Dubois",
      modules: 8,
    },
    {
      id: 2,
      title: "Écotourisme et Développement Durable",
      description: "Initiatives éco-responsables dans le tourisme africain",
      category: "Écotourisme",
      level: "Intermédiaire",
      duration: "8h",
      students: 856,
      rating: 4.6,
      price: 199,
      image: "/courses/ecotourism.jpg",
      progress: 45,
      instructor: "Jean-Pierre N'Diaye",
      modules: 6,
    },
    {
      id: 3,
      title: "Digitalisation du Parcours Client",
      description: "IA et Data pour optimiser l'expérience client",
      category: "Digital",
      level: "Avancé",
      duration: "10h",
      students: 2103,
      rating: 4.9,
      price: 349,
      image: "/courses/digital-customer.jpg",
      progress: 30,
      instructor: "Sophie Martin",
      modules: 7,
    },
    {
      id: 4,
      title: "Revenue Management Stratégique",
      description: "Optimisation des revenus pour établissements touristiques",
      category: "Revenue Management",
      level: "Expert",
      duration: "15h",
      students: 567,
      rating: 4.7,
      price: 449,
      image: "/courses/revenue-management.jpg",
      progress: 0,
      instructor: "Thomas Bernard",
      modules: 10,
    },
  ]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      Débutant: { color: "bg-green-100 text-green-700" },
      Intermédiaire: { color: "bg-yellow-100 text-yellow-700" },
      Avancé: { color: "bg-orange-100 text-orange-700" },
      Expert: { color: "bg-red-100 text-red-700" },
    };
    return (
      levelConfig[level as keyof typeof levelConfig] || levelConfig.Débutant
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-black text-white mb-2">Mes Cours</h1>
        <p className="text-white/70">
          Explorez et poursuivez votre apprentissage
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
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

          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Management">Management</option>
              <option value="Écotourisme">Écotourisme</option>
              <option value="Digital">Digital</option>
              <option value="Revenue Management">Revenue Management</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Cours en cours",
            value: courses.filter((c) => c.progress > 0 && c.progress < 100)
              .length,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "Cours terminés",
            value: courses.filter((c) => c.progress === 100).length,
            icon: Award,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            title: "Heures d'apprentissage",
            value: "45h",
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            title: "Certificats",
            value: "2",
            icon: Star,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course, index) => {
          const levelBadge = getLevelBadge(course.level);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${levelBadge.color}`}
                  >
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {course.title}
                  </h3>
                  <p className="text-white/80 text-sm">{course.instructor}</p>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Progress Bar */}
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-medium text-primary">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Course Meta */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.modules} modules
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
                  {course.progress > 0 ? (
                    <>
                      <Play className="w-5 h-5" />
                      Continuer
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5" />
                      Commencer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-12 text-center"
        >
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucun cours trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche
          </p>
        </motion.div>
      )}
    </div>
  );
}
