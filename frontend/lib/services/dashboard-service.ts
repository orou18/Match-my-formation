"use client";

type JsonObject = Record<string, unknown>;

async function readJson<T>(response: Response): Promise<T> {
  try {
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (payload as { message?: string; error?: string })?.message ||
        (payload as { message?: string; error?: string })?.error ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Réponse invalide du serveur: ${response.status}`);
    }
    throw error;
  }
}

function buildAuthHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window === "undefined") {
    return headers;
  }

  // Utiliser les mêmes tokens que le service d'authentification
  const token =
    window.localStorage.getItem("auth_token") ||
    window.localStorage.getItem("nextauth.session-token") ||
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("employee_token");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  headers["Content-Type"] = "application/json";
  headers["Accept"] = "application/json";

  return headers;
}

function getApiBaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL;
  return rawUrl && rawUrl !== "undefined"
    ? rawUrl.replace(/\/$/, "")
    : "http://127.0.0.1:8000";
}

export const dashboardService = {
  async getCreatorDashboard<T = JsonObject>() {
    return readJson<T>(
      await fetch("/api/creator/dashboard", {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getStudentDashboard<T = JsonObject>() {
    return readJson<T>(
      await fetch(`/api/student/dashboard`, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getAdminAnalytics<T = JsonObject>(period = "30d", metric = "revenue") {
    const baseUrl = getApiBaseUrl();
    const params = new URLSearchParams({ period, metric });
    return readJson<T>(
      await fetch(`${baseUrl}/api/admin/stats?${params.toString()}`, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getBrandingSettings<T = JsonObject>() {
    const baseUrl = getApiBaseUrl();
    return readJson<T>(
      await fetch(`${baseUrl}/api/admin/branding`, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async updateBrandingSettings<T = JsonObject>(data: FormData) {
    const baseUrl = getApiBaseUrl();
    return readJson<T>(
      await fetch(`${baseUrl}/api/admin/branding`, {
        method: "PUT",
        body: data,
        headers: buildAuthHeaders(),
      })
    );
  },
};
