"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Loader2, Film, ArrowRight } from "lucide-react";
import Link from "next/link";

// Importations des composants UI de ta première version
import CoursesHero from "@/components/courses/sections/CoursesHero";
import FilterBar from "@/components/courses/sections/FilterBar";
import CourseCard from "@/components/courses/CourseCard";
import Features from "@/components/courses/sections/Features";
import CTASection from "@/components/courses/sections/CTASection";

export default function CoursesPage() {
  const params = useParams();
  const locale = params.locale || "fr";

  // États pour la vue et le filtrage
  const [view, setView] = useState<"landing" | "all">("landing");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les données API
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Fetch des données réelles depuis Laravel
  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchVideos = async () => {
      try {
        const rawUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const baseUrl = rawUrl.replace(/\/$/, "");
        const targetUrl = `${baseUrl}/api/public/videos`;

        const response = await fetch(targetUrl, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          // On transforme les données API pour qu'elles matchent le format CourseCard si besoin
          setCourses(Array.isArray(data) ? data : []);
        } else {
          throw new Error("Erreur API");
        }
      } catch (error: any) {
        if (error.name === "AbortError") return;
        console.error("Mode Fallback activé (Données locales utilisées)");
        // Fallback : On utilise tes données statiques initiales
        setCourses(MOCK_FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    return () => controller.abort();
  }, []);

  // 2. Logique de filtrage (useMemo pour la performance)
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const categoryLabel = course.category || course.tags?.[0] || "Général";
      const matchesCat =
        activeCategory === "Tous" || categoryLabel === activeCategory;
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery, courses]);

  const handleToggleView = (newView: "landing" | "all") => {
    setView(newView);
    setTimeout(() => {
      document
        .getElementById("courses-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="relative pt-4">
        <CoursesHero />
      </div>

      <main id="courses-content" className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          {view === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-[#004D40] mb-4 tracking-tighter italic">
                  Formations Phares
                </h2>
                <div className="w-24 h-1.5 bg-[#FFB74D] mx-auto rounded-full mb-6" />
                <p className="text-gray-400 font-medium">
                  L&apos;excellence du tourisme à portée de main.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-[#FFB74D]" size={40} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                  {courses.slice(0, 4).map((course, index) => (
                    <CourseCard
                      key={course.id || index}
                      course={course}
                      index={index}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleView("all")}
                  className="group flex items-center gap-6 bg-[#FFB74D] text-[#004D40] px-12 py-5 rounded-full font-black shadow-2xl transition-all"
                >
                  DÉCOUVRIR TOUS LES CURSUS
                  <span className="bg-[#004D40] text-white w-8 h-8 flex items-center justify-center rounded-full group-hover:rotate-45 transition-transform">
                    →
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="exploration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <button
                      onClick={() => handleToggleView("landing")}
                      className="group mb-4 flex items-center gap-2 text-xs font-black text-[#004D40]/60 hover:text-[#004D40]"
                    >
                      ← RETOUR À LA SÉLECTION
                    </button>
                    <h2 className="text-5xl font-black text-[#004D40] tracking-tighter">
                      Exploration du catalogue
                    </h2>
                  </div>
                  <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    {filteredCourses.length} Résultats
                  </p>
                </div>

                <FilterBar
                  active={activeCategory}
                  setActive={setActiveCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  totalResults={filteredCourses.length}
                />

                {filteredCourses.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredCourses.map((course, index) => (
                        <CourseCard
                          key={course.id || index}
                          course={course}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <Film className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-400 font-medium">
                      Aucune formation ne correspond à votre recherche.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Features />
      <CTASection onViewCourses={() => handleToggleView("all")} />
    </div>
  );
}

// Données de secours (Mock) pour éviter que la page soit vide si l'API est éteinte
const MOCK_FALLBACK = [
  {
    id: 1,
    title: "Management Hôtelier",
    duration: "12 mois",
    rating: "4.9",
    image: "/sofitel.jpg",
    category: "Management",
  },
  {
    id: 2,
    title: "Guide Touristique Pro",
    duration: "8 mois",
    rating: "4.7",
    image: "/guide2.jpg",
    category: "Terrain",
  },
  {
    id: 3,
    title: "Marketing Digital Touristique",
    duration: "6 mois",
    rating: "4.8",
    image: "/guide1.jpg",
    category: "Digital",
  },
  {
    id: 4,
    title: "Tourisme Durable & Eco",
    duration: "10 mois",
    rating: "4.6",
    image: "/guide3.png",
    category: "Eco",
  },
];
