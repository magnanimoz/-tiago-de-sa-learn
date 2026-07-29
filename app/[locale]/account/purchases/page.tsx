import { PurchasesView } from "@/components/account/PurchaseView";
import { getLanguage } from "@/lib/get-language";

export default async function AccountPurchasesPage() {
  const language = await getLanguage();

  return <PurchasesView language={language} />;
}
