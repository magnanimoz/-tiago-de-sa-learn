import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { userHasAccessToContent } from "@/lib/access/user-has-access-to-content";
import { isRouteLocale, routeLocaleToLanguage } from "@/lib/i18n";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CardPaymentData = {
  token?: string;
  issuer_id?: string | number;
  payment_method_id?: string;
  transaction_amount?: number;
  installments?: number;
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

type MercadoPagoPaymentResponse = {
  id?: number;
  status?: string;
  status_detail?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  transaction_amount?: number;
  currency_id?: string;
  external_reference?: string;
  live_mode?: boolean;
  date_approved?: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
  message?: string;
  cause?: Array<{
    code?: number;
    description?: string;
  }>;
};

export async function POST(request: Request) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("MERCADO_PAGO_ACCESS_TOKEN não está configurado.");

      return NextResponse.json(
        { error: "O Mercado Pago não está configurado." },
        { status: 500 },
      );
    }

    const body = await request.json();

    const slug = typeof body.slug === "string" ? body.slug.trim() : "";

    const routeLocale =
      typeof body.locale === "string" && isRouteLocale(body.locale)
        ? body.locale
        : null;

    const paymentMethod =
      body.paymentMethod === "card" || body.paymentMethod === "pix"
        ? body.paymentMethod
        : null;

    const paymentData =
      body.paymentData && typeof body.paymentData === "object"
        ? (body.paymentData as CardPaymentData)
        : null;

    if (!routeLocale) {
      return NextResponse.json({ error: "Locale inválido." }, { status: 400 });
    }

    const language = routeLocaleToLanguage(routeLocale);

    if (!slug) {
      return NextResponse.json(
        {
          error: language === "pt" ? "Produto inválido." : "Invalid product.",
        },
        { status: 400 },
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Forma de pagamento inválida."
              : "Invalid payment method.",
        },
        { status: 400 },
      );
    }

    if (!paymentData) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Dados de pagamento inválidos."
              : "Invalid payment data.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: language === "pt" ? "Não autenticado." : "Not authenticated.",
        },
        { status: 401 },
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
          slug,
          type,
          title_pt,
          title_en,
          price_brl,
          published
        `,
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (productError) {
      console.error("Erro ao buscar produto:", productError);
    }

    if (productError || !product) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Produto não encontrado."
              : "Product not found.",
        },
        { status: 404 },
      );
    }

    const hasAccess = await userHasAccessToContent({
      userId: user.id,
      contentType: product.type,
      contentId: product.slug,
    });

    if (hasAccess) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Você já possui este produto."
              : "You already own this product.",
        },
        { status: 409 },
      );
    }
    const amount = Number(product.price_brl);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Preço inválido para este produto."
              : "Invalid product price.",
        },
        { status: 400 },
      );
    }

    const productTitle =
      language === "pt"
        ? product.title_pt
        : (product.title_en ?? product.title_pt);

    if (!productTitle) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Título inválido para este produto."
              : "Invalid product title.",
        },
        { status: 400 },
      );
    }

    if (paymentMethod === "card" && !paymentData.token) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "O token do cartão não foi recebido."
              : "The card token was not received.",
        },
        { status: 400 },
      );
    }

    console.log("paymentData recebido:", paymentData);

    const payerEmail = paymentData.payer?.email?.trim();

    if (!payerEmail) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Informe o e-mail do comprador."
              : "Enter the buyer email.",
        },
        { status: 400 },
      );
    }

    const payerIdentification = paymentData.payer?.identification;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

    const notificationUrl =
      siteUrl &&
      !siteUrl.includes("localhost") &&
      !siteUrl.includes("127.0.0.1")
        ? `${siteUrl}/api/mercadopago/webhook`
        : undefined;

    const externalReference = `${user.id}:${product.type}:${product.slug}`;

    const mercadoPagoBody =
      paymentMethod === "card"
        ? {
            transaction_amount: amount,
            token: paymentData.token,
            description: productTitle,
            installments: Number(paymentData.installments ?? 1),
            payment_method_id: paymentData.payment_method_id,
            issuer_id: paymentData.issuer_id,
            payer: {
              email: payerEmail,
              identification:
                payerIdentification?.type && payerIdentification?.number
                  ? {
                      type: payerIdentification.type,
                      number: payerIdentification.number,
                    }
                  : undefined,
            },
            external_reference: externalReference,
            metadata: {
              user_id: user.id,
              content_type: product.type,
              content_id: product.slug,
              locale: routeLocale,
            },
            notification_url: notificationUrl,
          }
        : {
            transaction_amount: amount,
            description: productTitle,
            payment_method_id: "pix",
            payer: {
              email: payerEmail,
              identification:
                payerIdentification?.type && payerIdentification?.number
                  ? {
                      type: payerIdentification.type,
                      number: payerIdentification.number,
                    }
                  : undefined,
            },
            external_reference: externalReference,
            metadata: {
              user_id: user.id,
              content_type: product.type,
              content_id: product.slug,
              locale: routeLocale,
            },
            notification_url: notificationUrl,
          };

    const mercadoPagoResponse = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": randomUUID(),
        },
        body: JSON.stringify(mercadoPagoBody),
        cache: "no-store",
      },
    );

    const mercadoPagoRequestId =
      mercadoPagoResponse.headers.get("x-request-id");

    const payment =
      (await mercadoPagoResponse.json()) as MercadoPagoPaymentResponse;

    if (!mercadoPagoResponse.ok) {
      console.error("Erro retornado pelo Mercado Pago:", {
        requestId: mercadoPagoRequestId,
        status: mercadoPagoResponse.status,
        payment,
      });

      const mercadoPagoDescription = payment.cause?.[0]?.description;
      const isMercadoPagoServerError = mercadoPagoResponse.status >= 500;

      return NextResponse.json(
        {
          error: isMercadoPagoServerError
            ? language === "pt"
              ? "O Mercado Pago está temporariamente indisponível. Tente novamente."
              : "Mercado Pago is temporarily unavailable. Please try again."
            : (mercadoPagoDescription ??
              (language === "pt"
                ? "O Mercado Pago não conseguiu processar o pagamento."
                : "Mercado Pago could not process the payment.")),
        },
        { status: mercadoPagoResponse.status },
      );
    }

    if (!payment.id || !payment.status) {
      console.error("Resposta incompleta do Mercado Pago:", payment);

      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "O Mercado Pago retornou uma resposta incompleta."
              : "Mercado Pago returned an incomplete response.",
        },
        { status: 502 },
      );
    }

    const paidAmount = Number(payment.transaction_amount ?? amount);

    if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
      console.error("Valor inválido retornado pelo Mercado Pago:", payment);

      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "O Mercado Pago retornou um valor inválido."
              : "Mercado Pago returned an invalid amount.",
        },
        { status: 502 },
      );
    }

    const { error: paymentInsertError } = await supabaseAdmin
      .from("payments")
      .upsert(
        {
          provider: "mercado_pago",
          provider_payment_id: String(payment.id),
          mercado_pago_payment_id: payment.id,
          user_id: user.id,
          content_type: product.type,
          content_id: product.slug,
          status: payment.status,
          status_detail: payment.status_detail ?? null,
          payment_method_id:
            payment.payment_method_id ??
            (paymentMethod === "pix"
              ? "pix"
              : (paymentData.payment_method_id ?? null)),
          payment_type_id: payment.payment_type_id ?? null,
          amount: paidAmount,
          currency: payment.currency_id ?? "BRL",
          payer_email: payerEmail,
          external_reference: payment.external_reference ?? externalReference,
          live_mode: payment.live_mode ?? null,
          approved_at: payment.date_approved ?? null,
        },
        {
          onConflict: "mercado_pago_payment_id",
        },
      );

    if (paymentInsertError) {
      console.error("Erro ao registrar pagamento no banco:", {
        paymentId: payment.id,
        paymentInsertError,
      });

      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "O pagamento foi criado, mas não foi possível registrá-lo."
              : "The payment was created but could not be registered.",
        },
        { status: 500 },
      );
    }

    const pixTransaction = payment.point_of_interaction?.transaction_data;

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,

      pix:
        paymentMethod === "pix"
          ? {
              qrCode: pixTransaction?.qr_code,
              qrCodeBase64: pixTransaction?.qr_code_base64,
              ticketUrl: pixTransaction?.ticket_url,
            }
          : undefined,
    });
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);

    return NextResponse.json(
      { error: "Não foi possível processar o pagamento." },
      { status: 500 },
    );
  }
}
