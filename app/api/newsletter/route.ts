import { NextResponse } from "next/server";

type NewsletterRequestBody = {
  email?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterRequestBody;

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json(
        {
          error: "E-mail inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("A variável NEWSLETTER_WEBHOOK_URL não está configurada.");

      return NextResponse.json(
        {
          error: "O serviço de newsletter não está configurado.",
        },
        {
          status: 503,
        },
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: "website-footer",
        subscribedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text();

      console.error(
        "Erro retornado pelo webhook da newsletter:",
        webhookResponse.status,
        responseText,
      );

      return NextResponse.json(
        {
          error: "Não foi possível realizar a inscrição.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Erro inesperado na rota da newsletter:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor.",
      },
      {
        status: 500,
      },
    );
  }
}
