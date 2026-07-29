"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { purchases } from "@/app/[locale]/account/purchases/mock";
import { useSettings } from "@/contexts/SettingsContext";
import type { Locale, RouteLocale } from "@/lib/i18n";
import { accountText } from "@/lib/i18n/account";
import { localePath } from "@/lib/locale-path";
import { t } from "@/lib/t";

import { PurchaseCard } from "./PurchaseCard";

type PurchasesViewProps = {
  language: Locale;
};

type PurchaseStatus = "paid" | "pending" | "refunded" | "failed" | "cancelled";

type StatusConfig = {
  label: string;
  className: string;
  dotClassName: string;
};

function getStatusConfig(
  status: PurchaseStatus,
  language: Locale,
): StatusConfig {
  const statusMap: Record<PurchaseStatus, StatusConfig> = {
    paid: {
      label: language === "pt" ? "Pago" : "Paid",
      className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      dotClassName: "bg-emerald-300",
    },
    pending: {
      label: language === "pt" ? "Processando" : "Processing",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
      dotClassName: "bg-amber-300",
    },
    refunded: {
      label: language === "pt" ? "Reembolsado" : "Refunded",
      className: "border-sky-400/20 bg-sky-400/10 text-sky-200",
      dotClassName: "bg-sky-300",
    },
    failed: {
      label: language === "pt" ? "Falhou" : "Failed",
      className: "border-red-400/20 bg-red-400/10 text-red-200",
      dotClassName: "bg-red-300",
    },
    cancelled: {
      label: language === "pt" ? "Cancelado" : "Cancelled",
      className: "border-white/10 bg-white/[0.06] text-white/60",
      dotClassName: "bg-white/40",
    },
  };

  return statusMap[status];
}

