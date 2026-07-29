"use client";

import AccountField from "@/components/account/AccountField";
import EditableField from "@/components/account/EditableField";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { accountText } from "@/lib/i18n/account";
import { t } from "@/lib/t";

export default function AccountProfile() {
  const { user, updateName } = useAuth();
  const { language } = useSettings();

  const localeByLanguage = {
    pt: "pt-BR",
    en: "en-US",
    es: "es-ES",
  } as const;

  const locale =
    localeByLanguage[language as keyof typeof localeByLanguage] ?? "pt-BR";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">
          {t(accountText.profile.title, language)}
        </h2>

        <p className="mt-2 text-white/60">
          {t(accountText.profile.description, language)}
        </p>
      </div>

      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <EditableField
          label={t(accountText.profile.name, language)}
          value={user?.user_metadata?.name ?? "-"}
          onSave={updateName}
        />

        <AccountField
          label={t(accountText.profile.email, language)}
          value={user?.email ?? "-"}
        />

        <AccountField
          label={t(accountText.profile.memberSince, language)}
          value={memberSince}
        />
      </div>
    </>
  );
}
