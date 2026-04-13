// app/layout.tsx
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { NotificationsProvider } from "@/components/ui/Notifications";
import { BrandingProvider } from "@/components/branding/BrandingProvider";
import { ThemeProvider } from "@/lib/theme-provider";
import { TranslationProvider } from "@/lib/i18n-provider";
import "./globals.css";

const metadataBase =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_FRONTEND_URL
    ? new URL(
        process.env.NEXT_PUBLIC_APP_URL ||
          process.env.NEXT_PUBLIC_FRONTEND_URL ||
          "http://localhost:3000"
      )
    : new URL("http://localhost:3000");

export const metadata = {
  metadataBase,
  title: "Match My Formation - Plateforme E-Learning",
  description: "Trouvez votre formation en tourisme et hôtellerie",
  keywords: "formation, tourisme, hôtellerie, e-learning, cours professionnel",
  authors: [{ name: "Match My Formation" }],
  openGraph: {
    title: "Match My Formation",
    description: "Plateforme E-Learning pour les formations en tourisme",
    type: "website",
    locale: "fr_FR",
    siteName: "Match My Formation",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Match My Formation - Plateforme E-Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Match My Formation",
    description: "Plateforme E-Learning pour les formations en tourisme",
    images: ["/og-image.jpg"],
  },
  robots: "index, follow",
  other: {
    "theme-color": "#007A7A",
    "msapplication-TileColor": "#007A7A",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // On ne met pas d'attribut lang fixe ici car il changera avec [locale]
    <html className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Préchargement critique des polices */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Optimisation du cache et performance */}
        <meta name="theme-color" content="#007A7A" />
        <meta name="msapplication-TileColor" content="#007A7A" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* DNS prefetch pour les ressources externes */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//api.unsplash.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Performance optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        className="antialiased font-sans text-gray-900 bg-gray-50 selection:bg-primary/20 selection:text-primary"
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <TranslationProvider>
            <NextAuthProvider>
              <BrandingProvider>
                <NotificationsProvider>
                  <div className="min-h-screen flex flex-col">
                    {/* Skip to main content for accessibility */}
                    <a
                      href="#main-content"
                      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50"
                    >
                      Aller au contenu principal
                    </a>

                    {/* Main content wrapper */}
                    <main id="main-content" className="flex-1">
                      {children}
                    </main>
                  </div>
                </NotificationsProvider>
              </BrandingProvider>
            </NextAuthProvider>
          </TranslationProvider>
        </ThemeProvider>

        {/* Performance monitoring script */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              // Lazy loading des images avec performance
              if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      const src = img.dataset.src;
                      if (src) {
                        img.src = src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                      }
                    }
                  });
                }, {
                  rootMargin: '50px 0px',
                  threshold: 0.01
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                  imageObserver.observe(img);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
