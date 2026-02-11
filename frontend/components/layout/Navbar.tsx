// frontend/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale || "fr";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        scrolled ? "py-3 bg-white/80 shadow-lg" : "py-5 bg-transparent"
      } backdrop-blur-xl`}
    >
      {isPending && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="absolute top-0 left-0 h-1 bg-accent z-[60]"
        />
      )}

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          onClick={() => setIsPending(true)}
          className="relative h-12 w-48 transition-transform hover:scale-105"
        >
          <Image
            src="/matchmyformation_footer.png"
            alt="Logo"
            fill
            className={`object-contain object-left transition-all ${scrolled ? "brightness-0" : ""}`}
          />
        </Link>

        <nav
          className={`hidden md:flex items-center gap-2 px-2 py-1.5 rounded-full ${scrolled ? "bg-gray-100/50" : "bg-white/10"}`}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => !active && setIsPending(true)}
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

        <div className="hidden md:flex items-center gap-6">
          <Link
            href={`/${locale}/login`}
            className={`font-bold text-sm ${textColorClass}`}
          >
            Connexion
          </Link>
          <Link
            href={`/${locale}/login`}
            className="bg-[#004D40] text-white px-7 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-accent hover:text-secondary transition-all"
          >
            Commencer
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
