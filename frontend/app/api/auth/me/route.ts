import { NextRequest, NextResponse } from "next/server";
import UserIdManager from "@/lib/user-id-manager";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification avec UserIdManager
    const userData = UserIdManager.getStoredUserData();

    if (!userData || !userData.id) {
      // Retourner 401 si pas authentifié
      return NextResponse.json(
        {
          success: false,
          message: "Non authentifié",
        },
        { status: 401 }
      );
    }

    // Retourner les données utilisateur réelles
    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Erreur /api/auth/me:", error);

    // Retourner 401 en cas d'erreur
    return NextResponse.json(
      {
        success: false,
        message: "Erreur d'authentification",
      },
      { status: 401 }
    );
  }
}