export function PurchasesView({ language }: PurchasesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { routeLocale } = useSettings();

  const [direction, setDirection] = useState<1 | -1>(1);
  const purchasesSectionRef = useRef<HTMLElement>(null);

  const orderNumber = searchParams.get("order");

  const selectedPurchase = purchases.find(
    (purchase) => purchase.orderNumber === orderNumber,
  );

  const locale = language === "pt" ? "pt-BR" : "en-US";

  const viewKey = selectedPurchase
    ? `details-${selectedPurchase.orderNumber}`
    : "list";

  const statusConfig = selectedPurchase
    ? getStatusConfig(selectedPurchase.status as PurchaseStatus, language)
    : undefined;

  useEffect(() => {
    if (!selectedPurchase) return;

    const section = purchasesSectionRef.current;

    if (!section) return;

    const rect = section.getBoundingClientRect();

    if (rect.top < 0) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedPurchase]);

  function navigateToDetails(selectedOrderNumber: string) {
    setDirection(1);

    const params = new URLSearchParams(searchParams.toString());

    params.set("order", selectedOrderNumber);

    router.replace(
      `${localePath("/account/purchases", routeLocale)}?${params.toString()}`,
      {
        scroll: false,
      },
    );
  }

  function navigateBack() {
    setDirection(-1);

    const params = new URLSearchParams(searchParams.toString());

    params.delete("order");

    const query = params.toString();
    const purchasesPath = localePath("/account/purchases", routeLocale);

    router.replace(query ? `${purchasesPath}?${query}` : purchasesPath, {
      scroll: false,
    });
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatCurrency(amountInCents: number, currency: string) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amountInCents / 100);
  }

  return (
    <section
      ref={purchasesSectionRef}
      className="mx-auto w-full max-w-5xl scroll-mt-35"
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <h1
              className={`transition-colors ${
                selectedPurchase ? "text-white/50" : "text-white"
              }`}
            >
              {t(accountText.purchases.pageTitle, language)}
            </h1>

            <AnimatePresence initial={false}>
              {selectedPurchase && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="text-white/30">›</span>

                  <span className="truncate text-white">
                    {t(accountText.purchases.details, language)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/45">
            {selectedPurchase
              ? language === "pt"
                ? "Confira os dados, o pagamento e as opções disponíveis para esta compra."
                : "Review the purchase details, payment information and available actions."
              : language === "pt"
                ? "Acesse seus produtos, recibos e informações de pagamento."
                : "Access your products, receipts and payment information."}
          </p>
        </div>

        {!selectedPurchase && purchases.length > 0 && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            {purchases.length}{" "}
            {purchases.length === 1
              ? language === "pt"
                ? "compra"
                : "purchase"
              : language === "pt"
                ? "compras"
                : "purchases"}
          </div>
        )}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={viewKey}
          initial={{
            opacity: 0,
            x: direction > 0 ? 12 : -12,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? -12 : 12,
          }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
        >
          {!selectedPurchase ? (
            purchases.length === 0 ? (
              <EmptyPurchases language={language} routeLocale={routeLocale} />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                {purchases.map((purchase, index) => (
                  <PurchaseCard
                    key={purchase.orderNumber}
                    index={index}
                    language={language}
                    onDetailsClick={() =>
                      navigateToDetails(purchase.orderNumber)
                    }
                    {...purchase}
                  />
                ))}
              </div>
            )
          ) : (
            <div>
              <button
                type="button"
                onClick={navigateBack}
                className="group mb-4 inline-flex min-h-9 items-center gap-2 rounded-lg px-1 text-xs font-medium text-white/40 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                >
                  ←
                </span>

                {language === "pt" ? "Voltar" : "Back"}
              </button>

              <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
                        {t(accountText.purchases.order, language)}
                      </p>

                      <p className="mt-1 truncate font-mono text-sm text-white/60">
                        #{selectedPurchase.orderNumber}
                      </p>
                    </div>
                  </div>

                  {statusConfig && (
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${statusConfig.className}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClassName}`}
                      />

                      {statusConfig.label}
                    </div>
                  )}
                </div>

                <div className="grid border-t border-white/10 lg:grid-cols-[minmax(0,1fr)_200px]">
                  <div className="min-w-0 px-5 py-6 sm:px-6">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
                      {language === "pt"
                        ? "Produto adquirido"
                        : "Purchased product"}
                    </p>

                    <h2 className="mt-2 max-w-2xl text-xl font-semibold leading-snug tracking-[-0.025em] text-white sm:text-2xl">
                      {selectedPurchase.productName[language]}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-white/35">
                      <span>{formatDate(selectedPurchase.purchasedAt)}</span>

                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-white/20"
                      />

                      <span>
                        {language === "pt"
                          ? "Produto digital"
                          : "Digital product"}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-white/20"
                      />

                      <span>
                        {language === "pt"
                          ? "Acesso disponível"
                          : "Access available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center border-t border-white/10 px-5 py-5 lg:border-l lg:border-t-0 lg:px-6 lg:text-right">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
                      {language === "pt" ? "Total pago" : "Total paid"}
                    </p>

                    <p className="mt-1 text-xl font-semibold tracking-tight text-white">
                      {formatCurrency(
                        selectedPurchase.amountInCents,
                        selectedPurchase.currency,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {language === "pt"
                        ? "Pagamento único"
                        : "One-time payment"}
                    </p>
                  </div>
                </div>

                <div className="grid border-t border-white/10 bg-black/[0.08] sm:grid-cols-3">
                  <PurchaseInformation
                    label={language === "pt" ? "Pagamento" : "Payment"}
                    value={
                      <div className="flex items-center gap-2.5">
                        <div className="inline-flex h-6 items-center justify-center rounded bg-white px-2 text-[9px] font-black italic text-blue-800">
                          VISA
                        </div>

                        <span>•••• 4242</span>
                      </div>
                    }
                  />

                  <PurchaseInformation
                    label={
                      language === "pt" ? "Data da compra" : "Purchase date"
                    }
                    value={formatDate(selectedPurchase.purchasedAt)}
                    className="border-t border-white/10 sm:border-l sm:border-t-0"
                  />

                  <PurchaseInformation
                    label={language === "pt" ? "Transação" : "Transaction"}
                    value={`txn_${selectedPurchase.orderNumber}`}
                    className="border-t border-white/10 sm:border-l sm:border-t-0"
                    monospaced
                  />
                </div>

                <div className="flex flex-col gap-2.5 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-sm leading-6 text-white/40">
                    {language === "pt"
                      ? "O acesso ao produto está vinculado a esta compra."
                      : "Product access is linked to this purchase."}
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      className="inline-flex min-h-9 w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:w-36"
                    >
                      {language === "pt" ? "Baixar recibo" : "Download receipt"}
                    </button>

                    <Link
                      href={localePath(
                        selectedPurchase.productHref,
                        routeLocale,
                      )}
                      className="group inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-black transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-36"
                    >
                      {language === "pt" ? "Abrir produto" : "Open product"}

                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>

              <div className="mt-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-white/25">
                  {language === "pt"
                    ? "Problemas com a compra? Informe o número do pedido ao suporte."
                    : "Problems with this purchase? Include the order number when contacting support."}
                </p>

                <Link
                  href={localePath("/support", routeLocale)}
                  className="w-fit text-[11px] font-medium text-white/35 transition hover:text-white"
                >
                  {language === "pt"
                    ? "Falar com suporte →"
                    : "Contact support →"}
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

type PurchaseInformationProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
  monospaced?: boolean;
};

function PurchaseInformation({
  label,
  value,
  className = "",
  monospaced = false,
}: PurchaseInformationProps) {
  return (
    <div className={`min-w-0 px-5 py-4 sm:px-6 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
        {label}
      </p>

      <div
        className={`mt-2 truncate text-sm font-medium text-white/65 ${
          monospaced ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

type EmptyPurchasesProps = {
  language: Locale;
  routeLocale: RouteLocale;
};

function EmptyPurchases({ language, routeLocale }: EmptyPurchasesProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-14 text-center sm:px-10 sm:py-20">
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-xl text-white/50"
      >
        ◇
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-white">
        {t(accountText.purchases.emptyTitle, language)}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
        {t(accountText.purchases.emptyDescription, language)}
      </p>

      <Link
        href={localePath("/products", routeLocale)}
        className="group mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/85"
      >
        {t(accountText.purchases.exploreProducts, language)}

        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
}
