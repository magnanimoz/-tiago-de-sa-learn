import type { CheckoutLocale, PaymentMethod } from "@/types/checkout-payment";

export type CheckoutProvider = "mercado_pago" | "stripe";

export type CheckoutCurrency = "BRL" | "USD";

export type CheckoutConfig = {
  provider: CheckoutProvider;
  currency: CheckoutCurrency;
  availableMethods: Array<Exclude<PaymentMethod, null>>;
};

export function getCheckoutConfig(locale: CheckoutLocale): CheckoutConfig {
  if (locale === "pt-br") {
    return {
      provider: "mercado_pago",
      currency: "BRL",
      availableMethods: ["card", "pix"],
    };
  }

  return {
    provider: "stripe",
    currency: "USD",
    availableMethods: ["card"],
  };
}
