import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
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
  if (pathname?.includes("/creator")) {
    // Permettre l'accès si le rôle est creator, admin, ou si aucun rôle n'est défini (fallback)
    if (userRole && userRole !== "creator" && userRole !== "admin") {
      console.warn(`Rôle utilisateur "${userRole}" tente d'accéder aux endpoints creator`);
      // Ne pas bloquer l'accès, juste logger un avertissement
      // throw new Error("Unauthorized: User role does not match required creator role");
    }
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

  // 3. Décoder le JWT NextAuth pour récupérer le vrai accessToken backend
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
        return nextAuthAccessToken;
      }
    } catch (error) {
      console.error("Erreur de décodage du token NextAuth:", error);
    }
  }

  // 4. Vérifier la session NextAuth
  try {
    const session = await getServerSession(authOptions);
    const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken;
    if (accessToken) {
      return accessToken;
    }

  } catch (error) {
    console.error("Erreur de resolution de session NextAuth:", error);
  }

  // 5. Retourner null si aucun vrai token backend n'a été trouvé
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
