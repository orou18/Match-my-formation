// app/layout.tsx
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import "./globals.css";

export const metadata = {
  title: "Match My Formation",
  description: "Trouvez votre formation en tourisme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // On ne met pas d'attribut lang fixe ici car il changera avec [locale]
    <html>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
