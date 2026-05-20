import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware Next.js pour la protection des routes et la gestion des rôles
 * 
 * RÔLES ET DASHBOARDS :
 * - admin    -> /[locale]/dashboard/admin
 * - creator  -> /[locale]/dashboard/creator
 * - student  -> /[locale]/dashboard/student
 * - employee -> /[locale]/dashboard/employee
 * 
 * SOURCE DE VÉRITÉ : session NextAuth (session.user.role)
 */

// Configuration du middleware
export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userRole = token?.role as string | undefined;

    console.log(`[Middleware] Path: ${pathname}, Role: ${userRole}`);

    // Routes publiques (pas d'authentification requise)
    const publicRoutes = [
      "/fr/login",
      "/en/login",
      "/fr/register",
      "/en/register",
      "/fr/auth/employee",
      "/en/auth/employee",
      "/fr/auth/employee-login",
      "/en/auth/employee-login",
      "/fr/forgot-password",
      "/en/forgot-password",
      "/",
    ];

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + "/")
    );

    if (isPublicRoute) {
      // Si l'utilisateur est déjà connecté, le rediriger vers son dashboard
      if (token && (pathname.includes("/login") || pathname.includes("/register"))) {
        const role = token.role as string;
        const locale = pathname.split("/")[1] || "fr";
        
        console.log(`[Middleware] User already authenticated, redirecting to /${locale}/dashboard/${role}`);
        
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard/${role}`, req.url)
        );
      }
      return NextResponse.next();
    }

    // Routes protégées : vérifier l'authentification
    if (!token) {
      console.log(`[Middleware] No token found, redirecting to login`);
      const loginUrl = new URL("/fr/login", req.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(loginUrl);
    }

    // Routes dashboard : vérifier le rôle
    const dashboardMatch = pathname.match(/^\/([^\/]+)\/dashboard\/([^\/]+)/);
    if (dashboardMatch) {
      const locale = dashboardMatch[1];
      const dashboardRole = dashboardMatch[2];

      // Vérifier que l'utilisateur accède à SON dashboard
      if (userRole && userRole !== dashboardRole) {
        console.log(`[Middleware] Role mismatch: user has '${userRole}' but accessing '${dashboardRole}' dashboard. Redirecting to correct dashboard.`);
        
        // Rediriger vers le bon dashboard
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard/${userRole}`, req.url)
        );
      }

      console.log(`[Middleware] Access granted to ${dashboardRole} dashboard`);
    }

    // Autres routes protégées : laisser passer
    return NextResponse.next();
  },
  {
    // Pages de connexion
    pages: {
      signIn: "/fr/login",
    },
    // Callback pour déterminer si la route nécessite une authentification
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Routes publiques
        const publicRoutes = [
          "/fr/login",
          "/en/login",
          "/fr/register",
          "/en/register",
          "/fr/auth/employee",
          "/en/auth/employee",
          "/fr/auth/employee-login",
          "/en/auth/employee-login",
          "/fr/forgot-password",
          "/en/forgot-password",
          "/",
          "/api/auth/csrf",
        ];

        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
          return true;
        }

        // Toutes les autres routes nécessitent une authentification
        return !!token;
      },
    },
  }
);

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};