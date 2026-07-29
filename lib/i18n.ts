export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const routeLocales = ["pt-br", "en-us"] as const;

export type RouteLocale = (typeof routeLocales)[number];

export const defaultRouteLocale: RouteLocale = "pt-br";

export function isRouteLocale(value: string): value is RouteLocale {
  return routeLocales.includes(value as RouteLocale);
}

export function routeLocaleToLanguage(routeLocale: RouteLocale): Locale {
  return routeLocale === "pt-br" ? "pt" : "en";
}

export function languageToRouteLocale(language: Locale): RouteLocale {
  return language === "pt" ? "pt-br" : "en-us";
}

export function routeLocaleToCurrency(routeLocale: RouteLocale): "BRL" | "USD" {
  return routeLocale === "pt-br" ? "BRL" : "USD";
}
