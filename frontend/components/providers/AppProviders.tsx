"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { TranslationProvider } from "./TranslationProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TranslationProvider>{children}</TranslationProvider>
    </ThemeProvider>
  );
}
