"use client";

export function getClientAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  // Priorité à la session NextAuth (nextauth.session-token)
  const sessionToken = window.localStorage.getItem("nextauth.session-token");
  if (sessionToken) {
    return sessionToken;
  }

  // Fallback pour compatibilité (à supprimer progressivement)
  return (
    window.localStorage.getItem("auth_token") ||
    window.localStorage.getItem("token") ||
    null
  );
}

export function buildClientAuthHeaders(headers?: HeadersInit) {
  const finalHeaders = new Headers(headers || {});
  const token = getClientAccessToken();

  if (token && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  return finalHeaders;
}

export async function ensureServerAuthSession() {
  const token = getClientAccessToken();

  if (!token) {
    return {
      ok: false,
      message: "Aucun token de session disponible. Veuillez vous reconnecter.",
    };
  }

  const response = await fetch("/api/auth/sync-session", {
    method: "POST",
    credentials: "include",
    headers: buildClientAuthHeaders(),
  });

  const payload = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    message:
      payload?.message ||
      (response.ok
        ? "Session synchronisée"
        : "Session invalide ou expirée. Veuillez vous reconnecter."),
  };
}
