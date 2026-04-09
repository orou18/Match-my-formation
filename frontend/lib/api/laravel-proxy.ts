import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import { fetchBackend, getBackendBaseUrls } from "@/lib/api/backend-fetch";

type LaravelFetchOptions = Omit<RequestInit, "headers"> & {
  request?: NextRequest;
  headers?: HeadersInit;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

function getLaravelBaseUrl() {
  return getBackendBaseUrls()[0] || "http://127.0.0.1:8000";
}

async function resolveAccessToken(request?: NextRequest) {
  // Vérifier le rôle de l'utilisateur
  const userRole = request?.cookies.get("userRole")?.value;
  
  // Vérifier si l'utilisateur a le rôle approprié pour les endpoints creator
  const pathname = request?.nextUrl?.pathname;
  if (pathname?.includes("/creator") && userRole !== "creator") {
    throw new Error("Unauthorized: User role does not match required creator role");
  }
  
  // 1. Vérifier le header Authorization
  const header = request?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  // 2. Vérifier les cookies (authToken)
  const cookieToken = request?.cookies.get("authToken")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // 3. Vérifier les cookies NextAuth
  const nextAuthToken = request?.cookies.get("next-auth.session-token")?.value;
  if (nextAuthToken) {
    return nextAuthToken;
  }

  // 4. Vérifier la session NextAuth
  try {
    const session = await getServerSession(authOptions);
    const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken;
    if (accessToken) {
      return accessToken;
    }

    // 5. Essayer de récupérer l'ID utilisateur depuis la session
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (userId) {
      // Créer un token temporaire basé sur l'ID utilisateur
      return `temp-user-${userId}`;
    }
  } catch (error) {
    console.error("Erreur de resolution de session NextAuth:", error);
  }

  // 6. Retourner null si aucun token trouvé
  return null;
}

export async function laravelFetch(
  path: string,
  { request, headers, searchParams, ...init }: LaravelFetchOptions = {}
) {
  const token = await resolveAccessToken(request);
  const url = new URL(
    `${getLaravelBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`
  );

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const finalHeaders = new Headers(headers || {});
  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }
  
  // Forward incoming cookies from the NextRequest to the backend so session-based
  // auth (Sanctum) works when proxying server-side requests.
  const incomingCookie = request?.headers.get("cookie");
  if (incomingCookie) {
    finalHeaders.set("Cookie", incomingCookie);
  }
  
  // Ajouter des cookies spécifiques pour NextAuth
  if (request) {
    const cookies = request.cookies.getAll();
    const authCookies = cookies
      .filter(cookie => 
        cookie.name.includes('next-auth') || 
        cookie.name.includes('authToken') ||
        cookie.name.includes('session')
      )
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    if (authCookies && !finalHeaders.has("Cookie")) {
      finalHeaders.set("Cookie", authCookies);
    } else if (authCookies && finalHeaders.has("Cookie")) {
      finalHeaders.set("Cookie", finalHeaders.get("Cookie") + '; ' + authCookies);
    }
  }
  
  if (token && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  return fetchBackend(url.toString().replace(getLaravelBaseUrl(), ""), {
    ...init,
    headers: finalHeaders,
  });
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
