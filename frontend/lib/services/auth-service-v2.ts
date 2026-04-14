// Service d'authentification pour gérer les tokens et les appels API sécurisés

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  message?: string;
}

export class AuthService {
  private getProxyUrl(path: string): string {
    return path;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(this.getProxyUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si le JSON ne peut être parsé, garder le message par défaut
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error: any) {
      console.error("Erreur de connexion:", error);

      if (error.name === "AbortError") {
        throw new Error(
          "Timeout: la route d'authentification ne répond pas. Vérifie le frontend et le backend."
        );
      }

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "La route d'authentification est inaccessible. Vérifie que le frontend Next et le backend Laravel tournent bien."
        );
      }

      throw error;
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<LoginResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(this.getProxyUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si le JSON ne peut être parsé, garder le message par défaut
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        token: data.token,
        message: data.message || "Inscription réussie",
        user: data.user,
      };
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);

      if (error.name === "AbortError") {
        throw new Error(
          "Timeout: la route d'inscription ne répond pas. Vérifie le frontend et le backend."
        );
      }

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "La route d'inscription est inaccessible. Vérifie que le frontend Next et le backend Laravel tournent bien."
        );
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    const token = this.getAuthToken();
    if (!token) return;

    try {
      await fetch(this.getProxyUrl("/api/auth/logout"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.warn("Erreur lors de la déconnexion:", error);
    }
  }

  getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    const userIdToken = localStorage.getItem("auth_token");
    if (userIdToken) return userIdToken;

    try {
      const UserIdManager = require("../user-id-manager").default;
      return UserIdManager.getToken();
    } catch {
      return null;
    }
  }

  setAuthToken(token: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("auth_token", token);
  }

  clearAuthToken(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();
