"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  MoreVertical,
  Download,
  Upload,
} from "lucide-react";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";
import { creatorDashboardApi } from "@/lib/services/creator-dashboard-api";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  status: "active" | "inactive";
  hire_date: string;
  completion_rate: number;
  progress: number;
  avatar?: string;
}

type EmployeeApiModel = {
  id: number | string;
  name?: string;
  email?: string;
  phone?: string;
  domain?: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
  completion_rate?: number;
  progress?: number;
  avatar?: string;
};

export default function EmployeesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  useEffect(() => {
    loadEmployees();
  }, []);

  const mapEmployee = (employee: EmployeeApiModel): Employee => ({
    id: Number(employee.id),
    name: String(employee.name || "Employé"),
    email: String(employee.email || ""),
    phone: employee.phone ? String(employee.phone) : "",
    department: String(employee.domain || "general"),
    position: String(employee.role || "Employé"),
    status: employee.is_active ? "active" : "inactive",
    hire_date: String(employee.created_at || new Date().toISOString()),
    completion_rate: Number(employee.completion_rate || 0),
    progress: Number(employee.progress || employee.completion_rate || 0),
    avatar: employee.avatar ? String(employee.avatar) : undefined,
  });

  const loadEmployees = async () => {
    try {
      const data = await creatorDashboardApi.getEmployees<EmployeeApiModel[]>();
      if (data.success) {
        setEmployees((data.data || []).map(mapEmployee));
      } else {
        error("Erreur", "Impossible de charger les employés");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setLoading(false);
    }
  };

  const departments = [...new Set(employees.map((e) => e.department))];
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || employee.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" || employee.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const deleteEmployee = async (employeeId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/creator/employees?id=${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success("Employé supprimé", "L'employé a été supprimé avec succès");
        loadEmployees();
      } else {
        error("Erreur", data.message || "Impossible de supprimer l'employé");
      }
    } catch (err) {
      console.error("Delete employee error:", err);
      error("Erreur", "Une erreur technique est survenue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                Gestion des Employés
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez votre équipe et suivez leur progression
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Lien principal */}
              <a
                href={`/${locale}/dashboard/creator/employees/add`}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={(e) => {
                  // Fallback JavaScript si le lien ne fonctionne pas
                  e.preventDefault();
                  const targetUrl = `/${locale}/dashboard/creator/employees/add`;
                  console.log("Navigation fallback vers:", targetUrl);
                  window.location.href = targetUrl;
                }}
              >
                <Users className="w-5 h-5" />
                Ajouter un employé
              </a>

              {/* Bouton de test direct */}
              <button
                onClick={() => {
                  const targetUrl = `/${locale}/dashboard/creator/employees/add`;
                  console.log("Test direct navigation vers:", targetUrl);
                  window.location.href = targetUrl;
                }}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total employés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.length}
                </p>
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
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((e) => e.status === "active").length}
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
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.length > 0
                    ? Math.round(
                        employees.reduce(
                          (sum, e) => sum + e.completion_rate,
                          0
                        ) / employees.length
                      )
                    : 0}
                  %
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">🏢 Tous les départements</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">🎯 Tous les statuts</option>
              <option value="active">🟢 Actifs</option>
              <option value="inactive">🔴 Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des employés */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredEmployees.length} employé
              {filteredEmployees.length > 1 ? "s" : ""} trouvé
              {filteredEmployees.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun employé trouvé
              </h3>
              <p className="text-gray-600">
                {searchTerm ||
                filterDepartment !== "all" ||
                filterStatus !== "all"
                  ? "Essayez de modifier vos filtres"
                  : "Commencez par ajouter votre premier employé"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {employee.position} • {employee.department}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {employee.email}
                          </span>
                          {employee.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {employee.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {employee.completion_rate}%
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${employee.completion_rate}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {employee.progress}% progression
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/${locale}/dashboard/creator/employees/${employee.id}`
                            )
                          }
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/${locale}/dashboard/creator/employees/${employee.id}/edit`
                            )
                          }
                          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEmployee(employee.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
