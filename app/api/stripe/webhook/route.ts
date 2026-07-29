import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura do Stripe ausente." },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET não configurada.");

    return NextResponse.json(
      { error: "Webhook não configurado." },
      { status: 500 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Assinatura inválida do webhook:", error);

    return NextResponse.json({ error: "Webhook inválido." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.user_id;
    const contentType = session.metadata?.content_type;
    const contentId = session.metadata?.content_id;

    if (!userId || !contentType || !contentId) {
      console.error("Checkout concluído sem metadata necessária:", session.id);

      return NextResponse.json(
        { error: "Metadata incompleta." },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from("content_access").upsert(
      {
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
      },
      {
        onConflict: "user_id,content_type,content_id",
      },
    );

    if (error) {
      console.error("Erro ao conceder acesso após pagamento:", error);

      return NextResponse.json(
        { error: "Não foi possível conceder o acesso." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    received: true,
  });
}
