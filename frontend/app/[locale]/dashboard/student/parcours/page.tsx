"use client";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import WelcomeHeader from "@/components/dashboard/student/parcours/WelcomeHeader";
import CourseProgressCard from "@/components/dashboard/student/parcours/CourseProgressCard";
import GlobalStatsChart from "@/components/dashboard/student/parcours/GlobalStatsChart";
import RecentModuleItem from "@/components/dashboard/student/parcours/RecentModuleItem";
import CertificationCard from "@/components/dashboard/student/parcours/CertificationCard";
import UserIdManager from "@/lib/user-id-manager";
import { AlertCircle } from "lucide-react";

// 1. Définition des interfaces pour le typage TypeScript
interface Course {
  id: number;
  title: string;
  module: string;
  progress: number;
  image: string;
  totalModules: number;
  completedModules: number;
  estimatedTime: string;
  difficulty: string;
  instructor: {
    name: string;
    avatar: string;
    specialty: string;
  };
  nextModule?: {
    title: string;
    duration: string;
    type: string;
  };
}

interface Module {
  id: number;
  title: string;
  course: string;
  date: string;
  duration: string;
  type: "video" | "interactive" | "workshop" | "exam" | "project";
  completed: boolean;
  score?: number;
  certificate?: {
    earned: boolean;
    downloadUrl?: string | null;
  };
}

interface Certification {
  id: number;
  title: string;
  description: string;
  date?: string;
  progress?: number;
  status: "Obtenu" | "En cours";
  score?: number;
  downloadUrl?: string | null;
  issuer: string;
  credentialId: string;
  expiresAt?: string | null;
  skills: string[];
  nextMilestone?: {
    title: string;
    date: string;
    type: string;
  };
}

interface ParcoursData {
  coursesInProgress: Course[];
  recentModules: Module[];
  certifications: Certification[];
  globalStats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalHours: number;
    completedHours: number;
    averageScore: number;
    streak: number;
    rank: number;
    totalStudents: number;
  };
}

// Variants pour les animations
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ParcoursPage() {
  const [parcoursData, setParcoursData] = useState<ParcoursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcoursData = async () => {
      try {
        // Vérifier l'authentification
        if (!UserIdManager.isAuthenticated()) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const response = await fetch("/api/student/parcours", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setParcoursData(data.data);
        } else {
          setError("Erreur lors du chargement des parcours");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchParcoursData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 font-medium">
          Chargement de vos parcours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!parcoursData) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }
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
                <h2 className="text-xl font-black text-[#002B24] tracking-tight">
                  Formations en cours
                </h2>
                <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {parcoursData.coursesInProgress.map((course: Course) => (
                  <CourseProgressCard key={course.id} {...course} />
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-black text-[#002B24] tracking-tight mb-6">
                Derniers modules visionnés
              </h2>
              <div className="space-y-2">
                {parcoursData.recentModules.map((mod: Module) => (
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
              <h2 className="text-xl font-black text-[#002B24] tracking-tight mb-6">
                Certifications
              </h2>
              <div className="space-y-6">
                {parcoursData.certifications.map(
                  (certification: Certification, index) => (
                    <CertificationCard
                      key={certification.id}
                      title={certification.title}
                      date={certification.date}
                      progress={certification.progress}
                      status={certification.status}
                    />
                  )
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
