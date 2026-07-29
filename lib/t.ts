import type { Locale } from "@/lib/i18n";
import type { TranslatedText } from "@/types/translated-text";

export function t(value: TranslatedText, language: Locale) {
  return value[language];
}
