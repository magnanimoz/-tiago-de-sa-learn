import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type PaymentStatusRouteProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: PaymentStatusRouteProps,
) {
  try {
    const { paymentId } = await params;

    if (!/^\d+$/.test(paymentId)) {
      return NextResponse.json(
        { error: "Pagamento inválido." },
        { status: 400 },
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
          status,
          status_detail,
          content_type,
          content_id,
          approved_at,
          updated_at
        `,
      )
      .eq("mercado_pago_payment_id", paymentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (paymentError) {
      console.error("Erro ao consultar pagamento no banco:", {
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

    return NextResponse.json({
      paymentId: payment.mercado_pago_payment_id,
      status: payment.status,
      statusDetail: payment.status_detail,
      contentType: payment.content_type,
      contentId: payment.content_id,
      approvedAt: payment.approved_at,
      updatedAt: payment.updated_at,
    });
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error);

    return NextResponse.json(
      { error: "Não foi possível consultar o pagamento." },
      { status: 500 },
    );
  }
}
