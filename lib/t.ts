import { TranslatedText } from "@/types/translated-text";

export function t(value: TranslatedText, language: "pt" | "en") {
  return value[language];
}
