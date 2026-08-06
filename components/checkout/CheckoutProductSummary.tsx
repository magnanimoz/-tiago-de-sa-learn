type CheckoutProductSummaryProps = {
  language: "pt" | "en";
  productTitle: string;
  artist?: string | null;
  image?: string | null;
  formattedPrice: string;
};

export default function CheckoutProductSummary({
  language,
  productTitle,
  artist,
  image,
  formattedPrice,
}: CheckoutProductSummaryProps) {
  return (
    <aside>
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.10]
          bg-white/[0.035]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_16px_44px_rgba(0,0,0,0.18)]
          backdrop-blur-xl
        "
      >
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0e10]">
            <img
              src={image}
              alt={productTitle}
              className="h-full w-full object-cover"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-white/40">
            {language === "pt" ? "Sua compra" : "Your purchase"}
          </p>

          <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">
            {productTitle}
          </h2>

          {artist && <p className="mt-1 text-sm text-white/52">{artist}</p>}

          <div className="mt-5 border-t border-white/[0.08] pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-white/40">Total</p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {formattedPrice}
                </p>
              </div>

              <span className="text-right text-xs leading-5 text-white/35">
                {language === "pt" ? "Pagamento único" : "One-time payment"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
