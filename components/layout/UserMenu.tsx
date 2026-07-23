"use client";

import { CreditCard, LogOut, UserRound } from "lucide-react";

import Dropdown from "@/components/ui/Dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { headerText } from "@/lib/i18n/header";
import { t } from "@/lib/t";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { language } = useSettings();

  async function handleSignOut() {
    await signOut();
  }

  function handleMyAccount() {
    console.log("Minha conta ainda será implementada.");
  }

  function handleMyPurchases() {
    console.log("Minhas compras ainda será implementado.");
  }

  return (
    <Dropdown
      width="w-64"
      trigger={
        <button
          type="button"
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-white/5
            text-white
            transition-colors
            hover:bg-white/10
          "
          aria-label={t(headerText.accountMenu, language)}
        >
          <UserRound size={20} />
        </button>
      }
    >
      <div className="border-b border-white/10 px-4 py-3">
        <p className="font-medium text-white">
          {user?.user_metadata?.name || t(headerText.userFallback, language)}
        </p>

        <p className="mt-1 truncate text-sm text-white/60">{user?.email}</p>
      </div>

      <Dropdown.Item onClick={handleMyAccount}>
        <span className="flex items-center gap-3">
          <UserRound size={17} />

          {t(headerText.myAccount, language)}
        </span>
      </Dropdown.Item>

      <Dropdown.Item onClick={handleMyPurchases}>
        <span className="flex items-center gap-3">
          <CreditCard size={17} />

          {t(headerText.myPurchases, language)}
        </span>
      </Dropdown.Item>

      <div className="border-t border-white/10" />

      <Dropdown.Item onClick={handleSignOut}>
        <span className="flex items-center gap-3">
          <LogOut size={17} />

          {t(headerText.signOut, language)}
        </span>
      </Dropdown.Item>
    </Dropdown>
  );
}
