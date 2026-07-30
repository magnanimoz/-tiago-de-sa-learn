import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutStatusFromPayment } from "@/lib/checkout/payment-status";

import type {
  CheckoutLanguage,
  CheckoutLocale,
  CheckoutStatus,
  PaymentResponse,
  PaymentStatusRow,
  PixPaymentData,
} from "@/types/checkout-payment";

type UseCheckoutPixProps = {
  enabled: boolean;
  slug: string;
  locale: CheckoutLocale;
  language: CheckoutLanguage;
  checkoutStatus: CheckoutStatus;
  onStatusChange: (status: CheckoutStatus) => void;
  onPaymentIdChange: (paymentId: number | null) => void;
  onErrorChange: (message: string | null) => void;
};

const supabase = createClient();

export function useCheckoutPix({
  enabled,
  slug,
  locale,
  language,
  checkoutStatus,
  onStatusChange,
  onPaymentIdChange,
  onErrorChange,
}: UseCheckoutPixProps) {
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [pixPaymentId, setPixPaymentId] = useState<number | null>(null);
  const [pixStatus, setPixStatus] = useState<string | null>(null);
  const [pixEmail, setPixEmail] = useState("");
  const [pixCpf, setPixCpf] = useState("");
  const [pixCopied, setPixCopied] = useState(false);
  const [isPixLoading, setIsPixLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !pixPaymentId || checkoutStatus !== "choosing") {
      return;
    }

    let cancelled = false;

    function applyPaymentStatus(status: string) {
      if (cancelled) {
        return;
      }

      setPixStatus(status);

      const nextCheckoutStatus = getCheckoutStatusFromPayment(status);

      if (
        nextCheckoutStatus === "approved" ||
        nextCheckoutStatus === "failure"
      ) {
        onPaymentIdChange(pixPaymentId);
        onStatusChange(nextCheckoutStatus);
      }
    }

    const channel = supabase
      .channel(`payment-${pixPaymentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payments",
          filter: `mercado_pago_payment_id=eq.${pixPaymentId}`,
        },
        (payload) => {
          const payment = payload.new as PaymentStatusRow;

          if (payment.mercado_pago_payment_id !== pixPaymentId) {
            return;
          }

          applyPaymentStatus(payment.status);
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Erro ao assinar atualizações do pagamento Pix.");
        }

        if (status === "TIMED_OUT") {
          console.error("A assinatura do pagamento Pix expirou.");
        }
      });

    async function loadCurrentStatus() {
      try {
        const response = await fetch(`/api/payments/${pixPaymentId}`, {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data = (await response.json()) as PaymentResponse;

        if (!response.ok) {
          throw new Error(
            data.error ??
              (language === "pt"
                ? "Não foi possível consultar o pagamento."
                : "Could not check the payment."),
          );
        }

        if (data.status) {
          applyPaymentStatus(data.status);
        }
      } catch (error) {
        console.error("Erro ao consultar status inicial do Pix:", error);
      }
    }

    void loadCurrentStatus();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [
    checkoutStatus,
    enabled,
    language,
    onPaymentIdChange,
    onStatusChange,
    pixPaymentId,
  ]);

  async function createPix() {
    if (isPixLoading || pixData) {
      return;
    }

    const normalizedCpf = pixCpf.replace(/\D/g, "");

    if (!pixEmail.trim()) {
      onErrorChange(
        language === "pt"
          ? "Informe o e-mail do comprador."
          : "Enter the buyer email.",
      );
      return;
    }

    if (normalizedCpf.length !== 11) {
      onErrorChange(
        language === "pt" ? "Informe um CPF válido." : "Enter a valid CPF.",
      );
      return;
    }

    setIsPixLoading(true);
    setPixCopied(false);
    onErrorChange(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          locale,
          paymentMethod: "pix",
          paymentData: {
            payer: {
              email: pixEmail.trim(),
              identification: {
                type: "CPF",
                number: normalizedCpf,
              },
            },
          },
        }),
      });

      const data = (await response.json()) as PaymentResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            (language === "pt"
              ? "Não foi possível gerar o pagamento Pix."
              : "Could not generate the Pix payment."),
        );
      }

      if (!data.paymentId) {
        throw new Error(
          language === "pt"
            ? "O Mercado Pago não retornou o pagamento."
            : "Mercado Pago did not return the payment.",
        );
      }

      if (!data.pix?.qrCode && !data.pix?.ticketUrl) {
        throw new Error(
          language === "pt"
            ? "O Mercado Pago não retornou os dados do Pix."
            : "Mercado Pago did not return the Pix data.",
        );
      }

      setPixPaymentId(data.paymentId);
      setPixData(data.pix);
      setPixStatus(data.status ?? "pending");
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);

      onErrorChange(
        error instanceof Error
          ? error.message
          : language === "pt"
            ? "Não foi possível gerar o pagamento Pix."
            : "Could not generate the Pix payment.",
      );
    } finally {
      setIsPixLoading(false);
    }
  }

  async function copyPixCode() {
    if (!pixData?.qrCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(pixData.qrCode);

      setPixCopied(true);

      window.setTimeout(() => {
        setPixCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar código Pix:", error);

      onErrorChange(
        language === "pt"
          ? "Não foi possível copiar o código Pix."
          : "Could not copy the Pix code.",
      );
    }
  }

  function resetPix(options?: { clearBuyerData?: boolean }) {
    setPixPaymentId(null);
    setPixData(null);
    setPixStatus(null);
    setPixCopied(false);
    setIsPixLoading(false);

    if (options?.clearBuyerData) {
      setPixEmail("");
      setPixCpf("");
    }
  }

  return {
    pixData,
    pixPaymentId,
    pixStatus,
    pixEmail,
    pixCpf,
    pixCopied,
    isPixLoading,
    setPixEmail,
    setPixCpf,
    createPix,
    copyPixCode,
    resetPix,
  };
}
