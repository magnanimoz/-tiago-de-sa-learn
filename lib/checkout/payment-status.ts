import type { CheckoutStatus } from "@/types/checkout-payment";

const pendingPaymentStatuses = new Set([
  "pending",
  "in_process",
  "authorized",
  "in_mediation",
]);

const failedPaymentStatuses = new Set([
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
]);

export function getCheckoutStatusFromPayment(
  paymentStatus: string | null | undefined,
): Exclude<CheckoutStatus, "choosing" | "processing"> | null {
  if (!paymentStatus) {
    return null;
  }

  if (paymentStatus === "approved") {
    return "approved";
  }

  if (pendingPaymentStatuses.has(paymentStatus)) {
    return "pending";
  }

  if (failedPaymentStatuses.has(paymentStatus)) {
    return "failure";
  }

  return null;
}

export function isFinalPaymentStatus(paymentStatus: string | null | undefined) {
  const checkoutStatus = getCheckoutStatusFromPayment(paymentStatus);

  return checkoutStatus === "approved" || checkoutStatus === "failure";
}
