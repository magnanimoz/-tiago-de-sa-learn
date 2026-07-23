type PurchaseStatus = "paid" | "pending" | "cancelled" | "refunded";

type PurchaseStatusBadgeProps = {
  status: PurchaseStatus;
};

const statusConfig = {
  paid: {
    label: "Pago",
    className: "bg-emerald-500/15 text-emerald-400",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-500/15 text-amber-400",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-500/15 text-red-400",
  },
  refunded: {
    label: "Reembolsado",
    className: "bg-sky-500/15 text-sky-400",
  },
} satisfies Record<
  PurchaseStatus,
  {
    label: string;
    className: string;
  }
>;

export function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export type { PurchaseStatus };
