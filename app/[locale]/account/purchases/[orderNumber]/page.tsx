import type { ReactNode } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { purchases } from "@/app/account/purchases/mock";
import { getLanguage } from "@/lib/get-language";
import { accountText } from "@/lib/i18n/account";
import { t } from "@/lib/t";

type PurchaseDetailsPageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

type PurchaseStatus = "paid" | "pending" | "refunded" | "failed" | "cancelled";

function getStatusConfig(status: PurchaseStatus, language: "pt" | "en") {
  const statusConfig = {
    paid: {
      label: language === "pt" ? "Pagamento aprovado" : "Payment approved",
      description:
        language === "pt"
          ? "Esta compra foi concluída com sucesso."
          : "This purchase was completed successfully.",
      className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      dotClassName: "bg-emerald-300",
    },

    pending: {
      label: language === "pt" ? "Pagamento processando" : "Payment processing",
      description:
        language === "pt"
          ? "Estamos aguardando a confirmação do pagamento."
          : "We are waiting for payment confirmation.",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
      dotClassName: "bg-amber-300",
    },

    refunded: {
      label: language === "pt" ? "Compra reembolsada" : "Purchase refunded",
      description:
        language === "pt"
          ? "O valor desta compra foi reembolsado."
          : "The amount for this purchase was refunded.",
      className: "border-sky-400/20 bg-sky-400/10 text-sky-200",
      dotClassName: "bg-sky-300",
    },

    failed: {
      label: language === "pt" ? "Pagamento recusado" : "Payment failed",
      description:
        language === "pt"
          ? "Não foi possível concluir o pagamento."
          : "The payment could not be completed.",
      className: "border-red-400/20 bg-red-400/10 text-red-200",
      dotClassName: "bg-red-300",
    },

    cancelled: {
      label: language === "pt" ? "Compra cancelada" : "Purchase cancelled",
      description:
        language === "pt"
          ? "Esta compra foi cancelada."
          : "This purchase was cancelled.",
      className: "border-white/10 bg-white/[0.06] text-white/60",
      dotClassName: "bg-white/40",
    },
  };

  return statusConfig[status];
}

