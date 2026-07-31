import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";
import CheckoutProductSummary from "@/components/checkout/CheckoutProductSummary";
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

  const paymentProviderLabel =
    routeLocale === "pt-br" ? "Mercado Pago" : "Stripe";

  const productHref =
    product.type === "song"
      ? localePath(`/learn/${product.slug}`, routeLocale)
      : product.type === "course"
        ? localePath(`/courses/${product.slug}`, routeLocale)
        : localePath(`/packs/${product.slug}`, routeLocale);

  return (
    <main className="relative min-h-screen overflow-x-clip px-0 pb-8 pt-8 sm:pb-10 sm:pt-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden animate-checkout-darken">
        <div className="checkout-blob checkout-blob-pink absolute left-[-14rem] top-0 h-[32rem] w-[32rem]" />

        <div className="checkout-blob checkout-blob-blue absolute right-[-12rem] top-[22rem] h-[30rem] w-[30rem]" />
      </div>

      <Container>
        <section className="mx-auto w-full max-w-5xl">
          <CheckoutLayout
            header={
              <div>
                <div className="mb-8 flex items-center justify-between gap-4">
                  <Link
                    href={productHref}
                    className="group inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white/75"
                  >
                    <ArrowLeft
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                      strokeWidth={1.8}
                    />

                    <span>
                      {language === "pt"
                        ? "Voltar para o produto"
                        : "Back to product"}
                    </span>
                  </Link>
                </div>

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
            }
            productSummary={
              <CheckoutProductSummary
                language={language}
                productTitle={productTitle}
                artist={product.artist}
                image={product.image}
                formattedPrice={formattedPrice}
              />
            }
            paymentPanel={
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                <div className="px-3 py-4 sm:px-5 sm:py-6">
                  <CheckoutPaymentForm
                    slug={product.slug}
                    amount={productPrice}
                    locale={routeLocale}
                  />
                </div>

                <div className="border-t border-white/10 px-6 py-4 sm:px-8">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-white/40">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                      >
                        <path
                          d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white/55">
                        {language === "pt"
                          ? "Pagamento seguro"
                          : "Secure payment"}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-white/30">
                        {language === "pt"
                          ? `Seus dados são processados com segurança pelo ${paymentProviderLabel}.`
                          : `Your payment details are securely processed by ${paymentProviderLabel}.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </section>
      </Container>
    </main>
  );
}
