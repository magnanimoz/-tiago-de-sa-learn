import { Price } from "@/types/price";
import { TranslatedText } from "@/types/translated-text";

export type LibraryItemType = "song" | "course" | "pack";

export type LibraryItem = {
  type: LibraryItemType;
  slug: string;
  title: TranslatedText;
  artist?: string;
  image: string;
  price: Price;
  href: string;
};
