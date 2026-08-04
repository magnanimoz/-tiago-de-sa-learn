"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard } from "lucide-react";

import type { CheckoutLanguage } from "@/types/checkout-payment";
import type {
  CardFieldErrors,
  CardFieldName,
} from "@/hooks/checkout/useCheckoutCard";

type CheckoutCardFormProps = {
  language: CheckoutLanguage;
  cardReady: boolean;
  cardBrand: string | null;
  isSubmitting: boolean;
  fieldErrors: CardFieldErrors;
  onSubmitAttempt: () => boolean;
  onClearFieldError: (fieldName: CardFieldName) => void;
};

const checkoutEase = [0.22, 1, 0.36, 1] as const;

const cardBrandLogos: Record<string, string> = {
  visa: "/images/payment/visa.svg",
  master: "/images/payment/mastercard.svg",
  mastercard: "/images/payment/mastercard.svg",
  amex: "/images/payment/amex.svg",
  elo: "/images/payment/elo.svg",
  hipercard: "/images/payment/hipercard.svg",
  maestro: "/images/payment/maestro.svg",
  discover: "/images/payment/discover.svg",
  jcb: "/images/payment/jcb.svg",
  diners: "/images/payment/dinersclub.svg",
  dinersclub: "/images/payment/dinersclub.svg",
  unionpay: "/images/payment/unionpay.svg",
};

