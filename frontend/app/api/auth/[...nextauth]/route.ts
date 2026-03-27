import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { ensureUserRecords, findAccountByEmail } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
  accessToken?: string;
};

const authOptions: AuthOptions = {
  // 1. OBLIGATOIRE : Forcer le mode JWT car on utilise une API externe
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Laravel Backend",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

          const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/login`, {
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

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.token, // On stocke le token Sanctum
            };
          }
        } catch (error) {
          console.error("Erreur connexion Laravel:", error);
        }

        const localUser = findAccountByEmail(String(credentials.email));
        if (!localUser || localUser.password !== credentials.password) {
          return null;
        }

        ensureUserRecords(localUser.id, localUser.role);
        return {
          id: Number(localUser.id),
          name: localUser.name,
          email: localUser.email,
          role: localUser.role,
          accessToken: `mock-${localUser.role}-token-${localUser.id}-${Date.now()}`,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "temp",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temp",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "temp",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "temp",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "temp",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "temp",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: Record<string, unknown> }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: { user?: SessionUser };
      token: Record<string, unknown>;
    }) {
      if (session.user) {
        session.user.id = token.id as string | number | undefined;
        session.user.role = token.role as string | undefined;
        session.user.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/fr/login",
    error: "/fr/login",
  },
  // Vérifie bien que cette variable est définie dans ton .env
  secret:
    process.env.NEXTAUTH_SECRET ||
    "panafrican_tourism_academy_secret_key_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
