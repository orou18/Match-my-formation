"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import WelcomeHeader from "@/components/dashboard/student/parcours/WelcomeHeader";
import CourseProgressCard from "@/components/dashboard/student/parcours/CourseProgressCard";
import GlobalStatsChart from "@/components/dashboard/student/parcours/GlobalStatsChart";
import RecentModuleItem from "@/components/dashboard/student/parcours/RecentModuleItem";
import CertificationCard from "@/components/dashboard/student/parcours/CertificationCard";
import VideoPlayer from "@/components/dashboard/student/parcours/VideoPlayer";
import BankingIntegration from "@/components/dashboard/student/parcours/BankingIntegration";
import { AlertCircle, Play, BookOpen, Award, TrendingUp } from "lucide-react";

// Interfaces TypeScript
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
  isPremium: boolean;
  price: number;
  enrolledAt: string;
  lastAccessed: string;
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
  videoUrl?: string;
  thumbnail?: string;
  progress?: number;
  liked?: boolean;
  favorite?: boolean;
  isPremium: boolean;
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
  userBalance: number;
  paymentMethods: any[];
  transactions: any[];
}

interface VideoData {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  progress: number;
  liked: boolean;
  favorite: boolean;
  isPremium: boolean;
  views: number;
  likes: number;
  instructor: {
    name: string;
    avatar: string;
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
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "achievements">("overview");
  
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  useEffect(() => {
    const fetchParcoursData = async () => {
      try {
        // Récupérer le token d'authentification
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }

        // Appeler l'API backend pour récupérer les parcours détaillés
        const response = await fetch("/api/student/parcours", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setParcoursData(data.data);
          } else {
            setError(data.message || "Erreur lors de la récupération des parcours");
          }
        } else {
          setError("Erreur lors de la communication avec le serveur");
        }
      } catch (error) {
        console.error("Erreur parcours:", error);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchParcoursData();
  }, []);

  const handleVideoClick = (module: Module) => {
    if (module.videoUrl && module.thumbnail) {
      const videoData: VideoData = {
        id: module.id,
        title: module.title,
        description: `Module de la formation ${module.course}`,
        videoUrl: module.videoUrl,
        thumbnail: module.thumbnail,
        duration: parseInt(module.duration) || 0,
        progress: module.progress || 0,
        liked: module.liked || false,
        favorite: module.favorite || false,
        isPremium: module.isPremium || false,
        views: 0,
        likes: 0,
        instructor: {
          name: "Instructeur",
          avatar: "/default-avatar.png",
        },
      };
      setSelectedVideo(videoData);
      setShowVideoPlayer(true);
    }
  };

  const handleProgressUpdate = async (videoId: number, progress: number, position: number) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/student/parcours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update_progress",
          data: {
            videoId,
            progress,
            position,
            videoTitle: selectedVideo?.title,
            videoUrl: selectedVideo?.videoUrl,
            thumbnail: selectedVideo?.thumbnail,
            totalDuration: selectedVideo?.duration,
            isPremium: selectedVideo?.isPremium,
          },
        }),
      });

      const data = await response.json();
      if (data.success && selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          progress,
        });
      }
    } catch (error) {
      console.error("Erreur mise à jour progression:", error);
    }
  };

  const handleLike = async (videoId: number) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/student/parcours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "like_video",
          data: {
            videoId,
            videoTitle: selectedVideo?.title,
            videoUrl: selectedVideo?.videoUrl,
            thumbnail: selectedVideo?.thumbnail,
            isPremium: selectedVideo?.isPremium,
          },
        }),
      });

      const data = await response.json();
      if (data.success && selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          liked: !selectedVideo.liked,
        });
      }
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  const handleFavorite = async (videoId: number) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/student/parcours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add_favorite",
          data: {
            videoId,
            videoTitle: selectedVideo?.title,
            videoUrl: selectedVideo?.videoUrl,
            thumbnail: selectedVideo?.thumbnail,
            isPremium: selectedVideo?.isPremium,
          },
        }),
      });

      const data = await response.json();
      if (data.success && selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          favorite: !selectedVideo.favorite,
        });
      }
    } catch (error) {
      console.error("Erreur favoris:", error);
    }
  };

  const handlePurchaseComplete = (success: boolean, transactionId?: string) => {
    if (success) {
      // Recharger les données après achat
      window.location.reload();
    } else {
      alert("Erreur lors de l'achat. Veuillez réessayer.");
    }
  };

  const handleEnrollmentComplete = (success: boolean) => {
    if (success) {
      // Recharger les données après inscription
      window.location.reload();
    } else {
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 font-medium">
            Chargement de vos parcours d'apprentissage...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Connexion à la base de données et récupération de votre progression
          </p>
        </div>
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
      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h3>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Video Player */}
            <div className="flex-1 overflow-hidden">
              <VideoPlayer
                video={selectedVideo}
                onProgressUpdate={handleProgressUpdate}
                onLike={handleLike}
                onFavorite={handleFavorite}
              />
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 md:px-8 py-8 space-y-10"
      >
        {/* HEADER SECTION */}
        <motion.section variants={itemVariants}>
          <WelcomeHeader 
            userName="Étudiant"
            streak={parcoursData.globalStats?.streak || 0}
            rank={parcoursData.globalStats?.rank || 0}
          />
        </motion.section>

        {/* TABS NAVIGATION */}
        <motion.section variants={itemVariants} className="bg-white rounded-xl p-1 shadow-sm">
          <div className="flex space-x-1">
            {[
              { id: "overview", label: "Aperçu", icon: <BookOpen size={16} /> },
              { id: "progress", label: "Progression", icon: <TrendingUp size={16} /> },
              { id: "achievements", label: "Achievements", icon: <Award size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* CONTENT BASED ON ACTIVE TAB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-8 space-y-10">
            {activeTab === "overview" && (
              <>
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
                      <CourseProgressCard 
                        key={course.id} 
                        {...course}
                        onVideoClick={handleVideoClick}
                      />
                    ))}
                  </div>
                </motion.section>

                <motion.section variants={itemVariants}>
                  <h2 className="text-xl font-black text-[#002B24] tracking-tight mb-6">
                    Derniers modules visionnés
                  </h2>
                  <div className="space-y-2">
                    {parcoursData.recentModules.map((mod: Module) => (
                      <RecentModuleItem 
                        key={mod.id} 
                        {...mod}
                        onClick={() => handleVideoClick(mod)}
                      />
                    ))}
                  </div>
                </motion.section>
              </>
            )}

            {activeTab === "progress" && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xl font-black text-[#002B24] tracking-tight mb-6">
                  Progression détaillée
                </h2>
                <div className="space-y-4">
                  {parcoursData.coursesInProgress.map((course: Course) => (
                    <div key={course.id} className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.instructor.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{course.progress}%</div>
                          <p className="text-sm text-gray-500">complété</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{course.completedModules} / {course.totalModules} modules</span>
                        <span>Temps estimé: {course.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === "achievements" && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xl font-black text-[#002B24] tracking-tight mb-6">
                  Certifications et achievements
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
            )}
          </div>

          {/* COLONNE DROITE */}
          <div className="lg:col-span-4 space-y-10">
            <motion.section variants={itemVariants} className="h-fit">
              <GlobalStatsChart {...parcoursData.globalStats} />
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

            {/* Banking Integration pour les cours premium */}
            {parcoursData.coursesInProgress.some((course: Course) => course.isPremium) && (
              <motion.section variants={itemVariants}>
                <BankingIntegration
                  courseId={parcoursData.coursesInProgress.find(c => c.isPremium)?.id || 0}
                  courseTitle={parcoursData.coursesInProgress.find(c => c.isPremium)?.title || ""}
                  isPremium={true}
                  price={parcoursData.coursesInProgress.find(c => c.isPremium)?.price || 0}
                  onPurchaseComplete={handlePurchaseComplete}
                  onEnrollmentComplete={handleEnrollmentComplete}
                />
              </motion.section>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
