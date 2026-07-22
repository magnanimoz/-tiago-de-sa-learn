import { Product } from "@/types/product";
import { TranslatedText } from "@/types/translated-text";

export interface Course extends Product {
  slug: string;
  title: TranslatedText;
  description: TranslatedText;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: string[];
  previewVideo: string;
}
