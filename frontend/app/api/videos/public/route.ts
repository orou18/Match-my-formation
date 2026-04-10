import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api/backend-fetch";

// Fonction helper pour lire le JSON store
async function readJsonStore(key: string, defaultValue: any = []) {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', `${key}.json`);
    
    // Créer le dossier data s'il n'existe pas
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Lire le fichier
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner la valeur par défaut
    return defaultValue;
  }
}

// Fonction pour normaliser les données vidéo
function normalizeVideoData(videos: any[]): any[] {
  return videos.map(video => ({
    id: video.id,
    title: video.title || "Titre non disponible",
    description: video.description || "Description non disponible",
    thumbnail: video.thumbnail || video.image || "/placeholder-video.jpg",
    duration: video.duration || "00:00",
    views: video.views || video.students_count || 0,
    likes: video.likes || Math.floor((video.students_count || 0) * 0.8),
    rating: video.rating || 4.0,
    creator: {
      id: video.creator?.id || 0,
      name: video.creator?.name || "Anonyme",
      email: video.creator?.email || "anonymous@example.com",
      avatar: video.creator?.avatar || "/default-avatar.png"
    },
    category: video.category || "Général",
    tags: Array.isArray(video.tags) ? video.tags : [],
    video_url: video.video_url || "",
    is_published: video.is_published ?? true,
    visibility: video.visibility || "public",
    created_at: video.created_at || new Date().toISOString(),
    updated_at: video.updated_at || video.created_at || new Date().toISOString(),
    resources: Array.isArray(video.resources) ? video.resources : [],
    is_free: video.is_free ?? true,
    price: video.price || 0,
    comments: Array.isArray(video.comments) ? video.comments : [],
    students_count: video.students_count || video.views || 0,
    source: video.source || "general"
  }));
}

export async function GET() {
  try {
    // Récupérer toutes les vidéos depuis différentes sources
    const [adminVideos, creatorVideos, videos, studentVideos] = await Promise.all([
      readJsonStore("admin-videos", []),
      readJsonStore("creator-videos", []),
      readJsonStore("videos", []),
      readJsonStore("student-videos", [])
    ]);

    // Combiner toutes les vidéos
    const allVideos = [
      ...adminVideos.map((video: any) => ({ ...video, source: "admin" })),
      ...creatorVideos.map((video: any) => ({ ...video, source: "creator" })),
      ...videos.map((video: any) => ({ ...video, source: "general" })),
      ...studentVideos.map((video: any) => ({ ...video, source: "student" }))
    ];

    // Filtrer uniquement les vidéos publiques et publiées
    const publicVideos = allVideos.filter(video => 
      video.visibility === "public" && 
      video.is_published === true &&
      video.video_url // S'assurer que l'URL de la vidéo existe
    );

    // Normaliser les données pour le frontend
    const normalizedVideos = normalizeVideoData(publicVideos);

    // Trier par date de création (plus récent d'abord)
    normalizedVideos.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      data: normalizedVideos,
      count: normalizedVideos.length,
      sources: {
        admin: adminVideos.filter((v: any) => v.visibility === "public" && v.is_published).length,
        creator: creatorVideos.filter((v: any) => v.visibility === "public" && v.is_published).length,
        general: videos.filter((v: any) => v.visibility === "public" && v.is_published).length,
        student: studentVideos.filter((v: any) => v.visibility === "public" && v.is_published).length
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos publiques:", error);
    
    // En cas d'erreur, retourner des données de démonstration
    const fallbackVideos = [
      {
        id: 1,
        title: "Introduction au Marketing Digital",
        description: "Découvrez les fondamentaux du marketing digital",
        thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        duration: "15:30",
        views: 1234,
        likes: 89,
        rating: 4.5,
        creator: {
          id: 0,
          name: "Administrateur",
          email: "admin@matchmyformation.com",
          avatar: "/admin-avatar.png"
        },
        category: "marketing",
        tags: ["marketing", "digital", "stratégie"],
        video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        is_published: true,
        visibility: "public",
        created_at: "2024-01-15T10:30:00.000Z",
        updated_at: "2024-01-15T10:30:00.000Z",
        resources: [],
        is_free: true,
        price: 0,
        comments: [],
        source: "admin"
      },
      {
        id: 2,
        title: "Développement Web avec React",
        description: "Apprenez à créer des applications web modernes avec React",
        thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        duration: "22:45",
        views: 2156,
        likes: 167,
        rating: 4.8,
        creator: {
          id: 1,
          name: "Jean Dupont",
          email: "jean.dupont@email.com",
          avatar: "/creator-avatar-1.jpg"
        },
        category: "development",
        tags: ["react", "javascript", "web"],
        video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        is_published: true,
        visibility: "public",
        created_at: "2024-01-14T14:20:00.000Z",
        updated_at: "2024-01-14T14:20:00.000Z",
        resources: [],
        is_free: true,
        price: 0,
        comments: [],
        source: "creator"
      }
    ];

    return NextResponse.json({
      success: true,
      data: fallbackVideos,
      count: fallbackVideos.length,
      sources: { admin: 1, creator: 1, general: 0, student: 0 },
      fallback: true
    });
  }
}
