import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import PartnersSection from "@/components/landing/PartnersSection";
import WhyUs from "@/components/landing/WhyUs";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import VideoGrid from "@/components/videos/VideoGrid";

export default function HomePage() {
  // Mock data for demonstration
  const recentVideos = [
    {
      id: "1",
      title: "Introduction au Tourisme Durable",
      description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables dans l'industrie.",
      thumbnail: "/videos/video1-thumb.jpg",
      duration: "12:34",
      views: 15420,
      likes: 892,
      creator: "Marie Dubois",
      publishedAt: "Il y a 2 jours",
      category: "Tourisme"
    },
    {
      id: "2",
      title: "Gestion Hôtelière Avancée",
      description: "Techniques de management et stratégies pour l'hôtellerie de luxe.",
      thumbnail: "/videos/video2-thumb.jpg",
      duration: "18:22",
      views: 8750,
      likes: 567,
      creator: "Jean Martin",
      publishedAt: "Il y a 5 jours",
      category: "Hôtellerie"
    },
    {
      id: "3",
      title: "Marketing Digital pour le Tourisme",
      description: "Stratégies digitales et marketing pour les professionnels du secteur touristique.",
      thumbnail: "/videos/video3-thumb.jpg",
      duration: "15:45",
      views: 6230,
      likes: 445,
      creator: "Alice Bernard",
      publishedAt: "Il y a 1 semaine",
      category: "Marketing"
    },
    {
      id: "4",
      title: "Service Client d'Excellence",
      description: "Les meilleures pratiques du service client dans l'hôtellerie et le tourisme.",
      thumbnail: "/videos/video4-thumb.jpg",
      duration: "22:10",
      views: 9870,
      likes: 723,
      creator: "Thomas Petit",
      publishedAt: "Il y a 3 jours",
      category: "Service Client"
    }
  ];

  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      
      {/* Recent Videos Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vidéos Récentes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les dernières vidéos publiées par nos créateurs experts
            </p>
          </div>
          
          <VideoGrid 
            videos={recentVideos}
            variant="featured"
            maxVideos={4}
          />
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Voir toutes les vidéos
            </button>
          </div>
        </div>
      </section>
      
      <PartnersSection />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
    </>
  );
}