export default function CheckoutCardForm({
  language,
  cardReady,
  cardBrand,
  isSubmitting,
  fieldErrors,
  onSubmitAttempt,
  onClearFieldError,
}: CheckoutCardFormProps) {
  function clearSecureFieldErrors() {
    onClearFieldError("cardNumber");
    onClearFieldError("expirationDate");
    onClearFieldError("securityCode");
  }

  useEffect(() => {
    function handleWindowBlur() {
      window.setTimeout(() => {
        const activeElement = document.activeElement;

        if (!(activeElement instanceof HTMLIFrameElement)) {
          return;
        }

        const secureFieldContainer = activeElement.closest(
          [
            "#form-checkout__cardNumber",
            "#form-checkout__expirationDate",
            "#form-checkout__securityCode",
          ].join(","),
        );

        if (secureFieldContainer) {
          clearSecureFieldErrors();
        }
      }, 0);
    }

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [onClearFieldError]);

  const [identificationType, setIdentificationType] = useState("CPF");
  return (
    <motion.div
      key="card-payment"
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: "auto",
        transition: {
          height: {
            duration: 1.2,
            ease: checkoutEase,
          },
          opacity: {
            duration: 1.5,
          },
        },
      }}
      exit={{
        opacity: 0,
        height: 0,
        transition: {
          height: {
            duration: 0.8,
            ease: checkoutEase,
          },
          opacity: {
            duration: 0.55,
          },
        },
      }}
      className="overflow-hidden"
    >
      <div className="relative mt-4 min-h-[430px] overflow-hidden px-6">
        <AnimatePresence>
          {!cardReady && (
            <motion.div
              key="card-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 z-10 bg-[#111214]"
            >
              <div className="animate-pulse">
                <div className="h-4 w-36 rounded bg-white/10" />

                <div className="mt-5 h-11 w-full rounded-lg bg-white/[0.07]" />

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="h-11 rounded-lg bg-white/[0.07]" />
                  <div className="h-11 rounded-lg bg-white/[0.07]" />
                </div>

                <div className="mt-5 h-4 w-28 rounded bg-white/10" />

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="h-11 rounded-lg bg-white/[0.07]" />
                  <div className="h-11 rounded-lg bg-white/[0.07]" />
                </div>

                <div className="mt-6 h-12 w-full rounded-lg bg-white/10" />
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/35">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-white/60" />

                <span>
                  {language === "pt"
                    ? "Carregando pagamento seguro..."
                    : "Loading secure payment..."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={{
            opacity: cardReady ? 1 : 0,
            y: cardReady ? 0 : 8,
          }}
          transition={{
            opacity: {
              duration: 0.3,
            },
            y: {
              duration: 0.4,
              ease: checkoutEase,
            },
          }}
          className={cardReady ? "" : "pointer-events-none"}
        >
          <form id="form-checkout" className="space-y-5 pt-4 pb-5">
            <div
              data-card-field="cardNumber"
              className={[
                "rounded-2xl border transition-[border-color,background-color,box-shadow,padding] duration-200 ease-out",
                fieldErrors.cardNumber ||
                fieldErrors.expirationDate ||
                fieldErrors.securityCode
                  ? "border-red-400/70 bg-red-500/[0.04] px-3 pt-3 pb-0 shadow-[0_0_0_3px_rgba(248,113,113,0.08)]"
                  : "border-transparent",
              ].join(" ")}
            >
              <div>
                <label
                  htmlFor="form-checkout__cardNumber"
                  className="mb-2 block text-sm font-medium text-white/55"
                >
                  {language === "pt" ? "Número do cartão" : "Card number"}
                </label>

                <div className="relative">
                  <div
                    id="form-checkout__cardNumber"
                    className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 pr-16 transition focus-within:border-white/25 focus-within:bg-white/[0.07] focus-within:ring-4 focus-within:ring-white/[0.06]"
                  />

                  <AnimatePresence mode="wait" initial={false}>
                    {cardBrand && cardBrandLogos[cardBrand] ? (
                      <motion.img
                        key={cardBrand}
                        src={cardBrandLogos[cardBrand]}
                        alt={cardBrand}
                        initial={{ opacity: 0, scale: 0.9, y: 2 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -2 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pointer-events-none absolute right-4 top-1/2 h-6 w-auto -translate-y-1/2 object-contain"
                      />
                    ) : (
                      <motion.div
                        key="generic-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                      >
                        <CreditCard className="h-7 w-7" strokeWidth={1.6} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div data-card-field="expirationDate">
                  <label
                    htmlFor="form-checkout__expirationDate"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt"
                      ? "Data de vencimento"
                      : "Expiration date"}
                  </label>

                  <div
                    id="form-checkout__expirationDate"
                    className="h-12 rounded-xl border border-white/10 bg-white/[0.035] px-4 transition focus-within:border-emerald-500/70 focus-within:ring-4 focus-within:ring-emerald-500/10"
                  />
                </div>

                <div data-card-field="securityCode">
                  <label
                    htmlFor="form-checkout__securityCode"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt"
                      ? "Código de segurança (CVV)"
                      : "Security code (CVV)"}
                  </label>

                  <div
                    id="form-checkout__securityCode"
                    className="h-12 rounded-xl border border-white/10 bg-white/[0.035] px-4 transition focus-within:border-emerald-500/70 focus-within:ring-4 focus-within:ring-emerald-500/10"
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {(fieldErrors.cardNumber ||
                  fieldErrors.expirationDate ||
                  fieldErrors.securityCode) && (
                  <motion.p
                    key="secure-fields-error"
                    role="alert"
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -4,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -4,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-3 overflow-hidden pb-3 text-xs text-red-300"
                  >
                    {language === "pt"
                      ? "Confira o número do cartão, a validade e o código de segurança."
                      : "Check the card number, expiration date and security code."}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div data-card-field="cardholderName">
                <div>
                  <label
                    htmlFor="form-checkout__cardholderName"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt" ? "Nome no cartão" : "Name on card"}
                  </label>

                  <input
                    id="form-checkout__cardholderName"
                    type="text"
                    onChange={() => onClearFieldError("cardholderName")}
                    className={[
                      "h-12 w-full rounded-xl border bg-white/[0.035] px-4 text-sm text-white",
                      "outline-none transition placeholder:text-white/25 focus:bg-white/[0.055] focus:ring-4",
                      fieldErrors.cardholderName
                        ? "border-red-400/70 ring-4 ring-red-400/10"
                        : "border-white/10 focus:border-emerald-500/70 focus:ring-emerald-500/10",
                    ].join(" ")}
                  />
                  {fieldErrors.cardholderName && (
                    <p role="alert" className="mt-2 text-xs text-red-300">
                      {fieldErrors.cardholderName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="form-checkout__issuer"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt" ? "Banco emissor" : "Issuing bank"}
                  </label>

                  <select
                    id="form-checkout__issuer"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#17181a] px-4 text-sm text-white outline-none"
                  />
                </div>

                <div data-card-field="installments">
                  <label
                    htmlFor="form-checkout__installments"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt" ? "Parcelas" : "Installments"}
                  </label>

                  <select
                    id="form-checkout__installments"
                    onChange={() => onClearFieldError("installments")}
                    className={[
                      "h-12 w-full rounded-xl border bg-[#17181a] px-4 text-sm text-white outline-none",
                      fieldErrors.installments
                        ? "border-red-400/70 ring-4 ring-red-400/10"
                        : "border-white/10",
                    ].join(" ")}
                  />

                  {fieldErrors.installments && (
                    <p role="alert" className="mt-2 text-xs text-red-300">
                      {fieldErrors.installments}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
                <div>
                  <label
                    htmlFor="form-checkout__identificationType"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt" ? "Tipo de documento" : "Document type"}
                  </label>

                  <select
                    id="form-checkout__identificationType"
                    onChange={(event) => {
                      setIdentificationType(event.target.value);
                      onClearFieldError("identificationNumber");
                    }}
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#17181a] px-4 text-sm text-white outline-none"
                  />
                </div>

                <div data-card-field="identificationNumber">
                  <label
                    htmlFor="form-checkout__identificationNumber"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    {language === "pt"
                      ? "Número do documento"
                      : "Document number"}
                  </label>

                  <input
                    id="form-checkout__identificationNumber"
                    type="text"
                    placeholder={
                      language === "pt"
                        ? identificationType === "CNPJ"
                          ? "CNPJ"
                          : "CPF"
                        : "Document number"
                    }
                    onChange={() => onClearFieldError("identificationNumber")}
                    className={[
                      "h-12 w-full rounded-xl border bg-white/[0.035] px-4 text-sm text-white",
                      "outline-none transition placeholder:text-white/25 focus:ring-4",
                      fieldErrors.identificationNumber
                        ? "border-red-400/70 ring-4 ring-red-400/10"
                        : "border-white/10 focus:border-emerald-500/70 focus:ring-emerald-500/10",
                    ].join(" ")}
                  />

                  {fieldErrors.identificationNumber && (
                    <p role="alert" className="mt-2 text-xs text-red-300">
                      {fieldErrors.identificationNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div data-card-field="cardholderEmail">
                <div>
                  <label
                    htmlFor="form-checkout__cardholderEmail"
                    className="mb-2 block text-sm font-medium text-white/55"
                  >
                    E-mail
                  </label>

                  <input
                    id="form-checkout__cardholderEmail"
                    type="email"
                    onChange={() => onClearFieldError("cardholderEmail")}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10"
                  />
                  {fieldErrors.cardholderEmail && (
                    <p role="alert" className="mt-2 text-xs text-red-300">
                      {fieldErrors.cardholderEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3">
              <motion.button
                id="form-checkout__submit"
                type="submit"
                disabled={isSubmitting}
                onClick={(event) => {
                  const canSubmit = onSubmitAttempt();

                  if (!canSubmit) {
                    event.preventDefault();
                  }
                }}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? language === "pt"
                    ? "Processando..."
                    : "Processing..."
                  : language === "pt"
                    ? "Pagar"
                    : "Pay"}
              </motion.button>
            </div>

            <progress className="payment-progress hidden" value="0" max="100" />
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
