"use client";

import type { ReactNode } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SettingsProvider>
      <AuthModalProvider>{children}</AuthModalProvider>
    </SettingsProvider>
  );
}
