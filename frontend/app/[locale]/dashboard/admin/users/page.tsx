"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Edit,
  Trash2,
  UserPlus,
  Download,
  RefreshCw,
} from "lucide-react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const [users] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      role: "student",
      status: "active",
      registeredAt: "2024-01-15",
      lastLogin: "2024-03-10",
      coursesEnrolled: 12,
      completionRate: 85,
      avatar: "/avatars/marie.jpg",
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@email.com",
      role: "creator",
      status: "active",
      registeredAt: "2024-02-20",
      lastLogin: "2024-03-09",
      coursesCreated: 8,
      totalStudents: 245,
      avatar: "/avatars/jean.jpg",
    },
    {
      id: 3,
      name: "Alice Bernard",
      email: "alice.bernard@email.com",
      role: "student",
      status: "suspended",
      registeredAt: "2024-03-01",
      lastLogin: "2024-03-05",
      coursesEnrolled: 6,
      completionRate: 92,
      avatar: "/avatars/alice.jpg",
    },
    {
      id: 4,
      name: "Thomas Petit",
      email: "thomas.petit@email.com",
      role: "admin",
      status: "active",
      registeredAt: "2023-12-10",
      lastLogin: "2024-03-10",
      managedUsers: 1560,
      avatar: "/avatars/thomas.jpg",
    },
  ]);

  const [stats] = useState({
    total: 15420,
    active: 8750,
    new: 245,
    suspended: 12,
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Actif" },
      suspended: { color: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Suspendu" },
      pending: { color: "bg-yellow-100 text-yellow-700", icon: RefreshCw, label: "En attente" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "bg-purple-100 text-purple-700", label: "Admin" },
      creator: { color: "bg-blue-100 text-blue-700", label: "Créateur" },
      student: { color: "bg-green-100 text-green-700", label: "Étudiant" },
    };
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600">
                Gérez tous les utilisateurs de la plateforme
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                <UserPlus className="w-4 h-4" />
                Ajouter un utilisateur
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Total utilisateurs"
            value={stats.total}
            change={stats.new}
            changeType="increase"
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-50"
            subtitle="Inscrits depuis le début"
          />
          <AnalyticsCard
            title="Utilisateurs actifs"
            value={stats.active}
            change={5.2}
            changeType="increase"
            icon={CheckCircle}
            color="text-green-600"
            bgColor="bg-green-50"
            subtitle="Actifs cette semaine"
          />
          <AnalyticsCard
            title="Nouveaux utilisateurs"
            value={stats.new}
            change={12.4}
            changeType="increase"
            icon={UserPlus}
            color="text-purple-600"
            bgColor="bg-purple-50"
            subtitle="Ce mois-ci"
          />
          <AnalyticsCard
            title="Utilisateurs suspendus"
            value={stats.suspended}
            change={-2.1}
            changeType="decrease"
            icon={AlertTriangle}
            color="text-red-600"
            bgColor="bg-red-50"
            subtitle="Nécessite une action"
          />
        </div>

        {/* Filters */}
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
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="creator">Créateur</option>
              <option value="student">Étudiant</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscrit le
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role).color}`}>
                        {getRoleBadge(user.role).label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusBadge(user.status).color}`}>
                        {React.createElement(getStatusBadge(user.status).icon, { className: "w-3 h-3" })}
                        {getStatusBadge(user.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.registeredAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
