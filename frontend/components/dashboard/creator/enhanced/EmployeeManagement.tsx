"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Key,
  BookOpen,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  assignedPathway?: string;
  assignedCourse?: string;
  progress: number;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastLogin?: string;
}

interface Assignment {
  type: "pathway" | "course";
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: string;
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
  });
  const [assignmentData, setAssignmentData] = useState({
    employeeId: 0,
    assignmentType: "pathway" as "pathway" | "course",
    selectedAssignment: "",
  });

  const availablePathways: Assignment[] = [
    {
      type: "pathway",
      title: "Formation Management Hôtelier",
      description: "Parcours complet en gestion hôtelière",
      estimatedHours: 120,
      difficulty: "intermediate",
    },
    {
      type: "pathway",
      title: "Parcours Chef de Cuisine",
      description: "Maîtrise de la cuisine française",
      estimatedHours: 180,
      difficulty: "advanced",
    },
    {
      type: "pathway",
      title: "Marketing Digital Touristique",
      description: "Stratégies marketing touristique",
      estimatedHours: 60,
      difficulty: "beginner",
    },
  ];

  const availableCourses: Assignment[] = [
    {
      type: "course",
      title: "Introduction au Management",
      description: "Bases du management hôtelier",
      estimatedHours: 20,
      difficulty: "beginner",
    },
    {
      type: "course",
      title: "Communication Hôtelière",
      description: "Techniques de communication",
      estimatedHours: 25,
      difficulty: "intermediate",
    },
    {
      type: "course",
      title: "Leadership Équipe",
      description: "Gestion d'équipe efficace",
      estimatedHours: 30,
      difficulty: "advanced",
    },
  ];

  useEffect(() => {
    // Données mockées
    const mockEmployees: Employee[] = [
      {
        id: 1,
        name: "Alexandre Martin",
        email: "alexandre.martin@company.com",
        role: "employee",
        assignedPathway: "Formation Management Hôtelier",
        progress: 78,
        status: "active",
        joinDate: "2024-01-15",
        lastLogin: "2024-03-16 09:30",
      },
      {
        id: 2,
        name: "Marie Dubois",
        email: "marie.dubois@company.com",
        role: "employee",
        assignedCourse: "Introduction au Management",
        progress: 45,
        status: "active",
        joinDate: "2024-02-01",
        lastLogin: "2024-03-15 14:20",
      },
      {
        id: 3,
        name: "Thomas Bernard",
        email: "thomas.bernard@company.com",
        role: "manager",
        assignedPathway: "Parcours Chef de Cuisine",
        progress: 92,
        status: "active",
        joinDate: "2024-01-20",
        lastLogin: "2024-03-16 11:45",
      },
      {
        id: 4,
        name: "Sophie Laurent",
        email: "sophie.laurent@company.com",
        role: "employee",
        assignedCourse: "Communication Hôtelière",
        progress: 23,
        status: "active",
        joinDate: "2024-03-01",
        lastLogin: "2024-03-14 16:10",
      },
      {
        id: 5,
        name: "Pierre Petit",
        email: "pierre.petit@company.com",
        role: "employee",
        assignedPathway: "Marketing Digital Touristique",
        progress: 67,
        status: "suspended",
        joinDate: "2024-02-15",
        lastLogin: "2024-03-10 08:30",
      },
    ];

    setTimeout(() => {
      setEmployees(mockEmployees);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateEmployee = () => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      progress: 0,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
    };

    setEmployees([...employees, newEmployee]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleAssignContent = () => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map((emp) => {
      if (emp.id === selectedEmployee.id) {
        if (assignmentData.assignmentType === "pathway") {
          return {
            ...emp,
            assignedPathway: assignmentData.selectedAssignment,
            progress: 0,
          };
        } else {
          return {
            ...emp,
            assignedCourse: assignmentData.selectedAssignment,
            progress: 0,
          };
        }
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowAssignModal(false);
    resetAssignmentForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "employee",
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentData({
      employeeId: 0,
      assignmentType: "pathway",
      selectedAssignment: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Actif
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Suspendu
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <X className="w-3 h-3" />
            Inactif
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      employee: "bg-blue-100 text-blue-700",
      manager: "bg-purple-100 text-purple-700",
      admin: "bg-red-100 text-red-700",
    };
    const labels = {
      employee: "Employé",
      manager: "Manager",
      admin: "Admin",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}
      >
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const generateCredentials = (employee: Employee) => {
    const password = Math.random().toString(36).slice(-8);
    return {
      email: employee.email,
      password: password,
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Employés
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des Employés
          </h1>
          <p className="text-gray-600">
            Créez des comptes employés et assignez leurs parcours de formation
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Ajouter un employé
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +12%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {employees.length}
          </h3>
          <p className="text-sm text-gray-600">Total Employés</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {employees.filter((emp) => emp.assignedPathway).length}
          </h3>
          <p className="text-sm text-gray-600">Parcours Assignés</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round(
              employees.reduce((acc, emp) => acc + emp.progress, 0) /
                employees.length
            ) || 0}
            %
          </h3>
          <p className="text-sm text-gray-600">Progression Moyenne</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {employees.filter((emp) => emp.status === "active").length}
          </h3>
          <p className="text-sm text-gray-600">Actifs</p>
        </motion.div>
      </div>

      {/* Employees Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        {employee.lastLogin && (
                          <div className="text-xs text-gray-500">
                            Dernière connexion: {employee.lastLogin}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(employee.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.assignedPathway ||
                        employee.assignedCourse ||
                        "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${employee.progress}%` }}
                          transition={{
                            delay: index * 0.05 + 0.5,
                            duration: 0.8,
                          }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {employee.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowAssignModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Ajouter un employé
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Entrez le nom..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="employe@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="employee">Employé</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateEmployee}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Ajouter l'employé
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedEmployee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAssignModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Assigner un contenu à {selectedEmployee.name}
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Assignment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Type d'assignation
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setAssignmentData({
                        ...assignmentData,
                        assignmentType: "pathway",
                      })
                    }
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                      assignmentData.assignmentType === "pathway"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Parcours d'apprentissage
                  </button>
                  <button
                    onClick={() =>
                      setAssignmentData({
                        ...assignmentData,
                        assignmentType: "course",
                      })
                    }
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                      assignmentData.assignmentType === "course"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Cours individuel
                  </button>
                </div>
              </div>

              {/* Content Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Sélectionnez le contenu à assigner
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(assignmentData.assignmentType === "pathway"
                    ? availablePathways
                    : availableCourses
                  ).map((assignment) => (
                    <label
                      key={assignment.title}
                      className="border border-gray-200 rounded-xl p-4 hover:border-primary cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="assignment"
                        value={assignment.title}
                        checked={
                          assignmentData.selectedAssignment === assignment.title
                        }
                        onChange={(e) =>
                          setAssignmentData({
                            ...assignmentData,
                            selectedAssignment: e.target.value,
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {assignment.description}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Durée: {assignment.estimatedHours}h</span>
                          <span>Difficulté: {assignment.difficulty}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignContent}
                disabled={!assignmentData.selectedAssignment}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Assigner le contenu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
