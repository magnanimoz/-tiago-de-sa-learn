import { Icon } from "@iconify/react";
import { CreditCard } from "lucide-react";

import type { CheckoutLanguage, PaymentMethod } from "@/types/checkout-payment";

type CheckoutPaymentMethodSelectorProps = {
  language: CheckoutLanguage;
  selectedMethod: PaymentMethod;
  availableMethods: Array<Exclude<PaymentMethod, null>>;
  onSelect: (method: Exclude<PaymentMethod, null>) => void;
};

type PaymentMethodButtonProps = {
  active: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
};

function PaymentMethodButton({
  active,
  title,
  description,
  icon,
  onClick,
}: PaymentMethodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-xl border p-4 text-left transition",
        active
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{title}</p>

          <p className="mt-1 text-xs text-white/45">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default function CheckoutPaymentMethodSelector({
  language,
  selectedMethod,
  availableMethods,
  onSelect,
}: CheckoutPaymentMethodSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {availableMethods.includes("card") && (
        <PaymentMethodButton
          active={selectedMethod === "card"}
          title={language === "pt" ? "Cartão de crédito" : "Credit card"}
          description={
            language === "pt"
              ? "Pague com segurança e parcele sua compra"
              : "Pay securely and choose installments"
          }
          icon={
            <CreditCard
              className={[
                "h-5 w-5 transition-colors",
                selectedMethod === "card" ? "text-emerald-400" : "text-white",
              ].join(" ")}
            />
          }
          onClick={() => onSelect("card")}
        />
      )}

      {availableMethods.includes("pix") && (
        <PaymentMethodButton
          active={selectedMethod === "pix"}
          title="Pix"
          description={
            language === "pt" ? "Aprovação instantânea" : "Instant confirmation"
          }
          icon={
            <Icon
              icon="simple-icons:pix"
              className={[
                "h-5 w-5 transition-colors",
                selectedMethod === "pix" ? "text-emerald-400" : "text-white",
              ].join(" ")}
            />
          }
          onClick={() => onSelect("pix")}
        />
      )}
    </div>
  );
}
