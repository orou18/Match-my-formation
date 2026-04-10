"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu, X, Bell, User, Map, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import UserIdManager from "@/lib/user-id-manager";
import ThemeLanguageSwitcher from "./ThemeLanguageSwitcher";

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale || "fr";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Gérer le body overflow seulement si pas déjà géré par un autre composant
    if (isOpen) {
      const currentOverflow = document.body.style.overflow;
      if (currentOverflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
        // Stocker l'état précédent pour le restaurer proprement
        (document.body as any).dashboardPreviousOverflow = currentOverflow;
      }
    } else {
      // Restaurer seulement si on a été celui qui a mis hidden
      const previousOverflow = (document.body as any).dashboardPreviousOverflow;
      document.body.style.overflow = previousOverflow || '';
      delete (document.body as any).dashboardPreviousOverflow;
    }
    
    return () => {
      // Nettoyer en cas de démontage
      const previousOverflow = (document.body as any).dashboardPreviousOverflow;
      document.body.style.overflow = previousOverflow || '';
      delete (document.body as any).dashboardPreviousOverflow;
    };
  }, [isOpen]);

  // Définition de l'URL du profil pour réutilisation
  const profileUrl = `/${locale}/dashboard/student/profile`;

  const navLinks = [
    {
      name: "Accueil",
      href: `/${locale}/dashboard/student`,
      icon: <Compass size={14} />,
    },
    {
      name: "Parcours",
      href: `/${locale}/dashboard/student/parcours`,
      icon: <Map size={14} />,
    },
    {
      name: "Blog",
      href: `/${locale}/dashboard/student/blog`,
      icon: <User size={14} />,
    },
    {
      name: "Abonnement",
      href: `/${locale}/dashboard/student/billing`,
      icon: <Bell size={14} />,
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    await signOut({ redirect: false }).catch(() => {});
    UserIdManager.logout();
    window.location.href = `/${locale}`;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-3 sm:px-4 md:px-8 ${scrolled ? "pt-2" : "pt-3 sm:pt-4"}`}
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-500 rounded-[1.5rem] border relative overflow-hidden ${
            scrolled
              ? "bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_0_rgba(0,128,128,0.08)]"
              : "bg-white/95 backdrop-blur-md border-white/50 shadow-lg"
          }`}
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-40" />

          <div className="relative px-3 sm:px-5 py-2 flex items-center justify-between gap-3">
            <div className="flex-shrink-0 group">
              <Link
                href={`/${locale}/dashboard/student`}
                className="relative block w-24 sm:w-28 md:w-32 h-8 transition-transform duration-300 group-hover:scale-105"
              >
                <Image
                  src="/matchmyformation.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>

            {/* NAV DESKTOP */}
            <div className="hidden lg:flex items-center gap-1 bg-black/5 p-1 rounded-[1.2rem] backdrop-blur-sm border border-black/5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-[0.9rem] overflow-hidden ${
                      isActive
                        ? "text-white"
                        : "text-[#004D40]/70 hover:text-[#004D40]"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[#004D40] shadow-md"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              <Link
                href={`/${locale}/dashboard/student/notifications`}
                className="relative p-2 text-[#004D40] rounded-xl transition-all hover:bg-primary/10 hover:scale-110 active:scale-95"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full border border-white animate-pulse" />
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-100">
                {/* Theme and Language Switcher */}
                <ThemeLanguageSwitcher />

                {/* REDIRECTION PROFIL ICI */}
                <Link
                  href={profileUrl}
                  className="relative w-8 h-8 rounded-xl overflow-hidden border border-primary/20 rotate-2 hover:rotate-0 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95"
                >
                  <Image
                    src="/temoignage.png"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 rounded-xl transition-all hover:bg-red-50"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2.5 text-[#004D40] bg-gray-100 rounded-xl transition-colors active:scale-95"
                aria-expanded={isOpen}
                aria-label="Ouvrir le menu du dashboard"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#002B24]/90 backdrop-blur-xl z-[110]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] max-w-full bg-white z-[120] p-5 sm:p-8 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.3)] panel-scroll"
            >
              <div className="absolute -bottom-20 -left-20 text-gray-50 opacity-10 pointer-events-none rotate-12">
                <Compass size={400} />
              </div>

              <div className="relative flex-grow flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-10 sm:mb-16">
                  <div className="w-28 h-8 relative">
                    <Image
                      src="/matchmyformation.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-3 bg-gray-50 rounded-2xl text-[#002B24] hover:bg-gray-100 transition-colors active:scale-95"
                    aria-label="Fermer le menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8 sm:space-y-10 flex-grow min-h-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                    Ma Destination
                  </p>
                  <div className="flex flex-col gap-5 sm:gap-6">
                    {navLinks.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between gap-4 text-2xl sm:text-3xl font-black text-[#002B24] hover:text-primary transition-all text-safe"
                        >
                          <span>{item.name}</span>
                          <span className="text-gray-200 group-hover:text-primary group-hover:translate-x-2 transition-all">
                            →
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t border-gray-100">
                  {/* Theme and Language Switcher Mobile */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-black uppercase tracking-wider text-primary mb-3">
                      Préférences
                    </p>
                    <ThemeLanguageSwitcher />
                  </div>

                  {/* REDIRECTION PROFIL MOBILE ICI */}
                  <Link
                    href={profileUrl}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                      <Image
                        src="/temoignage.png"
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-[#002B24] text-sm">
                        Marie Kouassi
                      </h4>
                      <p className="text-[10px] uppercase font-bold text-primary tracking-wider">
                        Voir mon profil
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-[0.98]"
                  >
                    <LogOut size={18} /> Quitter l'académie
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
