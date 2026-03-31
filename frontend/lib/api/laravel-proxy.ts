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
  const header = request?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const cookieToken = request?.cookies.get("authToken")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  if (request) {
    return null;
  }

  try {
    const session = await getServerSession(authOptions);
    return (
      (session?.user as { accessToken?: string } | undefined)?.accessToken ||
      null
    );
  } catch (error) {
    console.error("Erreur de resolution de session NextAuth:", error);
    return null;
  }
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
