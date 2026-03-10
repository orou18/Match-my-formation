"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
  Rocket,
  Crown,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const locale = params.locale || "fr";

  useEffect(() => {
    // Utiliser les données de test pour éviter les erreurs
    const mockUser = {
      id: 3,
      name: "Alice Élève",
      email: "student@match.com",
      role: "student"
    };
    
    setUser(mockUser);
    setLoading(false);
    
    /* Commenté pour éviter les erreurs API
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const res = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    */
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black text-[#002B24] mb-2">Mon profil</h1>
          <p className="text-gray-400">Gérez vos informations personnelles et votre progression</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* Info Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rôle</p>
                  <p className="font-semibold text-gray-900">Student</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Membre depuis</p>
                  <p className="font-semibold text-gray-900">Janvier 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cours suivis</p>
                  <p className="font-semibold text-gray-900">12</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Certificats</p>
                  <p className="font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">4.8</span>
            </div>
            <p className="text-gray-600">Note moyenne</p>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < 4 ? "bg-yellow-400" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">89%</span>
            </div>
            <p className="text-gray-600">Taux de complétion</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "89%" }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">156h</span>
            </div>
            <p className="text-gray-600">Temps d'apprentissage</p>
            <p className="text-sm text-green-600 mt-2">+12h ce mois</p>
          </div>
        </motion.div>

      {/* Become Creator CTA - BOUTON QUI SE DÉMARQUE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Effet de fond animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FFB800] rounded-3xl transform rotate-1 scale-105 opacity-90"></div>
          
          {/* Conteneur principal */}
          <div className="relative bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FFB800] rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
            {/* Particules animées */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse delay-1000"></div>
            
            {/* Icônes flottantes */}
            <div className="absolute top-4 right-4 animate-bounce delay-500">
              <Crown className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="absolute bottom-4 left-4 animate-bounce delay-700">
              <Rocket className="w-6 h-6 text-yellow-300" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Devenez Créateur !</h3>
                </div>
                <p className="text-white/95 max-w-md text-lg leading-relaxed">
                  Transformez votre expertise en revenus. Rejoignez notre communauté de créateurs et commencez à partager vos connaissances avec des milliers d'étudiants.
                </p>
                
                {/* Avantages */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Crown className="w-4 h-4" />
                    Revenus passifs
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Rocket className="w-4 h-4" />
                    Communauté active
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Sparkles className="w-4 h-4" />
                    Support complet
                  </div>
                </div>
              </div>
              
              {/* BOUTON QUI SE DÉMARQUE VRAIMENT */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(255, 107, 53, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = `/${locale}/dashboard/creator/become`}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-[#FF6B35] rounded-2xl font-black text-lg tracking-wider shadow-2xl hover:shadow-[#FF6B35]/25 transition-all duration-300 overflow-hidden"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {/* Contenu du bouton */}
                <span className="relative z-10 flex items-center gap-3">
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Devenir Créateur</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Bordure animée */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-1 -z-10">
                  <div className="bg-white rounded-2xl w-full h-full"></div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Activité récente</h3>
          <div className="space-y-4">
            {[
              {
                title: "React Avancé",
                progress: 75,
                lastAccessed: "Il y a 2 jours",
                icon: BookOpen,
              },
              {
                title: "TypeScript Masterclass",
                progress: 100,
                lastAccessed: "Il y a 1 semaine",
                icon: Award,
              },
              {
                title: "Node.js Backend",
                progress: 45,
                lastAccessed: "Il y a 3 jours",
                icon: BookOpen,
              },
            ].map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <course.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.lastAccessed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.progress}%</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}