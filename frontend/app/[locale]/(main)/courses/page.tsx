"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoursesHero from "@/components/courses/sections/CoursesHero";
import FilterBar from "@/components/courses/sections/FilterBar";
import CourseCard from "@/components/courses/CourseCard";
import Features from "@/components/courses/sections/Features";
import CTASection from "@/components/courses/sections/CTASection";

const ALL_COURSES = [
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
  {
    id: 5,
    title: "Gestion d'Agence de Voyage",
    duration: "9 mois",
    rating: "4.8",
    image: "/guide4.png",
    category: "Management",
  },
  {
    id: 6,
    title: "Anglais du Tourisme",
    duration: "4 mois",
    rating: "4.9",
    image: "/guide2.jpg",
    category: "Terrain",
  },
  {
    id: 7,
    title: "Hôtellerie de Luxe",
    duration: "14 mois",
    rating: "5.0",
    image: "/sofitel.jpg",
    category: "Management",
  },
  {
    id: 8,
    title: "Communication Digitale",
    duration: "5 mois",
    rating: "4.7",
    image: "/guide1.jpg",
    category: "Digital",
  },
];

export default function CoursesPage() {
  const [view, setView] = useState<"landing" | "all">("landing");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return ALL_COURSES.filter((course) => {
      const matchesCat =
        activeCategory === "Tous" || course.category === activeCategory;
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleToggleView = (newView: "landing" | "all") => {
    setView(newView);
    const contentElement = document.getElementById("courses-content");
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
              transition={{ duration: 0.5, ease: "circOut" }}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {ALL_COURSES.slice(0, 4).map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, gap: "2rem" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleView("all")}
                  className="group flex items-center gap-6 bg-[#FFB74D] text-[#004D40] px-12 py-5 rounded-full font-black shadow-2xl hover:shadow-orange-200 transition-all"
                >
                  DÉCOUVRIR TOUS LES CURSUS
                  <span className="bg-[#004D40] text-white w-8 h-8 flex items-center justify-center rounded-full group-hover:rotate-45 transition-transform duration-500">
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
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <div className="flex flex-col gap-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <button
                      onClick={() => handleToggleView("landing")}
                      className="group mb-4 flex items-center gap-2 text-xs font-black text-[#004D40]/60 hover:text-[#004D40] transition-all"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">
                        ←
                      </span>{" "}
                      RETOUR À LA SÉLECTION
                    </button>
                    <h2 className="text-5xl font-black text-[#004D40] tracking-tighter">
                      Exploration du catalogue
                    </h2>
                  </div>
                  <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    {filteredCourses.length} Formations disponibles
                  </p>
                </div>

                <FilterBar
                  active={activeCategory}
                  setActive={setActiveCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  totalResults={filteredCourses.length}
                />

                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[60vh] mt-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredCourses.map((course, index) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                <div className="flex justify-center mt-20 gap-4">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={`w-14 h-14 rounded-2xl font-black transition-all duration-300 ${page === 1 ? "bg-[#004D40] text-white shadow-xl shadow-emerald-900/20 scale-110" : "bg-white text-gray-300 hover:text-[#004D40] hover:shadow-md"}`}
                    >
                      0{page}
                    </button>
                  ))}
                </div>
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
