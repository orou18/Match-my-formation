"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import StudentHero from "@/components/dashboard/StudentHero";
import CategoryFilters from "@/components/dashboard/CategoryFilters";
import FeaturedGrid from "@/components/dashboard/FeaturedGrid";
import VideoCard from "@/components/video/VideoCard";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
import ProfileSidebar from "@/components/dashboard/student/profile/ProfileSidebar";
import UserIdManager from "@/lib/user-id-manager";
import { useRouter, useParams } from "next/navigation";
import {
  Star,
  User,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Video,
  Play,
} from "lucide-react";

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
  const [publicVideos, setPublicVideos] = useState<any[]>([]);
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
        
        // Récupérer directement les données depuis UserIdManager
        const userData = UserIdManager.getStoredUserData();
        
        if (!userData) {
          throw new Error("Aucune donnée d'authentification trouvée");
        }

        // Utiliser directement les données utilisateur
        const user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as 'student' | 'creator' | 'admin',
          created_at: new Date().toISOString(),
          avatar: userData.avatar || null,
        };

        setUser(user);

        // Charger les vidéos publiques pour la section pépites
        const publicVideosResponse = await fetch("/api/videos/public", {
          cache: "no-store",
        });

        let publicVideosList: any[] = [];
        if (publicVideosResponse.ok) {
          const publicVideosPayload = await publicVideosResponse.json();
          publicVideosList = Array.isArray(publicVideosPayload)
            ? publicVideosPayload
            : Array.isArray(publicVideosPayload?.videos)
              ? publicVideosPayload.videos
              : [];
        }
        setPublicVideos(publicVideosList);

        const videosResponse = await fetch("/api/student-videos", {
          cache: "no-store",
        });

        if (videosResponse.ok) {
          const videosPayload = await videosResponse.json();
          const nextCourses = Array.isArray(videosPayload)
            ? videosPayload
            : Array.isArray(videosPayload?.videos)
              ? videosPayload.videos
              : [];

          setCourses(nextCourses);
          setTotalPages(1);
        } else {
          setCourses([]);
          setTotalPages(1);
        }

        // Vérifier si c'est un nouvel utilisateur (créé il y a moins de 24h)
        const createdAt = new Date(user.created_at);
        const now = new Date();
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        setIsNewUser(hoursDiff < 24);

      } catch (error: unknown) {
        console.error("Erreur dashboard étudiant:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement du dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Exposer une fonction de rechargement global
    const refreshStudentVideos = async () => {
      try {
        const videosResponse = await fetch("/api/student-videos", {
          cache: "no-store",
        });

        if (videosResponse.ok) {
          const videosPayload = await videosResponse.json();
          const nextCourses = Array.isArray(videosPayload)
            ? videosPayload
            : Array.isArray(videosPayload?.videos)
              ? videosPayload.videos
              : [];

          setCourses(nextCourses);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Erreur lors du rechargement des vidéos étudiant:", error);
      }
    };

    // Stocker la fonction de rechargement globalement
    (window as any).refreshStudentVideos = refreshStudentVideos;
    
    return () => {
      delete (window as any).refreshStudentVideos;
    };
  }, []);

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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 font-medium text-sm tracking-[0.1em]">
          Accès à l&apos;académie...
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
      {/* Contenu principal - plein écran */}
      <div className="flex-1 overflow-y-auto">
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
                    Bienvenue dans votre espace d&apos;apprentissage !
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
<br />
<br />
          <div>
          <main className="container mx-auto px-4 md:px-8 py-10">
            <FeaturedGrid />

            <section className="mt-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-2xl font-bold text-[#002B24] tracking-tight">
                    Catalogue des formations
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-[0.15em]">
                    Explorez l&apos;excellence académique
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
                      Les formations apparaîtront ici dès qu&apos;elles seront publiées par les créateurs.
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Charger plus de formations
                  </button>
                </div>
              )}
            </section>

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

              <div>
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              >
                {publicVideos.slice(0, 6).map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-none w-[280px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => {
                      // Ouvrir la vidéo dans un nouvel onglet ou modal
                      if (video.video_url) {
                        window.open(video.video_url, '_blank');
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-800">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <Play size={20} className="text-primary" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play size={20} className="text-gray-900 ml-1" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-white text-xs">4.8</span>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {(video.views || 0).toLocaleString()} vues
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          {video.category || 'Expertise'}
                        </div>
                        {video.duration && (
                          <div className="text-gray-400 text-xs">
                            {video.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {publicVideos.length === 0 && (
                  <div className="flex-none w-[280px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video size={20} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">
                      Aucune vidéo disponible
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Les vidéos publiques de nos experts apparaîtront ici
                    </p>
                  </div>
                )}
              </div>
            </div>
            </div>
          </section>
        </main>
      </div>
    </div>
    <PremiumBanner />
  </div>
  );
}
