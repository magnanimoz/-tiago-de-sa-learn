import type { PurchaseStatus } from "@/components/account/PurchaseStatusBadge";

export type Purchase = {
  orderNumber: string;
  productName: {
    pt: string;
    en: string;
  };
  productHref: string;
  purchasedAt: string;
  amountInCents: number;
  currency: "BRL" | "USD";
  status: PurchaseStatus;
  detailsHref: string;
};

export const purchases: Purchase[] = [
  {
    orderNumber: "10245",
    productName: {
      pt: "Curso Completo de Next.js",
      en: "Complete Next.js Course",
    },
    productHref: "/courses/curso-nextjs",
    purchasedAt: "2026-07-23",
    amountInCents: 1990,
    currency: "USD",
    status: "paid",
    detailsHref: "/account/purchases/10245",
  },
  {
    orderNumber: "10238",
    productName: {
      pt: "Curso de React Avançado",
      en: "Advanced React Course",
    },
    productHref: "/courses/curso-react",
    purchasedAt: "2026-07-18",
    amountInCents: 14990,
    currency: "BRL",
    status: "pending",
    detailsHref: "/account/purchases/10238",
  },
  {
    orderNumber: "10210",
    productName: {
      pt: "Curso de TypeScript",
      en: "TypeScript Course",
    },
    productHref: "/courses/curso-typescript",
    purchasedAt: "2026-07-02",
    amountInCents: 7990,
    currency: "BRL",
    status: "refunded",
    detailsHref: "/account/purchases/10210",
  },
  {
    orderNumber: "10196",
    productName: {
      pt: "Curso de Tailwind CSS",
      en: "Tailwind CSS Course",
    },
    productHref: "/courses/curso-tailwind",
    purchasedAt: "2026-06-25",
    amountInCents: 5990,
    currency: "BRL",
    status: "paid",
    detailsHref: "/account/purchases/10196",
  },
  {
    orderNumber: "10180",
    productName: {
      pt: "Curso de Supabase",
      en: "Supabase Course",
    },
    productHref: "/courses/curso-supabase",
    purchasedAt: "2026-06-10",
    amountInCents: 12990,
    currency: "BRL",
    status: "cancelled",
    detailsHref: "/account/purchases/10180",
  },
];
