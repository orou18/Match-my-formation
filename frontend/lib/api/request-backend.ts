import type { NextRequest } from "next/server";
import { fetchBackend } from "@/lib/api/backend-fetch";

export function getRequestAccessToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return request.cookies.get("authToken")?.value || null;
}

export async function fetchBackendWithRequestAuth(
  request: NextRequest,
  path: string,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers || {});
  const token = getRequestAccessToken(request);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetchBackend(path, {
    ...init,
    headers,
  });
}
