import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ContentType } from "@/lib/access/user-has-access-to-content";
import { stripe } from "@/lib/stripe/client";

function isContentType(value: unknown): value is ContentType {
  return value === "song" || value === "course" || value === "pack";
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET não está configurado.");

    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Stripe signature was not received." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.warn("Invalid Stripe webhook signature.", error);

    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({
      received: true,
      ignored: true,
      eventId: event.id,
      eventType: event.type,
    });
  }

  const session = event.data.object;

  if (session.payment_status !== "paid") {
    return NextResponse.json({
      received: true,
      eventId: event.id,
      eventType: event.type,
      accessGranted: false,
      reason: "payment_not_paid",
    });
  }

  const userId = session.metadata?.user_id;
  const contentType = session.metadata?.content_type;
  const contentId = session.metadata?.content_id;
  const locale = session.metadata?.locale;

  if (
    !userId ||
    !isContentType(contentType) ||
    !contentId ||
    locale !== "en-us"
  ) {
    console.error("Stripe session has invalid metadata.", {
      sessionId: session.id,
      metadata: session.metadata,
    });

    return NextResponse.json({
      received: true,
      ignored: true,
      reason: "invalid_metadata",
    });
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("slug, type, price_usd, published")
    .eq("slug", contentId)
    .eq("type", contentType)
    .eq("published", true)
    .maybeSingle();

  if (productError) {
    console.error("Error validating Stripe product.", productError);

    return NextResponse.json(
      { error: "Could not validate product." },
      { status: 500 },
    );
  }

  if (!product) {
    return NextResponse.json({
      received: true,
      ignored: true,
      reason: "product_not_found",
    });
  }

  const expectedAmount = Math.round(Number(product.price_usd) * 100);
  const paidAmount = session.amount_total;

  if (
    session.currency !== "usd" ||
    !Number.isFinite(expectedAmount) ||
    expectedAmount <= 0 ||
    paidAmount === null ||
    paidAmount !== expectedAmount
  ) {
    console.error("Stripe amount or currency mismatch.", {
      sessionId: session.id,
      expectedAmount,
      paidAmount,
      currency: session.currency,
    });

    return NextResponse.json({
      received: true,
      ignored: true,
      reason: "amount_or_currency_mismatch",
    });
  }

  const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
    {
      provider: "stripe",
      provider_payment_id: session.id,

      user_id: userId,

      content_type: contentType,
      content_id: contentId,

      amount: Number(product.price_usd),
      currency: "USD",

      status: "approved",
      status_detail: session.payment_status,
    },
    {
      onConflict: "provider,provider_payment_id",
    },
  );

  if (paymentError) {
    console.error("Error saving Stripe payment.", paymentError);

    return NextResponse.json(
      { error: "Could not save payment." },
      { status: 500 },
    );
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
    console.error("Error granting Stripe access.", {
      sessionId: session.id,
      userId,
      contentType,
      contentId,
      accessError,
    });

    return NextResponse.json(
      { error: "Could not grant access." },
      { status: 500 },
    );
  }

  console.info("Access granted after Stripe payment.", {
    eventId: event.id,
    sessionId: session.id,
    userId,
    contentType,
    contentId,
    amount: paidAmount,
    currency: session.currency,
  });

  return NextResponse.json({
    received: true,
    eventId: event.id,
    eventType: event.type,
    sessionId: session.id,
    accessGranted: true,
  });
}
