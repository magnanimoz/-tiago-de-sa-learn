import { notFound, redirect } from "next/navigation";

import CheckoutReturnExperience from "@/components/checkout/CheckoutReturnExperience";
import { isRouteLocale, routeLocaleToLanguage } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";

type CheckoutReturnPageProps = {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    payment_id?: string;
    session_id?: string;
    preview_status?: string;
  }>;
};

type MercadoPagoPayment = {
  id?: number;
  status?: string;

  metadata?: {
    user_id?: string;
    content_type?: string;
    content_id?: string;
  };
};

function resolveDestination(contentType: string, contentId: string) {
  if (contentType === "song") {
    return `/learn/${contentId}`;
  }

  if (contentType === "course") {
    return `/courses/${contentId}`;
  }

  return `/packs/${contentId}`;
}

export default async function CheckoutReturnPage({
  params,
  searchParams,
}: CheckoutReturnPageProps) {
  const { locale } = await params;
  const {
    payment_id: paymentId,
    session_id: sessionId,
    preview_status: previewStatus,
  } = await searchParams;

  if (!isRouteLocale(locale)) {
    notFound();
  }

  const language = routeLocaleToLanguage(locale);
  const libraryHref = localePath("/learn", locale);

  const isDevelopmentPreview =
    process.env.NODE_ENV === "development" &&
    (previewStatus === "approved" ||
      previewStatus === "pending" ||
      previewStatus === "failure");

  if (isDevelopmentPreview) {
    return (
      <CheckoutReturnExperience
        language={language}
        status={previewStatus}
        previewAutoApprove={previewStatus === "pending"}
        productTitle="Lion and the Lamb"
        destinationHref={localePath("/learn/lion-and-the-lamb", locale)}
        libraryHref={libraryHref}
        checkoutHref={localePath("/checkout/lion-and-the-lamb", locale)}
      />
    );
  }

  if (locale === "en-us" && sessionId) {
    if (!sessionId.startsWith("cs_")) {
      notFound();
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect(localePath("/login", locale));
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (
        session.client_reference_id !== user.id ||
        session.metadata?.user_id !== user.id
      ) {
        notFound();
      }

      const contentType = session.metadata?.content_type;
      const contentId = session.metadata?.content_id;

      if (!contentType || !contentId) {
        return (
          <CheckoutReturnExperience
            language={language}
            status="pending"
            libraryHref={libraryHref}
          />
        );
      }

      const { data: product } = await supabase
        .from("products")
        .select("title_pt, title_en")
        .eq("slug", contentId)
        .maybeSingle();

      const productTitle = product?.title_en ?? product?.title_pt;

      const destinationHref = localePath(
        resolveDestination(contentType, contentId),
        locale,
      );

      const checkoutHref = localePath(`/checkout/${contentId}`, locale);

      const status =
        session.payment_status === "paid"
          ? "approved"
          : session.status === "expired"
            ? "failure"
            : "pending";

      return (
        <CheckoutReturnExperience
          language={language}
          status={status}
          productTitle={productTitle}
          destinationHref={destinationHref}
          libraryHref={libraryHref}
          checkoutHref={checkoutHref}
          paymentId={session.id}
        />
      );
    } catch (error) {
      console.error("Error loading Stripe checkout return:", error);

      return (
        <CheckoutReturnExperience
          language={language}
          status="pending"
          libraryHref={libraryHref}
          paymentId={sessionId}
        />
      );
    }
  }

  if (!paymentId || !/^\d+$/.test(paymentId)) {
    redirect(libraryHref);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localePath("/login", locale));
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return (
      <CheckoutReturnExperience
        language={language}
        status="pending"
        libraryHref={libraryHref}
        paymentId={paymentId}
      />
    );
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return (
        <CheckoutReturnExperience
          language={language}
          status="pending"
          libraryHref={libraryHref}
          paymentId={paymentId}
        />
      );
    }

    const payment = (await response.json()) as MercadoPagoPayment;

    if (payment.metadata?.user_id !== user.id) {
      notFound();
    }

    const contentType = payment.metadata?.content_type;
    const contentId = payment.metadata?.content_id;

    let productTitle: string | undefined;
    let destinationHref: string | undefined;
    let checkoutHref: string | undefined;

    if (contentType && contentId) {
      const { data: product } = await supabase
        .from("products")
        .select("title_pt, title_en")
        .eq("slug", contentId)
        .maybeSingle();

      productTitle =
        language === "pt"
          ? product?.title_pt
          : (product?.title_en ?? product?.title_pt);

      destinationHref = localePath(
        resolveDestination(contentType, contentId),
        locale,
      );

      checkoutHref = localePath(`/checkout/${contentId}`, locale);
    }

    const status =
      payment.status === "approved"
        ? "approved"
        : payment.status === "rejected" ||
            payment.status === "cancelled" ||
            payment.status === "refunded" ||
            payment.status === "charged_back"
          ? "failure"
          : "pending";

    return (
      <CheckoutReturnExperience
        language={language}
        status={status}
        productTitle={productTitle}
        destinationHref={destinationHref}
        libraryHref={libraryHref}
        checkoutHref={checkoutHref}
        paymentId={String(payment.id ?? paymentId)}
      />
    );
  } catch (error) {
    console.error("Erro ao montar página de retorno:", error);

    return (
      <CheckoutReturnExperience
        language={language}
        status="pending"
        libraryHref={libraryHref}
        paymentId={paymentId}
      />
    );
  }
}
