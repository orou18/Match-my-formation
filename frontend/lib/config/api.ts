import { getBackendBaseUrls } from "@/lib/api/backend-fetch";

// Configuration centralisée de l'API
export const API_CONFIG = {
  // URL de base de l'API Laravel
  BASE_URL: getBackendBaseUrls()[0] || "http://127.0.0.1:8000",
  
  // Endpoints principaux
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      LOGOUT: "/api/auth/logout",
      ME: "/api/me",
    },
    USER: {
      PROFILE: "/api/user/profile",
      UPLOAD_AVATAR: "/api/user/upload-avatar",
      NOTIFICATIONS: "/api/user/notifications",
      UNREAD_COUNT: "/api/user/notifications/unread-count",
      MARK_READ: (id: number) => `/api/user/notifications/${id}/read`,
      DELETE: (id: number) => `/api/user/notifications/${id}`,
    },
    COURSES: {
      LIST: "/api/courses",
      DETAIL: (id: number) => `/api/courses/${id}`,
      STUDENT_COURSES: "/api/student/courses",
      ENROLL: (id: number) => `/api/student/courses/${id}/enroll`,
      SEARCH: "/api/courses/search",
    },
    VIDEOS: {
      LIST: "/api/videos",
      DETAIL: (id: number) => `/api/videos/${id}`,
      PUBLIC: "/api/videos/public",
      CREATOR_VIDEOS: "/api/creator/videos",
      CREATOR_SPECIFIC: (id: number) => `/api/creator/${id}/videos`,
      TOGGLE_PUBLISH: (id: number) => `/api/videos/${id}/toggle-publish`,
      LIKE: (id: number) => `/api/videos/${id}/like`,
      UNLIKE: (id: number) => `/api/videos/${id}/unlike`,
      SEARCH: "/api/videos/search",
    },
    DASHBOARD: {
      CREATOR: "/api/creator/dashboard",
      STUDENT: "/api/student/dashboard",
      ADMIN_ANALYTICS: "/api/admin/stats",
      ADMIN_BRANDING: "/api/admin/branding",
    },
  },
  
  // Configuration par défaut
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  
  // Timeout par défaut (10 secondes)
  TIMEOUT: 10000,
} as const;

// Helper pour construire les URLs complètes
export function buildUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper pour construire les headers avec authentification
export function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper pour créer un AbortController avec timeout
export function createTimeoutController(timeoutMs: number = API_CONFIG.TIMEOUT): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}
