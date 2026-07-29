"use client";

import { createContext, ReactNode, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  defaultRouteLocale,
  isRouteLocale,
  languageToRouteLocale,
  routeLocaleToCurrency,
  routeLocaleToLanguage,
  type Locale,
  type RouteLocale,
} from "@/lib/i18n";

export type Currency = "BRL" | "USD";

interface SettingsContextData {
  language: Locale;
  currency: Currency;
  routeLocale: RouteLocale;
  setLanguage: (language: Locale) => void;
}

const SettingsContext = createContext<SettingsContextData | null>(null);

function getRouteLocaleFromPathname(pathname: string): RouteLocale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (firstSegment && isRouteLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultRouteLocale;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const routeLocale = getRouteLocaleFromPathname(pathname);
  const language = routeLocaleToLanguage(routeLocale);
  const currency = routeLocaleToCurrency(routeLocale);

  function handleSetLanguage(nextLanguage: Locale) {
    const nextRouteLocale = languageToRouteLocale(nextLanguage);
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] && isRouteLocale(segments[0])) {
      segments[0] = nextRouteLocale;
    } else {
      segments.unshift(nextRouteLocale);
    }

    router.push(`/${segments.join("/")}`);
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        currency,
        routeLocale,
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
