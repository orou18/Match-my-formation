"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";
import {
  Users,
  Play,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  LogOut,
  User,
  Building,
  Calendar,
  CheckCircle,
  Eye,
  Target,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";
import type { Employee } from "@/types/employee";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video_url?: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  visibility: string;
  status: string;
  progress?: number;
  completed?: boolean;
  creator: {
    name: string;
    domain: string;
  };
}

interface EmployeeStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_watch_time: number;
  certificates_earned: number;
}

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "fr";
  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  useEffect(() => {
    loadEmployeeData();
    loadCourses();
  }, []);

  useEffect(() => {
    loadStats(courses);
  }, [courses]);

  const withLocale = (path: string) =>
    `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

  const loadEmployeeData = async () => {
    try {
      const token = localStorage.getItem("employee_token");
      if (!token) {
        router.push(withLocale("/auth/employee"));
        return;
      }

      const response = await fetch("/api/employee/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setEmployee(data.data);
      } else {
        error("Erreur", "Impossible de charger vos informations");
        router.push(withLocale("/auth/employee"));
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
      router.push(withLocale("/auth/employee"));
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("employee_token");
      if (!token) return;

      const response = await fetch("/api/employee/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      error("Erreur", "Impossible de charger les cours");
    }
  };

  const parseDurationToMinutes = (duration: string) => {
    const parts = duration
      .split(":")
      .map((value) => Number.parseInt(value, 10) || 0);
    if (parts.length === 2) {
      return (parts[0] * 60 + parts[1]) / 60;
    }
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 60;
    }
    return 0;
  };

  const loadStats = (courseList: Course[]) => {
    const completedCourses = courseList.filter(
      (course) =>
        course.completed === true ||
        (typeof course.progress === "number" && course.progress >= 100)
    ).length;

    const inProgressCourses = courseList.filter(
      (course) =>
        course.completed !== true &&
        (typeof course.progress !== "number" || course.progress < 100)
    ).length;

    const totalWatchTime = Math.round(
      courseList.reduce(
        (sum, course) => sum + parseDurationToMinutes(course.duration),
        0
      )
    );

    setStats({
      total_courses: courseList.length,
      completed_courses: completedCourses,
      in_progress_courses: inProgressCourses,
      total_watch_time: totalWatchTime,
      certificates_earned: completedCourses,
    });
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("employee_token");
      if (token) {
        await fetch("/api/employee/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem("employee_token");
      localStorage.removeItem("employee_remember");

      success("Déconnexion", "Vous avez été déconnecté avec succès");
      router.push(withLocale("/auth/employee"));
    } catch (err) {
      error("Erreur", "Une erreur est survenue lors de la déconnexion");
    }
  };

  const watchCourse = (course: Course) => {
    // Rediriger vers la page de visionnage
    router.push(withLocale(`/video/${course.id}/watch`));
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Espace Employé
                </h1>
                <p className="text-sm text-gray-600">{employee.domain}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                {employee.name}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Bienvenue, {employee.name} !
              </h2>
              <p className="text-blue-100">
                Continuez votre progression dans le domaine {employee.domain}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100 mb-1">Dernière connexion</p>
              <p className="text-lg font-medium">
                {employee.last_login_at
                  ? new Date(employee.last_login_at).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "Première connexion"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total des cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total_courses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cours terminés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed_courses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps de visionnage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(stats.total_watch_time / 60)}h{" "}
                    {stats.total_watch_time % 60}m
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Certificats</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.certificates_earned}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Mes formations
          </h3>
          <p className="text-gray-600">
            {filteredCourses.length} formation
            {filteredCourses.length > 1 ? "s" : ""} disponible
            {filteredCourses.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune formation trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Essayez de modifier votre recherche"
                : "Votre formateur n'a pas encore ajouté de formations"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => watchCourse(course)}
              >
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {course.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {course.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {course.publishedAt}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {course.creator.domain}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mon profil</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                    <p className="text-sm text-blue-600">{employee.domain}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      ID de connexion
                    </span>
                    <span className="text-sm font-mono text-gray-900">
                      {employee.login_id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Statut</span>
                    <span
                      className={`text-sm font-medium ${employee.is_active ? "text-green-600" : "text-red-600"}`}
                    >
                      {employee.is_active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Date d'ajout</span>
                    <span className="text-sm text-gray-900">
                      {new Date(employee.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
