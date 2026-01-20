import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignorer Next.js, API, fichiers statiques
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));

  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }
}
