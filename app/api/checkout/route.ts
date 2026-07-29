import { NextResponse } from "next/server";

import { userHasAccessToContent } from "@/lib/access/user-has-access-to-content";
import {
  isRouteLocale,
  routeLocaleToCurrency,
  routeLocaleToLanguage,
} from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug = typeof body.slug === "string" ? body.slug.trim() : "";

    const routeLocale =
      typeof body.locale === "string" && isRouteLocale(body.locale)
        ? body.locale
        : null;

    if (!routeLocale) {
      return NextResponse.json({ error: "Locale inválido." }, { status: 400 });
    }

    const language = routeLocaleToLanguage(routeLocale);
    const currency = routeLocaleToCurrency(routeLocale);

    if (!slug) {
      return NextResponse.json(
        {
          error: language === "pt" ? "Produto inválido." : "Invalid product.",
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
          price_usd,
          published
        `,
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const amount =
      currency === "BRL"
        ? Number(product.price_brl)
        : Number(product.price_usd);

    const productTitle =
      language === "pt" ? product.title_pt : product.title_en;

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "Preço inválido para este produto."
              : "Invalid price for this product.",
        },
        { status: 400 },
      );
    }

    const paymentMethodTypes: Array<"card" | "pix"> =
      currency === "BRL" ? ["card", "pix"] : ["card"];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "elements",

      payment_method_types: paymentMethodTypes,
      customer_email: user.email ?? undefined,

      line_items: [
        {
          quantity: 1,

          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(amount * 100),

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
        locale: routeLocale,
      },

      return_url: `${siteUrl}${localePath(
        "/checkout/return",
        routeLocale,
      )}?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        {
          error:
            language === "pt"
              ? "O Stripe não retornou o client secret."
              : "Stripe did not return the client secret.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);

    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento." },
      { status: 500 },
    );
  }
}
