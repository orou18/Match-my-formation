"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, User, LogIn, AlertCircle } from "lucide-react";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Stocker le token et les infos de l'employé
        localStorage.setItem("employee_token", result.data.token);
        localStorage.setItem("employee_info", JSON.stringify(result.data.employee));
        
        // Rediriger vers le dashboard employé
        router.push(`/${locale}/dashboard/employee/student`);
      } else {
        setError(result.message || "Erreur de connexion");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion Employé
            </h1>
            <p className="text-gray-600">
              Accédez à votre espace de formation
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-2">
              Identifiants de démonstration :
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Email:</strong> employee@test.com</p>
              <p><strong>Mot de passe:</strong> password123</p>
            </div>
          </div>

          {/* Back to regular login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous êtes un utilisateur normal ?{" "}
              <button
                onClick={() => router.push(`/${locale}/login`)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Connexion utilisateur
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
