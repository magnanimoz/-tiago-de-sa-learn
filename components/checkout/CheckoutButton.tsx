"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";

type CheckoutButtonProps = {
  slug: string;
};

export default function CheckoutButton({ slug }: CheckoutButtonProps) {
  const { language, routeLocale } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCheckout() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          locale: routeLocale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            (language === "pt"
              ? "Não foi possível iniciar o checkout."
              : "Unable to start checkout."),
        );
      }

      if (!data.url) {
        throw new Error(
          language === "pt"
            ? "A sessão de checkout não retornou uma URL."
            : "The checkout session did not return a URL.",
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : language === "pt"
            ? "Não foi possível iniciar o checkout."
            : "Unable to start checkout.",
      );

      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="
          inline-flex
          min-h-11
          w-full
          items-center
          justify-center
          rounded-lg
          bg-white
          px-5
          text-sm
          font-semibold
          text-black
          transition
          hover:bg-white/85
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isLoading
          ? language === "pt"
            ? "Abrindo pagamento..."
            : "Opening checkout..."
          : language === "pt"
            ? "Finalizar compra"
            : "Complete purchase"}
      </button>

      {errorMessage && (
        <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
