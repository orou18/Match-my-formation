"use client";

import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import PartnersSection from "@/components/landing/PartnersSection";
import WhyUs from "@/components/landing/WhyUs";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import VideoGrid from "@/components/videos/VideoGrid";
import VideoCard from "@/components/video/VideoCard";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function HomePage() {
  const params = useParams();
  const locale = params.locale || "fr";

  // Mock data pour les 6 cours mieux notés
  const topRatedVideos = [
    {
      id: 1,
      title: "Introduction au Tourisme Durable",
      description:
        "Découvrez les fondamentaux du tourisme écologique et les pratiques durables dans l'industrie.",
      thumbnail: "/videos/video1-thumb.jpg",
      video_url: "/videos/video1.mp4",
      duration: "12:34",
      order: 1,
      creator_id: 1,
      views: 15420,
      likes: 892,
      comments: [],
      tags: ["tourisme", "durable", "ecologie"],
      is_published: true,
      visibility: "public" as const,
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
      publishedAt: "Il y a 2 jours",
      creator: {
        id: 1,
        name: "Dr. Marie Laurent",
        email: "marie.laurent@example.com",
        avatar: "/avatars/creator1.jpg",
        specialty: "Tourisme Durable & Environnement",
      },
      learning_objectives: [
        {
          id: 1,
          video_id: 1,
          title: "Comprendre les principes du tourisme durable",
          description:
            "Maîtriser les concepts fondamentaux du tourisme durable",
          order: 1,
        },
      ],
      resources: [
        {
          id: 1,
          video_id: 1,
          name: "Guide pratique du tourisme durable",
          file_path: "/resources/guide-tourisme-durable.pdf",
          file_size: 2048000,
          file_type: "application/pdf",
          description: "Un guide complet avec les meilleures pratiques",
          created_at: "2024-01-15",
        },
      ],
      is_free: true,
      rating: 4.9,
    },
    {
      id: 2,
      title: "Gestion Hôtelière Avancée",
      description:
        "Techniques de management et stratégies pour l'hôtellerie de luxe.",
      thumbnail: "/videos/video2-thumb.jpg",
      video_url: "/videos/video2.mp4",
      duration: "18:22",
      order: 1,
      creator_id: 2,
      views: 8750,
      likes: 567,
      comments: [],
      tags: ["hotellerie", "management", "luxe"],
      is_published: true,
      visibility: "public" as const,
      created_at: "2024-01-10",
      updated_at: "2024-01-10",
      publishedAt: "Il y a 5 jours",
      creator: {
        id: 2,
        name: "Sophie Martin",
        email: "sophie.martin@example.com",
        avatar: "/avatars/creator2.jpg",
        specialty: "Management Hôtelier",
      },
      learning_objectives: [
        {
          id: 2,
          video_id: 2,
          title: "Maîtriser les opérations hôtelières",
          description: "Comprendre et gérer tous les aspects opérationnels",
          order: 1,
        },
      ],
      resources: [
        {
          id: 2,
          video_id: 2,
          name: "Check-list gestion hôtelière",
          file_path: "/resources/checklist-hotel.xlsx",
          file_size: 512000,
          file_type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          description: "Template complet pour la gestion quotidienne",
          created_at: "2024-01-10",
        },
      ],
      is_free: false,
      price: 49,
      rating: 4.8,
    },
    {
      id: 3,
      title: "Marketing Digital Touristique",
      description:
        "Stratégies digitales et marketing pour les professionnels du secteur touristique.",
      thumbnail: "/videos/video1-thumb.jpg",
      video_url: "/videos/video3.mp4",
      duration: "15:45",
      order: 1,
      creator_id: 3,
      views: 6230,
      likes: 445,
      comments: [],
      tags: ["marketing", "digital", "tourisme"],
      is_published: true,
      visibility: "public" as const,
      created_at: "2024-01-05",
      updated_at: "2024-01-05",
      publishedAt: "Il y a 1 semaine",
      creator: {
        id: 3,
        name: "Julie Bernard",
        email: "julie.bernard@example.com",
        avatar: "/avatars/creator3.jpg",
        specialty: "Marketing Digital",
      },
      learning_objectives: [
        {
          id: 3,
          video_id: 3,
          title: "Développer une stratégie digitale",
          description:
            "Créer et mettre en œuvre une stratégie digitale efficace",
          order: 1,
        },
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
          created_at: "2024-01-05",
        },
      ],
      is_free: true,
      rating: 4.7,
    },
    {
      id: 4,
      title: "Revenue Management Avancé",
      description:
        "Techniques avancées d'optimisation des revenus dans l'hôtellerie.",
      thumbnail: "/videos/video1-thumb.jpg",
      video_url: "/videos/video4.mp4",
      duration: "22:15",
      order: 1,
      creator_id: 4,
      views: 4890,
      likes: 334,
      comments: [],
      tags: ["revenue", "management", "pricing"],
      is_published: true,
      visibility: "public" as const,
      created_at: "2023-12-28",
      updated_at: "2023-12-28",
      publishedAt: "Il y a 2 semaines",
      creator: {
        id: 4,
        name: "Thomas Dubois",
        email: "thomas.dubois@example.com",
        avatar: "/avatars/creator4.jpg",
        specialty: "Revenue Management",
      },
      learning_objectives: [
        {
          id: 4,
          video_id: 4,
          title: "Optimiser les revenus",
          description: "Maîtriser les techniques de pricing et d'optimisation",
          order: 1,
        },
      ],
      resources: [
        {
          id: 4,
          video_id: 4,
          name: "Calculateur ROI",
          file_path: "/resources/calculateur-roi.xlsx",
          file_size: 256000,
          file_type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          description: "Outil de calcul du retour sur investissement",
          created_at: "2023-12-28",
        },
      ],
      is_free: false,
      price: 79,
      rating: 4.8,
    },
    {
      id: 5,
      title: "Service Client Excellence",
      description:
        "Maîtrisez les techniques du service client de luxe dans l'hôtellerie.",
      thumbnail: "/videos/video2-thumb.jpg",
      video_url: "/videos/video5.mp4",
      duration: "16:30",
      order: 1,
      creator_id: 5,
      views: 6780,
      likes: 512,
      comments: [],
      tags: ["service", "client", "luxe"],
      is_published: true,
      visibility: "public" as const,
      created_at: "2024-01-08",
      updated_at: "2024-01-08",
      publishedAt: "Il y a 3 jours",
      creator: {
        id: 5,
        name: "Claire Rousseau",
        email: "claire.rousseau@example.com",
        avatar: "/avatars/creator5.jpg",
        specialty: "Service Client",
      },
      learning_objectives: [
        {
          id: 5,
          video_id: 5,
          title: "Excellence du service client",
          description: "Développer un service client exceptionnel",
          order: 1,
        },
      ],
      resources: [
        {
          id: 5,
          video_id: 5,
          name: "Protocoles service client",
          file_path: "/resources/protocoles-service.pdf",
          file_size: 1536000,
          file_type: "application/pdf",
          description: "Protocoles détaillés pour le service client",
          created_at: "2024-01-08",
        },
      ],
      is_free: true,
      rating: 4.9,
    },
    {
      id: 6,
      title: "Digitalisation Hôtelière",
      description:
        "Transformez votre établissement hôtelier avec les dernières technologies digitales.",
      thumbnail: "/videos/video1-thumb.jpg",
      video_url: "/videos/video6.mp4",
      duration: "19:45",
      order: 1,
      creator_id: 6,
      views: 5430,
      likes: 389,
      comments: [],
      tags: ["digital", "technologie", "hotellerie"],
      is_published: true,
      visibility: "public" as const,
      created_at: "2024-01-06",
      updated_at: "2024-01-06",
      publishedAt: "Il y a 4 jours",
      creator: {
        id: 6,
        name: "Pierre Lefebvre",
        email: "pierre.lefebvre@example.com",
        avatar: "/avatars/creator6.jpg",
        specialty: "Digitalisation",
      },
      learning_objectives: [
        {
          id: 6,
          video_id: 6,
          title: "Transformation digitale",
          description: "Mettre en œuvre les technologies digitales",
          order: 1,
        },
      ],
      resources: [
        {
          id: 6,
          video_id: 6,
          name: "Guide digitalisation",
          file_path: "/resources/guide-digitalisation.pdf",
          file_size: 2560000,
          file_type: "application/pdf",
          description: "Guide complet de la transformation digitale",
          created_at: "2024-01-06",
        },
      ],
      is_free: false,
      price: 69,
      rating: 4.6,
    },
  ];

  return (
    <>
      <HeroSection />
      <FeaturedCourses />

      {/* Top Rated Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les 6 Cours Mieux Notés
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les formations les plus appréciées par nos étudiants,
              créées par des experts de l'industrie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRatedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#002B24] text-white rounded-xl font-semibold hover:bg-[#003d34] transition-colors"
            >
              Voir toutes les formations
            </Link>
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
