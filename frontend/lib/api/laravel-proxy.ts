import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type LaravelFetchOptions = Omit<RequestInit, "headers"> & {
  request?: NextRequest;
  headers?: HeadersInit;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

function getLaravelBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(
    /\/$/,
    ""
  );
}

async function resolveAccessToken(request?: NextRequest) {
  const header = request?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const session = await getServerSession(authOptions);
  return (
    (session?.user as { accessToken?: string } | undefined)?.accessToken || null
  );
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

  return fetch(url.toString(), {
    ...init,
    headers: finalHeaders,
    cache: "no-store",
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
