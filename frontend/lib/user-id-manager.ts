/**
 * Gestionnaire d'IDs utilisateur pour garantir la cohérence
 * entre la connexion, l'inscription et le profil
 */

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "student" | "creator" | "admin";
  avatar?: string;
  provider?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthData {
  token: string;
  user: UserData;
}

export class UserIdManager {
  private static readonly STORAGE_KEYS = {
    TOKEN: "token",
    USER_ROLE: "userRole",
    USER_ID: "userId",
    USER_NAME: "userName",
    USER_EMAIL: "userEmail",
    USER_AVATAR: "userAvatar",
    PROVIDER: "socialProvider",
  };

  /**
   * Stocke les données d'authentification de manière cohérente
   */
  static storeAuthData(authData: AuthData): void {
    const { token, user } = authData;

    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(this.STORAGE_KEYS.USER_ROLE, user.role);
    localStorage.setItem(this.STORAGE_KEYS.USER_ID, user.id.toString());
    localStorage.setItem(this.STORAGE_KEYS.USER_NAME, user.name);
    localStorage.setItem(this.STORAGE_KEYS.USER_EMAIL, user.email);

    if (user.avatar) {
      localStorage.setItem(this.STORAGE_KEYS.USER_AVATAR, user.avatar);
    }

    if (user.provider) {
      localStorage.setItem(this.STORAGE_KEYS.PROVIDER, user.provider);
    }
  }

  /**
   * Récupère les données utilisateur stockées
   */
  static getStoredUserData(): UserData | null {
    // Vérifier si nous sommes côté serveur
    if (typeof window === "undefined") {
      return null;
    }

    const id = localStorage.getItem(this.STORAGE_KEYS.USER_ID);
    const name = localStorage.getItem(this.STORAGE_KEYS.USER_NAME);
    const email = localStorage.getItem(this.STORAGE_KEYS.USER_EMAIL);
    const role = localStorage.getItem(
      this.STORAGE_KEYS.USER_ROLE
    ) as UserData["role"];
    const avatar = localStorage.getItem(this.STORAGE_KEYS.USER_AVATAR);
    const provider = localStorage.getItem(this.STORAGE_KEYS.PROVIDER);

    if (!id || !name || !email || !role) {
      return null;
    }

    return {
      id: parseInt(id),
      name,
      email,
      role,
      avatar: avatar || undefined,
      provider: provider || undefined,
    };
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      // Côté serveur: utiliser les cookies ou vérifier autrement
      return false;
    }
    return (
      !!localStorage.getItem(this.STORAGE_KEYS.TOKEN) &&
      !!this.getStoredUserData()
    );
  }

  /**
   * Déconnecte l'utilisateur
   */
  static logout(): void {
    if (typeof window === "undefined") return;

    Object.values(this.STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Récupère l'ID utilisateur actuel
   */
  static getCurrentUserId(): number | null {
    const userId = localStorage.getItem(this.STORAGE_KEYS.USER_ID);
    return userId ? parseInt(userId) : null;
  }

  static getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  /**
   * Crée des données utilisateur de test (pour le développement)
   */
  static createTestUser(): void {
    if (typeof window === "undefined") return;

    const testUser: UserData = {
      id: 1,
      name: "Étudiant Test",
      email: "student@example.com",
      role: "student",
      avatar: undefined,
      provider: undefined,
    };

    const testToken = "test-token-" + Date.now();

    this.storeAuthData({
      token: testToken,
      user: testUser,
    });
  }

  /**
   * Initialise un utilisateur de test si aucun utilisateur n'existe
   */
  static initializeTestUserIfNeeded(): void {
    if (typeof window === "undefined") return;

    if (!this.isAuthenticated()) {
      this.createTestUser();
    }
  }
}

export default UserIdManager;
