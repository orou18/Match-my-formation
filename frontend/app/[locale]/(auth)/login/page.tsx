"use client";

import { useState } from "react";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: `/${locale}/dashboard` });
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      {/* --- SECTION GAUCHE : L'IMMERSION --- */}
      <div className="relative hidden lg:flex lg:w-[45%] bg-[#002B24] items-center justify-center p-12 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
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

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-40 h-40 bg-accent/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 w-full flex flex-col h-full justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-48 h-16 relative"
          >
            <Image
              src="/matchmyformation_footer.png"
              fill
              className="object-contain"
              alt="Logo"
              priority
            />
          </motion.div>

          <div className="max-w-md">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black text-white leading-tight mb-8"
            >
              L&apos;excellence du{" "}
              <span className="text-primary">tourisme</span> commence ici.
            </motion.h1>

            <div className="space-y-6">
              {[
                {
                  icon: GraduationCap,
                  text: "Accès à des certifications mondiales",
                },
                {
                  icon: ShieldCheck,
                  text: "Environnement d'apprentissage sécurisé",
                },
                { icon: Globe, text: "Réseau d'experts panafricains" },
              ].map((item, i) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={i}
                  className="flex items-center gap-4 text-white/70 group hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            <Link
              href={`/${locale}/terms`}
              className="hover:text-primary transition-colors"
            >
              Conditions d&apos;utilisation
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-primary transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>

      {/* --- SECTION DROITE : LE FORMULAIRE --- */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 bg-[#F8FAFB]">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-[480px] bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 p-10 md:p-14"
        >
          <div className="flex p-1.5 bg-gray-100/80 rounded-[2rem] mb-12 relative">
            <motion.div
              className="absolute inset-1.5 bg-white rounded-[1.5rem] shadow-sm z-0"
              animate={{ x: isLogin ? 0 : "100%" }}
              style={{ width: "calc(50% - 6px)" }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-3.5 text-xs font-black uppercase tracking-widest transition-colors ${isLogin ? "text-secondary" : "text-gray-400"}`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-3.5 text-xs font-black uppercase tracking-widest transition-colors ${!isLogin ? "text-secondary" : "text-gray-400"}`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-secondary/40 uppercase ml-2 tracking-widest">
                    Nom complet
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      name="name"
                      type="text"
                      onChange={handleChange}
                      placeholder="Ex: Jean Kouassi"
                      className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:border-primary outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary/40 uppercase ml-2 tracking-widest">
                Adresse Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">
                  Mot de passe
                </label>
                {isLogin && (
                  <Link
                    href="#"
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Oublié ?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:border-primary outline-none transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-secondary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="remember"
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-secondary/60 group-hover:text-secondary">
                    Se souvenir de moi
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-secondary text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-secondary/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading
                ? "Vérification..."
                : isLogin
                  ? "Entrer dans l'académie"
                  : "Créer mon profil"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-white px-4 text-gray-400">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* --- BOUTONS SOCIAUX : COULEURS DIRECTES --- */}
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center py-4 border border-gray-100 rounded-2xl transition-all hover:bg-white hover:shadow-md hover:border-gray-200 group active:scale-95"
              >
                <div className="relative w-6 h-6">
                  <Image
                    src="/google.png"
                    fill
                    className="object-contain"
                    alt="Google"
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("linkedin")}
                className="flex items-center justify-center py-4 border border-gray-100 rounded-2xl transition-all hover:bg-white hover:shadow-md hover:border-gray-200 group active:scale-95"
              >
                <div className="relative w-6 h-6">
                  <Image
                    src="/linkedIn.png"
                    fill
                    className="object-contain"
                    alt="LinkedIn"
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center py-4 border border-gray-100 rounded-2xl transition-all hover:bg-white hover:shadow-md hover:border-gray-200 group active:scale-95"
              >
                <div className="relative w-6 h-6">
                  <Image
                    src="/facebook.png"
                    fill
                    className="object-contain"
                    alt="Facebook"
                  />
                </div>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
