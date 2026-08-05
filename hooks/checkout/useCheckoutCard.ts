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

export type CardFieldName =
  | "cardNumber"
  | "expirationDate"
  | "securityCode"
  | "cardholderName"
  | "issuer"
  | "installments"
  | "identificationNumber"
  | "cardholderEmail";

export type CardFieldErrors = Partial<Record<CardFieldName, string>>;

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
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<CardFieldErrors>({});

  const submitFallbackTimeoutRef = useRef<number | null>(null);
  const secureFieldsEditedAfterErrorRef = useRef(false);

  const cardFormRef = useRef<MercadoPagoCardForm | null>(null);
  const isSubmittingRef = useRef(false);

  function clearSubmitFallback() {
    if (submitFallbackTimeoutRef.current !== null) {
      window.clearTimeout(submitFallbackTimeoutRef.current);
      submitFallbackTimeoutRef.current = null;
    }
  }

  function revealFieldError(fieldName: CardFieldName) {
    window.requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(
        `[data-card-field="${fieldName}"]`,
      );

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.classList.remove("checkout-field-shake");

      void element.offsetWidth;

      element.classList.add("checkout-field-shake");

      window.setTimeout(() => {
        element.classList.remove("checkout-field-shake");
      }, 450);
    });
  }

  function showFieldErrors(errors: CardFieldErrors) {
    setFieldErrors(errors);

    const firstField = Object.keys(errors)[0] as CardFieldName | undefined;

    if (firstField) {
      revealFieldError(firstField);
    }
  }

  function clearFieldError(fieldName: CardFieldName) {
    if (
      fieldName === "cardNumber" ||
      fieldName === "expirationDate" ||
      fieldName === "securityCode"
    ) {
      secureFieldsEditedAfterErrorRef.current = true;
    }

    setFieldErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[fieldName];

      return nextErrors;
    });
  }

  function handleSubmitAttempt() {
    clearSubmitFallback();

    const errors: CardFieldErrors = {};

    const cardholderName =
      document
        .querySelector<HTMLInputElement>("#form-checkout__cardholderName")
        ?.value.trim() ?? "";

    const identificationNumber =
      document
        .querySelector<HTMLInputElement>("#form-checkout__identificationNumber")
        ?.value.trim() ?? "";

    const cardholderEmail =
      document
        .querySelector<HTMLInputElement>("#form-checkout__cardholderEmail")
        ?.value.trim() ?? "";

    const installments =
      document.querySelector<HTMLSelectElement>("#form-checkout__installments")
        ?.value ?? "";

    if (!cardholderName) {
      errors.cardholderName =
        language === "pt"
          ? "Informe o nome escrito no cartão."
          : "Enter the name shown on the card.";
    }

    if (!installments) {
      errors.installments =
        language === "pt"
          ? "Selecione o número de parcelas."
          : "Select the number of installments.";
    }

    if (!identificationNumber) {
      errors.identificationNumber =
        language === "pt"
          ? "Informe o número do documento."
          : "Enter the document number.";
    }

    if (!cardholderEmail) {
      errors.cardholderEmail =
        language === "pt" ? "Informe o e-mail." : "Enter the email.";
    }

    if (Object.keys(errors).length > 0) {
      if (secureFieldsEditedAfterErrorRef.current) {
        showFieldErrors(errors);
        return false;
      }

      const secureFieldsMessage =
        language === "pt"
          ? "Confira o número do cartão, a validade e o código de segurança."
          : "Check the card number, expiration date and security code.";

      showFieldErrors({
        cardNumber: secureFieldsMessage,
        expirationDate: secureFieldsMessage,
        securityCode: secureFieldsMessage,
        ...errors,
      });

      return false;
    }

    submitFallbackTimeoutRef.current = window.setTimeout(() => {
      secureFieldsEditedAfterErrorRef.current = false;

      const message =
        language === "pt"
          ? "Confira o número do cartão, a validade e o código de segurança."
          : "Check the card number, expiration date and security code.";

      showFieldErrors({
        cardNumber: message,

        expirationDate: message,

        securityCode: message,
      });
    }, 700);

    return true;
  }

  function resetCard() {
    secureFieldsEditedAfterErrorRef.current = false;

    cardFormRef.current?.unmount?.();
    cardFormRef.current = null;
    isSubmittingRef.current = false;

    setCardReady(false);
    setIsSubmitting(false);
    setCardBrand(null);

    clearSubmitFallback();
    setFieldErrors({});
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

        const cardFormOptions: Parameters<typeof mp.cardForm>[0] = {
          amount: String(amount),
          iframe: true,
          form: {
            id: "form-checkout",
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder:
                language === "pt"
                  ? "1234 5678 9012 3456"
                  : "1234 5678 9012 3456",
              style: {
                color: "#ffffff",
                fontSize: "15px",
                fontFamily: "'Space Grotesk', sans-serif",
              },
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/AA",
              style: {
                color: "#ffffff",
                fontSize: "15px",
                fontFamily: "'Space Grotesk', sans-serif",
              },
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "123",
              style: {
                color: "#ffffff",
                fontSize: "15px",
                fontFamily: "'Space Grotesk', sans-serif",
              },
            },
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: language === "pt" ? "João Silva" : "Joe Shmoe",
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
            onBinChange: async (bin: string) => {
              if (bin.length < 6) {
                setCardBrand(null);
                return;
              }

              try {
                const response = await mp.getPaymentMethods({ bin });
                const paymentMethod = response.results?.[0];

                setCardBrand(paymentMethod?.id ?? null);
              } catch (error) {
                console.error("Erro ao identificar bandeira:", error);
                setCardBrand(null);
              }
            },

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

              clearSubmitFallback();
              setFieldErrors({});

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
        };

        const cardForm = mp.cardForm(cardFormOptions);

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
      clearSubmitFallback();

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
    cardBrand,
    isSubmitting,
    fieldErrors,
    handleSubmitAttempt,
    clearFieldError,
    resetCard,
  };
}
