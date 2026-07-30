import { NextResponse } from "next/server";

import { userHasAccessToContent } from "@/lib/access/user-has-access-to-content";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";

type StripeCheckoutRequest = {
  slug?: unknown;
  locale?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StripeCheckoutRequest;

    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const locale = body.locale === "en-us" ? body.locale : null;

    if (!locale) {
      return NextResponse.json(
        { error: "Stripe checkout is only available for en-us." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

    if (!siteUrl) {
      return NextResponse.json(
        { error: "The site URL is not configured." },
        { status: 500 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
          slug,
          type,
          title_en,
          title_pt,
          price_usd,
          published
        `,
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (productError) {
      console.error("Error loading Stripe checkout product:", productError);
    }

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found." },
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
        { error: "You already own this product." },
        { status: 409 },
      );
    }

    const amount = Number(product.price_usd);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid product price." },
        { status: 400 },
      );
    }

    const amountInCents = Math.round(amount * 100);
    const productTitle = product.title_en ?? product.title_pt;

    if (!productTitle) {
      return NextResponse.json(
        { error: "Invalid product title." },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      success_url: `${siteUrl}/en-us/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/en-us/checkout/${product.slug}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: productTitle,
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        content_type: product.type,
        content_id: product.slug,
        locale,
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          content_type: product.type,
          content_id: product.slug,
          locale,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating Stripe Checkout Session:", error);

    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 },
    );
  }
}
