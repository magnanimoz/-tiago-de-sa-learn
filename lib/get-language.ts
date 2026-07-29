import { cookies } from "next/headers";

import { defaultLocale, locales, type Locale } from "@/lib/i18n";

const LANGUAGE_COOKIE_NAME = "language";

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export async function getLanguage(): Promise<Locale> {
  const cookieStore = await cookies();
  const language = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  if (language && isLocale(language)) {
    return language;
  }

  return defaultLocale;
}
