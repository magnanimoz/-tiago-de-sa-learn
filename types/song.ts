import { TranslatedText } from "@/types/translated-text";
import { Price } from "@/types/price";
import { Product } from "@/types/product";
import type { Lesson } from "@/types/lesson";
import type { Tuning } from "@/types/tuning";
import type { Difficulty } from "./difficulty";

export interface Song extends Product {
  slug: string;
  title: TranslatedText;
  artist: string;
  description: TranslatedText;

  price: Price;

  difficulty: Difficulty;
  duration: string;
  key: string;
  tuning: Tuning;
  capo: string;

  previewVideo: string;
  lessons: Lesson[];
}
