"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Building,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
} from "lucide-react";

export default function AdminPartnersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [partners] = useState([
    {
      id: 1,
      name: "Hilton Hotels & Resorts",
      email: "partnership@hilton.com",
      phone: "+33 1 42 68 00 00",
      status: "active",
      joinedAt: "2024-01-15",
      revenue: 45000,
      courses: 12,
    },
    {
      id: 2,
      name: "Accor Group",
      email: "partners@accor.com",
      phone: "+33 1 45 38 00 00",
      status: "active",
      joinedAt: "2024-02-20",
      revenue: 32000,
      courses: 8,
    },
    {
      id: 3,
      name: "Marriott International",
      email: "partners@marriott.com",
      phone: "+33 1 40 68 00 00",
      status: "pending",
      joinedAt: "2024-03-01",
      revenue: 0,
      courses: 0,
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-700", label: "Actif" },
      pending: { color: "bg-yellow-100 text-yellow-700", label: "En attente" },
      inactive: { color: "bg-gray-100 text-gray-700", label: "Inactif" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Partenaires
            </h1>
            <p className="text-lg text-gray-600">
              Administration des partenaires hôtellerie et tourisme
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
            <Plus className="w-5 h-5" />
            Ajouter un partenaire
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Partenaires",
              value: partners.length,
              icon: Building,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Partenaires Actifs",
              value: partners.filter(p => p.status === "active").length,
              icon: Users,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              title: "Revenus Totaux",
              value: `${partners.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}€`,
              icon: TrendingUp,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              title: "Cours Créés",
              value: partners.reduce((sum, p) => sum + p.courses, 0),
              icon: Calendar,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un partenaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Partners Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Partenaire</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Statut</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Revenus</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Cours</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Date d'inscription</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partners.map((partner) => {
                  const statusBadge = getStatusBadge(partner.status);
                  
                  return (
                    <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{partner.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">{partner.email}</p>
                          <p className="text-sm text-gray-600">{partner.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {partner.revenue.toLocaleString()}€
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {partner.courses}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(partner.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}