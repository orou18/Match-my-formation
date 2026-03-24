"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import StudentHero from "@/components/dashboard/StudentHero";
import CategoryFilters from "@/components/dashboard/CategoryFilters";
import FeaturedGrid from "@/components/dashboard/FeaturedGrid";
import VideoCard from "@/components/video/VideoCard";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
import Image from "next/image";
import { Star, Users, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import UserIdManager from "@/lib/user-id-manager";

interface CreatorCourse {
  id: number;
  title: string;
  image: string;
  students: number;
  rating: number;
  creator: {
    name: string;
    logo: string;
    specialty: string;
  };
}

export default function StudentDashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Données de test cohérentes avec UserIdManager
  const mockUser = {
    id: UserIdManager.getCurrentUserId() || 3,
    name: "Alice Élève",
    email: "student@match.com",
    role: "student"
  };

  const mockVideos = [
    {
      id: 1,
      title: "Introduction au Tourisme Durable",
      description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables.",
      thumbnail: "/videos/video1-thumb.jpg",
      duration: "12:34",
      views: 15420,
      likes: 892,
      comments: 45,
      publishedAt: "Il y a 2 jours",
      visibility: "public",
      status: "published",
      creator: {
        id: 1,
        name: "Dr. Marie Laurent",
        email: "marie.laurent@example.com",
        avatar: "/avatars/creator1.jpg",
        specialty: "Tourisme Durable & Environnement"
      },
      learning_objectives: [
        {
          id: 1,
          video_id: 1,
          title: "Comprendre les principes du tourisme durable",
          description: "Maîtriser les concepts fondamentaux et les 3 piliers du développement durable appliqués au tourisme",
          order: 1
        },
        {
          id: 2,
          video_id: 1,
          title: "Analyser l'impact environnemental",
          description: "Évaluer et mesurer l'empreinte écologique des activités touristiques",
          order: 2
        }
      ],
      resources: [
        {
          id: 1,
          video_id: 1,
          name: "Guide pratique du tourisme durable",
          file_path: "/resources/guide-tourisme-durable.pdf",
          file_size: 2048000,
          file_type: "application/pdf",
          description: "Un guide complet avec les meilleures pratiques et check-lists",
          created_at: "2024-01-15"
        }
      ],
      is_free: true,
      tags: ["tourisme", "durable", "ecologie"]
    },
    {
      id: 2,
      title: "Gestion Hôtelière Avancée - Module 1",
      description: "Première partie de notre formation complète en gestion hôtelière.",
      thumbnail: "/videos/video2-thumb.jpg",
      duration: "18:22",
      views: 8750,
      likes: 567,
      comments: 23,
      publishedAt: "Il y a 5 jours",
      visibility: "public",
      status: "published",
      pathway: "Certificat Hôtellerie",
      creator: {
        id: 2,
        name: "Sophie Martin",
        email: "sophie.martin@example.com",
        avatar: "/avatars/creator2.jpg",
        specialty: "Management Hôtelier"
      },
      learning_objectives: [
        {
          id: 3,
          video_id: 2,
          title: "Maîtriser les opérations hôtelières",
          description: "Comprendre et gérer tous les aspects opérationnels d'un établissement hôtelier",
          order: 1
        }
      ],
      resources: [
        {
          id: 2,
          video_id: 2,
          name: "Check-list gestion hôtelière",
          file_path: "/resources/checklist-hotel.xlsx",
          file_size: 512000,
          file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          description: "Template complet pour la gestion quotidienne",
          created_at: "2024-01-10"
        }
      ],
      is_free: false,
      price: 49,
      tags: ["hotellerie", "management", "luxe"]
    },
    {
      id: 3,
      title: "Marketing Digital Touristique",
      description: "Stratégies de marketing digital appliquées au secteur touristique.",
      thumbnail: "/videos/video3-thumb.jpg",
      duration: "15:45",
      views: 6230,
      likes: 445,
      comments: 18,
      publishedAt: "Il y a 1 semaine",
      visibility: "public",
      status: "published",
      creator: {
        id: 3,
        name: "Julie Bernard",
        email: "julie.bernard@example.com",
        avatar: "/avatars/creator3.jpg",
        specialty: "Marketing Digital"
      },
      learning_objectives: [
        {
          id: 4,
          video_id: 3,
          title: "Développer une stratégie digitale",
          description: "Créer et mettre en œuvre une stratégie de marketing digital efficace",
          order: 1
        }
      ],
      resources: [
        {
          id: 3,
          video_id: 3,
          name: "Template stratégie marketing",
          file_path: "/resources/template-marketing.pdf",
          file_size: 1024000,
          file_type: "application/pdf",
          description: "Guide stratégique complet avec exemples",
          created_at: "2024-01-05"
        }
      ],
      is_free: true,
      tags: ["marketing", "digital", "tourisme"]
    },
    {
      id: 4,
      title: "Revenue Management Avancé",
      description: "Techniques avancées d'optimisation des revenus dans l'hôtellerie.",
      thumbnail: "/videos/video4-thumb.jpg",
      duration: "22:15",
      views: 4890,
      likes: 334,
      comments: 12,
      publishedAt: "Il y a 2 semaines",
      visibility: "public",
      status: "published",
      creator: {
        id: 4,
        name: "Thomas Dubois",
        email: "thomas.dubois@example.com",
        avatar: "/avatars/creator4.jpg",
        specialty: "Revenue Management"
      },
      learning_objectives: [
        {
          id: 5,
          video_id: 4,
          title: "Optimiser les revenus",
          description: "Maîtriser les techniques de pricing et d'optimisation des revenus",
          order: 1
        }
      ],
      resources: [
        {
          id: 4,
          video_id: 4,
          name: "Calculateur ROI",
          file_path: "/resources/calculateur-roi.xlsx",
          file_size: 256000,
          file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          description: "Outil de calcul du retour sur investissement",
          created_at: "2023-12-28"
        }
      ],
      is_free: false,
      price: 79,
      tags: ["revenue", "management", "pricing"]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Vérifier l'authentification avec UserIdManager
      if (!UserIdManager.isAuthenticated()) {
        window.location.href = `/${locale}/login`;
        return;
      }

      // Récupérer les données utilisateur stockées
      const storedUserData = UserIdManager.getStoredUserData();
      
      if (storedUserData && storedUserData.role === 'student') {
        setUser(storedUserData);
      } else {
        setUser(mockUser);
      }
      
      setVideos(mockVideos);
      setLoading(false);
      
      /* Commenté temporairement pour éviter les erreurs de connexion
      if (!token) {
        // Redirection forcée si pas de token
        window.location.href = `/${locale}/login`;
        return;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const baseUrl = apiBase.replace(/\/$/, "");

      try {
        // 1. Récupérer le profil utilisateur
        const userRes = await fetch(`${baseUrl}/api/me`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        if (!userRes.ok) {
          if (userRes.status === 401) {
            localStorage.removeItem("token");
            window.location.href = `/${locale}/login`;
            return;
          }
          throw new Error("Impossible de charger votre profil.");
        }
        
        const userData = await userRes.json();
        setUser(userData);

        // 2. Récupérer les cours
        const videoRes = await fetch(`${baseUrl}/api/student/courses`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          // On s'assure que videoData est bien un tableau
          setVideos(Array.isArray(videoData) ? videoData : []);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Connexion au serveur perdue. Vérifiez que votre backend est lancé.");
      } finally {
        setLoading(false);
      }
      */
    };

    fetchData();
  }, [locale]); // On ne dépend que du locale pour éviter les boucles infinies de useEffect

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const creatorCourses: CreatorCourse[] = [
    {
      id: 101,
      title: "Secrets du Management de Luxe",
      image: "/guide1.jpg",
      students: 1250,
      rating: 4.9,
      creator: { name: "Sofitel Académie", logo: "/sofitel-logo.png", specialty: "Hôtellerie de Luxe" },
    },
    {
      id: 102,
      title: "Art de la Table Panafricaine",
      image: "/guide1.jpg",
      students: 850,
      rating: 4.8,
      creator: { name: "Chef Azuma", logo: "/chef-logo.png", specialty: "Gastronomie" },
    },
    {
      id: 103,
      title: "Design d'Espaces Touristiques",
      image: "/guide2.jpg",
      students: 2100,
      rating: 4.7,
      creator: { name: "ArchiDesign Studio", logo: "/archi-logo.png", specialty: "Architecture" },
    },
    {
        id: 104,
        title: "Innovation & Spa Wellness",
        image: "/guide1.jpg",
        students: 540,
        rating: 4.9,
        creator: { name: "Spa Academy", logo: "/logo.png", specialty: "Wellness" },
      }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB]">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-gray-600 font-medium text-sm tracking-[0.1em]">Accès à l'académie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] p-6 text-center">
        <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 max-w-md shadow-2xl shadow-red-500/5">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#002B24] mb-2">Erreur de liaison</h2>
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
      <StudentHero user={user} />

      <main className="container mx-auto px-4 md:px-8 py-10">
        <FeaturedGrid />

        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-[#002B24] tracking-tight">Catalogue des formations</h2>
              <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-[0.15em]">Explorez l'excellence académique</p>
            </div>
            <CategoryFilters />
          </div>

          {videos.length > 0 ? (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {videos.map((video) => (
                <motion.div variants={itemVariants} key={video.id}>
                    <VideoCard video={video} />
                </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <span className="text-xs text-gray-500">Aucune formation disponible pour le moment</span>
            </div>
          )}
          
          <div className="flex justify-center mt-12">
            <LoadMoreButton />
          </div>
        </section>
      </main>

      {/* --- SECTION EXPERTS --- */}
      <section className="mt-4 mb-16 bg-[#002B24] py-12 relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="max-w-xl">
              <span className="text-primary text-[9px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Elite Experts</span>
              <h2 className="text-xl font-bold text-white mt-3 leading-tight">
                Pépites de nos <span className="italic text-primary font-serif">experts</span>
              </h2>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => scroll("left")} className="p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-[#002B24] transition-all active:scale-90">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => scroll("right")} className="p-3 rounded-full bg-primary text-[#002B24] hover:bg-white transition-all active:scale-90 shadow-lg shadow-primary/20">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 relative z-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {creatorCourses.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -5 }}
                className="snap-start shrink-0 w-[80vw] md:w-[320px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 hover:bg-white/10 transition-all group"
              >
                <div className="relative h-44 w-full rounded-[1.8rem] overflow-hidden mb-5">
                  <Image src={item.image} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                  <div className="absolute top-3 left-3 bg-white p-2 rounded-xl shadow-lg">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-black text-[#002B24] text-[8px] uppercase">
                      {item.creator.name.substring(0, 3)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-white">
                  <p className="text-primary text-[9px] font-black uppercase tracking-wider">{item.creator.name}</p>
                  <h4 className="text-base font-semibold leading-tight min-h-[44px] line-clamp-2">{item.title}</h4>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Users size={14} className="text-primary" />
                      <span>{item.students.toLocaleString()} élèves</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 font-semibold text-xs bg-orange-400/5 px-2 py-0.5 rounded-md">
                      <Star size={12} fill="currentColor" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <button className="w-full py-3.5 bg-white text-[#002B24] rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all active:scale-[0.97]">
                    Découvrir
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 pb-20">
        <PremiumBanner />
      </main>
    </div>
  );
}
