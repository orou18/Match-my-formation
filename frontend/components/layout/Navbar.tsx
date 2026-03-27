"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale || "fr";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false); // Ferme le menu mobile lors du changement de page
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = [
    { label: "Accueil", href: `/${locale}` },
    { label: "Formations", href: `/${locale}/courses`, dropdown: true },
    { label: "Blog", href: `/${locale}/blog` },
    { label: "Tarifs", href: `/${locale}/pricing` },
  ];

  const textColorClass = scrolled ? "text-darkText" : "text-white";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled || open ? "py-3 bg-white/90 shadow-lg" : "py-5 bg-transparent"
      } backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link
          href={`/${locale}`}
          className="relative h-10 w-32 sm:w-36 md:h-12 md:w-48 transition-transform hover:scale-105"
        >
          <Image
            src="/matchmyformation_footer.png"
            alt="Logo"
            fill
            className={`object-contain object-left transition-all ${scrolled || open ? "brightness-0" : ""}`}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav
          className={`hidden md:flex items-center gap-2 px-2 py-1.5 rounded-full ${scrolled ? "bg-gray-100/50" : "bg-white/10"}`}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative px-5 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "text-primary"
                    : `${textColorClass} hover:text-accent`
                }`}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {item.label}
                  {item.dropdown && <ChevronDown size={14} />}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white shadow-sm rounded-full z-0"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={`/${locale}/login`}
            className={`font-bold text-sm ${textColorClass}`}
          >
            Connexion
          </Link>
          <Link
            href={`/${locale}/login`}
            className="bg-primary text-white px-7 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-accent hover:text-secondary transition-all"
          >
            Commencer
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2.5 rounded-xl transition-colors active:scale-95 ${
            scrolled || open
              ? "bg-primary/10 text-primary"
              : "bg-white/10 text-white"
          }`}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 4.5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-full bg-white z-40 overflow-hidden flex flex-col md:hidden border-t border-gray-100 shadow-2xl"
          >
            <div className="flex-1 px-5 sm:px-8 py-8 sm:py-10 flex flex-col gap-6 panel-scroll">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`text-3xl font-black ${
                      pathname === item.href ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <hr className="border-gray-100" />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4"
              >
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] text-secondary font-bold"
                >
                  Espace Connexion
                  <ArrowRight size={20} className="text-primary" />
                </Link>

                <Link
                  href={`/${locale}/login`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-3 p-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20"
                >
                  Démarrer l&apos;aventure
                  <ArrowRight size={24} />
                </Link>
              </motion.div>
            </div>

            {/* Footer Menu Mobile */}
            <div className="px-5 sm:px-8 py-5 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <Globe size={18} className="text-primary" />
                {String(locale).toUpperCase()}
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-[0.22em] uppercase">
                Match My Formation © 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
