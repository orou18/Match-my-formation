import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { fetchBackend } from "@/lib/api/backend-fetch";

/**
 * POST /api/auth/sync-session
 * 
 * Rôle: Synchroniser la session NextAuth avec Laravel Sanctum
 * 
 * CORRECTION APPLIQUÉE:
 * - Avant: Utilisait cookies authToken/userId/userRole (obsolète)
 * - Après: Utilise getServerSession() pour extraire accessToken du JWT NextAuth
 * 
 * Flux:
 * 1. Récupérer session NextAuth (contient accessToken dans JWT)
 * 2. Extraire session.user.accessToken (token Laravel Sanctum)
 * 3. Appeler Laravel /api/me avec header Authorization: Bearer {token}
 * 4. Retourner user + session cohérente
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Récupérer session NextAuth (contient accessToken dans JWT)
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.warn("[sync-session] Pas de session NextAuth");
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const accessToken = session.user.accessToken;
    
    if (!accessToken) {
      console.warn("[sync-session] Pas de accessToken dans session");
      return NextResponse.json(
        { success: false, message: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    console.log("[sync-session] Session NextAuth trouvée, accessToken présent");

    // 2. Appeler Laravel /api/me avec le token
    const response = await fetchBackend("/api/me", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.id) {
      console.error("[sync-session] Laravel /api/me échec:", response.status, payload);
      return NextResponse.json(
        { 
          success: false, 
          message: "Session Laravel invalide ou expirée",
          details: payload?.message 
        },
        { status: response.status || 401 }
      );
    }

    console.log("[sync-session] Laravel /api/me succès, user:", payload.id);

    // 3. Retourner succès avec session cohérente
    return NextResponse.json({
      success: true,
      user: payload,
      session: {
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
      },
      message: "Session synchronisée avec succès",
    });

  } catch (error) {
    console.error("[sync-session] Erreur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de la synchronisation" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/sync-session
 * 
 * Vérifie simplement si la session NextAuth est valide
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { authenticated: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
      },
    });

  } catch (error) {
    console.error("[sync-session GET] Erreur:", error);
    return NextResponse.json(
      { authenticated: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}