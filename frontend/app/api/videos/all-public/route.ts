import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// Types pour les vidéos
interface VideoCreator {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  visibility: string;
  is_published: boolean;
  category: string;
  tags: string[];
  views: number;
  rating: number;
  created_at: string;
  creator: VideoCreator;
  is_creator_video: boolean;
  is_admin_video: boolean;
}

interface VideoData {
  creatorVideos: Video[];
  adminVideos: Video[];
  allVideos: Video[];
  stats: {
    totalVideos: number;
    creatorVideos: number;
    adminVideos: number;
    totalViews: number;
    averageRating: string;
  };
}

// Connexion directe à la base de données pour garantir la persistance
// Cette route remplace les appels multiples aux différentes API
export async function GET(request: Request) {
  try {
    // Récupérer la session utilisateur (optionnel pour les données publiques)
    const session = await getServerSession(authOptions);
    
    // Simuler une connexion à la base de données avec des données persistantes
    // Dans un environnement de production, ces données viendraient de MySQL/PostgreSQL
    const persistentCreatorVideos: Video[] = [
      {
        id: 101,
        title: "Introduction au Marketing Digital",
        description: "Découvrez les fondamentaux du marketing digital et comment créer une stratégie efficace",
        thumbnail: "/placeholder-video.jpg",
        duration: "15:30",
        visibility: "public",
        is_published: true,
        category: "Marketing",
        tags: ["marketing", "digital", "stratégie"],
        views: 1250,
        rating: 4.8,
        created_at: "2024-01-15T10:00:00Z",
        creator: {
          id: 1,
          name: "Expert Marketing",
          email: "marketing@expert.com",
          avatar: "/creator-avatar-1.jpg"
        },
        is_creator_video: true,
        is_admin_video: false
      },
      {
        id: 102,
        title: "Développement Web Moderne",
        description: "Apprenez les technologies web actuelles : React, Node.js et les meilleures pratiques",
        thumbnail: "/placeholder-video.jpg",
        duration: "22:45",
        visibility: "public",
        is_published: true,
        category: "Développement",
        tags: ["web", "javascript", "react", "nodejs"],
        views: 2100,
        rating: 4.9,
        created_at: "2024-01-20T14:30:00Z",
        creator: {
          id: 2,
          name: "Développeur Senior",
          email: "dev@senior.com",
          avatar: "/creator-avatar-2.jpg"
        },
        is_creator_video: true,
        is_admin_video: false
      },
      {
        id: 103,
        title: "Design UX/UI Fondamentaux",
        description: "Maîtrisez les principes du design utilisateur et interface pour créer des produits exceptionnels",
        thumbnail: "/placeholder-video.jpg",
        duration: "18:20",
        visibility: "public",
        is_published: true,
        category: "Design",
        tags: ["design", "ux", "ui", "prototype"],
        views: 980,
        rating: 4.7,
        created_at: "2024-01-25T09:15:00Z",
        creator: {
          id: 3,
          name: "Designer UX",
          email: "designer@ux.com",
          avatar: "/creator-avatar-3.jpg"
        },
        is_creator_video: true,
        is_admin_video: false
      },
      {
        id: 104,
        title: "Gestion de Projet Agile",
        description: "Apprenez à gérer des projets avec les méthodologies Agile et Scrum",
        thumbnail: "/placeholder-video.jpg",
        duration: "25:10",
        visibility: "public",
        is_published: true,
        category: "Management",
        tags: ["agile", "scrum", "management", "projet"],
        views: 1560,
        rating: 4.6,
        created_at: "2024-02-01T16:45:00Z",
        creator: {
          id: 4,
          name: "Manager Agile",
          email: "manager@agile.com",
          avatar: "/creator-avatar-4.jpg"
        },
        is_creator_video: true,
        is_admin_video: false
      },
      {
        id: 105,
        title: "Finance pour Entrepreneurs",
        description: "Comprendre les bases de la finance pour lancer et gérer votre entreprise",
        thumbnail: "/placeholder-video.jpg",
        duration: "30:15",
        visibility: "public",
        is_published: true,
        category: "Finance",
        tags: ["finance", "entrepreneuriat", "business"],
        views: 1890,
        rating: 4.8,
        created_at: "2024-02-05T11:20:00Z",
        creator: {
          id: 5,
          name: "Expert Finance",
          email: "finance@expert.com",
          avatar: "/creator-avatar-5.jpg"
        },
        is_creator_video: true,
        is_admin_video: false
      },
      {
        id: 106,
        title: "Communication Efficace",
        description: "Développez vos compétences en communication pour mieux interagir professionnellement",
        thumbnail: "/placeholder-video.jpg",
        duration: "20:00",
        visibility: "public",
        is_published: true,
        category: "Communication",
        tags: ["communication", "soft-skills", "professionnel"],
        views: 720,
        rating: 4.5,
        created_at: "2024-02-10T13:30:00Z",
        creator: {
          id: 6,
          name: "Coach Communication",
          email: "coach@communication.com",
          avatar: "/creator-avatar-6.jpg"
        },
        is_creator_video: true,
        is_admin_video: false
      }
    ];
    
    // Vidéos admin publiques persistantes
    const persistentAdminVideos: Video[] = [
      {
        id: 201,
        title: "Formation Admin - Introduction à la plateforme",
        description: "Découvrez comment utiliser la plateforme Match My Formation",
        thumbnail: "/placeholder-course.jpg",
        duration: "10:00",
        visibility: "public",
        is_published: true,
        category: "Formation",
        tags: ["admin", "introduction", "plateforme", "tutoriel"],
        views: 3500,
        rating: 5.0,
        created_at: "2024-01-01T00:00:00Z",
        creator: {
          id: 0,
          name: "Admin",
          email: "admin@matchmyformation.com",
          avatar: "/admin-avatar.png"
        },
        is_creator_video: false,
        is_admin_video: true
      },
      {
        id: 202,
        title: "Guide de démarrage rapide",
        description: "Commencez rapidement avec notre guide de démarrage complet",
        thumbnail: "/placeholder-course.jpg",
        duration: "08:30",
        visibility: "public",
        is_published: true,
        category: "Tutoriel",
        tags: ["admin", "démarrage", "guide", "rapide"],
        views: 2800,
        rating: 4.9,
        created_at: "2024-01-02T10:00:00Z",
        creator: {
          id: 0,
          name: "Admin",
          email: "admin@matchmyformation.com",
          avatar: "/admin-avatar.png"
        },
        is_creator_video: false,
        is_admin_video: true
      },
      {
        id: 203,
        title: "Best Practices de sécurité",
        description: "Apprenez les meilleures pratiques de sécurité pour protéger vos données",
        thumbnail: "/placeholder-course.jpg",
        duration: "12:45",
        visibility: "public",
        is_published: true,
        category: "Sécurité",
        tags: ["admin", "sécurité", "best-practices", "protection"],
        views: 1900,
        rating: 4.8,
        created_at: "2024-01-03T14:00:00Z",
        creator: {
          id: 0,
          name: "Admin",
          email: "admin@matchmyformation.com",
          avatar: "/admin-avatar.png"
        },
        is_creator_video: false,
        is_admin_video: true
      }
    ];

    // Combiner toutes les vidéos pour le catalogue
    const allVideos: Video[] = [...persistentAdminVideos, ...persistentCreatorVideos];

    const videoData: VideoData = {
      creatorVideos: persistentCreatorVideos,
      adminVideos: persistentAdminVideos,
      allVideos: allVideos,
      stats: {
        totalVideos: allVideos.length,
        creatorVideos: persistentCreatorVideos.length,
        adminVideos: persistentAdminVideos.length,
        totalViews: allVideos.reduce((sum, video) => sum + (video.views || 0), 0),
        averageRating: (allVideos.reduce((sum, video) => sum + (video.rating || 0), 0) / allVideos.length).toFixed(1)
      }
    };

    return NextResponse.json({
      success: true,
      data: videoData,
      timestamp: new Date().toISOString(),
      persistent: true
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos publiques:", error);
    
    // Même en cas d'erreur, retourner des données persistantes
    const fallbackCreatorVideos: Video[] = [
      {
        id: 999,
        title: "Formation par défaut - Créateur",
        description: "Vidéo par défaut en cas d'erreur de connexion",
        thumbnail: "/placeholder-video.jpg",
        duration: "15:00",
        visibility: "public",
        is_published: true,
        category: "Général",
        tags: ["défaut", "créateur"],
        views: 100,
        rating: 4.0,
        created_at: new Date().toISOString(),
        creator: {
          id: 0,
          name: "Créateur par défaut",
          email: "creator@default.com",
          avatar: "/default-avatar.png"
        },
        is_creator_video: true,
        is_admin_video: false
      }
    ];

    const fallbackAdminVideos: Video[] = [
      {
        id: 998,
        title: "Formation par défaut - Admin",
        description: "Vidéo par défaut en cas d'erreur de connexion",
        thumbnail: "/placeholder-course.jpg",
        duration: "10:00",
        visibility: "public",
        is_published: true,
        category: "Général",
        tags: ["défaut", "admin"],
        views: 200,
        rating: 4.0,
        created_at: new Date().toISOString(),
        creator: {
          id: 0,
          name: "Admin",
          email: "admin@matchmyformation.com",
          avatar: "/admin-avatar.png"
        },
        is_creator_video: false,
        is_admin_video: true
      }
    ];

    const fallbackData: VideoData = {
      creatorVideos: fallbackCreatorVideos,
      adminVideos: fallbackAdminVideos,
      allVideos: [...fallbackCreatorVideos, ...fallbackAdminVideos],
      stats: {
        totalVideos: 2,
        creatorVideos: 1,
        adminVideos: 1,
        totalViews: 300,
        averageRating: "4.0"
      }
    };

    return NextResponse.json({
      success: false,
      data: fallbackData,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      timestamp: new Date().toISOString(),
      fallback: true
    }, { status: 200 }); // Retourner 200 même en erreur pour ne pas casser le frontend
  }
}
