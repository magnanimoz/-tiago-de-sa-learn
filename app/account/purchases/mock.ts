import type { PurchaseStatus } from "@/components/account/PurchaseStatusBadge";

export const purchases: {
  orderNumber: string;
  productName: string;
  productHref: string;
  date: string;
  amount: string;
  status: PurchaseStatus;
  detailsHref: string;
}[] = [
  {
    orderNumber: "10245",
    productName: "Curso Completo de Next.js",
    productHref: "/products/curso-nextjs",
    date: "23/07/2026",
    amount: "R$ 99,90",
    status: "paid",
    detailsHref: "/account/purchases/10245",
  },
  {
    orderNumber: "10238",
    productName: "Curso de React Avançado",
    productHref: "/products/curso-react",
    date: "18/07/2026",
    amount: "R$ 149,90",
    status: "pending",
    detailsHref: "/account/purchases/10238",
  },
  {
    orderNumber: "10210",
    productName: "Curso de TypeScript",
    productHref: "/products/curso-typescript",
    date: "02/07/2026",
    amount: "R$ 79,90",
    status: "refunded",
    detailsHref: "/account/purchases/10210",
  },
  {
    orderNumber: "10196",
    productName: "Curso de Tailwind CSS",
    productHref: "/products/curso-tailwind",
    date: "25/06/2026",
    amount: "R$ 59,90",
    status: "paid",
    detailsHref: "/account/purchases/10196",
  },
  {
    orderNumber: "10180",
    productName: "Curso de Supabase",
    productHref: "/products/curso-supabase",
    date: "10/06/2026",
    amount: "R$ 129,90",
    status: "cancelled",
    detailsHref: "/account/purchases/10180",
  },
];
