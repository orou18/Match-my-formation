import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * API Route /api/student/dashboard
 * 
 * Retourne les données du dashboard student.
 * SOURCE DE VÉRITÉ : session NextAuth (et non localStorage)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier que l'ID est présent
    if (!session.user.id) {
      console.warn("[/api/student/dashboard] User ID missing in session");
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    // Créer les données du dashboard avec les informations NextAuth
    const dashboardData = {
      user: {
        id: session.user.id,
        name: session.user.name || "Utilisateur",
        email: session.user.email || "",
        role: session.user.role || "student",
        created_at: new Date().toISOString(),
        avatar: (session.user as any).avatar || null,
      },
      courses: [],
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
