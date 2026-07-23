import Link from "next/link";
import { PurchaseStatus, PurchaseStatusBadge } from "./PurchaseStatusBadge";

type PurchaseCardProps = {
  orderNumber: string;
  date: string;
  productName: string;
  productHref: string;
  amount: string;
  status: PurchaseStatus;
  detailsHref: string;
};

export function PurchaseCard({
  orderNumber,
  date,
  productName,
  productHref,
  amount,
  status,
  detailsHref,
}: PurchaseCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 border-b border-white/10 pb-5 lg:border-0 lg:pb-0">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Pedido #{orderNumber}
          </p>

          <Link
            href={productHref}
            title={`Ver produto: ${productName}`}
            className="mt-2 inline-flex w-fit text-lg font-semibold text-white underline-offset-4 transition hover:text-white/70 hover:underline"
          >
            {productName}
          </Link>
        </div>

        <div className="grid gap-4 pt-1 sm:grid-cols-2 lg:grid-cols-[120px_140px_140px_auto] lg:items-center lg:pt-0">
          <div>
            <p className="text-xs text-white/40">Data</p>
            <p className="mt-1 text-sm text-white/80">{date}</p>
          </div>

          <div>
            <p className="text-xs text-white/40">Valor pago</p>
            <p className="mt-1 text-sm font-medium text-white">{amount}</p>
          </div>

          <div>
            <p className="text-xs text-white/40">Status</p>

            <div className="mt-1">
              <PurchaseStatusBadge status={status} />
            </div>
          </div>

          <Link
            href={detailsHref}
            className="group inline-flex items-center gap-1 justify-self-start text-sm font-medium text-white/60 transition hover:text-white lg:justify-self-end"
          >
            Ver detalhes
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
