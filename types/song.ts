import { TranslatedText } from "@/types/translated-text";
import { Price } from "@/types/price";
import { Product } from "@/types/product";

export interface Song extends Product {
  slug: string;
  title: TranslatedText;
  artist: string;
  description: TranslatedText;

  price: Price;

  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  key: string;
  tuning: string;
  capo: string;

  previewVideo?: string;
}
