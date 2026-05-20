import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { fetchBackend } from "@/lib/api/backend-fetch";

/**
 * Configuration NextAuth pour Match-my-formation
 * 
 * SOURCE DE VÉRITÉ UNIQUE :
 * - session.user.role (rôle de l'utilisateur)
 * - session.user.accessToken (token Laravel pour les appels API)
 * - session.user.id (ID de l'utilisateur)
 * 
 * RÔLES SUPPORTÉS :
 * - admin    -> /[locale]/dashboard/admin
 * - creator  -> /[locale]/dashboard/creator
 * - student  -> /[locale]/dashboard/student
 * - employee -> /[locale]/dashboard/employee
 */

type SessionUser = {
  id?: string | number;
  role?: string;
  accessToken?: string;
};

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    // Durée de session : 7 jours (conformément aux décisions architecturales)
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  providers: [
    CredentialsProvider({
      name: "Laravel Backend",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[NextAuth] Authorize attempt for email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.warn("[NextAuth] Missing email or password");
          return null;
        }

        try {
          const res = await fetchBackend("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          const data = await res.json().catch(() => null);

          if (res.ok && data?.user && data?.token) {
            console.log("[NextAuth] Backend login successful for:", data.user.email, "Role:", data.user.role);
            
            // S'assurer que le rôle est défini (défaut: student)
            const role = data.user.role || "student";
            
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: role,
              accessToken: data.token,
            };
          }

          console.error(
            "[NextAuth] Backend login failed:",
            data?.message || "Unknown error"
          );
          return null;
        } catch (error) {
          console.error("[NextAuth] Backend connection error:", error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    /**
     * Callback JWT : Stocke les données utilisateur dans le JWT
     * Exécuté à chaque fois qu'un JWT est créé ou mis à jour
     */
    async jwt({ token, user, trigger, session }) {
      // Lors de la connexion initiale, on ajoute les données utilisateur au JWT
      if (user) {
        console.log("[NextAuth JWT] Storing user data in JWT:", {
          id: user.id,
          role: user.role,
          hasAccessToken: !!user.accessToken,
        });
        
        token.id = user.id;
        token.role = user.role || "student"; // Rôle par défaut: student
        token.accessToken = user.accessToken;
      }
      
      // Gestion des mises à jour de session (ex: refresh token)
      if (trigger === "update" && session) {
        console.log("[NextAuth JWT] Session update triggered");
        if (session.accessToken) {
          token.accessToken = session.accessToken;
        }
      }
      
      return token;
    },
    
    /**
     * Callback Session : Expose les données du JWT dans la session
     * Exécuté à chaque fois qu'une session est vérifiée
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string | number | undefined;
        session.user.role = (token.role as string) || "student"; // Rôle par défaut: student
        session.user.accessToken = token.accessToken as string | undefined;
        
        console.log("[NextAuth Session] Session populated:", {
          id: session.user.id,
          role: session.user.role,
          hasAccessToken: !!session.user.accessToken,
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/fr/login",
    error: "/fr/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  // Configuration de sécurité
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
