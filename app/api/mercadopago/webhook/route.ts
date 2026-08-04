import { NextResponse } from "next/server";
import { WebhookSignatureValidator } from "mercadopago";

import type { ContentType } from "@/lib/access/user-has-access-to-content";
import { supabaseAdmin } from "@/lib/supabase/admin";

type MercadoPagoWebhookBody = {
  id?: number | string;
  action?: string;
  api_version?: string;
  live_mode?: boolean;
  type?: string;
  user_id?: number | string;

  data?: {
    id?: number | string;
  };
};

type MercadoPagoPayment = {
  id?: number;
  status?: string;
  status_detail?: string;
  transaction_amount?: number;
  currency_id?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  date_approved?: string;
  external_reference?: string;
  live_mode?: boolean;
  payer?: {
    email?: string;
  };
  metadata?: {
    user_id?: string;
    content_type?: string;
    content_id?: string;
    locale?: string;
  };
};

function isContentType(value: unknown): value is ContentType {
  return value === "song" || value === "course" || value === "pack";
}

function getPaymentId(
  request: Request,
  body: MercadoPagoWebhookBody,
): string | null {
  const url = new URL(request.url);

  const queryPaymentId =
    url.searchParams.get("data.id") ??
    url.searchParams.get("data_id") ??
    url.searchParams.get("id");

  const bodyPaymentId =
    body.data?.id !== undefined ? String(body.data.id) : null;

  return queryPaymentId ?? bodyPaymentId;
}