export default async function PurchaseDetailsPage({
  params,
}: PurchaseDetailsPageProps) {
  const { orderNumber } = await params;
  const language = await getLanguage();

  const purchase = purchases.find((item) => item.orderNumber === orderNumber);

  if (!purchase) {
    notFound();
  }

  const locale = language === "pt" ? "pt-BR" : "en-US";

  const statusConfig = getStatusConfig(
    purchase.status as PurchaseStatus,
    language,
  );

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(purchase.purchasedAt));

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: purchase.currency,
  }).format(purchase.amountInCents / 100);

  const formattedZero = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: purchase.currency,
  }).format(0);

  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* TOPO DA PÁGINA */}
      <header className="mb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs"
        >
          <Link
            href="/account/purchases"
            className="text-white/35 transition hover:text-white"
          >
            {t(accountText.purchases.pageTitle, language)}
          </Link>

          <span aria-hidden="true" className="text-white/20">
            /
          </span>

          <span className="text-white/60">
            {t(accountText.purchases.details, language)}
          </span>
        </nav>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
              {t(accountText.purchases.order, language)}
            </p>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              #{purchase.orderNumber}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-5 text-white/40">
              {language === "pt"
                ? "Informações do produto, pagamento e acesso desta compra."
                : "Product, payment and access information for this purchase."}
            </p>
          </div>

          <Link
            href="/account/purchases"
            className="group inline-flex min-h-9 w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3.5 text-xs font-medium text-white/50 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >
            <span
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              ←
            </span>

            {language === "pt" ? "Voltar às compras" : "Back to purchases"}
          </Link>
        </div>
      </header>

      {/* STATUS */}
      <div
        className={`mb-4 flex flex-col gap-3 rounded-xl border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between ${statusConfig.className}`}
      >
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${statusConfig.dotClassName}`}
          />

          <div>
            <p className="text-sm font-medium">{statusConfig.label}</p>

            <p className="mt-0.5 text-xs opacity-65">
              {statusConfig.description}
            </p>
          </div>
        </div>

        <span className="text-xs opacity-55">{formattedDate}</span>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* LADO ESQUERDO */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="relative overflow-hidden p-5 sm:p-6 lg:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[0.025] blur-3xl"
            />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-base font-semibold text-white/65">
                {purchase.productName[language].charAt(0).toUpperCase()}
              </div>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
                {language === "pt" ? "Produto adquirido" : "Purchased product"}
              </p>

              <h2 className="mt-2.5 max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl">
                {purchase.productName[language]}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-5 text-white/40">
                {language === "pt"
                  ? "O acesso ao produto está vinculado a esta compra."
                  : "Product access is linked to this purchase."}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href={purchase.productHref}
                  className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/85"
                >
                  {language === "pt" ? "Acessar produto" : "Access product"}

                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>

                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  {language === "pt" ? "Baixar recibo" : "Download receipt"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid border-t border-white/10 bg-black/[0.08] sm:grid-cols-2">
            <DetailItem
              label={language === "pt" ? "Data da compra" : "Purchase date"}
            >
              {formattedDate}
            </DetailItem>

            <DetailItem
              label={language === "pt" ? "Tipo de produto" : "Product type"}
              className="border-t border-white/10 sm:border-l sm:border-t-0"
            >
              {language === "pt" ? "Produto digital" : "Digital product"}
            </DetailItem>
          </div>
        </div>

        {/* LADO DIREITO */}
        <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
              {language === "pt" ? "Resumo da compra" : "Purchase summary"}
            </p>

            <div className="mt-4 space-y-3.5">
              <SummaryRow
                label={language === "pt" ? "Subtotal" : "Subtotal"}
                value={formattedAmount}
              />

              <SummaryRow
                label={language === "pt" ? "Descontos" : "Discounts"}
                value={formattedZero}
                muted
              />
            </div>

            <div className="my-4 border-t border-dashed border-white/10" />

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-white/45">
                  {language === "pt" ? "Total pago" : "Total paid"}
                </p>

                <p className="mt-0.5 text-[11px] text-white/25">
                  {language === "pt" ? "Pagamento único" : "One-time payment"}
                </p>
              </div>

              <p className="text-xl font-semibold tracking-tight text-white">
                {formattedAmount}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/[0.08] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
              {language === "pt" ? "Forma de pagamento" : "Payment method"}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <CardBrand brand="visa" />

              <div>
                <p className="text-sm font-medium text-white/75">
                  Visa •••• 4242
                </p>

                <p className="mt-0.5 text-xs text-white/30">
                  {language === "pt" ? "Cartão de crédito" : "Credit card"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
              {language === "pt" ? "ID da transação" : "Transaction ID"}
            </p>

            <p
              className="mt-2 truncate font-mono text-xs text-white/50"
              title={`txn_${purchase.orderNumber}`}
            >
              txn_{purchase.orderNumber}
            </p>
          </div>
        </aside>
      </div>

      {/* SUPORTE */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white/65">
            {language === "pt" ? "Precisa de ajuda?" : "Need help?"}
          </p>

          <p className="mt-0.5 text-xs leading-5 text-white/30">
            {language === "pt"
              ? "Informe o número do pedido ao entrar em contato."
              : "Include the order number when contacting support."}
          </p>
        </div>

        <Link
          href="/support"
          className="text-xs font-medium text-white/50 transition hover:text-white"
        >
          {language === "pt" ? "Falar com o suporte →" : "Contact support →"}
        </Link>
      </div>
    </section>
  );
}

type DetailItemProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function DetailItem({ label, children, className = "" }: DetailItemProps) {
  return (
    <div className={`min-w-0 px-5 py-4 ${className}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/30">
        {label}
      </p>

      <div className="mt-1.5 text-sm font-medium text-white/65">{children}</div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  muted?: boolean;
};

function SummaryRow({ label, value, muted = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-white/40">{label}</span>

      <span className={muted ? "text-white/25" : "text-white/65"}>{value}</span>
    </div>
  );
}

type CardBrandProps = {
  brand: "visa" | "mastercard";
};

function CardBrand({ brand }: CardBrandProps) {
  if (brand === "mastercard") {
    return (
      <span
        aria-label="Mastercard"
        className="relative inline-flex h-8 w-12 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white"
      >
        <span className="absolute left-2.5 h-4 w-4 rounded-full bg-red-500" />
        <span className="absolute right-2.5 h-4 w-4 rounded-full bg-amber-400 opacity-90" />
      </span>
    );
  }

  return (
    <span
      aria-label="Visa"
      className="inline-flex h-8 min-w-12 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white px-2 text-[11px] font-black italic tracking-tight text-blue-800"
    >
      VISA
    </span>
  );
}
