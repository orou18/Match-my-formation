import { NextRequest, NextResponse } from "next/server";
import { fetchPublicVideosPayload } from "@/lib/api/public-videos-proxy";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";
import { videosStore } from "@/lib/store/videos-store";

export async function GET(request: NextRequest) {
  try {
    // Essayer de récupérer les vidéos depuis le backend
    let backendVideos = null;
    let backendStatus = 200;
    
    try {
      const response = await laravelFetch("/api/videos/public", { request });
      const data = await parseLaravelJson(response);
      
      if (response.ok && data?.success) {
        backendVideos = data.videos || [];
        backendStatus = response.status;
      }
    } catch (backendError) {
      console.warn("Backend non accessible pour les vidéos publiques, utilisation du store local:", backendError);
    }

    // Si le backend a répondu avec succès, retourner sa réponse
    if (backendVideos && backendVideos.length > 0) {
      return NextResponse.json({ 
        videos: backendVideos, 
        total: backendVideos.length 
      }, { status: backendStatus });
    }

    // Sinon, utiliser le store local pour les vidéos publiques
    try {
      const publicVideos = await videosStore.getPublicVideos();
      
      if (publicVideos && publicVideos.length > 0) {
        return NextResponse.json({ 
          videos: publicVideos, 
          total: publicVideos.length 
        }, { status: 200 });
      }
    } catch (storeError) {
      console.warn("Store local inaccessible, utilisation du fallback:", storeError);
    }

    // En dernier recours, utiliser le proxy existant avec fallback amélioré
    const { response, body } = await fetchPublicVideosPayload();
    
    // Ajouter des vidéos de fallback si aucune vidéo n'est trouvée
    const videos = Array.isArray(body?.videos) ? body.videos : [];
    
    if (videos.length === 0) {
      // Vidéos de fallback pour la section pépites
      const fallbackVideos = [
        {
          id: 1,
          title: "Introduction au Marketing Digital",
          description: "Découvrez les bases du marketing digital et transformez votre stratégie",
          thumbnail: "/videos/video1-thumb.jpg",
          video_url: "/videos/video1.mp4",
          duration: "15:30",
          views: 1250,
          likes: 89,
          students_count: 3420,
          rating: 4.8,
          tags: ["marketing", "digital", "base"],
          category: "marketing",
          difficulty_level: "beginner",
          language: "fr",
          is_free: true,
          price: 0,
          created_at: "2024-01-15T10:30:00Z",
          creator: {
            id: 1,
            name: "Expert Marketing",
            avatar: "/avatars/default-creator.jpg"
          }
        },
        {
          id: 2,
          title: "Techniques de Vente Avancées",
          description: "Maîtrisez les techniques de vente modernes pour augmenter vos conversions",
          thumbnail: "/videos/video2-thumb.jpg",
          video_url: "/videos/video2.mp4",
          duration: "22:15",
          views: 980,
          likes: 67,
          students_count: 2890,
          rating: 4.6,
          tags: ["vente", "techniques", "avancé"],
          category: "sales",
          difficulty_level: "intermediate",
          language: "fr",
          is_free: true,
          price: 0,
          created_at: "2024-01-14T14:20:00Z",
          creator: {
            id: 2,
            name: "Expert Commercial",
            avatar: "/avatars/default-creator.jpg"
          }
        },
        {
          id: 3,
          title: "Gestion de la Relation Client",
          description: "Apprenez à fidéliser vos clients et à gérer efficacement la relation client",
          thumbnail: "/videos/video1-thumb.jpg",
          video_url: "/videos/video1.mp4",
          duration: "18:45",
          views: 756,
          likes: 45,
          students_count: 2156,
          rating: 4.7,
          tags: ["client", "relation", "fidélisation"],
          category: "customer-service",
          difficulty_level: "intermediate",
          language: "fr",
          is_free: true,
          price: 0,
          created_at: "2024-01-13T09:15:00Z",
          creator: {
            id: 3,
            name: "Expert Service Client",
            avatar: "/avatars/default-creator.jpg"
          }
        }
      ];
      
      return NextResponse.json({ 
        videos: fallbackVideos, 
        total: fallbackVideos.length 
      }, { status: 200 });
    }
    
    return NextResponse.json(body, { status: response.status });
    
  } catch (error) {
    console.error("STUDENT VIDEOS - Erreur:", error);
    return NextResponse.json({ 
      error: "Erreur serveur",
      videos: [],
      total: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Cette route legacy est en lecture seule." },
    { status: 405 }
  );
}
