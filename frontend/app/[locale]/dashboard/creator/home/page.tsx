"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function CreatorHomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Espace Creator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bienvenue dans votre espace de création de formations
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Créer une formation",
              description: "Commencez à créer votre premier cours",
              icon: Plus,
              href: "/dashboard/creator/videos",
              color: "bg-blue-500 hover:bg-blue-600",
            },
            {
              title: "Vos statistiques",
              description: "Analysez vos performances",
              icon: TrendingUp,
              href: "/dashboard/creator/stats",
              color: "bg-green-500 hover:bg-green-600",
            },
            {
              title: "Historique",
              description: "Consultez votre activité",
              icon: BookOpen,
              href: "/dashboard/creator/history",
              color: "bg-purple-500 hover:bg-purple-600",
            },
            {
              title: "Certifications",
              description: "Gérez vos certificats",
              icon: Award,
              href: "/dashboard/creator/notifications",
              color: "bg-orange-500 hover:bg-orange-600",
            },
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`${action.color} text-white rounded-2xl p-6 block hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <action.icon className="w-8 h-8" />
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue, Creator !
                </h2>
                <p className="text-gray-600">
                  Prêt à partager votre expertise avec le monde ?
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vos performances récentes
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">0</div>
                    <div className="text-sm text-gray-600">Formations créées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">0</div>
                    <div className="text-sm text-gray-600">Apprenants inscrits</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/creator/videos"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Créer une nouvelle formation</span>
                  </Link>
                  <Link
                    href="/dashboard/creator/profile"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Compléter votre profil</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">
                Commencez votre parcours
              </h3>
              <p className="text-white/90 mb-8">
                Rejoignez des milliers de créateurs et commencez à monétiser votre expertise
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/dashboard/creator/become"
                  className="w-full bg-white text-primary py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Devenir créateur</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  href="/dashboard/creator/setup"
                  className="w-full bg-white/20 backdrop-blur-sm text-white py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2 border border border-white/30"
                >
                  <span>Configurer mon profil</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Besoin d'aide ?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Consultez notre documentation complète</p>
                <p>• Rejoignez la communauté des créateurs</p>
                <p>• Contactez notre support technique</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    Accéder à la documentation →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
