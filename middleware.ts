import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locales = ['fr', 'en'];

  // 1. NE PAS TOUCHER aux fichiers dans le dossier public (images, icons, etc.)
  // Si le chemin commence par l'un de ces dossiers, on ignore le middleware
  const publicFiles = ['/images/', '/icons/', '/fonts/', '/logo/'];
  if (publicFiles.some(folder => pathname.startsWith(folder))) {
    return NextResponse.next();
  }

  // 2. Rediriger la racine '/' vers '/fr'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }

  // 3. Vérifier si la locale est déjà présente
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 4. Si pas de locale et pas un fichier (ne contient pas de point)
  if (!pathnameHasLocale && !pathname.includes('.')) {
    return NextResponse.redirect(new URL(`/fr${pathname}`, request.url));
  }

  return NextResponse.next();
}

// 5. Optimisation du matcher pour exclure tout ce qui est technique
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (ton dossier d'images dans public)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|google.png|facebook.png|linkedIn.png).*)',
  ],
};