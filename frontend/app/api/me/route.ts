/**
 * GET /api/me
 *
 * Retourne le profil de l'utilisateur actuellement authentifié
 * en interrogeant le backend Laravel via le token Bearer présent
 * dans le cookie httpOnly "authToken", le header Authorization,
 * ou le JWT NextAuth (dans cet ordre de priorité).
 *
 * Réponse succès : { success: true, user: { id, name, email, role, avatar, ... } }
 * Réponse échec  : { success: false, message: "..." } + status 401 ou 502
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { fetchBackendWithRequestAuth } from "@/lib/api/request-backend";
import { fetchBackend } from "@/lib/api/backend-fetch";

export async function GET(request: NextRequest) {
  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 1 : Détecter la source du token d'authentification
  // ─────────────────────────────────────────────────────────────────────

  // Source A — Cookie httpOnly "authToken" (posé par /api/auth/login)
  const cookieToken = request.cookies.get("authToken")?.value ?? null;

  // Source B — Header Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization") ?? "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  // Source C — JWT NextAuth (fallback si login via signIn("credentials"))
  // Ce token contient le Bearer Laravel stocké dans le champ "accessToken"
  let nextAuthAccessToken: string | null = null;

  if (!cookieToken && !headerToken) {
    try {
      const jwtPayload = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      const raw = jwtPayload?.accessToken;
      if (typeof raw === "string" && raw.length > 0) {
        nextAuthAccessToken = raw;
      }
    } catch {
      // NEXTAUTH_SECRET absent ou JWT invalide — pas de token disponible
      // On laisse nextAuthAccessToken à null et on continue
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 2 : Aucun token disponible → 401 immédiat
  // ─────────────────────────────────────────────────────────────────────

  if (!cookieToken && !headerToken && !nextAuthAccessToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Non authentifié. Veuillez vous connecter.",
      },
      { status: 401 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 3 : Appeler le backend Laravel GET /api/me
  // ─────────────────────────────────────────────────────────────────────

  let backendResponse: Response;

  try {
    if (nextAuthAccessToken && !cookieToken && !headerToken) {
      // Cas NextAuth pur : le cookie authToken n'a pas été posé
      // On forge la requête avec le token extrait du JWT NextAuth
      backendResponse = await fetchBackend("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${nextAuthAccessToken}`,
          Accept: "application/json",
        },
      });
    } else {
      // Cas standard : cookie "authToken" ou header Authorization présent
      // fetchBackendWithRequestAuth lit automatiquement ces deux sources
      backendResponse = await fetchBackendWithRequestAuth(request, "/api/me", {
        method: "GET",
      });
    }
  } catch (networkError) {
    // Le backend Laravel est inaccessible (non démarré, réseau, etc.)
    console.error("[/api/me] Backend inaccessible :", networkError);
    return NextResponse.json(
      {
        success: false,
        message:
          "Backend indisponible. Vérifiez que Laravel est démarré sur le port 8000.",
      },
      { status: 502 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 4 : Traiter la réponse du backend
  // ─────────────────────────────────────────────────────────────────────

  // Token expiré ou révoqué côté Laravel
  if (backendResponse.status === 401) {
    return NextResponse.json(
      {
        success: false,
        message: "Session expirée. Veuillez vous reconnecter.",
      },
      { status: 401 }
    );
  }

  // Erreur serveur Laravel (500, 503, etc.)
  if (!backendResponse.ok) {
    console.error(`[/api/me] Erreur backend HTTP ${backendResponse.status}`);
    return NextResponse.json(
      {
        success: false,
        message: `Erreur backend : HTTP ${backendResponse.status}`,
      },
      { status: backendResponse.status }
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 5 : Parser et valider le corps de la réponse
  // ─────────────────────────────────────────────────────────────────────

  // Le backend Laravel /api/me retourne un objet plat :
  // { id, name, email, role, avatar?, phone?, bio?, location?, website? }
  const userData = await backendResponse.json().catch(() => null);

  if (!userData || typeof userData.id === "undefined") {
    console.error("[/api/me] Réponse backend invalide :", userData);
    return NextResponse.json(
      {
        success: false,
        message: "Données utilisateur invalides reçues du backend.",
      },
      { status: 401 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 6 : Retourner le profil normalisé
  // ─────────────────────────────────────────────────────────────────────

  return NextResponse.json({
    success: true,
    user: {
      id: userData.id,
      name: userData.name ?? "",
      email: userData.email ?? "",
      role: userData.role ?? "student",
      avatar: userData.avatar ?? null,
      phone: userData.phone ?? null,
      bio: userData.bio ?? null,
      location: userData.location ?? null,
      website: userData.website ?? null,
    },
  });
}
