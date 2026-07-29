"use client";

import { useState } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { Icon } from "@iconify/react";
import { CreditCard } from "lucide-react";

const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

if (publicKey) {
  initMercadoPago(publicKey, {
    locale: "pt-BR",
  });
}

type CheckoutPaymentFormProps = {
  slug: string;
};

type PaymentMethod = "card" | "pix";

function PixIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M365.8 142.2 290.5 66.9c-19-19-49.9-19-68.9 0l-75.4 75.4c-8.8 8.8-20.6 13.7-33.1 13.7H98.3l95.4 95.4c34.4 34.4 90.2 34.4 124.6 0l95.4-95.4h-14.8c-12.5 0-24.3-5-33.1-13.8Z"
        fill="currentColor"
      />

      <path
        d="m146.2 369.8 75.4 75.3c19 19 49.9 19 68.9 0l75.4-75.4c8.8-8.8 20.6-13.7 33.1-13.7h14.8l-95.4-95.4c-34.4-34.4-90.2-34.4-124.6 0L98.3 356h14.8c12.5 0 24.3 5 33.1 13.8Z"
        fill="currentColor"
      />

      <path
        d="m445.1 221.5-31.4-31.4-95.4 95.4c-34.4 34.4-90.2 34.4-124.6 0l-95.4-95.4-31.4 31.4c-19 19-19 49.9 0 68.9l31.4 31.4 95.4-95.4c34.4-34.4 90.2-34.4 124.6 0l95.4 95.4 31.4-31.4c19-19 19-49.9 0-68.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CheckoutPaymentForm({
  slug,
}: CheckoutPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={[
            "rounded-xl border p-4 text-left transition",
            paymentMethod === "card"
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <CreditCard
                className={[
                  "h-5 w-5 transition-colors",
                  paymentMethod === "card" ? "text-emerald-400" : "text-white",
                ].join(" ")}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Cartão de crédito
              </p>

              <p className="mt-1 text-xs text-white/45">
                Pague com segurança e parcele sua compra
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("pix")}
          className={[
            "rounded-xl border p-4 text-left transition",
            paymentMethod === "pix"
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <Icon
                icon="simple-icons:pix"
                className={[
                  "h-5 w-5 transition-colors",
                  paymentMethod === "pix" ? "text-emerald-400" : "text-white",
                ].join(" ")}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Pix</p>

              <p className="mt-1 text-xs text-white/45">
                Aprovação instantânea
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6">
        {paymentMethod === "card" ? (
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-white/50">
              Formulário do cartão será adicionado aqui.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-white/50">
              Pagamento Pix será adicionado aqui.
            </p>
          </div>
        )}
      </div>

      <span className="hidden">
        {slug}
        {String(Boolean(CardPayment))}
      </span>
    </div>
  );
}
