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

  // Utiliser les tokens d'employé
  const token =
    window.localStorage.getItem("employee_token") ||
    window.localStorage.getItem("auth_token") ||
    window.localStorage.getItem("nextauth.session-token") ||
    window.localStorage.getItem("token");

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

export const employeeStudentService = {
  async getDashboard<T = JsonObject>() {
    const baseUrl = getApiBaseUrl();
    return readJson<T>(
      await fetch(`${baseUrl}/api/employee/student/dashboard`, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getVideos<T = JsonObject>(params?: {
    search?: string;
    category?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) {
    const baseUrl = getApiBaseUrl();
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

    const url = `${baseUrl}/api/employee/student/videos${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    return readJson<T>(
      await fetch(url, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getPathways<T = JsonObject>(params?: {
    search?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) {
    const baseUrl = getApiBaseUrl();
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

    const url = `${baseUrl}/api/employee/student/pathways${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    return readJson<T>(
      await fetch(url, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getPathwayDetails<T = JsonObject>(pathwayId: number) {
    const baseUrl = getApiBaseUrl();
    return readJson<T>(
      await fetch(`${baseUrl}/api/employee/student/pathways/${pathwayId}`, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async completeVideo<T = JsonObject>(videoId: number, data: {
    watched_duration: number;
    completed: boolean;
  }) {
    const baseUrl = getApiBaseUrl();
    return readJson<T>(
      await fetch(`${baseUrl}/api/employee/student/videos/${videoId}/complete`, {
        method: "POST",
        headers: {
          ...buildAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    );
  },
};
