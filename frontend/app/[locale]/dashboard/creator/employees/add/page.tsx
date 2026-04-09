"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  Users,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Save,
  ArrowLeft,
  User,
  Shield,
  Key,
} from "lucide-react";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";
import { creatorDashboardApi } from "@/lib/services/creator-dashboard-api";

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: "employee" | "manager";
  password: string;
  confirmPassword: string;
  hire_date: string;
  status: "active" | "inactive";
}

type EmployeeCreationResponse = {
  id: number;
  name: string;
  email: string;
  domain: string;
  created_at: string;
  is_active: boolean;
  login_id?: string;
};

type EmployeeCredentials = {
  email?: string;
  login_id: string;
  password: string;
};

type CreateEmployeeApiResponse = {
  login_credentials?: EmployeeCredentials;
};

export default function AddEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "employee",
    password: "",
    confirmPassword: "",
    hire_date: new Date().toISOString().split("T")[0],
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  const departments = [
    "Production",
    "Marketing",
    "Ventes",
    "Support Client",
    "Ressources Humaines",
    "Finance",
    "Technologie",
    "Opérations",
  ];

  const positions = [
    "Agent",
    "Superviseur",
    "Manager",
    "Spécialiste",
    "Coordinateur",
    "Analyste",
    "Technicien",
    "Consultant",
  ];

  const validateForm = () => {
    const newErrors: Partial<EmployeeFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (formData.phone.trim() && !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone n'est pas valide";
    }

    if (!formData.department) {
      newErrors.department = "Le département est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Soumission du formulaire:", formData);

    if (!validateForm()) {
      error(
        "Erreur de validation",
        "Veuillez corriger les erreurs dans le formulaire"
      );
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Envoi à l'API...");

      const data = await creatorDashboardApi.createEmployee<
        EmployeeCreationResponse
      >({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        domain: formData.department,
      });
      console.log("📋 Données API:", data);

      if (data.success) {
        const credentials = (data as CreateEmployeeApiResponse)
          .login_credentials;
        const successMessage = credentials
          ? `Email: ${credentials.email || formData.email} | Mot de passe: ${credentials.password}`
          : "L'employé a été ajouté avec succès";

        success("Employé ajouté", successMessage);

        setTimeout(() => {
          router.push(`/${locale}/dashboard/creator/employees`);
        }, 1500);
      } else {
        error("Erreur", data.message || "Impossible d'ajouter l'employé");
      }
    } catch (err) {
      console.error("❌ Erreur complète:", err);
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur quand l'utilisateur corrige le champ
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  router.push(`/${locale}/dashboard/creator/employees`)
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-600" />
                  Ajouter un Employé
                </h1>
                <p className="text-gray-600 mt-2">
                  Créez un nouveau compte pour votre équipe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Informations Personnelles */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Informations Personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom Complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Jean Dupont"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Professionnel <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="jean.dupont@entreprise.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d&apos;embauche <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Poste et Département */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Poste et Département
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
                        errors.department ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Sélectionner un département</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
                        errors.position ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Sélectionner un poste</option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.position}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Compte d'Accès */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Compte d&apos;Accès
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option value="employee">Employé</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Min. 8 caractères"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirmer le mot de passe"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  router.push(`/${locale}/dashboard/creator/employees`)
                }
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Annuler
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Ajout en cours..." : "Ajouter l'employé"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
