import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  // 1. OBLIGATOIRE : Forcer le mode JWT car on utilise une API externe
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Laravel Backend",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Correction de l'URL avec un fallback localhost
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          
          const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json" 
            }
          });

          const data = await res.json();

          // Dans ton contrôleur Laravel, tu renvoies : ['user' => $user, 'token' => $token]
          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.token, // On stocke le token Sanctum
            };
          }
          return null;
        } catch (error) {
          console.error("Erreur connexion Laravel:", error);
          return null;
        }
      }
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
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/fr/login", 
    error: "/fr/login",
  },
  // Vérifie bien que cette variable est définie dans ton .env
  secret: process.env.NEXTAUTH_SECRET || "panafrican_tourism_academy_secret_key_12345",
});

export { handler as GET, handler as POST };