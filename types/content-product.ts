import type { Difficulty } from "@/types/difficulty";
import type { Lesson } from "@/types/lesson";
import type { Price } from "@/types/price";
import type { Product } from "@/types/product";
import type { TranslatedText } from "@/types/translated-text";
import type { Tuning } from "@/types/tuning";

export type ContentProductType = "song" | "course";

export interface ContentProduct extends Product {
  type: ContentProductType;

  slug: string;
  title: TranslatedText;
  description: TranslatedText;
  artist: string;

  price: Price;
  difficulty: Difficulty;
  duration: string;

  key?: string;
  tuning?: Tuning;
  capo?: string;

  previewVideo: string;
  lessons: Lesson[];
}
