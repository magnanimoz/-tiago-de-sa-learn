"use client";

import AccountField from "@/components/account/AccountField";
import EditableField from "@/components/account/EditableField";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountProfile() {
  const { user, updateName } = useAuth();

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Minha conta</h2>

        <p className="mt-2 text-white/60">
          Gerencie suas informações pessoais.
        </p>
      </div>

      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <EditableField
          label="Nome"
          value={user?.user_metadata?.name ?? "-"}
          onSave={updateName}
        />

        <AccountField label="E-mail" value={user?.email ?? "-"} />

        <AccountField label="Membro desde" value={memberSince} />
      </div>
    </>
  );
}
