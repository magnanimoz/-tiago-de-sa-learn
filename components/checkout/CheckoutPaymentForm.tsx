"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import CheckoutCardForm from "./CheckoutCardForm";
import CheckoutPaymentMethodSelector from "./CheckoutPaymentMethodSelector";
import CheckoutPaymentState from "./CheckoutPaymentState";
import CheckoutPixForm from "./CheckoutPixForm";
import CheckoutPaymentHeader from "./CheckoutPaymentHeader";
import CheckoutStripeButton from "./CheckoutStripeButton";

import { getCheckoutConfig } from "@/lib/checkout/get-checkout-config";
import { useCheckoutCard } from "@/hooks/checkout/useCheckoutCard";
import { useCheckoutPix } from "@/hooks/checkout/useCheckoutPix";
import { useCheckoutState } from "@/hooks/checkout/useCheckoutState";

const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

type CheckoutPaymentFormProps = {
  slug: string;
  amount: number;
  locale: "pt-br" | "en-us";
};

const checkoutEase = [0.22, 1, 0.36, 1] as const;

const checkoutScreenVariants = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction === 1 ? 72 : -72,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction === 1 ? -72 : 72,
  }),
};

const checkoutScreenTransition = {
  duration: 0.5,
  ease: checkoutEase,
};

