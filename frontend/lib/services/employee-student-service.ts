"use client";

/**
 * Service Employee Student - Version corrigée
 * 
 * CHANGEMENTS :
 * - Suppression de buildAuthHeaders() qui utilisait localStorage("employee_token")
 * - Tous les appels passent maintenant par les API routes Next.js
 * - Les API routes Next.js gèrent l'authentification via session.accessToken
 * - credentials: "include" pour inclure les cookies NextAuth
 * - Employee est maintenant intégré au système NextAuth comme les autres rôles
 */

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

export const employeeStudentService = {
  /**
   * Récupère les données du dashboard employee/student
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getDashboard<T = JsonObject>() {
    return readJson<T>(
      await fetch("/api/employee/student/dashboard", {
        cache: "no-store",
        credentials: "include", // Inclut les cookies NextAuth
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
    );
  },

  /**
   * Récupère les vidéos de l'employee
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getVideos<T = JsonObject>(params?: {
    search?: string;
    category?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    return readJson<T>(
      await fetch(`/api/employee/student/videos${queryString}`, {
        cache: "no-store",
        credentials: "include", // Inclut les cookies NextAuth
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
    );
  },

  /**
   * Récupère les parcours de l'employee
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getPathways<T = JsonObject>(params?: {
    search?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    return readJson<T>(
      await fetch(`/api/employee/student/pathways${queryString}`, {
        cache: "no-store",
        credentials: "include", // Inclut les cookies NextAuth
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
    );
  },

  /**
   * Récupère les détails d'un parcours
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getPathwayDetails<T = JsonObject>(pathwayId: number) {
    return readJson<T>(
      await fetch(`/api/employee/student/pathways/${pathwayId}`, {
        cache: "no-store",
        credentials: "include", // Inclut les cookies NextAuth
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
    );
  },

  /**
   * Marque une vidéo comme complétée
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async completeVideo<T = JsonObject>(videoId: number, data: {
    watched_duration: number;
    completed: boolean;
  }) {
    return readJson<T>(
      await fetch(`/api/employee/student/videos/${videoId}/complete`, {
        method: "POST",
        credentials: "include", // Inclut les cookies NextAuth
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      })
    );
  },
};
