import { notFound, redirect } from "next/navigation";

import { isRouteLocale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import { stripe } from "@/lib/stripe/server";

type CheckoutReturnPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutReturnPage({
  params,
  searchParams,
}: CheckoutReturnPageProps) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;

  if (!isRouteLocale(locale)) {
    notFound();
  }

  if (!sessionId) {
    redirect(localePath("/learn", locale));
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const contentType = session.metadata?.content_type;
  const contentId = session.metadata?.content_id;

  if (!contentType || !contentId) {
    redirect(localePath("/learn", locale));
  }

  const destinationPath =
    contentType === "song"
      ? `/learn/${contentId}`
      : contentType === "course"
        ? `/courses/${contentId}`
        : `/packs/${contentId}`;

  redirect(localePath(destinationPath, locale));
}
