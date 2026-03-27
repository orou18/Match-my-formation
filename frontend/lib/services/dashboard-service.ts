"use client";

type JsonObject = Record<string, unknown>;

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (payload as { message?: string; error?: string })?.message ||
      (payload as { message?: string; error?: string })?.error ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

function buildAuthHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window === "undefined") {
    return headers;
  }

  const token =
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("employee_token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
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
      await fetch("/api/student/dashboard", {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getAdminAnalytics<T = JsonObject>(period = "30d", metric = "revenue") {
    const params = new URLSearchParams({ period, metric });
    return readJson<T>(
      await fetch(`/api/admin/analytics?${params.toString()}`, {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async getBrandingSettings<T = JsonObject>() {
    return readJson<T>(
      await fetch("/api/branding", {
        cache: "no-store",
        headers: buildAuthHeaders(),
      })
    );
  },

  async updateBrandingSettings<T = JsonObject>(data: FormData) {
    return readJson<T>(
      await fetch("/api/branding", {
        method: "PUT",
        body: data,
        headers: buildAuthHeaders(),
      })
    );
  },
};
