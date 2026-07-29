import { notFound, redirect } from "next/navigation";

import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";
import Header from "@/components/layout/Header";
import Container from "@/components/ui/Container";
import { userHasAccessToContent } from "@/lib/access/user-has-access-to-content";
import {
  isRouteLocale,
  routeLocaleToCurrency,
  routeLocaleToLanguage,
} from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import { createClient } from "@/lib/supabase/server";

type CheckoutPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale: routeLocale, slug } = await params;

  if (!isRouteLocale(routeLocale)) {
    notFound();
  }

  const language = routeLocaleToLanguage(routeLocale);
  const currency = routeLocaleToCurrency(routeLocale);
  const formattingLocale = language === "pt" ? "pt-BR" : "en-US";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localePath("/login", routeLocale));
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        slug,
        type,
        title_pt,
        title_en,
        artist,
        price_brl,
        price_usd,
        image
      `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const hasAccess = await userHasAccessToContent({
    userId: user.id,
    contentType: product.type,
    contentId: product.slug,
  });

  if (hasAccess) {
    const destinationPath =
      product.type === "song"
        ? `/learn/${product.slug}`
        : product.type === "course"
          ? `/courses/${product.slug}`
          : `/packs/${product.slug}`;

    redirect(localePath(destinationPath, routeLocale));
  }

  const productTitle =
    language === "pt"
      ? product.title_pt
      : (product.title_en ?? product.title_pt);

  const productPrice =
    currency === "BRL" ? Number(product.price_brl) : Number(product.price_usd);

  const formattedPrice = new Intl.NumberFormat(formattingLocale, {
    style: "currency",
    currency,
  }).format(productPrice);

  return (
    <>
      <Header />

      <main className="relative overflow-x-clip pb-32 pt-32">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute left-[-14rem] top-0 h-[32rem] w-[32rem]"
            style={{
              background:
                "radial-gradient(circle, rgba(230, 0, 126, 0.14) 0%, rgba(230, 0, 126, 0.05) 38%, transparent 72%)",
            }}
          />

          <div
            className="absolute right-[-12rem] top-[22rem] h-[30rem] w-[30rem]"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 38%, transparent 72%)",
            }}
          />
        </div>

        <Container>
          <section className="mx-auto w-full max-w-5xl">
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-magenta">
                Checkout
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                {language === "pt"
                  ? "Finalizar compra"
                  : "Complete your purchase"}
              </h1>

              <p className="mt-2 text-sm text-white/40">
                {language === "pt"
                  ? "Revise o produto e conclua o pagamento."
                  : "Review the product and complete your payment."}
              </p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <aside className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                {product.image && (
                  <div className="aspect-[16/9] overflow-hidden bg-black">
                    <img
                      src={product.image}
                      alt={productTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-white/30">
                    {language === "pt" ? "Sua compra" : "Your purchase"}
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {productTitle}
                  </h2>

                  {product.artist && (
                    <p className="mt-1 text-sm text-white/45">
                      {product.artist}
                    </p>
                  )}

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-white/30">Total</p>

                        <p className="mt-1 text-2xl font-semibold text-white">
                          {formattedPrice}
                        </p>
                      </div>

                      <span className="text-xs text-white/25">
                        {language === "pt"
                          ? "Pagamento único"
                          : "One-time payment"}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111214]">
                <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">
                    {language === "pt"
                      ? "Escolha como pagar"
                      : "Choose how to pay"}
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-white/40">
                    {language === "pt"
                      ? "Pague com cartão de crédito ou Pix."
                      : "Pay with credit card or Pix."}
                  </p>
                </div>

                <div className="px-3 py-4 sm:px-5 sm:py-6">
                  <CheckoutPaymentForm slug={product.slug} />
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 px-6 py-4 text-xs text-white/35 sm:px-8">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 shrink-0"
                  >
                    <path
                      d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span>
                    {language === "pt"
                      ? "Pagamento processado com segurança pelo Mercado Pago."
                      : "Payment securely processed by Mercado Pago."}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
