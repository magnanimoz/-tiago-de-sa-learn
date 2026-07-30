import { useEffect, useState } from "react";

import type { CheckoutStatus } from "@/types/checkout-payment";

type PreviewStatus = Exclude<CheckoutStatus, "choosing">;

type UseCheckoutPreviewProps = {
  onStatusChange: (status: CheckoutStatus) => void;
  onStart: () => void;
};

const previewStatuses: readonly PreviewStatus[] = [
  "processing",
  "pending",
  "approved",
  "failure",
];

export function useCheckoutPreview({
  onStatusChange,
  onStart,
}: UseCheckoutPreviewProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "development" ||
      previewIndex === null ||
      previewIndex >= previewStatuses.length - 1
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextIndex = previewIndex + 1;
      const nextStatus = previewStatuses[nextIndex];

      setPreviewIndex(nextIndex);
      onStatusChange(nextStatus);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onStatusChange, previewIndex]);

  function startPreview() {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    onStart();
    setPreviewIndex(0);
    onStatusChange(previewStatuses[0]);
  }

  function resetPreview() {
    setPreviewIndex(null);
  }

  const currentStatus =
    previewIndex === null ? null : previewStatuses[previewIndex];

  const buttonLabel =
    previewIndex === null
      ? "Iniciar preview"
      : previewIndex === previewStatuses.length - 1
        ? "Reiniciar preview"
        : "Recomeçar preview";

  return {
    previewIndex,
    currentStatus,
    buttonLabel,
    startPreview,
    resetPreview,
  };
}
