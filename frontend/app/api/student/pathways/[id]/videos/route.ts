import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer la session de l'utilisateur
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier si c'est un employé
    if (session.user.role !== "employee") {
      return NextResponse.json(
        { success: false, message: "Accès réservé aux employés" },
        { status: 403 }
      );
    }

    const pathwayId = params.id;

    // Appeler l'API Laravel pour récupérer les vidéos du parcours
    const response = await laravelFetch(
      `/api/student/pathways/${pathwayId}/videos`,
      {
        request,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
      // Transformer les données pour correspondre à l'interface frontend
      const transformedVideos = data.data.map((video: any, index: number) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration || "00:00",
        thumbnail: video.thumbnail || null,
        is_completed: video.is_completed || false,
        order: index + 1,
      }));

      return NextResponse.json({
        success: true,
        data: transformedVideos,
      });
    } else {
      // En cas d'erreur, retourner des données de démonstration
      const demoVideos = [
        {
          id: 1,
          title: "Introduction au Marketing Digital",
          description:
            "Découvrez les bases du marketing digital et les concepts fondamentaux",
          duration: "15:30",
          thumbnail: "/placeholder-video.jpg",
          is_completed: true,
          order: 1,
        },
        {
          id: 2,
          title: "Stratégies de Contenu",
          description:
            "Apprenez à créer du contenu engageant pour votre audience",
          duration: "22:45",
          thumbnail: "/placeholder-video.jpg",
          is_completed: true,
          order: 2,
        },
        {
          id: 3,
          title: "SEO et Référencement",
          description:
            "Maîtrisez les techniques de SEO pour améliorer votre visibilité",
          duration: "18:20",
          thumbnail: "/placeholder-video.jpg",
          is_completed: false,
          order: 3,
        },
        {
          id: 4,
          title: "Publicité en Ligne",
          description:
            "Gérez vos campagnes publicitaires sur les plateformes digitales",
          duration: "25:10",
          thumbnail: "/placeholder-video.jpg",
          is_completed: false,
          order: 4,
        },
      ];

      return NextResponse.json({
        success: true,
        data: demoVideos,
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos du parcours:",
      error
    );

    // Retourner des données de démonstration en cas d'erreur
    const demoVideos = [
      {
        id: 1,
        title: "Introduction au Marketing Digital",
        description: "Découvrez les bases du marketing digital",
        duration: "15:30",
        thumbnail: "/placeholder-video.jpg",
        is_completed: false,
        order: 1,
      },
    ];

    return NextResponse.json({
      success: true,
      data: demoVideos,
    });
  }
}
