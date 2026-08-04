import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CancelPaymentRouteProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

type MercadoPagoCancellationResponse = {
  id?: number;
  status?: string;
  status_detail?: string;
  message?: string;
  cause?: Array<{
    code?: number;
    description?: string;
  }>;
};

const cancellableStatuses = new Set(["pending", "in_process", "authorized"]);

export async function POST(
  _request: Request,
  { params }: CancelPaymentRouteProps,
) {
  try {
    const { paymentId } = await params;

    if (!/^\d+$/.test(paymentId)) {
      return NextResponse.json(
        { error: "Pagamento inválido." },
        { status: 400 },
      );
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("MERCADO_PAGO_ACCESS_TOKEN não está configurado.");

      return NextResponse.json(
        { error: "O Mercado Pago não está configurado." },
        { status: 500 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select(
        `
          mercado_pago_payment_id,
          provider,
          payment_method_id,
          status,
          user_id
        `,
      )
      .eq("mercado_pago_payment_id", paymentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (paymentError) {
      console.error("Erro ao buscar pagamento para cancelamento:", {
        paymentId,
        userId: user.id,
        paymentError,
      });

      return NextResponse.json(
        { error: "Não foi possível consultar o pagamento." },
        { status: 500 },
      );
    }

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado." },
        { status: 404 },
      );
    }

    if (
      payment.provider !== "mercado_pago" ||
      payment.payment_method_id !== "pix"
    ) {
      return NextResponse.json(
        { error: "Este pagamento não pode ser cancelado por esta operação." },
        { status: 400 },
      );
    }

    if (payment.status === "cancelled") {
      return NextResponse.json({
        paymentId: payment.mercado_pago_payment_id,
        status: "cancelled",
        alreadyCancelled: true,
      });
    }

    if (!cancellableStatuses.has(payment.status)) {
      return NextResponse.json(
        {
          error:
            payment.status === "approved"
              ? "O pagamento já foi aprovado e não pode ser cancelado."
              : "O pagamento não está em um estado que permita cancelamento.",
          status: payment.status,
        },
        { status: 409 },
      );
    }

    const mercadoPagoResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
        cache: "no-store",
      },
    );

    const mercadoPagoRequestId =
      mercadoPagoResponse.headers.get("x-request-id");

    const cancellation =
      (await mercadoPagoResponse.json()) as MercadoPagoCancellationResponse;

    if (!mercadoPagoResponse.ok) {
      console.error("Erro ao cancelar pagamento no Mercado Pago:", {
        paymentId,
        requestId: mercadoPagoRequestId,
        responseStatus: mercadoPagoResponse.status,
        cancellation,
      });

      const mercadoPagoDescription =
        cancellation.cause?.[0]?.description ?? cancellation.message;

      return NextResponse.json(
        {
          error:
            mercadoPagoDescription ?? "Não foi possível cancelar o pagamento.",
        },
        { status: mercadoPagoResponse.status },
      );
    }

    if (
      cancellation.id !== Number(paymentId) ||
      cancellation.status !== "cancelled"
    ) {
      console.error("Resposta inesperada ao cancelar pagamento:", {
        paymentId,
        cancellation,
      });

      return NextResponse.json(
        { error: "O Mercado Pago retornou uma resposta inesperada." },
        { status: 502 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("payments")
      .update({
        status: "cancelled",
        status_detail: cancellation.status_detail ?? null,
      })
      .eq("mercado_pago_payment_id", paymentId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Pagamento cancelado, mas banco não foi atualizado:", {
        paymentId,
        userId: user.id,
        updateError,
      });

      return NextResponse.json(
        {
          error:
            "O pagamento foi cancelado, mas não foi possível atualizar o registro.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      paymentId: cancellation.id,
      status: cancellation.status,
      statusDetail: cancellation.status_detail ?? null,
    });
  } catch (error) {
    console.error("Erro ao cancelar pagamento Pix:", error);

    return NextResponse.json(
      { error: "Não foi possível cancelar o pagamento." },
      { status: 500 },
    );
  }
}
