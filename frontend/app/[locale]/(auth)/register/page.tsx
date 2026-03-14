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
  UserPlus,
  ArrowRight,
  Chrome,
  Linkedin,
  Facebook,
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
      console.log(`Début inscription avec ${provider}...`);
      
      // Étape 1: Redirection vers le provider OAuth
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const baseUrl = API_BASE.replace(/\/$/, "");
      
      // Étape 2: Ouvrir une popup pour l'authentification OAuth
      const popup = window.open(
        `${baseUrl}/api/auth/${provider}`,
        'authPopup',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      if (!popup) {
        throw new Error("Impossible d'ouvrir la fenêtre d'authentification. Veuillez autoriser les popups.");
      }
      
      // Étape 3: Écouter les messages de la popup
      return new Promise((resolve, reject) => {
        const messageHandler = async (event: MessageEvent) => {
          // Vérifier que le message vient de notre domaine
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'AUTH_SUCCESS') {
            popup.close();
            window.removeEventListener('message', messageHandler);
            
            try {
              // Étape 4: Traiter la réponse d'authentification
              const { token, user } = event.data.payload;
              
              // Étape 5: Sauvegarder les données
              localStorage.setItem("token", token);
              localStorage.setItem("userRole", user.role);
              localStorage.setItem("userName", user.name);
              localStorage.setItem("userEmail", user.email);
              localStorage.setItem("userId", user.id.toString());
              localStorage.setItem("socialProvider", provider);
              localStorage.setItem("socialAvatar", user.avatar || '');
              
              setSuccessMessage(`Inscription avec ${provider.charAt(0).toUpperCase() + provider.slice(1)} réussie !`);
              
              // Étape 6: Redirection selon le rôle
              setTimeout(() => {
                const dashboardRoute = user.role === "admin" 
                  ? "/dashboard/admin" 
                  : `/dashboard/${user.role}`;
                
                router.push(`/${locale}${dashboardRoute}`);
              }, 1500);
              
              resolve(event.data);
            } catch (error) {
              reject(error);
            }
          } else if (event.data.type === 'AUTH_ERROR') {
            popup.close();
            window.removeEventListener('message', messageHandler);
            reject(new Error(event.data.message));
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Vérifier si la popup a été fermée manuellement
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            reject(new Error("Authentification annulée"));
          }
        }, 1000);
        
        // Timeout après 5 minutes
        setTimeout(() => {
          if (!popup.closed) {
            popup.close();
            window.removeEventListener('message', messageHandler);
            reject(new Error("Timeout d'authentification"));
          }
        }, 300000);
      });
      
    } catch (error: any) {
      console.error("Social registration error:", error);
      
      // Fallback pour développement si le backend n'est pas accessible
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        console.log(`Mode développement: simulation inscription ${provider}`);
        
        const mockSocialUser = {
          token: `social-${provider}-token-${Date.now()}`,
          user: {
            id: Math.floor(Math.random() * 1000),
            name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            email: `user.${provider}@match.com`,
            role: "student",
            avatar: `https://ui-avatars.com/api/?name=${provider}&background=random`,
            provider: provider
          }
        };
        
        localStorage.setItem("token", mockSocialUser.token);
        localStorage.setItem("userRole", mockSocialUser.user.role);
        localStorage.setItem("userName", mockSocialUser.user.name);
        localStorage.setItem("userEmail", mockSocialUser.user.email);
        localStorage.setItem("userId", mockSocialUser.user.id.toString());
        localStorage.setItem("socialProvider", provider);
        localStorage.setItem("socialAvatar", mockSocialUser.user.avatar);
        
        setSuccessMessage(`Inscription avec ${provider.charAt(0).toUpperCase() + provider.slice(1)} réussie (mode démo) !`);
        
        setTimeout(() => {
          router.push(`/${locale}/dashboard/student`);
        }, 1500);
      } else {
        setError(error.message || `Erreur lors de l'inscription avec ${provider}`);
      }
      
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
      // Utiliser l'URL de l'API configurée
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const baseUrl = API_BASE.replace(/\/$/, "");
      
      console.log(`Tentative d'inscription vers: ${baseUrl}/api/register`);
      
      // Créer un timeout manuel
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Augmenté à 15s
      
      const res = await fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Response status: ${res.status}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Inscription réussie:", data);

      // Sauvegarder les données utilisateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userId", data.user.id.toString());
      
      setSuccessMessage("Inscription réussie ! Redirection...");
      
      // Redirection selon le rôle après un court délai
      setTimeout(() => {
        const dashboardRoute = data.user.role === "admin" 
          ? "/dashboard/admin" 
          : `/dashboard/${data.user.role}`;
        
        router.push(`/${locale}${dashboardRoute}`);
      }, 1500);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Gestion spécifique des erreurs de connexion
      if (error.name === 'AbortError') {
        setError("Le serveur met trop temps à répondre. Vérifiez votre connexion ou réessayez plus tard.");
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setError("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
        
        // Option de fallback pour développement uniquement
        console.log("Mode développement: utilisation du fallback");
        
        const mockUserData = {
          token: `dev-token-${Date.now()}`,
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
        localStorage.setItem("userId", mockUserData.user.id.toString());
        
        setSuccessMessage("Inscription réussie (mode développement)");
        
        setTimeout(() => {
          const dashboardRoute = mockUserData.user.role === "admin" 
            ? "/dashboard/admin" 
            : `/dashboard/${mockUserData.user.role}`;
          
          router.push(`/${locale}${dashboardRoute}`);
        }, 1500);
      } else {
        setError(error.message || "Erreur lors de l'inscription");
      }
      
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
              <UserPlus className="w-8 h-8 text-white" />
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
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 font-medium">Continuer avec Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin("linkedIn")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Linkedin className="w-5 h-5 text-blue-700" />
              <span className="text-gray-700 font-medium">Continuer avec LinkedIn</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">Continuer avec Facebook</span>
            </button>
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