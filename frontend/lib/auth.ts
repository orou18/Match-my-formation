import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Extrait l'ID utilisateur depuis le token d'authentification
 * Compatible avec UserIdManager
 */
export function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const userId = request.cookies.get("userId")?.value;
    return userId || null;
  } catch (error) {
    console.error("Erreur lors de l'extraction de l'ID utilisateur:", error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(request: NextRequest): boolean {
  return getUserIdFromToken(request) !== null;
}

export function getRoleFromToken(request: NextRequest): string | null {
  try {
    return request.cookies.get("userRole")?.value || null;
  } catch {
    return null;
  }
}

/**
 * Crée une réponse avec les cookies d'authentification
 */
export function createAuthResponse(
  data: unknown,
  userId: string
): NextResponse {
  const response = NextResponse.json(data);

  // Ajouter les cookies pour la persistance
  response.cookies.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return response;
}
