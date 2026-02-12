"use client";
import { motion, Variants } from "framer-motion";
import WelcomeHeader from "@/components/dashboard/student/parcours/WelcomeHeader";
import CourseProgressCard from "@/components/dashboard/student/parcours/CourseProgressCard";
import GlobalStatsChart from "@/components/dashboard/student/parcours/GlobalStatsChart";
import RecentModuleItem from "@/components/dashboard/student/parcours/RecentModuleItem";
import CertificationCard from "@/components/dashboard/student/parcours/CertificationCard";

// 1. Définition des interfaces pour le typage TypeScript
interface Course {
  id: number;
  title: string;
  module: string;
  progress: number;
  image: string;
}

interface Module {
  id: number;
  title: string;
  course: string;
  date: string;
}

// 2. Données fictives (Assure-toi qu'elles sont bien EN DEHORS du composant ou exportées)
const IN_PROGRESS_COURSES: Course[] = [
  {
    id: 1,
    title: "Histoire des sites touristiques du Bénin",
    module: "Module 4 sur 8 terminé",
    progress: 50,
    image: "/images/guide1.jpg", // Vérifie tes chemins d'images
  },
  {
    id: 2,
    title: "Techniques de communication touristique",
    module: "Module 7 sur 10 terminé",
    progress: 70,
    image: "/images/guide2.jpg",
  },
  {
    id: 3,
    title: "Patrimoine culturel et traditions locales",
    module: "Module 2 sur 6 terminé",
    progress: 33,
    image: "/images/guide3.jpg",
  },
];

const RECENT_MODULES: Module[] = [
  { id: 1, title: "Les palais royaux d'Abomey", course: "Histoire des sites touristiques du Bénin", date: "12 janvier 2026" },
  { id: 2, title: "L'art de la narration touristique", course: "Techniques de communication touristique", date: "11 janvier 2026" },
  { id: 3, title: "Les cérémonies vodoun", course: "Patrimoine culturel et traditions locales", date: "10 janvier 2026" },
  { id: 4, title: "Gestion des groupes touristiques", course: "Techniques de communication touristique", date: "09 janvier 2026" },
];

// 3. Variants pour les animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

export default function ParcoursPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 md:px-8 py-8 space-y-10"
      >
        {/* HEADER SECTION */}
        <motion.section variants={itemVariants}>
          <WelcomeHeader />
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-8 space-y-10">
            <motion.section variants={itemVariants}>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black text-[#002B24] tracking-tight">Formations en cours</h2>
                <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Voir tout</button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {/* Typage explicite du paramètre 'course' */}
                {IN_PROGRESS_COURSES.map((course: Course) => (
                  <CourseProgressCard key={course.id} {...course} />
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-black text-[#002B24] tracking-tight mb-6">Derniers modules visionnés</h2>
              <div className="space-y-2">
                {/* Typage explicite du paramètre 'mod' */}
                {RECENT_MODULES.map((mod: Module) => (
                  <RecentModuleItem key={mod.id} {...mod} />
                ))}
              </div>
            </motion.section>
          </div>

          {/* COLONNE DROITE */}
          <div className="lg:col-span-4 space-y-10">
            <motion.section variants={itemVariants} className="h-fit">
              <GlobalStatsChart />
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-black text-[#002B24] tracking-tight mb-6">Certifications</h2>
              <div className="space-y-6">
                <CertificationCard 
                  title="Certification Guide Touristique Professionnel" 
                  date="15 décembre 2024" 
                  status="Obtenu" 
                />
                <CertificationCard 
                  title="Spécialisation Patrimoine Culturel" 
                  progress={68} 
                  status="En cours" 
                />
                <CertificationCard 
                  title="Expert en Communication Touristique" 
                  progress={45} 
                  status="En cours" 
                />
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}