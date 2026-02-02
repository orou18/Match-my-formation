import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignorer les fichiers système et statiques
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // 2. Gestion de la Locale (i18n)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const url = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  // 3. Protection des routes Dashboard (Auth)
  // On récupère le token (adapté selon ton système de stockage : cookie ou autre)
  const token = request.cookies.get("token")?.value;
  
  // Vérifie si le chemin contient "/dashboard" peu importe la langue
  const isDashboardRoute = locales.some(locale => 
    pathname.startsWith(`/${locale}/dashboard`)
  );

  if (isDashboardRoute && !token) {
    const loginUrl = new URL(`/${defaultLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // On applique le middleware à toutes les routes sauf fichiers statiques
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};