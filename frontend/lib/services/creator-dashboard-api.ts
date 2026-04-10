"use client";

export type CreatorApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type CreatorRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function getClientAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("auth_token") ||
    window.localStorage.getItem("nextauth.session-token") ||
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("employee_token")
  );
}

function buildHeaders(headers?: HeadersInit, body?: BodyInit | null) {
  const finalHeaders = new Headers(headers || {});

  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  const token = getClientAccessToken();
  if (token && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (
    body &&
    !(body instanceof FormData) &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return finalHeaders;
}

async function readResponse<T>(response: Response): Promise<T> {
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

async function creatorRequest<T>(
  path: string,
  { query, headers, body, ...init }: CreatorRequestOptions = {}
) {
  // Construire l'URL avec les paramètres de requête
  let url = path;
  if (query && Object.keys(query).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...init,
    body,
    headers: buildHeaders(headers, body),
    cache: "no-store",
    credentials: "include", // Inclure les cookies NextAuth pour l'authentification
  });

  return readResponse<T>(response);
}

export type CreatorStatsPayload = {
  totalViews: number;
  totalStudents: number;
  totalRevenue: number;
  totalVideos: number;
  monthlyViews: number[];
  monthlyRevenue: number[];
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    revenue: number;
    students: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "view" | "enrollment" | "revenue";
    title: string;
    timestamp: string;
    amount?: number;
  }>;
};

export const creatorDashboardApi = {
  getDashboard<T = unknown>() {
    return creatorRequest<T>("/api/creator/dashboard");
  },

  getStats(range: "7d" | "30d" | "90d" | "1y") {
    return creatorRequest<CreatorApiResponse<CreatorStatsPayload>>(
      "/api/creator/stats",
      {
        query: { range },
      }
    );
  },

  getEmployees<T = unknown>() {
    return creatorRequest<CreatorApiResponse<T>>("/api/creator/employees");
  },

  getVideos<T = unknown>() {
    return creatorRequest<T>("/api/creator/videos-simple");
  },

  createVideo<T = unknown>(payload: FormData) {
    return creatorRequest<T>("/api/creator/videos-simple", {
      method: "POST",
      body: payload,
    });
  },

  updateVideo<T = unknown>(payload: unknown) {
    return creatorRequest<T>("/api/creator/videos-simple", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteVideo<T = unknown>(id: number | string) {
    return creatorRequest<T>("/api/creator/videos-simple", {
      method: "DELETE",
      query: { id },
    });
  },

  createEmployee<T = unknown>(payload: unknown) {
    return creatorRequest<CreatorApiResponse<T>>("/api/creator/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteEmployee(id: number | string) {
    return creatorRequest<{ success?: boolean; message?: string }>(
      `/api/creator/employees/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  getEmployeesGlobalProgress<T = unknown>() {
    return creatorRequest<CreatorApiResponse<T>>(
      "/api/creator/employees/progress/global"
    );
  },

  getEmployeeProgress<T = unknown>(id: number | string) {
    return creatorRequest<CreatorApiResponse<T>>(
      `/api/creator/employees/${id}/progress`
    );
  },

  getPathways<T = unknown>() {
    return creatorRequest<CreatorApiResponse<T>>("/api/creator/pathways");
  },

  createPathway<T = unknown>(payload: unknown) {
    return creatorRequest<CreatorApiResponse<T>>("/api/creator/pathways", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  assignPathway<T = unknown>(payload: unknown) {
    return creatorRequest<CreatorApiResponse<T>>(
      "/api/creator/pathways/assign",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  deletePathway(id: number | string) {
    return creatorRequest<{ success?: boolean; message?: string }>(
      `/api/creator/pathways/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  getCustomizeSettings<T = unknown>() {
    return creatorRequest<{ settings: T }>("/api/creator/customize");
  },

  updateCustomizeSettings<T = unknown>(payload: unknown) {
    return creatorRequest<{ settings: T; message?: string }>(
      "/api/creator/customize",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },
};
