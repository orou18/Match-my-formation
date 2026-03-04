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
  
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push(`/${params.locale}/login`);
        return;
      }

      // On force l'usage de localhost si la variable d'env fait défaut
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const baseUrl = apiBase.replace(/\/$/, "");

      try {
        const userRes = await fetch(`${baseUrl}/api/me`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          mode: 'cors' 
        });

        if (!userRes.ok) {
          if (userRes.status === 401) {
            localStorage.removeItem("token");
            router.push(`/${params.locale}/login`);
            return;
          }
          throw new Error("Erreur profil");
        }
        
        const userData = await userRes.json();
        setUser(userData);

        // Appel des vidéos
        const videoRes = await fetch(`${baseUrl}/api/videos`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          setVideos(videoData);
        }
      } catch (err) {
        console.error("Bug réseau dashboard:", err);
        setError("Le serveur Laravel est injoignable sur localhost:8000");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.locale, router]);

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
      image: "/guide3.jpg",
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
        image: "/guide3.jpg",
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
        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Initialisation du dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-black text-[#002B24] mb-2">Oups !</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-[#002B24] text-white rounded-xl font-bold">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] overflow-x-hidden font-sans">
      <StudentHero user={user} />

      <main className="container mx-auto px-4 md:px-8 py-10">
        <FeaturedGrid />

        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-[#002B24] tracking-tight">Catalogue des formations</h2>
              <p className="text-gray-400 mt-2 font-medium uppercase text-[10px] tracking-[0.2em]">Explorez l'excellence académique</p>
            </div>
            <CategoryFilters />
          </div>

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
          
          <div className="flex justify-center mt-12">
            <LoadMoreButton />
          </div>
        </section>
      </main>

      <section className="mt-4 mb-16 bg-[#002B24] py-12 relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="max-w-xl">
              <span className="text-primary text-[9px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Elite Experts</span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-3 leading-tight">
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
                  <h4 className="text-lg font-bold leading-tight min-h-[44px] line-clamp-2">{item.title}</h4>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/50 text-[11px]">
                      <Users size={14} className="text-primary" />
                      <span>{item.students.toLocaleString()} élèves</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 font-bold text-[11px] bg-orange-400/5 px-2 py-0.5 rounded-md">
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