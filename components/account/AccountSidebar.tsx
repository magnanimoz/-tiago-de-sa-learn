"use client";

import { CreditCard, House, Settings, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/account",
    label: "Dashboard",
    icon: House,
  },
  {
    href: "/account/profile",
    label: "Minha conta",
    icon: UserRound,
  },
  {
    href: "/account/purchases",
    label: "Minhas compras",
    icon: CreditCard,
  },
  {
    href: "/account/security",
    label: "Segurança",
    icon: Shield,
  },
  {
    href: "/account/settings",
    label: "Configurações",
    icon: Settings,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/account" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
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

              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
