"use client";

import { motion } from "framer-motion";

export default function SimpleDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de vos performances et de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total des vidéos", value: "12", change: "+12%" },
          { title: "Vues totales", value: "45,680", change: "+23%" },
          { title: "Revenus", value: "2,850€", change: "+18%" },
          { title: "Abonnés", value: "3,420", change: "+5%" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Vidéos récentes
        </h2>
        <div className="space-y-4">
          {[
            "Introduction au Tourisme Durable",
            "Gestion Hôtelière Avancée",
            "Marketing Digital Touristique",
          ].map((title, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">▶</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>15,420 vues</span>
                  <span>892 likes</span>
                  <span>Il y a 2 jours</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
