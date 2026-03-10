// Configuration centralisée de l'API
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  apiVersion: 'api/v1',
  timeout: 10000,
  endpoints: {
    // Auth endpoints
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      me: '/auth/me',
      refresh: '/auth/refresh',
    },
    // Student endpoints
    student: {
      dashboard: '/api/student/dashboard',
      courses: '/api/student/courses',
      progress: '/api/student/progress',
      certificates: '/api/student/certificates',
      profile: '/api/student/profile',
      notifications: '/api/student/notifications',
    },
    // Creator endpoints
    creator: {
      dashboard: '/api/creator/dashboard',
      videos: '/api/creator/videos',
      upload: '/api/creator/videos/upload',
      stats: '/api/creator/stats',
      revenue: '/api/creator/revenue',
      profile: '/api/creator/profile',
      notifications: '/api/creator/notifications',
    },
    // Admin endpoints
    admin: {
      dashboard: '/api/admin/dashboard',
      users: '/api/admin/users',
      courses: '/api/admin/courses',
      analytics: '/api/admin/analytics',
    },
    // Public endpoints
    public: {
      courses: '/api/courses',
      categories: '/api/categories',
      instructors: '/api/instructors',
    }
  }
};

// Helper function pour construire les URLs
export function buildUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

// Helper function pour vérifier le token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper function pour vérifier si l'utilisateur est authentifié
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// Configuration des headers par défaut
export function getDefaultHeaders(includeAuth: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Types pour les erreurs
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fonction utilitaire pour les appels API
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit & { requiresAuth?: boolean } = {}
): Promise<T> {
  const url = buildUrl(endpoint);
  const token = getAuthToken();

  if (!token && options.requiresAuth !== false) {
    throw new ApiError('Authentication required', 401);
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...getDefaultHeaders(options.requiresAuth !== false),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred');
  }
}

// Fonctions utilitaires spécifiques
export const api = {
  get: <T = unknown>(endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

  // Pour les uploads de fichiers
  upload: <T = unknown>(endpoint: string, formData: FormData, options?: Omit<RequestInit, 'method' | 'body' | 'headers'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Accept': 'application/json',
        // Ne pas inclure Content-Type pour FormData (le navigateur le fait automatiquement)
      },
    }),
};

export default API_CONFIG;
