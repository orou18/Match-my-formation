// Service d'authentification pour gérer les tokens et les appels API sécurisés

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Priorité: NextAuth session > localStorage > UserIdManager
  const sessionToken = localStorage.getItem("nextauth.session-token");
  if (sessionToken) return sessionToken;

  const userIdToken = localStorage.getItem("auth_token");
  if (userIdToken) return userIdToken;

  return UserIdManager.getToken();
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("auth_token", token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_token");
  localStorage.removeItem("nextauth.session-token");
  localStorage.removeItem("nextauth.csrf-token");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Importer UserIdManager pour la compatibilité
import UserIdManager from "@/lib/user-id-manager";
