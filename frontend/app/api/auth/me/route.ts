import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * API Route /api/auth/me
 * 
 * Retourne les informations de l'utilisateur connecté via NextAuth.
 * SOURCE DE VÉRITÉ : session NextAuth (session.user.role, session.accessToken)
 * 
 * Cette route est utilisée par les dashboards pour récupérer les informations
 * de l'utilisateur et vérifier son rôle.
 */

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session NextAuth (source de vérité unique)
    const session = await getServerSession(authOptions);

    console.log("[/api/auth/me] Session:", session ? {
      user: {
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email,
        role: session.user?.role,
      },
      hasAccessToken: !!session.user?.accessToken,
    } : "No session");

    if (!session || !session.user) {
      // Utilisateur non connecté - retourner une réponse 401
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non connecté",
          user: null,
        },
        { status: 401 }
      );
    }

    // Construire les données utilisateur depuis la session NextAuth
    const userData = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role || "student", // Rôle par défaut: student
      avatar: (session.user as any).avatar || null,
      created_at: (session.user as any).created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Retourner les données utilisateur
    return NextResponse.json({
      success: true,
      user: userData,
      // Note: on ne retourne pas accessToken côté serveur pour des raisons de sécurité
    });
  } catch (error) {
    console.error("[/api/auth/me] Error:", error);

    // En cas d'erreur, retourner une erreur 500
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des informations utilisateur",
        user: null,
      },
      { status: 500 }
    );
  }
}
