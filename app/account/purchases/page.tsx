import Link from "next/link";
import { purchases } from "./mock";
import { PurchaseCard } from "@/components/account/PurchaseCard";

export default function AccountPurchasesPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Minhas compras</h2>

      <p className="mt-3 text-white/60">
        Acompanhe seus pedidos e visualize os detalhes de cada compra.
      </p>

      <div className="mt-8">
        {purchases.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
            <h3 className="text-lg font-medium text-white">
              Você ainda não realizou nenhuma compra
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Quando você comprar um produto, ele aparecerá aqui.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex text-sm font-medium text-white transition hover:text-white/70"
            >
              Explorar produtos →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <PurchaseCard key={purchase.orderNumber} {...purchase} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
