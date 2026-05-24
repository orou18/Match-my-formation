import { useSession } from "next-auth/react";

/**
 * Hook personnalisé pour récupérer le token d'accès Laravel depuis la session NextAuth
 * 
 * SOURCE DE VÉRITÉ UNIQUE : session.user.accessToken
 * 
 * Ce hook doit être utilisé dans tous les composants client qui ont besoin
 * d'appeler l'API Laravel.
 * 
 * Exemple d'utilisation :
 * ```tsx
 * const accessToken = useAccessToken();
 * const response = await fetch('/api/creator/dashboard', {
 *   headers: {
 *     Authorization: `Bearer ${accessToken}`
 *   }
 * });
 * ```
 */
export function useAccessToken(): string | undefined {
  const { data: session } = useSession();
  return session?.user?.accessToken;
}

/**
 * Hook pour vérifier si l'utilisateur est authentifié
 */
export function useIsAuthenticated(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

/**
 * Hook pour récupérer le rôle de l'utilisateur
 */
export function useUserRole(): string | undefined {
  const { data: session } = useSession();
  return session?.user?.role;
}