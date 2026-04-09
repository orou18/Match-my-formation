import { NextRequest, NextResponse } from "next/server";
import UserIdManager from "@/lib/user-id-manager";

export async function GET(request: NextRequest) {
  try {
    // Récupérer les données depuis UserIdManager (stocké localement)
    const authData = UserIdManager.getStoredUserData();
    
    if (!authData) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Créer les données du dashboard avec les informations utilisateur
    const dashboardData = {
      user: {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
        created_at: new Date().toISOString(), // Date par défaut
        avatar: authData.avatar || null,
      },
      courses: [], // Pas de cours pour commencer
      stats: {
        courses_in_progress: 0,
        courses_completed: 0,
        total_watch_time: 0,
        certificates_earned: 0,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard student error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du dashboard" },
      { status: 500 }
    );
  }
}
