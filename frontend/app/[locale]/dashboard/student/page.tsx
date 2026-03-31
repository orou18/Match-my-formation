"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import StudentHero from "@/components/dashboard/StudentHero";
import CategoryFilters from "@/components/dashboard/CategoryFilters";
import FeaturedGrid from "@/components/dashboard/FeaturedGrid";
import VideoCard from "@/components/video/VideoCard";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
import {
  Star,
  Users,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface DashboardCourse {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  duration?: string;
  students_count?: number;
  creator?: {
    name?: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  video_url?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

interface StudentDashboardPayload {
  user: DashboardUser;
  courses: DashboardCourse[];
  stats?: {
    courses_in_progress?: number;
  };
}

export default function StudentDashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/student/dashboard", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const payload = (await response.json().catch(() => null)) as
          | StudentDashboardPayload
          | { error?: string }
          | null;

        if (!response.ok || !payload || !("user" in payload)) {
          throw new Error(
            (payload && "error" in payload && payload.error) ||
              "Connexion au dashboard étudiant impossible."
          );
        }

        setUser(payload.user);
        setCourses(Array.isArray(payload.courses) ? payload.courses : []);
        setTotalPages(1);

        if (payload.user.created_at) {
          const createdAt = new Date(payload.user.created_at);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          setIsNewUser(createdAt > oneDayAgo);
        } else {
          setIsNewUser(false);
        }

      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Connexion au serveur perdue. Vérifiez que votre backend est lancé."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale, currentPage]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Fonction pour charger plus de cours
  const loadMoreCourses = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB]">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-gray-600 font-medium text-sm tracking-[0.1em]">
          Accès à l'académie...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] p-6 text-center">
        <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 max-w-md shadow-2xl shadow-red-500/5">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#002B24] mb-2">
            Erreur de liaison
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-4 bg-[#002B24] text-white rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-primary transition-all active:scale-95"
          >
            Réessayer la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] overflow-hidden font-sans">
      <div className="flex">
        {/* Contenu principal */}
        <div className="flex-1">
          <StudentHero user={user} />

          {/* Message de bienvenue pour les nouveaux utilisateurs */}
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 md:px-8 -mt-8 mb-8"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🎉</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Bienvenue dans votre espace d'apprentissage !
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Nous sommes ravis de vous accueillir. Votre parcours commence
                    maintenant ! Explorez nos formations et commencez à développer
                    vos compétences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setIsNewUser(false)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Commencer à explorer
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/${locale}/dashboard/student/profile`)
                      }
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      Compléter mon profil
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <main className="container mx-auto px-4 md:px-8 py-10">
            <FeaturedGrid />

            <section className="mt-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-2xl font-bold text-[#002B24] tracking-tight">
                    Catalogue des formations
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-[0.15em]">
                    Explorez l'excellence académique
                  </p>
                </div>
                <CategoryFilters />
              </div>

              {courses.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {courses.map((course) => (
                    <motion.div variants={itemVariants} key={course.id}>
                      <VideoCard video={{
                        id: course.id,
                        title: course.title,
                        description: course.description || "",
                        thumbnail: course.thumbnail || course.image || "/placeholder-course.jpg",
                        video_url: course.video_url || "",
                        duration: course.duration || '00:00',
                        order: 0,
                        creator_id: 0,
                        views: course.students_count || 0,
                        likes: Math.floor((course.students_count || 0) * 0.8),
                        comments: [],
                        tags: course.tags || [],
                        is_published: course.is_published ?? true,
                        visibility: "public",
                        created_at: course.created_at || new Date().toISOString(),
                        updated_at: course.updated_at || new Date().toISOString(),
                        creator: {
                          id: 0,
                          name: course.creator?.name || "Créateur",
                          email: "",
                          avatar: course.creator?.avatar || "/default-avatar.png",
                        },
                        is_free: true,
                        price: 0,
                        rating: 0,
                      }} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune formation disponible
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Les formations apparaîtront ici dès qu'elles seront publiées par les créateurs.
                    </p>
                  </div>
                </div>
              )}

              {courses.length > 0 && currentPage < totalPages && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={loadMoreCourses}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4" />
                    Charger plus de formations
                  </button>
                </div>
              )}
            </section>
          </main>

          {/* --- SECTION EXPERTS --- */}
          <section className="mt-4 mb-16 bg-[#002B24] py-12 relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="max-w-xl">
                  <span className="text-primary text-[9px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Elite Experts
                  </span>
                  <h2 className="text-xl font-bold text-white mt-3 leading-tight">
                    Pépites de nos{" "}
                    <span className="italic text-primary font-serif">experts</span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">
                    Apprenez des meilleurs dans leur domaine
                  </p>
                </div>
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => scroll("left")}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <ArrowLeft size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <ArrowRight size={16} className="text-white" />
                  </button>
                </div>
              </div>

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              >
                {courses.slice(0, 6).map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-none w-[280px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{course.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {course.creator?.name || "Créateur"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-white text-sm">4.8</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {(course.students_count || 0).toLocaleString()} étudiants
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
