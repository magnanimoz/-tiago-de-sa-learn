"use client";

import { CreditCard, Settings, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSettings } from "@/contexts/SettingsContext";
import { accountText } from "@/lib/i18n/account";
import { localePath } from "@/lib/locale-path";
import { t } from "@/lib/t";

const items = [
  {
    href: "/account/profile",
    label: accountText.sidebar.profile,
    icon: UserRound,
  },
  {
    href: "/account/purchases",
    label: accountText.sidebar.purchases,
    icon: CreditCard,
  },
  {
    href: "/account/security",
    label: accountText.sidebar.security,
    icon: Shield,
  },
  {
    href: "/account/settings",
    label: accountText.sidebar.settings,
    icon: Settings,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  const { language, routeLocale } = useSettings();

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const localizedHref = localePath(href, routeLocale);

          const isActive =
            localizedHref === localePath("/account", routeLocale)
              ? pathname === localizedHref
              : pathname.startsWith(localizedHref);

          return (
            <Link
              key={href}
              href={localizedHref}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3
                transition-all duration-200
                ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon size={18} />

              <span>{t(label, language)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
