import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    // Cet endpoint est PUBLIC - pas besoin d'authentification
    // Il retourne uniquement les vidéos créateurs PUBLIQUES

    // Appeler l'API Laravel pour récupérer les vidéos créateurs publiques
    const response = await laravelFetch("/api/creator/videos-public", {
      request,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
      // Filtrer uniquement les vidéos publiques
      const publicVideos = Array.isArray(data?.videos)
        ? data.videos
            .filter(
              (video: any) =>
                video.visibility === "public" &&
                (video.is_published === true || video.status === "published")
            )
            .slice(0, 6) // Limiter à 6 vidéos pour la section pépites
        : Array.isArray(data?.data)
          ? data.data
              .filter(
                (video: any) =>
                  video.visibility === "public" &&
                  (video.is_published === true || video.status === "published")
              )
              .slice(0, 6)
          : [];

      return NextResponse.json({
        success: true,
        data: publicVideos,
      });
    } else {
      // En cas d'erreur, retourner des données de démonstration
      const demoVideos = [
        {
          id: 1,
          title: "Introduction au Marketing Digital",
          description: "Découvrez les bases du marketing digital",
          thumbnail: "/placeholder-video.jpg",
          duration: "15:30",
          visibility: "public",
          is_published: true,
          creator_name: "Expert Marketing",
          category: "Marketing",
          tags: ["marketing", "digital", "stratégie"],
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Développement Web Moderne",
          description: "Apprenez les technologies web actuelles",
          thumbnail: "/placeholder-video.jpg",
          duration: "22:45",
          visibility: "public",
          is_published: true,
          creator_name: "Développeur Senior",
          category: "Développement",
          tags: ["web", "javascript", "react"],
          created_at: new Date().toISOString(),
        },
      ];

      return NextResponse.json({
        success: true,
        data: demoVideos,
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos créateurs publiques:",
      error
    );

    // Retourner des données de démonstration en cas d'erreur
    const demoVideos = [
      {
        id: 1,
        title: "Introduction au Marketing Digital",
        description: "Découvrez les bases du marketing digital",
        thumbnail: "/placeholder-video.jpg",
        duration: "15:30",
        visibility: "public",
        is_published: true,
        creator_name: "Expert Marketing",
        category: "Marketing",
        tags: ["marketing", "digital", "stratégie"],
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: demoVideos,
    });
  }
}
