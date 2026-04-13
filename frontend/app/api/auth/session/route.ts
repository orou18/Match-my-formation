import { NextRequest, NextResponse } from "next/server";
import UserIdManager from "@/lib/user-id-manager";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification avec UserIdManager
    const userData = UserIdManager.getStoredUserData();
    
    if (!userData || !userData.id) {
      // Retourner une session par défaut
      return NextResponse.json({
        user: null,
        expires: null,
      });
    }

    // Retourner la session utilisateur
    return NextResponse.json({
      user: userData,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    });
  } catch (error) {
    console.error("Erreur /api/auth/session:", error);
    
    // En cas d'erreur, retourner une session vide
    return NextResponse.json({
      user: null,
      expires: null,
    });
  }
}
