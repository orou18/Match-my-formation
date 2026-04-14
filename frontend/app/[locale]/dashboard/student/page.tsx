"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import StudentHero from "@/components/dashboard/StudentHero";
import CategoryFilters from "@/components/dashboard/CategoryFilters";
import FeaturedGrid from "@/components/dashboard/FeaturedGrid";
import VideoCard from "@/components/video/VideoCard";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
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
  is_admin_video?: boolean; // Ajouter cette propriété pour les vidéos admin
}

interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function StudentDashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [publicVideos, setPublicVideos] = useState<any[]>([]);
  const [creatorVideos, setCreatorVideos] = useState<any[]>([]);
  const [adminVideos, setAdminVideos] = useState<any[]>([]);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Gérer les changements de filtres
  const handleFilterChange = (filters: any) => {
    // Appliquer les filtres aux cours
    let filtered = [...courses];

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          course.category
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          course.tags?.some((tag: string) =>
            tag.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Filtre par catégorie
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (course) => course.category === filters.category
      );
    }

    // Filtre par difficulté
    if (filters.difficulty !== "all") {
      filtered = filtered.filter(
        (course) => course.difficulty_level === filters.difficulty
      );
    }

    // Filtre par durée
    if (filters.duration !== "all") {
      filtered = filtered.filter((course) => {
        const durationInMinutes = parseDuration(course.duration);
        switch (filters.duration) {
          case "short":
            return durationInMinutes < 30;
          case "medium":
            return durationInMinutes >= 30 && durationInMinutes <= 60;
          case "long":
            return durationInMinutes > 60;
          default:
            return true;
        }
      });
    }

    // Filtre par note
    if (filters.rating !== "all") {
      filtered = filtered.filter((course) => {
        const rating = course.rating || 0;
        switch (filters.rating) {
          case "4+":
            return rating >= 4;
          case "3+":
            return rating >= 3;
          case "2+":
            return rating >= 2;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "duration":
          return parseDuration(a.duration) - parseDuration(b.duration);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  };

  // Helper pour parser la durée
  const parseDuration = (duration: string): number => {
    if (!duration) return 0;
    const parts = duration.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'utilisateur depuis la session
        const userResponse = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        let user: DashboardUser = {
          id: 0,
          name: "Étudiant",
          email: "student@example.com",
          role: "student",
        };

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData?.user) {
            user = userData.user;
          }
        }

        setUser(user);

        // Charger les vidéos selon le rôle de l'utilisateur
        let allCourses: any[] = [];
        let creatorVideosData: any[] = [];
        let adminVideosData: any[] = [];

        // Pour les employés, charger les vidéos créateurs (privées, publiques, non listées)
        if (user.role === "employee") {
          const creatorVideosResponse = await fetch("/api/creator/videos", {
            cache: "no-store",
            credentials: "include",
          });

          if (creatorVideosResponse.ok) {
            const creatorVideosPayload = await creatorVideosResponse.json();
            creatorVideosData = Array.isArray(creatorVideosPayload?.videos)
              ? creatorVideosPayload.videos
              : Array.isArray(creatorVideosPayload)
                ? creatorVideosPayload
                : [];

            // Transformer les données pour le dashboard
            allCourses = creatorVideosData.map((video: any) => ({
              id: video.id,
              title: video.title,
              description: video.description,
              thumbnail: video.thumbnail,
              duration: video.duration,
              creator: {
                name: video.creator_name || "Créateur",
                avatar: video.creator_avatar || null,
              },
              category: video.category,
              tags: video.tags || [],
              video_url: video.video_url,
              is_published: video.is_published,
              visibility: video.visibility, // private, public, unlisted
              created_at: video.created_at,
              is_creator_video: true,
            }));
          }

          // Charger les vidéos admin pour le catalogue de formations (TOUJOURS pour les employés)
          const adminVideosResponse = await fetch("/api/admin/videos", {
            cache: "no-store",
          });

          if (adminVideosResponse.ok) {
            const adminVideosPayload = await adminVideosResponse.json();
            adminVideosData = Array.isArray(adminVideosPayload?.videos)
              ? adminVideosPayload.videos
              : Array.isArray(adminVideosPayload?.data)
                ? adminVideosPayload.data
                : [];
          }
        } else {
          // Pour les étudiants standards, charger les vidéos publiques
          const publicVideosResponse = await fetch("/api/videos/public", {
            cache: "no-store",
          });

          if (publicVideosResponse.ok) {
            const publicVideosPayload = await publicVideosResponse.json();
            allCourses = Array.isArray(publicVideosPayload?.data)
              ? publicVideosPayload.data
              : Array.isArray(publicVideosPayload)
                ? publicVideosPayload
                : [];
          }

          // Charger les vidéos créateurs publiques pour la section pépites de nos experts (ENDPOINT PUBLIC)
          const creatorVideosResponse = await fetch(
            "/api/creator/videos-public",
            {
              cache: "no-store",
              // Pas besoin de credentials pour l'endpoint public
            }
          );

          if (creatorVideosResponse.ok) {
            const creatorVideosPayload = await creatorVideosResponse.json();
            // L'endpoint public retourne déjà les vidéos publiques filtrées
            creatorVideosData = Array.isArray(creatorVideosPayload?.data)
              ? creatorVideosPayload.data
              : Array.isArray(creatorVideosPayload?.videos)
                ? creatorVideosPayload.videos
                : [];
          } else {
            // En cas d'erreur, utiliser un tableau vide pour la section pépites
            creatorVideosData = [];
          }

          // Charger les vidéos admin pour le catalogue de formations (ENDPOINT PUBLIC)
          const adminVideosResponse = await fetch("/api/admin/videos-public", {
            cache: "no-store",
            // Pas besoin de credentials pour l'endpoint public
          });

          if (adminVideosResponse.ok) {
            const adminVideosPayload = await adminVideosResponse.json();
            // L'endpoint public retourne déjà les vidéos admin transformées
            adminVideosData = Array.isArray(adminVideosPayload?.data)
              ? adminVideosPayload.data
              : Array.isArray(adminVideosPayload?.videos)
                ? adminVideosPayload.videos
                : [];
          } else {
            // En cas d'erreur, utiliser un tableau vide pour les vidéos admin
            adminVideosData = [];
          }
        }

        // Catalogue des formations: combiner les vidéos admin et les vidéos publiques
        const allAdminVideos = adminVideosData.filter(
          (video) => video.is_admin_video
        );
        const allPublicVideos = allCourses.filter(
          (video: any) => !video.is_admin_video
        );

        // Combiner toutes les vidéos pour le catalogue complet
        const coursesData = [...allAdminVideos, ...allPublicVideos];
        setCourses(coursesData); // Toutes les vidéos sont incluses ici
        setFilteredCourses(coursesData); // Initialiser les cours filtrés
        setPublicVideos(allPublicVideos.slice(0, 6)); // Exclure les vidéos admin des pépites publiques
        setCreatorVideos(creatorVideosData); // Stocker les vidéos créateurs publiques
        setAdminVideos(adminVideosData); // Stocker les vidéos admin
        setTotalPages(1);

        // Vérifier si c'est un nouvel utilisateur (créé il y a moins de 24h)
        const createdAt = user.created_at
          ? new Date(user.created_at)
          : new Date();
        const now = new Date();
        const hoursDiff =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        setIsNewUser(hoursDiff < 24);
      } catch (error: unknown) {
        console.error("Erreur dashboard étudiant:", error);
        setError(
          "Impossible de charger votre tableau de bord. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] p-6 text-center">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-200 max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-[#002B24] mb-2">
            Accès à l&apos;académie...
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Chargement de votre espace d&apos;apprentissage personnalisé
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
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
      {/* Contenu principal - plein écran sans padding */}
      <div className="flex-1 overflow-y-auto">
        <StudentHero user={user} />

        {/* Message de bienvenue pour les nouveaux utilisateurs */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full -mt-8 mb-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">? </span>
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
        <FeaturedGrid />
        <div className="w-full py-2">
          <CategoryFilters
            courses={courses}
            onFilterChange={handleFilterChange}
          />

          {/* --- SECTION PÉPITES DE NOS EXPERTS --- */}
          <section className="mt-0 mb-4 bg-[#002B24] p-4 relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1440px] p-6 mx-auto w-full">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="max-w-xl">
                  <span className="text-primary text-[9px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Elite Experts
                  </span>
                  <h2 className="text-xl font-bold text-white mt-3 leading-tight">
                    Pépites de nos{" "}
                    <span className="italic text-primary font-serif">
                      experts
                    </span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">
                    Découvrez les meilleures formations créées par nos experts certifiés
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
                {creatorVideos.slice(0, 6).map((video: any, index: number) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-none w-[280px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => {
                      // Naviguer vers la page de la vidéo
                      router.push(`/${locale}/video/${video.id}`);
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
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                            <Play size={24} className="text-primary" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play size={20} className="text-gray-900 ml-1" />
                        </div>
                      </div>
                      {/* Badge Expert */}
                      <div className="absolute top-2 left-2 z-20">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Expert
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
                          <Star
                            size={12}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="text-white text-xs">
                            {video.rating || 4.8}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {video.views || 0} vues
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <User size={12} className="text-gray-300" />
                        </div>
                        <span className="text-gray-300 text-xs truncate">
                          {video.creator?.name || "Expert"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          

          {/* --- SECTION CATALOGUE DES FORMATIONS --- */}
          <section className="mt-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 px-2 md:px-4">
              <div>
                <h2 className="text-2xl font-bold text-[#002B24] tracking-tight">
                  Catalogue des formations
                </h2>
                <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-[0.15em]">
                  Explorez l&apos;excellence académique
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  {filteredCourses.length} {filteredCourses.length === 1 ? "formation" : "formations"}
                </span>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {creatorVideos.length} créateur{creatorVideos.length > 1 ? "s" : ""}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    {adminVideos.length} admin{adminVideos.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {filteredCourses.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2 md:px-4"
              >
                {filteredCourses.map((course) => (
                  <motion.div
                    variants={itemVariants}
                    key={course.id}
                    className="relative"
                  >
                    {/* Badge pour les vidéos admin */}
                    {course.is_admin_video && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Admin
                        </div>
                      </div>
                    )}

                    {/* Badge pour les vidéos créateurs */}
                    {!course.is_admin_video && creatorVideos.some(cv => cv.id === course.id) && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Créateur
                        </div>
                      </div>
                    )}

                    <VideoCard
                      video={{
                        id: course.id,
                        title: course.title,
                        description: course.description || "",
                        thumbnail:
                          course.thumbnail || course.image || "/placeholder-course.jpg",
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
                          name: course.creator?.name || (course.is_admin_video ? "Admin" : "Créateur"),
                          email: course.is_admin_video ? "admin@matchmyformation.com" : "creator@example.com",
                          avatar: course.creator?.avatar || (course.is_admin_video ? "/admin-avatar.png" : "/default-avatar.png"),
                        },
                        is_free: true,
                        price: 0,
                        rating: course.rating || 0,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 mx-2 md:mx-4">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune formation disponible
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Les formations apparaîtront ici dès qu&apos;elles seront publiées par les créateurs et administrateurs.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
