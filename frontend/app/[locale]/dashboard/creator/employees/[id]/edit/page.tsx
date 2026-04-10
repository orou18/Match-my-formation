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
  Save,
  User,
  Mail,
  Building,
  Briefcase,
  Phone,
  CheckCircle,
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
  created_at: string;
}

export default function EditEmployeePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [employee, setEmployee] = useState<Employee | null>(null);

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
          setFormData({
            name: employeeData.name,
            email: employeeData.email,
            department: employeeData.department,
            position: employeeData.position,
            phone: employeeData.phone || "",
          });
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Le département est obligatoire";
    }

    if (!formData.position.trim()) {
      newErrors.position = "La position est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error("Erreur de validation", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/creator/employees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: employeeId,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          position: formData.position,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success("Employé modifié", "Les informations de l'employé ont été mises à jour avec succès");
        setTimeout(() => {
          router.push(withLocale("/dashboard/creator/employees"));
        }, 1500);
      } else {
        error("Erreur", data.message || "Impossible de modifier l'employé");
      }
    } catch (err) {
      console.error("Update employee error:", err);
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
                  Modifier l'employé
                </h1>
                <p className="text-gray-600 mt-1">
                  {employee?.name} - {employee?.department}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Informations de l'employé</h2>
            <p className="text-gray-600 text-sm mt-1">Modifiez les informations ci-dessous</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Entrez le nom complet"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email professionnel *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="exemple@entreprise.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none ${
                    errors.department ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionnez un département</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventes">Ventes</option>
                  <option value="Technologie">Technologie</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="Finance">Finance</option>
                  <option value="Opérations">Opérations</option>
                </select>
              </div>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.position ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Ex: Chef de projet, Développeur, etc."
                />
              </div>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone (optionnel)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+225 00 00 00 00"
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-4 pt-6">
              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: isSaving ? 1 : 1.02 }}
                whileTap={{ scale: isSaving ? 1 : 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.push(withLocale("/dashboard/creator/employees"))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
