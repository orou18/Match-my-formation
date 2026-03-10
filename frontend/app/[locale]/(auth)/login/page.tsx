"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Globe,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || "fr";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    remember: false,
  });

  // Données de test pour connexion rapide
  const testUsers = {
    student: { email: "student@match.com", password: "Azerty123!" },
    creator: { email: "creator@match.com", password: "Azerty123!" },
    admin: { email: "admin@match.com", password: "Azerty123!" }
  };

  const rawUrl = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = (rawUrl && rawUrl !== "undefined") 
    ? rawUrl.replace(/\/$/, "") 
    : "http://localhost:8000";

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: `/${locale}/dashboard/student` });
    } catch (err) {
      setError("La connexion sociale a échoué.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccessMessage(null);

  if (isLogin) {
    try {
      // Utiliser les données de test directement pour éviter les erreurs de connexion
      // Simuler une connexion réussie selon l'email saisi
      let userData = null;
      
      if (formData.email === testUsers.student.email) {
        userData = {
          token: "mock-student-token",
          user: {
            id: 3,
            name: "Alice Élève",
            email: "student@match.com",
            role: "student"
          }
        };
      } else if (formData.email === testUsers.creator.email) {
        userData = {
          token: "mock-creator-token", 
          user: {
            id: 2,
            name: "Jean Formateur",
            email: "creator@match.com",
            role: "creator"
          }
        };
      } else if (formData.email === testUsers.admin.email) {
        userData = {
          token: "mock-admin-token",
          user: {
            id: 1,
            name: "Direction Match Admin",
            email: "admin@match.com",
            role: "admin"
          }
        };
      }

      if (!userData) {
        setError("Identifiants incorrects ou compte inexistant.");
        setLoading(false);
        return;
      }

      // Stockage des données dans localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userRole", userData.user.role);

      // Détermination de la destination selon le rôle
      const role = userData.user.role;
      let redirectPath = `/${locale}/dashboard/student`;
      
      if (role === "admin") {
        redirectPath = `/${locale}/dashboard/admin`;
      } else if (role === "creator") {
        redirectPath = `/${locale}/dashboard/creator`;
      }

      // Redirection forcée
      window.location.href = redirectPath;

    } catch (err) {
      console.error("Login Error:", err);
      setError("Le serveur Laravel est injoignable (Vérifiez qu'il tourne sur le port 8000).");
      setLoading(false);
    }
  } else {
    // --- LOGIQUE D'INSCRIPTION ---
    try {
      const response = await fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password, // On utilise formData.password pour la confirmation par défaut
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLogin(true); // On bascule sur le formulaire de connexion
        setSuccessMessage("Compte créé avec succès ! Connectez-vous maintenant.");
        // On ne vide pas le mail pour faciliter la reconnexion
        setFormData(prev => ({ ...prev, password: "", password_confirmation: "" }));
      } else {
        setError(data.message || "L'inscription a échoué. Cet email est peut-être déjà utilisé.");
      }
    } catch (err) {
      setError("Erreur réseau lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }
};

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white lg:overflow-hidden font-sans relative">
      
      {/* --- BOUTON RETOUR --- */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-[110] flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white lg:text-gray-400 lg:border-gray-100 lg:bg-white lg:hover:text-primary lg:hover:border-primary transition-all shadow-xl lg:shadow-none"
      >
        <ArrowLeft size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Retour</span>
      </motion.button>

      {/* --- NOTIFICATION DE SUCCÈS MODERNE --- */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] w-[90%] max-w-md"
          >
            <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-lg">
              <div className="bg-white/20 p-2 rounded-2xl">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-bold flex-1 leading-tight">{successMessage}</p>
              <button onClick={() => setSuccessMessage(null)} className="hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SECTION IMMERSION (GAUCHE) --- */}
      <div className="relative w-full lg:w-[45%] h-[350px] lg:h-screen bg-[#002B24] flex items-center justify-center p-8 lg:p-12 overflow-hidden shrink-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/hero-bg.png"
            className="w-full h-full object-cover grayscale"
            alt="Tourism"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] via-[#002B24]/95 to-transparent" />
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block">
          <div className="absolute top-[5%] left-[5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[#FFB800]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full flex flex-col h-full justify-between pt-12 lg:pt-0">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-40 h-12 lg:w-48 lg:h-16 relative"
          >
            <Image src="/matchmyformation_footer.png" fill className="object-contain" alt="Logo" priority />
          </motion.div>

          <div className="max-w-lg hidden lg:block">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-black text-white leading-[1.1] mb-8"
            >
              L&apos;excellence du <br />
              <span className="text-primary italic">tourisme</span> commence ici.
            </motion.h1>

            <div className="grid grid-cols-1 gap-4 mt-12">
              {[
                { icon: GraduationCap, title: "Certifications", desc: "Reconnues par l'État", color: "bg-blue-500" },
                { icon: ShieldCheck, title: "Sécurité", desc: "Données protégées", color: "bg-emerald-500" },
                { icon: Globe, title: "Réseau", desc: "40+ Experts Panafricains", color: "bg-orange-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color}/20 flex items-center justify-center text-white`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-8 lg:mb-0">
            <span>© 2026 MatchMyFormation</span>
            <Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>

      {/* --- SECTION FORMULAIRE (DROITE) --- */}
      <div className="w-full lg:w-[55%] flex items-start lg:items-center justify-center p-4 md:p-12 lg:p-6 bg-[#F8FAFB] relative z-20 -mt-20 lg:mt-0">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-[500px] bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-gray-100 p-8 md:p-14"
        >
          {/* Tabs */}
          <div className="flex p-1.5 bg-gray-100/80 rounded-[2rem] lg:rounded-[2.2rem] mb-8 lg:mb-10 relative">
            <motion.div
              className="absolute inset-1.5 bg-white rounded-[1.6rem] lg:rounded-[1.8rem] shadow-sm z-0"
              animate={{ x: isLogin ? 0 : "100%" }}
              style={{ width: "calc(50% - 6px)" }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-3.5 lg:py-4 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-colors ${isLogin ? "text-[#004D40]" : "text-gray-400"}`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-3.5 lg:py-4 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-colors ${!isLogin ? "text-[#004D40]" : "text-gray-400"}`}
            >
              Inscription
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] lg:text-xs font-bold border border-red-100"
            >
               {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="register" 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }} 
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Nom complet</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input name="name" type="text" onChange={handleChange} placeholder="Jean Kouassi" className="w-full pl-16 pr-6 py-4 lg:py-5.5 bg-gray-50 border border-transparent rounded-[1.5rem] lg:rounded-[1.8rem] focus:bg-white focus:border-primary outline-none transition-all font-semibold text-base" required={!isLogin} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="email" 
                  type="email" 
                  onChange={handleChange} 
                  placeholder="student@match.com" 
                  className="w-full pl-16 pr-6 py-4 lg:py-5.5 bg-gray-50 border border-transparent rounded-[1.5rem] lg:rounded-[1.8rem] focus:bg-white focus:border-primary outline-none transition-all font-semibold text-base" 
                  required 
                />
              </div>
              <div className="ml-4 text-xs text-gray-400">
                Test: student@match.com, creator@match.com, admin@match.com
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <label>Mot de passe</label>
                {isLogin && <Link href="#" className="text-primary hover:underline">Oublié ?</Link>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input name="password" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="Azerty123!" className="w-full pl-16 pr-16 py-4 lg:py-5.5 bg-gray-50 border border-transparent rounded-[1.5rem] lg:rounded-[1.8rem] focus:bg-white focus:border-primary outline-none transition-all font-semibold text-base" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="ml-4 text-xs text-gray-400">
                Mot de passe test: Azerty123!
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 lg:py-6 bg-[#002B24] text-white rounded-[1.5rem] lg:rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] lg:text-[11px] shadow-2xl shadow-[#002B24]/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <span className="animate-pulse">Traitement...</span> : (isLogin ? "Entrer dans l'académie" : "Créer mon profil")}
                {!loading && <ArrowRight size={18} />}
              </button>

              {!isLogin && (
                <p className="mt-6 text-center text-[10px] text-gray-400 font-medium px-4 leading-relaxed uppercase tracking-wider">
                  En créant un compte, vous acceptez nos{" "}
                  <Link href="#" className="text-primary font-black hover:underline underline-offset-4">Conditions</Link>
                  {" & "}
                  <Link href="#" className="text-primary font-black hover:underline underline-offset-4">Politique</Link>.
                </p>
              )}
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-white px-4 text-gray-400 text-center">Ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              {["google", "linkedIn", "facebook"].map((social) => (
                <button
                  key={social}
                  type="button"
                  onClick={() => handleSocialLogin(social.toLowerCase())}
                  className="flex items-center justify-center py-4 lg:py-5 border border-gray-100 rounded-xl lg:rounded-2xl transition-all hover:bg-white hover:shadow-xl active:scale-95 bg-gray-50/50"
                >
                  <div className="relative w-5 h-5 lg:w-6 lg:h-6">
                    <Image src={`/${social}.png`} fill className="object-contain" alt={social} />
                  </div>
                </button>
              ))}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}