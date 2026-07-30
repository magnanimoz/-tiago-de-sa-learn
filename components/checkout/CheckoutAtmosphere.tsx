import type { ReactNode } from "react";

import type { CheckoutStatus } from "@/types/checkout-payment";

type CheckoutAtmosphereProps = {
  status: Exclude<CheckoutStatus, "choosing">;
  children: ReactNode;
};

export default function CheckoutAtmosphere({
  status,
  children,
}: CheckoutAtmosphereProps) {
  const isApproved = status === "approved";
  const isProcessing = status === "processing";
  const isPending = status === "pending";

  const background = isApproved
    ? `
    radial-gradient(
      circle at 50% 45%,
      rgba(52, 211, 153, 0.22) 0%,
      rgba(16, 185, 129, 0.09) 30%,
      transparent 68%
    )
  `
    : isProcessing || isPending
      ? `
      radial-gradient(
        circle at 50% 45%,
        rgba(125, 211, 252, 0.17) 0%,
        rgba(59, 130, 246, 0.07) 30%,
        transparent 70%
      )
    `
      : status === "failure"
        ? `
        radial-gradient(
          circle at 50% 43%,
          rgba(248, 113, 113, 0.17) 0%,
          rgba(127, 29, 29, 0.07) 30%,
          transparent 68%
        )
      `
        : `
        radial-gradient(
          circle at 50% 42%,
          rgba(255, 255, 255, 0.07) 0%,
          rgba(59, 130, 246, 0.035) 32%,
          transparent 70%
        )
      `;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#08090b]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-3xl sm:h-[600px] sm:w-[600px]"
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        {children}
      </div>
    </div>
  );
}
