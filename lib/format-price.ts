import { Price } from "@/types/price";

export function formatPrice(price: Price, currency: "BRL" | "USD" = "BRL") {
  const value = currency === "BRL" ? price.brl : price.usd;

  if (value === 0) {
    return currency === "BRL" ? "Grátis" : "Free";
  }

  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency,
  }).format(value);
}
