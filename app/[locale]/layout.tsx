import { notFound } from "next/navigation";

import { isRouteLocale, routeLocales, type RouteLocale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routeLocales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isRouteLocale(locale)) {
    notFound();
  }

  const currentLocale: RouteLocale = locale;

  return <div data-locale={currentLocale}>{children}</div>;
}
