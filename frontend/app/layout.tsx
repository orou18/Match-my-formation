// app/layout.tsx
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import "./globals.css";

export const metadata = {
  title: "Match My Formation - Plateforme E-Learning",
  description: "Trouvez votre formation en tourisme et hôtellerie",
  keywords: "formation, tourisme, hôtellerie, e-learning, cours professionnel",
  authors: [{ name: "Match My Formation" }],
  openGraph: {
    title: "Match My Formation",
    description: "Plateforme E-Learning pour les formations en tourisme",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Match My Formation",
    description: "Plateforme E-Learning pour les formations en tourisme",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // On ne met pas d'attribut lang fixe ici car il changera avec [locale]
    <html>
      <head>
        {/* Préchargement critique */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Optimisation du cache */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        
        {/* DNS prefetch pour les ressources externes */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//api.unsplash.com" />
      </head>
      <body className="antialiased">
        <NextAuthProvider>{children}</NextAuthProvider>
        
        {/* Scripts différés pour la performance */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              // Lazy loading des images
              if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      imageObserver.unobserve(img);
                    }
                  });
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
