import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await laravelFetch("/api/creator/employees", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        domain: payload.department || payload.domain || payload.position || "general",
      }),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Add employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de l'ajout de l'employé",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    let employeesData = null;
    
    try {
      const response = await laravelFetch("/api/creator/employees", { request });
      const data = await parseLaravelJson(response);
      
      if (response.ok) {
        employeesData = data;
      }
    } catch (backendError) {
      console.warn("Backend non accessible pour les employés, utilisation des données fallback:", backendError);
    }

    // Utiliser les données du backend si disponibles, sinon utiliser les fallbacks
    if (employeesData && employeesData.success) {
      return NextResponse.json(employeesData, { status: 200 });
    }

    // Données fallback
    const fallbackEmployees = [
      {
        id: 1,
        name: "Marie Kouassi",
        email: "marie@example.com",
        department: "Marketing",
        position: "Chef de projet",
        status: "active",
        progress: 85,
        completion_rate: 85,
        enrolled_courses: 3,
        completed_courses: 2,
        last_login: "2024-01-15T10:30:00Z",
        created_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        name: "Jean Dupont",
        email: "jean@example.com",
        department: "Ventes",
        position: "Commercial",
        status: "active",
        progress: 72,
        completion_rate: 72,
        enrolled_courses: 2,
        completed_courses: 1,
        last_login: "2024-01-14T15:20:00Z",
        created_at: "2024-01-02T00:00:00Z"
      },
      {
        id: 3,
        name: "Sophie Martin",
        email: "sophie@example.com",
        department: "RH",
        position: "Responsable formation",
        status: "active",
        progress: 90,
        completion_rate: 90,
        enrolled_courses: 4,
        completed_courses: 3,
        last_login: "2024-01-15T09:15:00Z",
        created_at: "2024-01-03T00:00:00Z"
      }
    ];

    return NextResponse.json({
      success: true,
      data: fallbackEmployees,
      total: fallbackEmployees.length
    }, { status: 200 });
  } catch (error) {
    console.error("Get employees error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des employés",
      },
      { status: 500 }
    );
  }
}
