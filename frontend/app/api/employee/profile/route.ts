import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    // Appeler l'API Laravel pour récupérer le profil de l'employé
    const response = await laravelFetch("/api/employee/me", {
      request,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        user: data.user || data.employee || data.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            data.message || "Impossible de récupérer le profil de l'employé",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur API employee/profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération du profil",
      },
      { status: 500 }
    );
  }
}
