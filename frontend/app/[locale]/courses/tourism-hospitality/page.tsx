"use client";

import { motion } from "framer-motion";
import TourismCourseGrid from "@/components/courses/TourismCourseGrid";
import {
  BookOpen,
  Star,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

export default function TourismHospitalityPage() {
  // Statistiques pour cette catégorie
  const stats = {
    totalCourses: 4,
    totalStudents: 4760,
    averageRating: 4.75,
    totalReviews: 355,
    popularCategories: [
      { name: "Management Hôtelier", count: 1234 },
      { name: "Digital & Tech", count: 2103 },
      { name: "Écotourisme", count: 856 },
      { name: "Revenue Management", count: 567 },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Tourisme & Hôtellerie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Formations d'excellence pour les professionnels du tourisme et de l'hôtellerie. 
            Développez votre expertise avec nos cours premium animés par des experts de l'industrie.
          </p>
          
          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-5 h-5 text-primary" />
              <span>Certification reconnue</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-5 h-5 text-primary" />
              <span>4700+ étudiants</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>4.8/5 moyenne</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>45h de contenu</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              title: "Cours disponibles",
              value: stats.totalCourses,
              icon: BookOpen,
              color: "text-blue-600",
              bg: "bg-blue-50",
              trend: "+2 ce mois"
            },
            {
              title: "Étudiants actifs",
              value: stats.totalStudents.toLocaleString(),
              icon: Users,
              color: "text-green-600",
              bg: "bg-green-50",
              trend: "+15% ce mois"
            },
            {
              title: "Note moyenne",
              value: stats.averageRating.toFixed(1),
              icon: Star,
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              trend: "+0.2"
            },
            {
              title: "Avis reçus",
              value: stats.totalReviews,
              icon: TrendingUp,
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: "+28 ce mois"
            }
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
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories Populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.popularCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} cours</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Cours en Vedette</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Tendances actuelles</span>
            </div>
          </div>
          
          <TourismCourseGrid 
            variant="featured" 
            maxCourses={4}
            showFilters={false}
          />
        </motion.div>

        {/* All Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tous les Cours</h2>
            <p className="text-lg text-gray-600">
              Explorez notre catalogue complet de formations en tourisme et hôtellerie
            </p>
          </div>
          
          <TourismCourseGrid 
            variant="default"
            showFilters={true}
          />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Booster Votre Carrière ?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Rejoignez des milliers de professionnels qui ont transformé leur carrière avec nos formations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Explorer tous les cours
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30">
                Demander une démo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
