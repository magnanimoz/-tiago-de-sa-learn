import type { CheckoutLanguage } from "@/types/checkout-payment";

type CheckoutPaymentHeaderProps = {
  language: CheckoutLanguage;
};

export default function CheckoutPaymentHeader({
  language,
}: CheckoutPaymentHeaderProps) {
  return (
    <div className="border-b border-white/10 px-3 pb-4 sm:px-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {language === "pt" ? "Forma de pagamento" : "Payment method"}
      </p>
    </div>
  );
}
