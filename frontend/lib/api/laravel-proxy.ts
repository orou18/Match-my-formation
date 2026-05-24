import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import { fetchBackend, getBackendBaseUrls } from "@/lib/api/backend-fetch";

/**
 * Laravel Proxy - Version corrigée
 * 
 * CHANGEMENTS :
 * - Suppression de la vérification des cookies userRole et authToken (obsolètes)
 * - Utilisation exclusive de NextAuth (session.accessToken) comme source de vérité
 * - Simplification de la logique de résolution du token
 * - Ajout de logs de debug pour tracer l'authentification
 */

type LaravelFetchOptions = Omit<RequestInit, "headers"> & {
  request?: NextRequest;
  headers?: HeadersInit;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

function getLaravelBaseUrl() {
  return getBackendBaseUrls()[0] || "http://127.0.0.1:8000";
}

/**
 * Routes publiques qui ne nécessitent PAS de token d'authentification
 * Ces routes doivent être appelées SANS header Authorization
 * 
 * NOTE: /api/videos/all-public a été retiré car Laravel retourne 401
 * même si la route semble publique dans api.php. Elle est en réalité
 * dans le groupe middleware('auth:sanctum') ligne 252-280.
 */
const PUBLIC_ROUTES = [
  "/api/videos/public",
  "/api/public/videos",
  "/api/videos/public/search",
  "/api/health",
];

/**
 * Vérifie si une route est publique (ne nécessite pas d'authentification)
 */
function isPublicRoute(path: string): boolean {
  const normalizedPath = path.replace(/\?.*$/, ''); // Retirer query params
  return PUBLIC_ROUTES.some(route => normalizedPath.startsWith(route));
}

/**
 * Résout le token d'accès Laravel depuis la session NextAuth
 * 
 * ORDRE DE PRIORITÉ :
 * 1. Header Authorization (si présent)
 * 2. JWT NextAuth via getToken() (côté serveur pour les API routes)
 * 3. Session NextAuth via getServerSession()
 * 4. null (pas de token)
 */
async function resolveAccessToken(request?: NextRequest, path?: string) {
  // Si c'est une route publique, ne pas envoyer de token
  if (path && isPublicRoute(path)) {
    console.log(`[LaravelProxy] Route publique détectée: ${path}, pas de token envoyé`);
    return null;
  }

  console.log("[LaravelProxy] Résolution du token d'accès...");

  // 1. Vérifier le header Authorization (pour les appels avec token explicite)
  const header = request?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const token = header.slice(7);
    console.log("[LaravelProxy] Token trouvé dans header Authorization");
    return token;
  }

  // 2. Décoder le JWT NextAuth pour récupérer le vrai accessToken backend
  if (request) {
    try {
      const nextAuthJwt = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      const nextAuthAccessToken =
        typeof nextAuthJwt?.accessToken === "string"
          ? nextAuthJwt.accessToken
          : null;

      if (nextAuthAccessToken) {
        console.log("[LaravelProxy] Token trouvé dans JWT NextAuth");
        return nextAuthAccessToken;
      }
    } catch (error) {
      console.error("[LaravelProxy] Erreur de décodage du JWT NextAuth:", error);
    }
  }

  // 3. Vérifier la session NextAuth
  try {
    const session = await getServerSession(authOptions);
    const accessToken = (session?.user as { accessToken?: string } | undefined)
      ?.accessToken;
    if (accessToken) {
      console.log("[LaravelProxy] Token trouvé dans session NextAuth");
      return accessToken;
    }
  } catch (error) {
    console.error("[LaravelProxy] Erreur de résolution de session NextAuth:", error);
  }

  // 4. Aucun token trouvé
  console.warn("[LaravelProxy] Aucun token d'accès trouvé");
  return null;
}

export async function laravelFetch(
  path: string,
  { request, headers, searchParams, ...init }: LaravelFetchOptions = {}
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  // Debug pour les routes vidéos
  if (normalizedPath.includes("/api/videos")) {
    console.log("[VIDEOS DEBUG] === Début appel vidéos ===");
    console.log("[VIDEOS DEBUG] Path:", normalizedPath);
    console.log("[VIDEOS DEBUG] Is public route:", isPublicRoute(normalizedPath));
  }

  const token = await resolveAccessToken(request, normalizedPath);
  const url = new URL(
    `${getLaravelBaseUrl()}${normalizedPath}`
  );

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  if (normalizedPath.includes("/api/videos")) {
    console.log("[VIDEOS DEBUG] Full URL:", url.toString());
  }

  const finalHeaders = new Headers(headers || {});
  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }
  if (!finalHeaders.has("X-Requested-With")) {
    finalHeaders.set("X-Requested-With", "XMLHttpRequest");
  }

  // Forward incoming cookies from the NextRequest to the backend so session-based
  // auth (Sanctum) works when proxying server-side requests.
  const incomingCookie = request?.headers.get("cookie");
  if (incomingCookie) {
    finalHeaders.set("Cookie", incomingCookie);
  }

  // Ajouter les cookies NextAuth pour la session
  if (request) {
    const cookies = request.cookies.getAll();
    const nextAuthCookies = cookies
      .filter((cookie) => cookie.name.includes("next-auth"))
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    if (nextAuthCookies && !finalHeaders.has("Cookie")) {
      finalHeaders.set("Cookie", nextAuthCookies);
    } else if (nextAuthCookies && finalHeaders.has("Cookie")) {
      finalHeaders.set(
        "Cookie",
        finalHeaders.get("Cookie") + "; " + nextAuthCookies
      );
    }
  }

  // Ajouter le token d'authentification (seulement si ce n'est pas une route publique)
  if (token && !finalHeaders.has("Authorization") && !isPublicRoute(normalizedPath)) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
    console.log("[LaravelProxy] Token ajouté au header Authorization");
  } else if (isPublicRoute(normalizedPath)) {
    console.log("[LaravelProxy] Route publique - pas de token ajouté");
  }

  if (normalizedPath.includes("/api/videos")) {
    console.log("[VIDEOS DEBUG] Has Authorization header:", finalHeaders.has("Authorization"));
    console.log("[VIDEOS DEBUG] Headers:", Object.fromEntries(finalHeaders));
  }

  console.log(`[LaravelProxy] Appel à ${url.pathname}`);

  try {
    const response = await fetchBackend(url.toString().replace(getLaravelBaseUrl(), ""), {
      ...init,
      credentials: init.credentials ?? "include",
      headers: finalHeaders,
    });

    // Debug pour les réponses vidéos
    if (normalizedPath.includes("/api/videos")) {
      console.log("[VIDEOS DEBUG] Response status:", response.status);
      console.log("[VIDEOS DEBUG] Response ok:", response.ok);
      
      // Lire le corps de la réponse pour debug
      const responseText = await response.clone().text();
      console.log("[VIDEOS DEBUG] Laravel raw response:", responseText.substring(0, 500));
    }

    return response;
  } catch (error) {
    if (normalizedPath.includes("/api/videos")) {
      console.error("[VIDEOS ERROR] Fetch error:", error);
    }
    throw error;
  }
}

export async function parseLaravelJson(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
