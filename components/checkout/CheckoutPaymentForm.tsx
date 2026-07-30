"use client";

import { AnimatePresence, motion } from "framer-motion";

import CheckoutCardForm from "./CheckoutCardForm";
import CheckoutPaymentMethodSelector from "./CheckoutPaymentMethodSelector";
import CheckoutPaymentState from "./CheckoutPaymentState";
import CheckoutPixForm from "./CheckoutPixForm";
import CheckoutPreviewControls from "./CheckoutPreviewControls";
import CheckoutPaymentHeader from "./CheckoutPaymentHeader";
import CheckoutStripeButton from "./CheckoutStripeButton";

import { getCheckoutConfig } from "@/lib/checkout/get-checkout-config";
import { useCheckoutCard } from "@/hooks/checkout/useCheckoutCard";
import { useCheckoutPix } from "@/hooks/checkout/useCheckoutPix";
import { useCheckoutPreview } from "@/hooks/checkout/useCheckoutPreview";
import { useCheckoutState } from "@/hooks/checkout/useCheckoutState";

const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

type CheckoutPaymentFormProps = {
  slug: string;
  amount: number;
  locale: "pt-br" | "en-us";
};

const checkoutEase = [0.22, 1, 0.36, 1] as const;

export default function CheckoutPaymentForm({
  slug,
  amount,
  locale,
}: CheckoutPaymentFormProps) {
  const language = locale === "pt-br" ? "pt" : "en";

  const checkoutConfig = getCheckoutConfig(locale);
  const isMercadoPagoCheckout = checkoutConfig.provider === "mercado_pago";

  const {
    checkoutStatus,
    setCheckoutStatus,
    paymentMethod,
    setPaymentMethod,
    paymentId,
    setPaymentId,
    errorMessage,
    setErrorMessage,
    togglePaymentMethod,
    resetCheckoutState,
  } = useCheckoutState();

  const { cardReady, isSubmitting, resetCard } = useCheckoutCard({
    enabled:
      isMercadoPagoCheckout &&
      paymentMethod === "card" &&
      checkoutStatus === "choosing",
    slug,
    amount,
    locale,
    language,
    onStatusChange: setCheckoutStatus,
    onPaymentIdChange: setPaymentId,
    onErrorChange: setErrorMessage,
  });

  const {
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
  } = useCheckoutPix({
    enabled: isMercadoPagoCheckout && paymentMethod === "pix",
    slug,
    locale,
    language,
    checkoutStatus,
    onStatusChange: setCheckoutStatus,
    onPaymentIdChange: setPaymentId,
    onErrorChange: setErrorMessage,
  });

  if (checkoutConfig.provider === "stripe") {
    return <CheckoutStripeButton slug={slug} locale="en-us" />;
  }

  const {
    currentStatus: previewStatus,
    buttonLabel: previewButtonLabel,
    startPreview,
    resetPreview,
  } = useCheckoutPreview({
    onStatusChange: setCheckoutStatus,
    onStart: () => {
      resetCard();
      resetPix({ clearBuyerData: true });

      setPaymentMethod(null);
      setPaymentId(123456789);
      setErrorMessage(null);
    },
  });

  if (!publicKey) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300"
      >
        {language === "pt"
          ? "A chave pública do Mercado Pago não está configurada."
          : "The Mercado Pago public key is not configured."}
      </div>
    );
  }

  function handleRetry() {
    resetCard();
    resetPix();
    resetPreview();
    resetCheckoutState();
  }

  return (
    <div className="w-full">
      <CheckoutPreviewControls
        currentStatus={previewStatus}
        buttonLabel={previewButtonLabel}
        onStart={startPreview}
      />

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {checkoutStatus === "choosing" ? (
            <motion.div
              key="checkout-choosing"
              initial={{
                opacity: 0,
                y: 8,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -18,
                scale: 0.992,
                filter: "blur(5px)",
              }}
              transition={{
                duration: 0.48,
                ease: checkoutEase,
              }}
              className="w-full"
            >
              <CheckoutPaymentHeader language={language} />

              <div className="pt-5">
                <CheckoutPaymentMethodSelector
                  language={language}
                  selectedMethod={paymentMethod}
                  availableMethods={checkoutConfig.availableMethods}
                  onSelect={togglePaymentMethod}
                />

                <div className="mt-6">
                  <AnimatePresence initial={false} mode="wait">
                    {paymentMethod === "card" && (
                      <CheckoutCardForm
                        language={language}
                        cardReady={cardReady}
                        isSubmitting={isSubmitting}
                      />
                    )}

                    {paymentMethod === "pix" && (
                      <CheckoutPixForm
                        language={language}
                        pixData={pixData}
                        pixPaymentId={pixPaymentId}
                        pixStatus={pixStatus}
                        pixEmail={pixEmail}
                        pixCpf={pixCpf}
                        pixCopied={pixCopied}
                        isLoading={isPixLoading}
                        onEmailChange={setPixEmail}
                        onCpfChange={setPixCpf}
                        onCreate={createPix}
                        onCopy={copyPixCode}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {errorMessage}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex min-h-[420px] w-full items-center justify-center"
            >
              <CheckoutPaymentState
                language={language}
                status={checkoutStatus}
                paymentId={paymentId?.toString()}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
