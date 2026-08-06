"use client";

import { CreditCard, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import Dropdown from "@/components/ui/Dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { headerText } from "@/lib/i18n/header";
import { localePath } from "@/lib/locale-path";
import { t } from "@/lib/t";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { language, routeLocale } = useSettings();

  async function handleSignOut() {
    try {
      await signOut();
      router.push(localePath("/", routeLocale));
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
    }
  }

  function handleMyAccount() {
    router.push(localePath("/account/profile", routeLocale));
  }

  function handleMyPurchases() {
    router.push(localePath("/account/purchases", routeLocale));
  }

  return (
    <Dropdown
      width="w-72"
      trigger={
        <button
          type="button"
          className="
            group
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-white/15
            bg-white/[0.06]
            text-white
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            transition-all
            duration-300
            hover:border-white/25
            hover:bg-white/10
            hover:shadow-[0_10px_35px_rgba(214,0,127,0.14)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-fuchsia-500/60
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#070809]
          "
          aria-label={t(headerText.accountMenu, language)}
        >
          <span
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_top,rgba(214,0,127,0.18),transparent_65%)]
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />

          <UserRound
            size={20}
            className="relative z-10 transition-transform duration-300 group-hover:scale-105"
          />
        </button>
      }
    >
      <div className="border-b border-white/5 bg-[#1d1d1d] px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-border
        bg-white/[0.05]
        text-white/70
      "
          >
            <UserRound size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white/90">
              {user?.user_metadata?.name ||
                t(headerText.userFallback, language)}
            </p>

            <p className="mt-0.5 truncate text-xs text-white/45">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <Dropdown.Item
          onClick={handleMyAccount}
          className="
      group
      rounded-lg
      px-3
      py-2.5
      text-sm
      text-white/75
      hover:bg-white/[0.06]
      hover:text-white
    "
        >
          <span className="flex items-center gap-3">
            <span
              className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          border
          border-white/[0.08]
          bg-white/[0.04]
          text-white/60
          transition-colors
          group-hover:border-white/15
          group-hover:bg-white/[0.07]
          group-hover:text-white
        "
            >
              <UserRound size={16} />
            </span>

            {t(headerText.myAccount, language)}
          </span>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={handleMyPurchases}
          className="
      group
      rounded-lg
      px-3
      py-2.5
      text-sm
      text-white/75
      hover:bg-white/[0.06]
      hover:text-white
    "
        >
          <span className="flex items-center gap-3">
            <span
              className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          border
          border-white/[0.08]
          bg-white/[0.04]
          text-white/60
          transition-colors
          group-hover:border-white/15
          group-hover:bg-white/[0.07]
          group-hover:text-white
        "
            >
              <CreditCard size={16} />
            </span>

            {t(headerText.myPurchases, language)}
          </span>
        </Dropdown.Item>
      </div>

      <div className="border-t border-white/[0.08] p-2">
        <Dropdown.Item
          onClick={handleSignOut}
          className="
      group
      rounded-lg
      px-3
      py-2.5
      text-sm
      text-red-300/75
      hover:bg-red-500/10
      hover:text-red-200
    "
        >
          <span className="flex items-center gap-3">
            <span
              className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          border
          border-red-400/10
          bg-red-500/[0.05]
          text-red-300/70
          transition-colors
          group-hover:border-red-400/20
          group-hover:bg-red-500/10
          group-hover:text-red-200
        "
            >
              <LogOut size={16} />
            </span>

            {t(headerText.signOut, language)}
          </span>
        </Dropdown.Item>
      </div>
    </Dropdown>
  );
}
