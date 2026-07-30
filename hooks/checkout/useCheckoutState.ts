import { useState } from "react";

import type {
  CheckoutStatus,
  PaymentMethod,
} from "@/types/checkout-payment";

export function useCheckoutState() {
  const [checkoutStatus, setCheckoutStatus] =
    useState<CheckoutStatus>("choosing");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function togglePaymentMethod(
    method: Exclude<PaymentMethod, null>,
  ) {
    if (checkoutStatus !== "choosing") {
      return;
    }

    setErrorMessage(null);

    setPaymentMethod((currentMethod) =>
      currentMethod === method ? null : method,
    );
  }

  function resetCheckoutState() {
    setCheckoutStatus("choosing");
    setPaymentMethod(null);
    setPaymentId(null);
    setErrorMessage(null);
  }

  return {
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
  };
}