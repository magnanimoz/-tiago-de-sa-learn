import { Product } from "@/types/product";
import { TranslatedText } from "@/types/translated-text";
import { PackItem } from "@/types/pack-item";

export interface Pack extends Product {
  slug: string;
  title: TranslatedText;
  description: TranslatedText;
  items: PackItem[];
}
