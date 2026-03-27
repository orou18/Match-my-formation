"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  BarChart3,
  CreditCard,
  Users,
  Eye,
  Download,
} from "lucide-react";

export default function RevenuePage() {
  // Données mockées pour le développement
  const stats = {
    totalRevenue: 45680,
    monthlyRevenue: 12450,
    growth: 15.8,
    averageOrderValue: 89.5,
    totalOrders: 511,
    conversionRate: 3.2,
    topProducts: [
      { name: "Formation Hôtellerie Avancée", revenue: 12450, orders: 89 },
      { name: "Gestion Restaurant", revenue: 8900, orders: 67 },
      { name: "Tourisme Durable", revenue: 6780, orders: 45 },
      { name: "Service Client", revenue: 4560, orders: 34 },
    ],
    monthlyData: [
      { month: "Jan", revenue: 8900, orders: 78 },
      { month: "Fév", revenue: 10200, orders: 92 },
      { month: "Mar", revenue: 12450, orders: 89 },
      { month: "Avr", revenue: 11800, orders: 85 },
      { month: "Mai", revenue: 13500, orders: 98 },
      { month: "Juin", revenue: 14200, orders: 103 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                Revenus
              </h1>
              <p className="text-gray-600 mt-2">
                Suivez vos revenus et performances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats principales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenu total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRevenue.toLocaleString("fr-FR")} €
                </p>
                <div className="flex items-center gap-1 text-sm">
                  {stats.growth > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={
                      stats.growth > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stats.growth > 0 ? "+" : ""}
                    {stats.growth}%
                  </span>
                </div>
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
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenu mensuel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthlyRevenue.toLocaleString("fr-FR")} €
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Commandes totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Panier moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageOrderValue.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Graphique mensuel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Évolution mensuelle
          </h2>

          <div className="space-y-4">
            {stats.monthlyData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 text-sm font-medium text-gray-600">
                  {data.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {data.revenue.toLocaleString("fr-FR")} €
                    </span>
                    <span className="text-sm text-gray-500">
                      {data.orders} commandes
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(data.revenue / Math.max(...stats.monthlyData.map((d) => d.revenue))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top produits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            Top formations
          </h2>

          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.orders} commandes
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {product.revenue.toLocaleString("fr-FR")} €
                  </p>
                  <p className="text-sm text-gray-500">Revenu total</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