export async function POST(request: Request) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    if (!accessToken || !webhookSecret) {
      console.error("Credenciais do Mercado Pago não configuradas.");

      return NextResponse.json(
        { error: "Webhook não configurado." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as MercadoPagoWebhookBody;

    if (body.type && body.type !== "payment") {
      return NextResponse.json({
        received: true,
        ignored: true,
        reason: "unsupported_event_type",
      });
    }

    const paymentId = getPaymentId(request, body);

    if (!paymentId || !/^\d+$/.test(paymentId)) {
      return NextResponse.json(
        { error: "Identificador de pagamento inválido." },
        { status: 400 },
      );
    }

    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    if (!xSignature || !xRequestId) {
      return NextResponse.json(
        { error: "Assinatura não recebida." },
        { status: 401 },
      );
    }

    try {
      WebhookSignatureValidator.validate({
        xSignature,
        xRequestId,
        dataId: paymentId,
        secret: webhookSecret,
      });
    } catch (error) {
      console.warn("Assinatura inválida no webhook do Mercado Pago.", {
        paymentId,
        error,
      });

      return NextResponse.json(
        { error: "Assinatura inválida." },
        { status: 401 },
      );
    }

    const mercadoPagoResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const payment = (await mercadoPagoResponse.json()) as MercadoPagoPayment;

    if (!mercadoPagoResponse.ok) {
      console.error("Erro ao consultar pagamento no Mercado Pago.", {
        paymentId,
        responseStatus: mercadoPagoResponse.status,
        payment,
      });

      if (mercadoPagoResponse.status === 404) {
        return NextResponse.json({
          received: true,
          ignored: true,
          reason: "payment_not_found",
          paymentId,
        });
      }

      return NextResponse.json(
        { error: "Não foi possível consultar o pagamento." },
        { status: 502 },
      );
    }

    if (!payment.id || !payment.status) {
      console.error("Resposta incompleta do Mercado Pago.", payment);

      return NextResponse.json(
        { error: "Pagamento incompleto." },
        { status: 502 },
      );
    }

    const userId = payment.metadata?.user_id;
    const contentType = payment.metadata?.content_type;
    const contentId = payment.metadata?.content_id;

    if (!userId || !isContentType(contentType) || !contentId) {
      console.error("Pagamento aprovado sem metadados válidos.", {
        paymentId: payment.id,
        metadata: payment.metadata,
      });

      return NextResponse.json({
        received: true,
        ignored: true,
        reason: "invalid_metadata",
      });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("slug, type, price_brl, published")
      .eq("slug", contentId)
      .eq("type", contentType)
      .eq("published", true)
      .maybeSingle();

    if (productError) {
      console.error("Erro ao validar produto do pagamento.", productError);

      return NextResponse.json(
        { error: "Não foi possível validar o produto." },
        { status: 500 },
      );
    }

    if (!product) {
      console.error("Produto do pagamento não encontrado.", {
        paymentId: payment.id,
        contentType,
        contentId,
      });

      return NextResponse.json({
        received: true,
        ignored: true,
        reason: "product_not_found",
      });
    }

    const expectedAmount = Number(product.price_brl);
    const paidAmount = Number(payment.transaction_amount);

    if (
      payment.currency_id !== "BRL" ||
      !Number.isFinite(expectedAmount) ||
      !Number.isFinite(paidAmount) ||
      Math.abs(paidAmount - expectedAmount) > 0.001
    ) {
      console.error("Valor ou moeda do pagamento não confere.", {
        paymentId: payment.id,
        expectedAmount,
        paidAmount,
        currency: payment.currency_id,
      });

      return NextResponse.json({
        received: true,
        ignored: true,
        reason: "amount_or_currency_mismatch",
      });
    }

    const { error: paymentUpsertError } = await supabaseAdmin
      .from("payments")
      .upsert(
        {
          provider: "mercado_pago",
          provider_payment_id: String(payment.id),
          mercado_pago_payment_id: payment.id,
          user_id: userId,
          content_type: contentType,
          content_id: contentId,
          status: payment.status,
          status_detail: payment.status_detail ?? null,
          payment_method_id: payment.payment_method_id ?? null,
          payment_type_id: payment.payment_type_id ?? null,
          amount: paidAmount,
          currency: payment.currency_id,
          payer_email: payment.payer?.email ?? null,
          external_reference: payment.external_reference ?? null,
          live_mode: payment.live_mode ?? null,
          approved_at: payment.date_approved ?? null,
        },
        {
          onConflict: "mercado_pago_payment_id",
        },
      );

    if (paymentUpsertError) {
      console.error("Erro ao atualizar pagamento no banco.", {
        paymentId: payment.id,
        status: payment.status,
        paymentUpsertError,
      });

      return NextResponse.json(
        { error: "Não foi possível atualizar o pagamento." },
        { status: 500 },
      );
    }

    if (payment.status !== "approved") {
      console.info("Status do pagamento atualizado.", {
        paymentId: payment.id,
        status: payment.status,
        statusDetail: payment.status_detail,
      });

      return NextResponse.json({
        received: true,
        paymentId: payment.id,
        status: payment.status,
        accessGranted: false,
      });
    }

    const { error: accessError } = await supabaseAdmin
      .from("content_access")
      .upsert(
        {
          user_id: userId,
          content_type: contentType,
          content_id: contentId,
        },
        {
          onConflict: "user_id,content_type,content_id",
          ignoreDuplicates: true,
        },
      );

    if (accessError) {
      console.error("Erro ao liberar conteúdo após pagamento.", {
        paymentId: payment.id,
        userId,
        contentType,
        contentId,
        accessError,
      });

      return NextResponse.json(
        { error: "Não foi possível liberar o conteúdo." },
        { status: 500 },
      );
    }

    console.info("Acesso liberado após pagamento aprovado.", {
      paymentId: payment.id,
      userId,
      contentType,
      contentId,
      amount: paidAmount,
      paymentMethod: payment.payment_method_id,
      paymentType: payment.payment_type_id,
      approvedAt: payment.date_approved,
    });

    return NextResponse.json({
      received: true,
      paymentId: payment.id,
      status: payment.status,
      accessGranted: true,
    });
  } catch (error) {
    console.error("Erro inesperado no webhook do Mercado Pago.", error);

    return NextResponse.json(
      { error: "Erro ao processar webhook." },
      { status: 500 },
    );
  }
}
