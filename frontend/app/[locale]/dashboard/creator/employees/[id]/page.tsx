"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Briefcase,
  Phone,
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Edit,
  Trash2,
  Users,
  Clock,
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  phone?: string;
  status: string;
  progress: number;
  completion_rate: number;
  enrolled_courses: number;
  completed_courses: number;
  last_login?: string;
  created_at: string;
}

export default function EmployeeDetailPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const params = useParams<{ id: string; locale?: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "fr";
  const employeeId = params?.id;

  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  const withLocale = (path: string) =>
    `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);

  const loadEmployee = async () => {
    try {
      const response = await fetch("/api/creator/employees");
      const data = await response.json();

      if (response.ok && data.success) {
        const employeeData = data.data.find((emp: Employee) => emp.id === parseInt(employeeId!));
        if (employeeData) {
          setEmployee(employeeData);
        } else {
          error("Erreur", "Employé non trouvé");
          router.push(withLocale("/dashboard/creator/employees"));
        }
      } else {
        error("Erreur", "Impossible de charger l'employé");
        router.push(withLocale("/dashboard/creator/employees"));
      }
    } catch (err) {
      console.error("Load employee error:", err);
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/creator/employees?id=${employeeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success("Employé supprimé", "L'employé a été supprimé avec succès");
        setTimeout(() => {
          router.push(withLocale("/dashboard/creator/employees"));
        }, 1500);
      } else {
        error("Erreur", data.message || "Impossible de supprimer l'employé");
      }
    } catch (err) {
      console.error("Delete employee error:", err);
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Employé non trouvé
          </h2>
          <button
            onClick={() => router.push(withLocale("/dashboard/creator/employees"))}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(withLocale("/dashboard/creator/employees"))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <User className="w-8 h-8 text-green-600" />
                  {employee.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {employee.position} - {employee.department}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(withLocale(`/dashboard/creator/employees/${employee.id}/edit`))}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={deleteEmployee}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Carte profil */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email professionnel</p>
                    <p className="font-medium text-gray-900">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Département</p>
                    <p className="font-medium text-gray-900">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium text-gray-900">{employee.position}</p>
                  </div>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium text-gray-900">{employee.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de formation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{employee.enrolled_courses}</p>
                  <p className="text-sm text-blue-700">Cours inscrits</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{employee.completed_courses}</p>
                  <p className="text-sm text-green-700">Cours terminés</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">{employee.completion_rate}%</p>
                  <p className="text-sm text-purple-700">Taux de complétion</p>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression globale</span>
                  <span className="text-sm text-gray-600">{employee.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${employee.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informations système */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Statut */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut</h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${employee.status === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className={`font-medium ${employee.status === "active" ? "text-green-700" : "text-red-700"}`}>
                  {employee.status === "active" ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>

            {/* Informations système */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations système</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date de création</p>
                    <p className="font-medium text-gray-900">{formatDate(employee.created_at)}</p>
                  </div>
                </div>
                {employee.last_login && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Dernière connexion</p>
                      <p className="font-medium text-gray-900">{formatDate(employee.last_login)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">ID Employé</p>
                    <p className="font-medium text-gray-900">#{employee.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(withLocale(`/dashboard/creator/employees/${employee.id}/edit`))}
                  className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier l'employé
                </button>
                <button
                  onClick={() => window.open(`mailto:${employee.email}`, "_blank")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Envoyer un email
                </button>
                <button
                  onClick={deleteEmployee}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer l'employé
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
