"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, KeyRound, Mail } from "lucide-react";
import UpdateEmailForm from "@/components/account/UpdateEmailForm";
import UpdatePasswordForm from "@/components/account/UpdatePasswordForm";
import SecurityMenu from "@/components/account/SecurityMenu";
import SecuritySectionHeader from "@/components/account/SecuritySectionHeader";

export default function AccountSecurityPage() {
  const router = useRouter();
  const navigateToSection = (section?: "password" | "email") => {
    const url = section
      ? `/account/security?section=${section}`
      : "/account/security";

    router.replace(url);
  };
  const searchParams = useSearchParams();

  const section = searchParams.get("section") ?? "menu";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Segurança</h2>
      </div>
      <div className="min-h-[520px]">
        {section === "menu" && (
          <SecurityMenu
            onPasswordClick={() => navigateToSection("password")}
            onEmailClick={() => navigateToSection("email")}
          />
        )}

        {section === "password" && (
          <>
            <SecuritySectionHeader
              title="Alterar senha"
              onBack={() => navigateToSection()}
            />

            <UpdatePasswordForm />
          </>
        )}

        {section === "email" && (
          <>
            <SecuritySectionHeader
              title="Alterar e-mail"
              onBack={() => navigateToSection()}
            />

            <UpdateEmailForm />
          </>
        )}
      </div>
    </>
  );
}
