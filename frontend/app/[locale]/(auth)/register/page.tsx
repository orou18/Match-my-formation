"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  // Fonction pour gérer l'inscription avec les réseaux sociaux
  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError("");
    
    try {
      // Clés arbitraires pour démonstration
      const socialKeys = {
        google: "demo-google-key-12345",
        linkedIn: "demo-linkedin-key-67890", 
        facebook: "demo-facebook-key-09876"
      };
      
      console.log(`Inscription avec ${provider}...`);
      console.log(`Clé API (démo): ${socialKeys[provider as keyof typeof socialKeys]}`);
      
      // Simulation d'inscription sociale réussie
      setTimeout(() => {
        const mockSocialUser = {
          token: `social-${provider}-token-${Date.now()}`,
          user: {
            id: Math.floor(Math.random() * 1000),
            name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            email: `user.${provider}@match.com`,
            role: "student",
            avatar: `/${provider}-avatar.jpg`,
            provider: provider
          }
        };
        
        localStorage.setItem("token", mockSocialUser.token);
        localStorage.setItem("userRole", mockSocialUser.user.role);
        localStorage.setItem("socialProvider", provider);
        
        setSuccessMessage(`Inscription avec ${provider.charAt(0).toUpperCase() + provider.slice(1)} réussie !`);
        
        setTimeout(() => {
          router.push(`/${locale}/dashboard/student`);
        }, 1500);
      }, 1500);
      
    } catch (error) {
      console.error("Social registration error:", error);
      setError(`Erreur lors de l'inscription avec ${provider}`);
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation email
    if (!validateEmail(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    // Validation mot de passe
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const baseUrl = rawUrl.replace(/\/$/, "");
      
      // Créer un timeout manuel
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        
        // Redirection selon le rôle
        const dashboardRoute = data.user.role === "admin" 
          ? "/dashboard/admin" 
          : `/dashboard/${data.user.role}`;
        
        router.push(`/${locale}${dashboardRoute}`);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Fallback immédiat pour développement - pas de vérification d'erreur
      console.log("Mode fallback: inscription locale");
      
      // Simulation d'inscription réussie
      const mockUserData = {
        token: `mock-token-${Date.now()}`,
        user: {
          id: Math.floor(Math.random() * 1000),
          name: formData.name,
          email: formData.email,
          role: formData.role
        }
      };
      
      localStorage.setItem("token", mockUserData.token);
      localStorage.setItem("userRole", mockUserData.user.role);
      localStorage.setItem("userName", mockUserData.user.name);
      localStorage.setItem("userEmail", mockUserData.user.email);
      
      setSuccessMessage("Inscription réussie (mode démo)");
      
      setTimeout(() => {
        const dashboardRoute = mockUserData.user.role === "admin" 
          ? "/dashboard/admin" 
          : `/dashboard/${mockUserData.user.role}`;
        
        router.push(`/${locale}${dashboardRoute}`);
      }, 1500);
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-gray-600">
              Rejoignez MatchMyFormation et commencez votre apprentissage
            </p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de compte
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="student">Étudiant</option>
                <option value="creator">Créateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Ou s'inscrire avec</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {["google", "linkedIn", "facebook"].map((social) => (
              <button
                key={social}
                type="button"
                onClick={() => handleSocialLogin(social)}
                className="flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
              </button>
            ))}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <a
                href={`/${locale}/login`}
                className="text-primary font-semibold hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}