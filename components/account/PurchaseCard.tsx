"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useSettings } from "@/contexts/SettingsContext";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import type { TranslatedText } from "@/types/translated-text";

import {
  type PurchaseStatus,
  PurchaseStatusBadge,
} from "./PurchaseStatusBadge";

type PurchaseCardProps = {
  index: number;
  orderNumber: string;
  purchasedAt: string;
  productName: TranslatedText;
  productHref: string;
  amountInCents: number;
  currency: "BRL" | "USD";
  status: PurchaseStatus;
  detailsHref: string;
  language: Locale;
  onDetailsClick: () => void;
};

export function PurchaseCard({
  index,
  orderNumber,
  purchasedAt,
  productName,
  productHref,
  amountInCents,
  currency,
  status,
  language,
  onDetailsClick,
}: PurchaseCardProps) {
  const { routeLocale } = useSettings();

  const locale = language === "pt" ? "pt-BR" : "en-US";

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${purchasedAt}T12:00:00`));

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountInCents / 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.04, 0.16),
        ease: "easeOut",
      }}
      className="group border-b border-white/[0.08] last:border-b-0"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onDetailsClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onDetailsClick();
          }
        }}
        aria-label={`${
          language === "pt" ? "Ver detalhes do pedido" : "View order details"
        } ${orderNumber}`}
        className="grid min-h-[92px] cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-5 px-5 py-4 transition-colors hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_135px_130px_130px_40px]"
      >
        <div className="min-w-0">
          <Link
            href={localePath(productHref, routeLocale)}
            onClick={(event) => event.stopPropagation()}
            className="block w-fit max-w-full truncate text-base font-medium text-white transition hover:text-white/70"
          >
            {productName[language]}
          </Link>

          <p className="mt-1 font-mono text-xs text-white/35">
            {language === "pt" ? "Pedido" : "Order"} #{orderNumber}
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="text-xs text-white/45">{formattedDate}</p>
        </div>

        <div className="hidden lg:block">
          <PurchaseStatusBadge status={status} />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-white/85">{formattedAmount}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white/35 transition group-hover:text-white">
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </div>

        <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.06] pt-3 lg:hidden">
          <span className="text-xs text-white/40">{formattedDate}</span>

          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-white/20"
          />

          <PurchaseStatusBadge status={status} />

          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-white/20"
          />

          <span className="text-sm font-medium text-white/80">
            {formattedAmount}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
