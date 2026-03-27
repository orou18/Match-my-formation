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

  // IDs de base pour les comptes de test
  private static readonly BASE_IDS = {
    admin: 1,
    creator: 2,
    student: 3,
  };

  /**
   * Génère un ID unique pour un nouvel utilisateur
   */
  static generateUserId(role: string): number {
    const timestamp = Date.now();
    const rolePrefix = this.BASE_IDS[role as keyof typeof this.BASE_IDS] || 999;
    return parseInt(`${rolePrefix}${timestamp.toString().slice(-6)}`);
  }

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
   * Crée les données de test pour la connexion
   */
  static createTestUser(email: string, password: string): AuthData | null {
    const testUsers = {
      "student@match.com": {
        id: this.BASE_IDS.student,
        name: "Alice Élève",
        email: "student@match.com",
        role: "student" as const,
        avatar: "/avatars/student.jpg",
      },
      "creator@match.com": {
        id: this.BASE_IDS.creator,
        name: "Jean Formateur",
        email: "creator@match.com",
        role: "creator" as const,
        avatar: "/avatars/creator.jpg",
      },
      "admin@match.com": {
        id: this.BASE_IDS.admin,
        name: "Direction Match Admin",
        email: "admin@match.com",
        role: "admin" as const,
        avatar: "/avatars/admin.jpg",
      },
    };

    const userData = testUsers[email as keyof typeof testUsers];
    if (!userData) return null;

    return {
      token: `mock-${userData.role}-token-${Date.now()}`,
      user: userData,
    };
  }

  /**
   * Crée un nouvel utilisateur pour l'inscription
   */
  static createNewUser(
    name: string,
    email: string,
    role: string,
    provider?: string
  ): AuthData {
    const userData: UserData = {
      id: this.generateUserId(role),
      name,
      email,
      role: role as UserData["role"],
      avatar: `/avatars/${role}.jpg`,
      provider,
    };

    return {
      token: `mock-token-${Date.now()}`,
      user: userData,
    };
  }

  /**
   * Crée un utilisateur de connexion sociale
   */
  static createSocialUser(provider: string): AuthData {
    const userData: UserData = {
      id: this.generateUserId("student"),
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user.${provider}@match.com`,
      role: "student",
      avatar: `/${provider}-avatar.jpg`,
      provider,
    };

    return {
      token: `social-${provider}-token-${Date.now()}`,
      user: userData,
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
}

export default UserIdManager;
