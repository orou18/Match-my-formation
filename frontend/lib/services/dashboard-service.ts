"use client";

/**
 * Service Dashboard - Version corrigée
 * 
 * CHANGEMENTS :
 * - Suppression de buildAuthHeaders() qui utilisait localStorage
 * - Tous les appels passent maintenant par les API routes Next.js
 * - Les API routes Next.js gèrent l'authentification via session.accessToken
 * - credentials: "include" pour inclure les cookies NextAuth
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

export const dashboardService = {
  /**
   * Récupère les données du dashboard creator
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getCreatorDashboard<T = JsonObject>() {
    return readJson<T>(
      await fetch("/api/creator/dashboard", {
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
   * Récupère les données du dashboard student
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getStudentDashboard<T = JsonObject>() {
    return readJson<T>(
      await fetch("/api/student/dashboard", {
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
   * Récupère les analytics admin
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getAdminAnalytics<T = JsonObject>(period = "30d", metric = "revenue") {
    const params = new URLSearchParams({ period, metric });
    return readJson<T>(
      await fetch(`/api/admin/stats?${params.toString()}`, {
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
   * Récupère les paramètres de branding
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async getBrandingSettings<T = JsonObject>() {
    return readJson<T>(
      await fetch("/api/admin/branding", {
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
   * Met à jour les paramètres de branding
   * Passe par l'API route Next.js qui gère l'authentification
   */
  async updateBrandingSettings<T = JsonObject>(data: FormData) {
    return readJson<T>(
      await fetch("/api/admin/branding", {
        method: "PUT",
        body: data,
        credentials: "include", // Inclut les cookies NextAuth
        headers: {
          "Accept": "application/json",
        },
      })
    );
  },
};
