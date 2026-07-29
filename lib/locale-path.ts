import type { RouteLocale } from "@/lib/i18n";

export function localePath(pathname: string, routeLocale: RouteLocale): string {
  if (!pathname || pathname === "/") {
    return `/${routeLocale}`;
  }

  if (
    pathname.startsWith("http://") ||
    pathname.startsWith("https://") ||
    pathname.startsWith("mailto:") ||
    pathname.startsWith("tel:") ||
    pathname.startsWith("#")
  ) {
    return pathname;
  }

  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments[0] === "pt-br" || segments[0] === "en-us") {
    segments[0] = routeLocale;

    return `/${segments.join("/")}`;
  }

  return `/${routeLocale}${normalizedPathname}`;
}
