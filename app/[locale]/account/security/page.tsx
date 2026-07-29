import { getLanguage } from "@/lib/get-language";

import { SecurityView } from "@/components/account/SecurityView";

export default async function AccountSecurityPage() {
  const language = await getLanguage();

  return <SecurityView language={language} />;
}
