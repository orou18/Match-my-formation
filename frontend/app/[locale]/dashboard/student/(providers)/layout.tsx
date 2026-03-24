"use client";

import { ThemeProvider } from "@/lib/theme-provider";
import { TranslationProvider } from "@/lib/i18n-provider";

export default function StudentProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  );
}
