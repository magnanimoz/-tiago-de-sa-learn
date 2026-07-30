import { useEffect, useRef, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { getCheckoutStatusFromPayment } from "@/lib/checkout/payment-status";

import type {
  CheckoutLanguage,
  CheckoutLocale,
  CheckoutStatus,
  PaymentResponse,
} from "@/types/checkout-payment";

type UseCheckoutCardProps = {
  enabled: boolean;
  slug: string;
  amount: number;
  locale: CheckoutLocale;
  language: CheckoutLanguage;
  onStatusChange: (status: CheckoutStatus) => void;
  onPaymentIdChange: (paymentId: number) => void;
  onErrorChange: (message: string | null) => void;
};

const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

export function useCheckoutCard({
  enabled,
  slug,
  amount,
  locale,
  language,
  onStatusChange,
  onPaymentIdChange,
  onErrorChange,
}: UseCheckoutCardProps) {
  const [cardReady, setCardReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardFormRef = useRef<MercadoPagoCardForm | null>(null);
  const isSubmittingRef = useRef(false);

  function resetCard() {
    cardFormRef.current?.unmount?.();
    cardFormRef.current = null;
    isSubmittingRef.current = false;

    setCardReady(false);
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!enabled || !publicKey) {
      return;
    }

    const mercadoPagoPublicKey = publicKey;
    let cancelled = false;

    async function initializeCardForm() {
      try {
        setCardReady(false);
        onErrorChange(null);

        await loadMercadoPago();

        if (cancelled || !window.MercadoPago) {
          return;
        }

        await new Promise<void>((resolve, reject) => {
          const startedAt = Date.now();

          function waitForForm() {
            if (cancelled) {
              reject(new Error("Inicialização do cartão cancelada."));
              return;
            }

            const formElement = document.getElementById("form-checkout");

            if (formElement) {
              resolve();
              return;
            }

            if (Date.now() - startedAt > 3000) {
              reject(
                new Error(
                  "O formulário do cartão não apareceu no tempo esperado.",
                ),
              );
              return;
            }

            requestAnimationFrame(waitForForm);
          }

          waitForForm();
        });

        if (cancelled) {
          return;
        }

        const mp = new window.MercadoPago(mercadoPagoPublicKey, {
          locale: language === "pt" ? "pt-BR" : "en-US",
          advancedFraudPrevention: true,
        });

        const cardForm = mp.cardForm({
          amount: String(amount),
          iframe: true,
          form: {
            id: "form-checkout",
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder:
                language === "pt" ? "Número do cartão" : "Card number",
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/AA",
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "CVV",
            },
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder:
                language === "pt" ? "Nome no cartão" : "Name on card",
            },
            issuer: {
              id: "form-checkout__issuer",
              placeholder: language === "pt" ? "Banco emissor" : "Issuing bank",
            },
            installments: {
              id: "form-checkout__installments",
              placeholder: language === "pt" ? "Parcelas" : "Installments",
            },
            identificationType: {
              id: "form-checkout__identificationType",
              placeholder: language === "pt" ? "Documento" : "Document",
            },
            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: language === "pt" ? "CPF" : "Document number",
            },
            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
              placeholder: "E-mail",
            },
          },
          callbacks: {
            onFormMounted(error: unknown) {
              if (error) {
                console.error("Erro ao montar CardForm:", error);

                onErrorChange(
                  language === "pt"
                    ? "Não foi possível carregar o formulário de cartão."
                    : "The card form could not be loaded.",
                );

                return;
              }

              setCardReady(true);
            },

            onSubmit: async (event: Event) => {
              event.preventDefault();

              if (isSubmittingRef.current) {
                return;
              }

              isSubmittingRef.current = true;
              setIsSubmitting(true);
              onErrorChange(null);
              onStatusChange("processing");

              try {
                const formData = cardForm.getCardFormData();

                const response = await fetch("/api/checkout", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    slug,
                    locale,
                    paymentMethod: "card",
                    paymentData: {
                      token: formData.token,
                      issuer_id: formData.issuerId,
                      payment_method_id: formData.paymentMethodId,
                      installments: Number(formData.installments),
                      payer: {
                        email: formData.cardholderEmail,
                        identification: {
                          type: formData.identificationType,
                          number: formData.identificationNumber,
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
                        ? "Não foi possível processar o pagamento."
                        : "The payment could not be processed."),
                  );
                }

                if (!data.paymentId) {
                  throw new Error(
                    language === "pt"
                      ? "O Mercado Pago não retornou o pagamento."
                      : "Mercado Pago did not return the payment.",
                  );
                }

                onPaymentIdChange(data.paymentId);

                const nextCheckoutStatus = getCheckoutStatusFromPayment(
                  data.status,
                );

                if (nextCheckoutStatus === "approved") {
                  onStatusChange("approved");
                  return;
                }

                if (nextCheckoutStatus === "pending") {
                  onStatusChange("pending");
                  return;
                }

                isSubmittingRef.current = false;
                setIsSubmitting(false);
                onStatusChange("failure");
              } catch (error) {
                console.error("Erro ao processar cartão:", error);

                onErrorChange(
                  error instanceof Error
                    ? error.message
                    : language === "pt"
                      ? "Não foi possível processar o pagamento."
                      : "The payment could not be processed.",
                );

                isSubmittingRef.current = false;
                setIsSubmitting(false);
                onStatusChange("failure");
              }
            },

            onFetching(resource: string) {
              console.log("Mercado Pago carregando:", resource);

              const progressBar =
                document.querySelector<HTMLProgressElement>(
                  ".payment-progress",
                );

              if (progressBar) {
                progressBar.removeAttribute("value");
              }

              return () => {
                if (progressBar) {
                  progressBar.value = 0;
                }
              };
            },
          },
        });

        cardFormRef.current = cardForm;
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Erro ao inicializar Mercado Pago:", error);

        onErrorChange(
          language === "pt"
            ? "Não foi possível inicializar o pagamento."
            : "The payment could not be initialized.",
        );
      }
    }

    void initializeCardForm();

    return () => {
      cancelled = true;
      cardFormRef.current?.unmount?.();
      cardFormRef.current = null;
      isSubmittingRef.current = false;
    };
  }, [
    amount,
    enabled,
    language,
    locale,
    onErrorChange,
    onPaymentIdChange,
    onStatusChange,
    slug,
  ]);

  return {
    cardReady,
    isSubmitting,
    resetCard,
  };
}
