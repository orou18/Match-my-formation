import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getMockTokenParts(token: string) {
  const match = token.match(/^mock-([a-z_]+)-token-([0-9]+)-/i);
  if (!match) return null;
  return {
    role: match[1],
    userId: match[2],
  };
}

/**
 * Extrait l'ID utilisateur depuis le token d'authentification
 * Compatible avec UserIdManager
 */
export function getUserIdFromToken(request: NextRequest): string | null {
  try {
    // Essayer de récupérer le token depuis l'en-tête Authorization
    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const parsed = getMockTokenParts(token);
      if (parsed?.userId) {
        return parsed.userId;
      }

      // Pour les tokens mock, extraire l'ID depuis le token
      if (token.includes("mock-")) {
        // Format: mock-student-token-timestamp ou mock-creator-token-timestamp
        if (token.includes("student")) return "3";
        if (token.includes("creator")) return "2";
        if (token.includes("admin")) return "1";
      }

      // Pour les tokens sociaux, extraire l'ID depuis localStorage côté client
      if (token.includes("social-")) {
        // L'ID sera géré côté client avec UserIdManager
        return null; // Laisser le client gérer
      }
    }

    // Essayer de récupérer depuis les cookies (alternative)
    const userId = request.cookies.get("userId")?.value;
    if (userId) {
      return userId;
    }

    return null;
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
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const parsed = getMockTokenParts(authHeader.substring(7));
      return parsed?.role || null;
    }
    return request.cookies.get("userRole")?.value || null;
  } catch {
    return null;
  }
}

/**
 * Crée une réponse avec les cookies d'authentification
 */
export function createAuthResponse(data: unknown, userId: string): NextResponse {
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
