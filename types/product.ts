import { Price } from "@/types/price";

export interface Product {
  price: Price;
  image: string;
  featured: boolean;
  published: boolean;
}
