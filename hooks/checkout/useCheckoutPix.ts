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

export type PixFieldName = "email" | "cpf";

export type PixFieldErrors = Partial<Record<PixFieldName, string>>;

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
  const [isPixCancelling, setIsPixCancelling] = useState(false);
  const [pixFieldErrors, setPixFieldErrors] = useState<PixFieldErrors>({});

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

  function clearPixFieldError(fieldName: PixFieldName) {
    setPixFieldErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[fieldName];

      return nextErrors;
    });
  }

  function updatePixEmail(value: string) {
    setPixEmail(value);
    clearPixFieldError("email");
    onErrorChange(null);
  }

  function updatePixCpf(value: string) {
    setPixCpf(value);
    clearPixFieldError("cpf");
    onErrorChange(null);
  }

  async function createPix() {
    if (isPixLoading || pixData) {
      return false;
    }

    const normalizedCpf = pixCpf.replace(/\D/g, "");

    const normalizedEmail = pixEmail.trim();

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    const nextFieldErrors: PixFieldErrors = {};

    if (!normalizedEmail) {
      nextFieldErrors.email =
        language === "pt"
          ? "Informe o e-mail do comprador."
          : "Enter the buyer email.";
    } else if (!emailIsValid) {
      nextFieldErrors.email =
        language === "pt"
          ? "Informe um e-mail válido."
          : "Enter a valid email.";
    }

    if (normalizedCpf.length !== 11) {
      nextFieldErrors.cpf =
        language === "pt" ? "Informe um CPF válido." : "Enter a valid CPF.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setPixFieldErrors(nextFieldErrors);
      onErrorChange(null);
      return false;
    }

    setPixFieldErrors({});

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
              email: normalizedEmail,
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
      return true;
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);

      onErrorChange(
        error instanceof Error
          ? error.message
          : language === "pt"
            ? "Não foi possível gerar o pagamento Pix."
            : "Could not generate the Pix payment.",
      );
      return false;
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

  async function cancelPix() {
    if (!pixPaymentId || isPixCancelling) {
      return false;
    }

    setIsPixCancelling(true);
    onErrorChange(null);

    try {
      const response = await fetch(`/api/payments/${pixPaymentId}/cancel`, {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as {
        error?: string;
        status?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ??
            (language === "pt"
              ? "Não foi possível cancelar o pagamento Pix."
              : "Could not cancel the Pix payment."),
        );
      }

      if (data.status !== "cancelled") {
        throw new Error(
          language === "pt"
            ? "O pagamento não foi cancelado."
            : "The payment was not cancelled.",
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao cancelar pagamento Pix:", error);

      onErrorChange(
        error instanceof Error
          ? error.message
          : language === "pt"
            ? "Não foi possível cancelar o pagamento Pix."
            : "Could not cancel the Pix payment.",
      );

      return false;
    } finally {
      setIsPixCancelling(false);
    }
  }

  function resetPix(options?: { clearBuyerData?: boolean }) {
    setPixPaymentId(null);
    setPixData(null);
    setPixStatus(null);
    setPixCopied(false);
    setIsPixLoading(false);
    setPixFieldErrors({});
    setIsPixCancelling(false);

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
    isPixCancelling,
    pixFieldErrors,
    setPixEmail: updatePixEmail,
    setPixCpf: updatePixCpf,
    createPix,
    cancelPix,
    copyPixCode,
    resetPix,
  };
}
