"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutAtmosphere from "./CheckoutAtmosphere";
import CheckoutPaymentState from "./CheckoutPaymentState";

import type {
  CheckoutLanguage,
  CheckoutStatus,
} from "@/types/checkout-payment";

type ReturnStatus = Exclude<CheckoutStatus, "choosing">;

type CheckoutReturnExperienceProps = {
  language: CheckoutLanguage;
  status: ReturnStatus;
  paymentId?: string;
  productTitle?: string;
  destinationHref?: string;
  libraryHref?: string;
  checkoutHref?: string;
  previewAutoApprove?: boolean;
};

export default function CheckoutReturnExperience({
  language,
  status,
  paymentId,
  productTitle,
  destinationHref,
  libraryHref,
  checkoutHref,
  previewAutoApprove = false,
}: CheckoutReturnExperienceProps) {
  const router = useRouter();

  const [previewStatus, setPreviewStatus] = useState<ReturnStatus | null>(null);

  const currentStatus =
    status === "pending" && previewStatus ? previewStatus : status;

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "development" ||
      !previewAutoApprove ||
      status !== "pending" ||
      previewStatus !== null
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviewStatus("approved");
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [previewAutoApprove, previewStatus, status]);

  function handleStartLesson() {
    if (destinationHref) {
      router.push(destinationHref);
      return;
    }

    if (libraryHref) {
      router.push(libraryHref);
    }
  }

  function handleRetry() {
    if (checkoutHref) {
      router.push(checkoutHref);
      return;
    }

    if (libraryHref) {
      router.push(libraryHref);
    }
  }

  return (
    <CheckoutAtmosphere status={currentStatus}>
      <div className="w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-2xl">
          {productTitle && (
            <div className="border-b border-white/10 px-5 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                {language === "pt" ? "Produto" : "Product"}
              </p>

              <p className="mt-1 text-sm font-medium text-white/70">
                {productTitle}
              </p>
            </div>
          )}

          <CheckoutPaymentState
            language={language}
            status={currentStatus}
            paymentId={paymentId}
            onStartLesson={
              currentStatus === "approved" && (destinationHref || libraryHref)
                ? handleStartLesson
                : undefined
            }
            onRetry={
              currentStatus === "failure" && (checkoutHref || libraryHref)
                ? handleRetry
                : undefined
            }
          />

          {currentStatus === "pending" && libraryHref && (
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => router.push(libraryHref)}
                className="text-xs font-medium text-white/35 transition hover:text-white/60"
              >
                {language === "pt"
                  ? "Voltar para a biblioteca"
                  : "Back to library"}
              </button>
            </div>
          )}
        </div>
      </div>
    </CheckoutAtmosphere>
  );
}