export default function CheckoutPaymentForm({
  slug,
  amount,
  locale,
}: CheckoutPaymentFormProps) {
  const router = useRouter();
  const pendingTransitionRef = useRef<number | null>(null);
  const formBackgroundTimeoutRef = useRef<number | null>(null);
  const selectionScreenRef = useRef<HTMLDivElement | null>(null);
  const qrScreenRef = useRef<HTMLDivElement | null>(null);

  const selectionScreenHeightRef = useRef<number | null>(null);
  const isReturningFromPixQrRef = useRef(false);

  const [screenHeight, setScreenHeight] = useState<number | "auto">("auto");
  const [showFormBackground, setShowFormBackground] = useState(false);
  const [isClosingPaymentMethod, setIsClosingPaymentMethod] = useState(false);

  useEffect(() => {
    return () => {
      if (pendingTransitionRef.current !== null) {
        window.clearTimeout(pendingTransitionRef.current);
      }

      if (formBackgroundTimeoutRef.current !== null) {
        window.clearTimeout(formBackgroundTimeoutRef.current);
      }
    };
  }, []);

  const [screenDirection, setScreenDirection] = useState<1 | -1>(1);
  const [showPixQrScreen, setShowPixQrScreen] = useState(false);
  const [isPreparingPixScreen, setIsPreparingPixScreen] = useState(false);

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
    resetCheckoutState,
  } = useCheckoutState();

  function handlePaymentMethodSelect(method: "card" | "pix") {
    if (pendingTransitionRef.current !== null) {
      window.clearTimeout(pendingTransitionRef.current);
      pendingTransitionRef.current = null;
    }

    if (formBackgroundTimeoutRef.current !== null) {
      window.clearTimeout(formBackgroundTimeoutRef.current);
      formBackgroundTimeoutRef.current = null;
    }

    if (!paymentMethod) {
      setIsClosingPaymentMethod(false);
      setShowFormBackground(true);
      setScreenHeight("auto");
      setPaymentMethod(method);
      return;
    }

    const isLeavingPix = paymentMethod === "pix";
    const isLeavingCard = paymentMethod === "card";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    pendingTransitionRef.current = window.setTimeout(() => {
      if (isLeavingPix) {
        resetPix({
          clearBuyerData: true,
        });
      }

      if (isLeavingCard) {
        resetCard();
      }

      const nextPaymentMethod = paymentMethod === method ? null : method;

      setScreenHeight("auto");

      if (nextPaymentMethod === null) {
        setIsClosingPaymentMethod(true);

        formBackgroundTimeoutRef.current = window.setTimeout(() => {
          setShowFormBackground(false);
          setIsClosingPaymentMethod(false);
          formBackgroundTimeoutRef.current = null;
        }, 800);
      } else {
        setIsClosingPaymentMethod(false);
        setShowFormBackground(true);
      }

      setPaymentMethod(nextPaymentMethod);
      setPaymentId(null);
      setErrorMessage(null);

      pendingTransitionRef.current = null;
    }, 300);
  }

  const handleStatusChange = useCallback(
    (status: Parameters<typeof setCheckoutStatus>[0]) => {
      if (status === "choosing") {
        setCheckoutStatus(status);
        return;
      }

      if (pendingTransitionRef.current !== null) {
        window.clearTimeout(pendingTransitionRef.current);
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      pendingTransitionRef.current = window.setTimeout(() => {
        setCheckoutStatus(status);
        pendingTransitionRef.current = null;
      }, 650);
    },
    [setCheckoutStatus],
  );

  const {
    cardReady,
    cardBrand,
    isSubmitting,
    fieldErrors,
    handleSubmitAttempt,
    clearFieldError,
    resetCard,
  } = useCheckoutCard({
    enabled:
      isMercadoPagoCheckout &&
      paymentMethod === "card" &&
      checkoutStatus === "choosing",
    slug,
    amount,
    locale,
    language,
    onStatusChange: handleStatusChange,
    onPaymentIdChange: setPaymentId,
    onErrorChange: setErrorMessage,
  });

  const {
    pixData,
    pixEmail,
    pixCpf,
    pixCopied,
    isPixLoading,
    isPixCancelling,
    pixFieldErrors,
    setPixEmail,
    setPixCpf,
    createPix,
    cancelPix,
    copyPixCode,
    resetPix,
  } = useCheckoutPix({
    enabled: isMercadoPagoCheckout && paymentMethod === "pix",
    slug,
    locale,
    language,
    checkoutStatus,
    onStatusChange: handleStatusChange,
    onPaymentIdChange: setPaymentId,
    onErrorChange: setErrorMessage,
  });

  async function handleCreatePix() {
    isReturningFromPixQrRef.current = false;
    setScreenDirection(1);
    setShowPixQrScreen(false);
    setIsPreparingPixScreen(true);

    const wasCreated = await createPix();

    if (!wasCreated) {
      setIsPreparingPixScreen(false);
      return;
    }

    await scrollToTopSmoothly();

    setShowPixQrScreen(true);
    setIsPreparingPixScreen(false);
  }

  function scrollToTopSmoothly() {
    return new Promise<void>((resolve) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion || window.scrollY <= 2) {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });

        resolve();
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const startedAt = performance.now();
      let settledFrames = 0;

      function checkScrollPosition() {
        if (window.scrollY <= 2) {
          settledFrames += 1;
        } else {
          settledFrames = 0;
        }

        if (settledFrames >= 3 || performance.now() - startedAt > 1500) {
          resolve();
          return;
        }

        window.requestAnimationFrame(checkScrollPosition);
      }

      window.requestAnimationFrame(checkScrollPosition);
    });
  }

  useEffect(() => {
    if (showPixQrScreen || paymentMethod || isClosingPaymentMethod) {
      return;
    }

    const selectionElement = selectionScreenRef.current;

    if (selectionElement === null) {
      return;
    }

    const updateSelectionHeight = () => {
      const nextHeight = selectionElement.getBoundingClientRect().height;

      if (nextHeight <= 0) {
        return;
      }

      selectionScreenHeightRef.current = nextHeight;

      if (screenHeight !== "auto") {
        setScreenHeight(nextHeight);
      }
    };

    updateSelectionHeight();

    const observer = new ResizeObserver(() => {
      updateSelectionHeight();
    });

    observer.observe(selectionElement);

    return () => {
      observer.disconnect();
    };
  }, [isClosingPaymentMethod, paymentMethod, screenHeight, showPixQrScreen]);

  useEffect(() => {
    if (!showPixQrScreen) {
      return;
    }

    const qrElement = qrScreenRef.current;

    if (qrElement === null) {
      return;
    }

    const updateQrHeight = () => {
      if (isReturningFromPixQrRef.current) {
        return;
      }

      const nextHeight = qrElement.offsetHeight;

      if (nextHeight <= 0) {
        return;
      }

      setScreenHeight(nextHeight);
    };

    updateQrHeight();

    const observer = new ResizeObserver(updateQrHeight);

    observer.observe(qrElement);

    return () => {
      observer.disconnect();
    };
  }, [showPixQrScreen]);

  if (checkoutConfig.provider === "stripe") {
    return <CheckoutStripeButton slug={slug} locale="en-us" />;
  }

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
    resetCheckoutState();
  }

  function handleStartLesson() {
    router.push(`/${locale}/learn/${slug}`);
  }

  async function handleCancelPix() {
    const wasCancelled = await cancelPix();

    if (!wasCancelled) {
      return;
    }

    setScreenDirection(-1);
    isReturningFromPixQrRef.current = true;

    const selectionHeight = selectionScreenHeightRef.current;

    if (selectionHeight !== null) {
      setScreenHeight(selectionHeight);
    }

    setShowPixQrScreen(false);
    setPaymentMethod(null);
    setShowFormBackground(false);
    setPaymentId(null);
    setErrorMessage(null);

    window.setTimeout(() => {
      resetPix({
        clearBuyerData: true,
      });

      isReturningFromPixQrRef.current = false;
    }, 750);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <motion.div
      initial={false}
      animate={{
        height: screenHeight,
      }}
      transition={{
        height: {
          duration: 0.7,
          ease: checkoutEase,
        },
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full">
        <AnimatePresence initial={false} mode="wait" custom={screenDirection}>
          {checkoutStatus !== "choosing" ? (
            <motion.div
              key="checkout-state"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
              }}
              className="flex min-h-[420px] w-full items-center justify-center"
            >
              <CheckoutPaymentState
                language={language}
                status={checkoutStatus}
                paymentId={paymentId?.toString()}
                onRetry={handleRetry}
                onStartLesson={
                  checkoutStatus === "approved" ? handleStartLesson : undefined
                }
              />
            </motion.div>
          ) : pixData && showPixQrScreen ? (
            <motion.div
              ref={qrScreenRef}
              key="pix-qr-screen"
              custom={screenDirection}
              variants={checkoutScreenVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={checkoutScreenTransition}
              className="w-full px-3 sm:px-5"
            >
              <CheckoutPixForm
                mode="qr"
                language={language}
                pixData={pixData}
                pixEmail={pixEmail}
                pixCpf={pixCpf}
                pixCopied={pixCopied}
                isLoading={isPixLoading}
                isCancelling={isPixCancelling}
                fieldErrors={pixFieldErrors}
                onEmailChange={setPixEmail}
                onCpfChange={setPixCpf}
                onCreate={handleCreatePix}
                onCancel={handleCancelPix}
                onCopy={copyPixCode}
              />
            </motion.div>
          ) : (
            <motion.div
              ref={selectionScreenRef}
              key="checkout-selection-screen"
              custom={screenDirection}
              variants={checkoutScreenVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={checkoutScreenTransition}
              className="w-full"
            >
              <div className="px-3 sm:px-5">
                <CheckoutPaymentHeader language={language} />

                <div className="pt-5 pb-5">
                  <CheckoutPaymentMethodSelector
                    language={language}
                    selectedMethod={paymentMethod}
                    availableMethods={checkoutConfig.availableMethods}
                    onSelect={handlePaymentMethodSelect}
                  />
                </div>
              </div>

              <div
                className={[
                  "relative",
                  showFormBackground ? "bg-white/[0.025]" : "",
                ].join(" ")}
              >
                <div className="px-3 sm:px-5">
                  <AnimatePresence initial={false} mode="wait">
                    {paymentMethod === "card" && (
                      <CheckoutCardForm
                        key="card"
                        language={language}
                        cardReady={cardReady}
                        cardBrand={cardBrand}
                        isSubmitting={isSubmitting}
                        fieldErrors={fieldErrors}
                        onSubmitAttempt={handleSubmitAttempt}
                        onClearFieldError={clearFieldError}
                      />
                    )}

                    {paymentMethod === "pix" && (
                      <CheckoutPixForm
                        key="pix-form"
                        mode="form"
                        language={language}
                        pixData={null}
                        pixEmail={pixEmail}
                        pixCpf={pixCpf}
                        pixCopied={pixCopied}
                        isLoading={isPixLoading || isPreparingPixScreen}
                        isCancelling={isPixCancelling}
                        fieldErrors={pixFieldErrors}
                        onEmailChange={setPixEmail}
                        onCpfChange={setPixCpf}
                        onCreate={handleCreatePix}
                        onCancel={handleCancelPix}
                        onCopy={copyPixCode}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {errorMessage && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {errorMessage}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
