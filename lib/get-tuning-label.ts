import type { Locale } from "@/lib/i18n";
import type { Tuning } from "@/types/tuning";

export function getTuningLabel(tuning: Tuning, language: Locale): string {
  switch (tuning) {
    case "Standard":
      return language === "pt" ? "Afinação Padrão" : "Standard tuning";

    case "Drop D":
      return language === "pt" ? "Afinação em Ré (Drop D)" : "Drop D tuning";

    case "Half Step Down":
      return language === "pt" ? "Meio tom abaixo" : "Half-step down tuning";

    case "Full Step Down":
      return language === "pt" ? "Um tom abaixo" : "Whole-step down tuning";

    case "DADGAD":
      return language === "pt" ? "Afinação DADGAD" : "DADGAD tuning";

    case "Open G":
      return language === "pt" ? "Afinação Open G" : "Open G tuning";

    case "Open D":
      return language === "pt" ? "Afinação Open D" : "Open D tuning";

    default:
      return tuning;
  }
}
