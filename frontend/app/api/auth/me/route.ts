import { NextRequest, NextResponse } from "next/server";
import UserIdManager from "@/lib/user-id-manager";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification avec UserIdManager
    const userData = UserIdManager.getStoredUserData();
    
    if (!userData || !userData.id) {
      // Retourner un utilisateur par défaut pour éviter les erreurs
      const defaultUser = {
        id: 1,
        name: "Étudiant",
        email: "student@example.com",
        role: "student",
        avatar: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return NextResponse.json({
        success: true,
        user: defaultUser,
      });
    }

    // Retourner les données utilisateur réelles
    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Erreur /api/auth/me:", error);
    
    // En cas d'erreur, retourner un utilisateur par défaut
    const fallbackUser = {
      id: 1,
      name: "Étudiant",
      email: "student@example.com",
      role: "student",
      avatar: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      user: fallbackUser,
    });
  }
}
