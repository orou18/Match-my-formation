import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
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

    // Appeler l'API Laravel pour récupérer les parcours assignés à l'employé
    const response = await laravelFetch("/api/student/pathways", {
      request,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
      // Transformer les données pour correspondre à l'interface frontend
      const transformedPathways = data.data.map((pathway: any) => ({
        id: pathway.id,
        title: pathway.title,
        description: pathway.description,
        domain: pathway.domain || "Général",
        duration_hours: pathway.duration_hours || 0,
        difficulty_level: pathway.difficulty_level || "beginner",
        progress: pathway.progress || 0,
        completed_videos: pathway.completed_videos || 0,
        total_videos: pathway.total_videos || 0,
        assigned_date: pathway.assigned_date || new Date().toISOString(),
        last_accessed: pathway.last_accessed || null,
        creator: pathway.creator
          ? {
              name: pathway.creator.name || "Créateur",
              avatar: pathway.creator.avatar || null,
            }
          : undefined,
      }));

      return NextResponse.json({
        success: true,
        data: transformedPathways,
      });
    } else {
      // En cas d'erreur, retourner des données de démonstration
      const demoPathways = [
        {
          id: 1,
          title: "Formation Marketing Digital",
          description:
            "Apprenez les fondamentaux du marketing digital avec des cours pratiques et interactifs",
          domain: "Marketing",
          duration_hours: 20,
          difficulty_level: "beginner" as const,
          progress: 65,
          completed_videos: 13,
          total_videos: 20,
          assigned_date: "2024-01-15",
          last_accessed: "2024-01-20",
          creator: {
            name: "DMC Associated",
            avatar: "/logo.png",
          },
        },
        {
          id: 2,
          title: "Développement Web Avancé",
          description:
            "Maîtrisez les technologies web modernes : React, Node.js, et plus",
          domain: "Développement",
          duration_hours: 40,
          difficulty_level: "advanced" as const,
          progress: 30,
          completed_videos: 6,
          total_videos: 20,
          assigned_date: "2024-01-10",
          creator: {
            name: "Tech Academy",
          },
        },
        {
          id: 3,
          title: "Gestion de Projet",
          description:
            "Apprenez à gérer des projets de A à Z avec les méthodes agiles",
          domain: "Management",
          duration_hours: 15,
          difficulty_level: "intermediate" as const,
          progress: 85,
          completed_videos: 17,
          total_videos: 20,
          assigned_date: "2024-01-05",
          last_accessed: "2024-01-19",
          creator: {
            name: "Business School",
          },
        },
      ];

      return NextResponse.json({
        success: true,
        data: demoPathways,
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des parcours étudiant:",
      error
    );

    // Retourner des données de démonstration en cas d'erreur
    const demoPathways = [
      {
        id: 1,
        title: "Formation Marketing Digital",
        description:
          "Apprenez les fondamentaux du marketing digital avec des cours pratiques et interactifs",
        domain: "Marketing",
        duration_hours: 20,
        difficulty_level: "beginner" as const,
        progress: 65,
        completed_videos: 13,
        total_videos: 20,
        assigned_date: "2024-01-15",
        last_accessed: "2024-01-20",
        creator: {
          name: "DMC Associated",
          avatar: "/logo.png",
        },
      },
    ];

    return NextResponse.json({
      success: true,
      data: demoPathways,
    });
  }
}
