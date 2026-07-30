"use client";

import { useState } from "react";

type CheckoutStripeButtonProps = {
  slug: string;
  locale: "en-us";
};

type StripeCheckoutResponse = {
  url?: string;
  error?: string;
};

export default function CheckoutStripeButton({
  slug,
  locale,
}: CheckoutStripeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCheckout() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          slug,
          locale,
        }),
      });

      const data = (await response.json()) as StripeCheckoutResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Error starting Stripe checkout:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Could not start checkout.",
      );

      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="border-b border-white/10 px-3 pb-5 sm:px-5">
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">
          Payment method
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
          Pay securely in USD using your credit or debit card.
        </p>
      </div>

      <div className="pt-5">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/80" />
          )}

          {isLoading ? "Opening secure checkout..." : "Pay with card"}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-white/35">
          You will be redirected to Stripe to complete your payment.
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
