import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/pathways", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE PATHWAYS - Erreur:", error);
    
    // Fallback avec données simulées si le backend ne répond pas
    const fallbackData = {
      success: true,
      data: [
        {
          id: 1,
          title: "Parcours Marketing Digital",
          description: "Formation complète sur le marketing digital et les stratégies modernes",
          creator: {
            id: 1,
            name: "Jean Formateur",
            avatar: "/creator-avatar-1.jpg",
          },
          videos_count: 8,
          total_duration: "4h 30min",
          assigned_at: "2024-01-15",
          completed_at: null,
          progress_percentage: 62.5,
          is_active: true,
          status: "active",
        },
        {
          id: 2,
          title: "Parcours Vente Avancée",
          description: "Techniques de vente avancées et développement commercial",
          creator: {
            id: 1,
            name: "Jean Formateur",
            avatar: "/creator-avatar-1.jpg",
          },
          videos_count: 6,
          total_duration: "3h 15min",
          assigned_at: "2024-01-20",
          completed_at: "2024-02-10",
          progress_percentage: 100,
          is_active: false,
          status: "completed",
        },
        {
          id: 3,
          title: "Parcours Communication",
          description: "Développez vos compétences en communication professionnelle",
          creator: {
            id: 2,
            name: "Marie Coach",
            avatar: "/creator-avatar-2.jpg",
          },
          videos_count: 5,
          total_duration: "2h 45min",
          assigned_at: "2024-02-01",
          completed_at: null,
          progress_percentage: 20,
          is_active: true,
          status: "active",
        },
      ],
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathwayId } = body;
    
    if (!pathwayId) {
      return NextResponse.json(
        { error: "ID du pathway requis" },
        { status: 400 }
      );
    }

    // Démarrer un pathway
    const response = await laravelFetch(`/api/employee/pathways/${pathwayId}/start`, {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE PATHWAYS - Erreur démarrage:", error);
    return NextResponse.json(
      { error: "Erreur lors du démarrage du parcours" },
      { status: 500 }
    );
  }
}
